// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "./TenderRegistry.sol";
import "./UserRegistry.sol";

contract BidRegistry is AccessControl, Pausable {
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");

    enum BidStatus {
        None,
        Submitted,
        Replaced,
        Withdrawn
    }

    struct Bid {
        uint256 tenderId;
        address bidder;
        bytes32 bidHash;
        string encryptedBidURI;
        uint256 submittedAt;
        BidStatus status;
        bool exists;
    }

    UserRegistry public immutable userRegistry;
    TenderRegistry public immutable tenderRegistry;

    mapping(uint256 => mapping(address => Bid)) public bids;
    mapping(uint256 => address[]) private tenderBidders;

    event BidSubmitted(
        uint256 indexed tenderId,
        address indexed bidder,
        bytes32 indexed bidHash,
        string encryptedBidURI,
        uint256 timestamp
    );
    event BidReplaced(
        uint256 indexed tenderId,
        address indexed bidder,
        bytes32 oldBidHash,
        bytes32 newBidHash,
        string encryptedBidURI,
        uint256 timestamp
    );
    event BidWithdrawn(
        uint256 indexed tenderId,
        address indexed bidder,
        bytes32 withdrawalReasonHash,
        uint256 timestamp
    );

    constructor(UserRegistry _userRegistry, TenderRegistry _tenderRegistry, address admin) {
        require(address(_userRegistry) != address(0), "BidRegistry: zero user registry");
        require(address(_tenderRegistry) != address(0), "BidRegistry: zero tender registry");
        require(admin != address(0), "BidRegistry: zero admin");

        userRegistry = _userRegistry;
        tenderRegistry = _tenderRegistry;
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(ADMIN_ROLE, admin);
    }

    modifier onlyActiveSupplier() {
        require(userRegistry.hasUserRole(msg.sender, UserRegistry.UserRole.Supplier), "BidRegistry: supplier only");
        _;
    }

    function submitBid(
        uint256 tenderId,
        bytes32 bidHash,
        string calldata encryptedBidURI
    ) external whenNotPaused onlyActiveSupplier {
        _validateOpenTender(tenderId);
        require(bidHash != bytes32(0), "BidRegistry: zero bid hash");

        Bid storage bid = bids[tenderId][msg.sender];
        require(!bid.exists || bid.status == BidStatus.Withdrawn, "BidRegistry: active bid exists");

        if (!bid.exists) {
            tenderBidders[tenderId].push(msg.sender);
        }

        bids[tenderId][msg.sender] = Bid({
            tenderId: tenderId,
            bidder: msg.sender,
            bidHash: bidHash,
            encryptedBidURI: encryptedBidURI,
            submittedAt: block.timestamp,
            status: BidStatus.Submitted,
            exists: true
        });

        emit BidSubmitted(tenderId, msg.sender, bidHash, encryptedBidURI, block.timestamp);
    }

    function replaceBid(
        uint256 tenderId,
        bytes32 newBidHash,
        string calldata newEncryptedBidURI
    ) external whenNotPaused onlyActiveSupplier {
        _validateOpenTender(tenderId);
        require(newBidHash != bytes32(0), "BidRegistry: zero bid hash");

        Bid storage bid = bids[tenderId][msg.sender];
        require(bid.exists, "BidRegistry: no bid");
        require(bid.status == BidStatus.Submitted || bid.status == BidStatus.Replaced, "BidRegistry: bid not active");

        bytes32 oldBidHash = bid.bidHash;
        bid.bidHash = newBidHash;
        bid.encryptedBidURI = newEncryptedBidURI;
        bid.submittedAt = block.timestamp;
        bid.status = BidStatus.Replaced;

        emit BidReplaced(tenderId, msg.sender, oldBidHash, newBidHash, newEncryptedBidURI, block.timestamp);
    }

    function withdrawBid(uint256 tenderId, bytes32 withdrawalReasonHash) external whenNotPaused onlyActiveSupplier {
        _validateOpenTender(tenderId);
        require(withdrawalReasonHash != bytes32(0), "BidRegistry: zero reason hash");

        Bid storage bid = bids[tenderId][msg.sender];
        require(bid.exists, "BidRegistry: no bid");
        require(bid.status == BidStatus.Submitted || bid.status == BidStatus.Replaced, "BidRegistry: bid not active");

        bid.status = BidStatus.Withdrawn;

        emit BidWithdrawn(tenderId, msg.sender, withdrawalReasonHash, block.timestamp);
    }

    function getBid(uint256 tenderId, address bidder) external view returns (Bid memory) {
        Bid memory bid = bids[tenderId][bidder];
        require(bid.exists, "BidRegistry: no bid");
        return bid;
    }

    function getBidderCount(uint256 tenderId) external view returns (uint256) {
        return tenderBidders[tenderId].length;
    }

    function getBidderAt(uint256 tenderId, uint256 index) external view returns (address) {
        require(index < tenderBidders[tenderId].length, "BidRegistry: bidder out of range");
        return tenderBidders[tenderId][index];
    }

    function hasValidBid(uint256 tenderId, address bidder) external view returns (bool) {
        Bid memory bid = bids[tenderId][bidder];
        return bid.exists && (bid.status == BidStatus.Submitted || bid.status == BidStatus.Replaced);
    }

    function verifyBidHash(uint256 tenderId, address bidder, bytes32 hashToCheck) external view returns (bool) {
        Bid memory bid = bids[tenderId][bidder];
        return bid.exists && bid.bidHash == hashToCheck;
    }

    function pause() external onlyRole(ADMIN_ROLE) {
        _pause();
    }

    function unpause() external onlyRole(ADMIN_ROLE) {
        _unpause();
    }

    function _validateOpenTender(uint256 tenderId) internal view {
        TenderRegistry.Tender memory tender = tenderRegistry.getTender(tenderId);
        require(tender.status == TenderRegistry.TenderStatus.Published, "BidRegistry: tender not published");
        require(block.timestamp < tender.submissionDeadline, "BidRegistry: deadline passed");
    }
}
