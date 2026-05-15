// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "./BidRegistry.sol";
import "./TenderRegistry.sol";
import "./UserRegistry.sol";

contract AwardRegistry is AccessControl, Pausable {
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    uint256 public constant STANDSTILL_PERIOD = 10 days;

    enum AwardStatus {
        None,
        EvaluationRecorded,
        IntentIssued,
        AwardConfirmed,
        Cancelled
    }

    struct Award {
        uint256 tenderId;
        address winningBidder;
        bytes32 openingReportHash;
        bytes32 evaluationReportHash;
        bytes32 intentHash;
        bytes32 awardHash;
        string awardURI;
        uint256 awardAmount;
        uint256 evaluationRecordedAt;
        uint256 intentIssuedAt;
        uint256 awardedAt;
        AwardStatus status;
        bool exists;
    }

    UserRegistry public immutable userRegistry;
    TenderRegistry public immutable tenderRegistry;
    BidRegistry public immutable bidRegistry;

    mapping(uint256 => Award) public awards;
    mapping(uint256 => string) public openingReportURIs;

    event OpeningReportRecorded(
        uint256 indexed tenderId,
        bytes32 indexed openingReportHash,
        string openingReportURI,
        uint256 timestamp
    );
    event EvaluationRecorded(uint256 indexed tenderId, bytes32 indexed evaluationReportHash, uint256 timestamp);
    event IntentIssued(
        uint256 indexed tenderId,
        address indexed intendedWinner,
        bytes32 indexed intentHash,
        uint256 timestamp
    );
    event AwardConfirmed(
        uint256 indexed tenderId,
        address indexed winningBidder,
        bytes32 indexed awardHash,
        string awardURI,
        uint256 awardAmount,
        uint256 timestamp
    );
    event AwardCancelled(uint256 indexed tenderId, bytes32 reasonHash, uint256 timestamp);

    constructor(UserRegistry _userRegistry, TenderRegistry _tenderRegistry, BidRegistry _bidRegistry, address admin) {
        require(address(_userRegistry) != address(0), "AwardRegistry: zero user registry");
        require(address(_tenderRegistry) != address(0), "AwardRegistry: zero tender registry");
        require(address(_bidRegistry) != address(0), "AwardRegistry: zero bid registry");
        require(admin != address(0), "AwardRegistry: zero admin");

        userRegistry = _userRegistry;
        tenderRegistry = _tenderRegistry;
        bidRegistry = _bidRegistry;
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(ADMIN_ROLE, admin);
    }

    modifier onlyAgencyOrAdmin() {
        require(
            userRegistry.hasUserRole(msg.sender, UserRegistry.UserRole.Agency) ||
                userRegistry.hasUserRole(msg.sender, UserRegistry.UserRole.Admin) ||
                hasRole(ADMIN_ROLE, msg.sender),
            "AwardRegistry: agency or admin only"
        );
        _;
    }

    function recordOpeningReport(
        uint256 tenderId,
        bytes32 openingReportHash,
        string calldata openingReportURI
    ) external whenNotPaused onlyAgencyOrAdmin {
        require(openingReportHash != bytes32(0), "AwardRegistry: zero opening hash");
        TenderRegistry.Tender memory tender = _closedOrReadyTender(tenderId);
        require(tender.agency == msg.sender || hasRole(ADMIN_ROLE, msg.sender), "AwardRegistry: not tender agency");

        Award storage award = awards[tenderId];
        require(award.openingReportHash == bytes32(0), "AwardRegistry: opening already recorded");

        award.tenderId = tenderId;
        award.openingReportHash = openingReportHash;
        award.exists = true;
        openingReportURIs[tenderId] = openingReportURI;

        emit OpeningReportRecorded(tenderId, openingReportHash, openingReportURI, block.timestamp);
    }

    function recordEvaluation(uint256 tenderId, bytes32 evaluationReportHash) external whenNotPaused onlyAgencyOrAdmin {
        require(evaluationReportHash != bytes32(0), "AwardRegistry: zero evaluation hash");
        TenderRegistry.Tender memory tender = _closedOrReadyTender(tenderId);
        require(tender.agency == msg.sender || hasRole(ADMIN_ROLE, msg.sender), "AwardRegistry: not tender agency");

        Award storage award = awards[tenderId];
        require(award.openingReportHash != bytes32(0), "AwardRegistry: opening not recorded");
        require(
            award.status == AwardStatus.None || award.status == AwardStatus.EvaluationRecorded,
            "AwardRegistry: evaluation locked"
        );

        award.tenderId = tenderId;
        award.evaluationReportHash = evaluationReportHash;
        award.evaluationRecordedAt = block.timestamp;
        award.status = AwardStatus.EvaluationRecorded;
        award.exists = true;

        emit EvaluationRecorded(tenderId, evaluationReportHash, block.timestamp);
    }

    function issueIntent(
        uint256 tenderId,
        address intendedWinner,
        bytes32 intentHash
    ) external whenNotPaused onlyAgencyOrAdmin {
        require(intendedWinner != address(0), "AwardRegistry: zero winner");
        require(intentHash != bytes32(0), "AwardRegistry: zero intent hash");
        require(bidRegistry.hasValidBid(tenderId, intendedWinner), "AwardRegistry: winner has no valid bid");

        TenderRegistry.Tender memory tender = _closedOrReadyTender(tenderId);
        require(tender.agency == msg.sender || hasRole(ADMIN_ROLE, msg.sender), "AwardRegistry: not tender agency");

        Award storage award = awards[tenderId];
        require(award.status == AwardStatus.EvaluationRecorded, "AwardRegistry: evaluation not recorded");

        award.winningBidder = intendedWinner;
        award.intentHash = intentHash;
        award.intentIssuedAt = block.timestamp;
        award.status = AwardStatus.IntentIssued;

        emit IntentIssued(tenderId, intendedWinner, intentHash, block.timestamp);
    }

    function confirmAward(
        uint256 tenderId,
        address winningBidder,
        bytes32 awardHash,
        string calldata awardURI,
        uint256 awardAmount
    ) external whenNotPaused onlyAgencyOrAdmin {
        require(winningBidder != address(0), "AwardRegistry: zero winner");
        require(awardHash != bytes32(0), "AwardRegistry: zero award hash");
        require(bidRegistry.hasValidBid(tenderId, winningBidder), "AwardRegistry: winner has no valid bid");

        TenderRegistry.Tender memory tender = tenderRegistry.getTender(tenderId);
        require(tender.agency == msg.sender || hasRole(ADMIN_ROLE, msg.sender), "AwardRegistry: not tender agency");

        Award storage award = awards[tenderId];
        require(award.status == AwardStatus.IntentIssued, "AwardRegistry: intent not issued");
        require(award.winningBidder == winningBidder, "AwardRegistry: winner mismatch");
        require(block.timestamp >= award.intentIssuedAt + STANDSTILL_PERIOD, "AwardRegistry: standstill active");

        award.awardHash = awardHash;
        award.awardURI = awardURI;
        award.awardAmount = awardAmount;
        award.awardedAt = block.timestamp;
        award.status = AwardStatus.AwardConfirmed;

        tenderRegistry.markAwarded(tenderId);

        emit AwardConfirmed(tenderId, winningBidder, awardHash, awardURI, awardAmount, block.timestamp);
    }

    function cancelAward(uint256 tenderId, bytes32 reasonHash) external whenNotPaused onlyAgencyOrAdmin {
        require(reasonHash != bytes32(0), "AwardRegistry: zero reason hash");
        Award storage award = awards[tenderId];
        require(award.exists, "AwardRegistry: unknown award");
        require(award.status != AwardStatus.AwardConfirmed, "AwardRegistry: already confirmed");
        require(award.status != AwardStatus.Cancelled, "AwardRegistry: already cancelled");

        TenderRegistry.Tender memory tender = tenderRegistry.getTender(tenderId);
        require(tender.agency == msg.sender || hasRole(ADMIN_ROLE, msg.sender), "AwardRegistry: not tender agency");

        award.status = AwardStatus.Cancelled;

        emit AwardCancelled(tenderId, reasonHash, block.timestamp);
    }

    function getAward(uint256 tenderId) external view returns (Award memory) {
        Award memory award = awards[tenderId];
        require(award.exists, "AwardRegistry: unknown award");
        return award;
    }

    function verifyAwardHash(uint256 tenderId, bytes32 hashToCheck) external view returns (bool) {
        Award memory award = awards[tenderId];
        return award.exists && award.awardHash == hashToCheck;
    }

    function pause() external onlyRole(ADMIN_ROLE) {
        _pause();
    }

    function unpause() external onlyRole(ADMIN_ROLE) {
        _unpause();
    }

    function _closedOrReadyTender(uint256 tenderId) internal view returns (TenderRegistry.Tender memory tender) {
        tender = tenderRegistry.getTender(tenderId);
        require(tender.status == TenderRegistry.TenderStatus.Closed, "AwardRegistry: tender not closed");
        require(block.timestamp >= tender.openingTime, "AwardRegistry: opening time not reached");
    }
}
