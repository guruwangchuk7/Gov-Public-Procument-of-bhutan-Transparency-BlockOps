// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "./UserRegistry.sol";

contract TenderRegistry is AccessControl, Pausable {
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");

    enum TenderStatus {
        Draft,
        Published,
        Closed,
        Cancelled,
        Awarded
    }

    struct Tender {
        uint256 tenderId;
        string tenderRef;
        address agency;
        bytes32 tenderHash;
        string documentURI;
        uint256 publishedAt;
        uint256 submissionDeadline;
        uint256 openingTime;
        TenderStatus status;
        bool exists;
    }

    struct Amendment {
        bytes32 amendmentHash;
        string amendmentURI;
        uint256 timestamp;
    }

    UserRegistry public immutable userRegistry;
    address public awardRegistry;
    uint256 public nextTenderId = 1;

    mapping(uint256 => Tender) public tenders;
    mapping(uint256 => Amendment[]) private tenderAmendments;

    event AwardRegistryUpdated(address indexed awardRegistry, uint256 timestamp);
    event TenderPublished(
        uint256 indexed tenderId,
        string tenderRef,
        address indexed agency,
        bytes32 indexed tenderHash,
        string documentURI,
        uint256 submissionDeadline,
        uint256 openingTime,
        uint256 timestamp
    );
    event TenderAmended(
        uint256 indexed tenderId,
        bytes32 indexed amendmentHash,
        string amendmentURI,
        uint256 timestamp
    );
    event TenderClosed(uint256 indexed tenderId, uint256 timestamp);
    event TenderCancelled(uint256 indexed tenderId, bytes32 reasonHash, uint256 timestamp);
    event TenderAwarded(uint256 indexed tenderId, uint256 timestamp);

    constructor(UserRegistry _userRegistry, address admin) {
        require(address(_userRegistry) != address(0), "TenderRegistry: zero user registry");
        require(admin != address(0), "TenderRegistry: zero admin");

        userRegistry = _userRegistry;
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(ADMIN_ROLE, admin);
    }

    modifier onlyActiveAgency() {
        require(userRegistry.hasUserRole(msg.sender, UserRegistry.UserRole.Agency), "TenderRegistry: agency only");
        _;
    }

    modifier onlyRegistryAdmin() {
        require(
            hasRole(ADMIN_ROLE, msg.sender) || userRegistry.hasUserRole(msg.sender, UserRegistry.UserRole.Admin),
            "TenderRegistry: admin only"
        );
        _;
    }

    function setAwardRegistry(address _awardRegistry) external onlyRegistryAdmin {
        require(_awardRegistry != address(0), "TenderRegistry: zero award registry");
        awardRegistry = _awardRegistry;
        emit AwardRegistryUpdated(_awardRegistry, block.timestamp);
    }

    function publishTender(
        string calldata tenderRef,
        bytes32 tenderHash,
        string calldata documentURI,
        uint256 submissionDeadline,
        uint256 openingTime
    ) external whenNotPaused onlyActiveAgency returns (uint256 tenderId) {
        require(bytes(tenderRef).length != 0, "TenderRegistry: empty tender ref");
        require(tenderHash != bytes32(0), "TenderRegistry: zero tender hash");
        require(submissionDeadline > block.timestamp, "TenderRegistry: deadline must be future");
        require(openingTime >= submissionDeadline, "TenderRegistry: opening before deadline");

        tenderId = nextTenderId++;
        tenders[tenderId] = Tender({
            tenderId: tenderId,
            tenderRef: tenderRef,
            agency: msg.sender,
            tenderHash: tenderHash,
            documentURI: documentURI,
            publishedAt: block.timestamp,
            submissionDeadline: submissionDeadline,
            openingTime: openingTime,
            status: TenderStatus.Published,
            exists: true
        });

        emit TenderPublished(
            tenderId,
            tenderRef,
            msg.sender,
            tenderHash,
            documentURI,
            submissionDeadline,
            openingTime,
            block.timestamp
        );
    }

    function addAmendment(
        uint256 tenderId,
        bytes32 amendmentHash,
        string calldata amendmentURI
    ) external whenNotPaused onlyActiveAgency {
        Tender storage tender = _publishedTender(tenderId);
        require(tender.agency == msg.sender, "TenderRegistry: not tender agency");
        require(block.timestamp < tender.submissionDeadline, "TenderRegistry: deadline passed");
        require(amendmentHash != bytes32(0), "TenderRegistry: zero amendment hash");

        tenderAmendments[tenderId].push(
            Amendment({ amendmentHash: amendmentHash, amendmentURI: amendmentURI, timestamp: block.timestamp })
        );

        emit TenderAmended(tenderId, amendmentHash, amendmentURI, block.timestamp);
    }

    function closeTender(uint256 tenderId) external whenNotPaused {
        Tender storage tender = _publishedTender(tenderId);
        require(msg.sender == tender.agency || hasRole(ADMIN_ROLE, msg.sender), "TenderRegistry: agency or admin only");
        require(block.timestamp >= tender.submissionDeadline, "TenderRegistry: deadline not reached");

        tender.status = TenderStatus.Closed;
        emit TenderClosed(tenderId, block.timestamp);
    }

    function cancelTender(uint256 tenderId, bytes32 reasonHash) external whenNotPaused {
        Tender storage tender = _existingTender(tenderId);
        require(msg.sender == tender.agency || hasRole(ADMIN_ROLE, msg.sender), "TenderRegistry: agency or admin only");
        require(tender.status != TenderStatus.Awarded, "TenderRegistry: already awarded");
        require(tender.status != TenderStatus.Cancelled, "TenderRegistry: already cancelled");
        require(reasonHash != bytes32(0), "TenderRegistry: zero reason hash");

        tender.status = TenderStatus.Cancelled;
        emit TenderCancelled(tenderId, reasonHash, block.timestamp);
    }

    function markAwarded(uint256 tenderId) external whenNotPaused {
        require(msg.sender == awardRegistry || hasRole(ADMIN_ROLE, msg.sender), "TenderRegistry: award registry only");
        Tender storage tender = _existingTender(tenderId);
        require(tender.status == TenderStatus.Closed, "TenderRegistry: tender not closed");

        tender.status = TenderStatus.Awarded;
        emit TenderAwarded(tenderId, block.timestamp);
    }

    function getTender(uint256 tenderId) external view returns (Tender memory) {
        return _existingTenderView(tenderId);
    }

    function getAmendmentCount(uint256 tenderId) external view returns (uint256) {
        _existingTenderView(tenderId);
        return tenderAmendments[tenderId].length;
    }

    function getAmendment(uint256 tenderId, uint256 index) external view returns (Amendment memory) {
        _existingTenderView(tenderId);
        require(index < tenderAmendments[tenderId].length, "TenderRegistry: amendment out of range");
        return tenderAmendments[tenderId][index];
    }

    function verifyTenderHash(uint256 tenderId, bytes32 hashToCheck) external view returns (bool) {
        Tender memory tender = _existingTenderView(tenderId);
        return tender.tenderHash == hashToCheck;
    }

    function pause() external onlyRegistryAdmin {
        _pause();
    }

    function unpause() external onlyRegistryAdmin {
        _unpause();
    }

    function _existingTender(uint256 tenderId) internal view returns (Tender storage tender) {
        tender = tenders[tenderId];
        require(tender.exists, "TenderRegistry: unknown tender");
    }

    function _existingTenderView(uint256 tenderId) internal view returns (Tender memory tender) {
        tender = tenders[tenderId];
        require(tender.exists, "TenderRegistry: unknown tender");
    }

    function _publishedTender(uint256 tenderId) internal view returns (Tender storage tender) {
        tender = _existingTender(tenderId);
        require(tender.status == TenderStatus.Published, "TenderRegistry: not published");
    }
}
