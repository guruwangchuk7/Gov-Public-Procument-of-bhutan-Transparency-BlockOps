// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

/**
 * @title BGPSProcurement
 * @dev Blockchain-Based Government Procurement System proof-of-procurement contract.
 * Stores only hashes of procurement milestones to ensure transparency and immutability.
 */
contract BGPSProcurement {
    address public owner;

    mapping(address => bool) public adminOperators;
    mapping(address => bool) public authorizedAgencies;
    mapping(address => bool) public authorizedSuppliers;

    event AdminOperatorAdded(address indexed adminWallet, address indexed addedBy, uint256 timestamp);
    event AdminOperatorRemoved(address indexed adminWallet, address indexed removedBy, uint256 timestamp);
    
    event AgencyWalletAuthorized(
        address indexed agencyWallet,
        bytes32 indexed proofHash,
        address indexed authorizedBy,
        uint256 timestamp
    );

    event SupplierWalletAuthorized(
        address indexed supplierWallet,
        bytes32 indexed proofHash,
        address indexed authorizedBy,
        uint256 timestamp
    );

    event TenderCreated(
        uint256 indexed tenderId,
        address indexed agencyWallet,
        bytes32 indexed tenderHash,
        uint256 timestamp
    );

    event BidSubmitted(
        uint256 indexed tenderId,
        uint256 indexed bidId,
        address indexed supplierWallet,
        bytes32 bidHash,
        uint256 timestamp
    );

    event WinnerSelected(
        uint256 indexed tenderId,
        uint256 indexed bidId,
        address indexed agencyWallet,
        bytes32 justificationHash,
        uint256 timestamp
    );

    modifier onlyOwner() {
        require(msg.sender == owner, "Caller is not the owner");
        _;
    }

    modifier onlyAdminOperator() {
        require(adminOperators[msg.sender], "Caller is not an admin operator");
        _;
    }

    modifier onlyAuthorizedAgency() {
        require(authorizedAgencies[msg.sender], "Caller is not an authorized agency");
        _;
    }

    modifier onlyAuthorizedSupplier() {
        require(authorizedSuppliers[msg.sender], "Caller is not an authorized supplier");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    // --- OWNER FUNCTIONS ---

    function addAdminOperator(address adminWallet) external onlyOwner {
        require(adminWallet != address(0), "Zero address");
        adminOperators[adminWallet] = true;
        emit AdminOperatorAdded(adminWallet, msg.sender, block.timestamp);
    }

    function removeAdminOperator(address adminWallet) external onlyOwner {
        require(adminWallet != address(0), "Zero address");
        adminOperators[adminWallet] = false;
        emit AdminOperatorRemoved(adminWallet, msg.sender, block.timestamp);
    }

    // --- ADMIN OPERATOR FUNCTIONS ---

    function authorizeAgency(address agencyWallet, bytes32 proofHash) external onlyAdminOperator {
        require(agencyWallet != address(0), "Zero address");
        require(proofHash != bytes32(0), "Empty hash");
        authorizedAgencies[agencyWallet] = true;
        emit AgencyWalletAuthorized(agencyWallet, proofHash, msg.sender, block.timestamp);
    }

    function authorizeSupplier(address supplierWallet, bytes32 proofHash) external onlyAdminOperator {
        require(supplierWallet != address(0), "Zero address");
        require(proofHash != bytes32(0), "Empty hash");
        authorizedSuppliers[supplierWallet] = true;
        emit SupplierWalletAuthorized(supplierWallet, proofHash, msg.sender, block.timestamp);
    }

    // --- AGENCY FUNCTIONS ---

    function recordTenderHash(uint256 tenderId, bytes32 tenderHash) external onlyAuthorizedAgency {
        require(tenderId > 0, "Invalid tender ID");
        require(tenderHash != bytes32(0), "Empty hash");
        emit TenderCreated(tenderId, msg.sender, tenderHash, block.timestamp);
    }

    function recordWinnerHash(uint256 tenderId, uint256 bidId, bytes32 justificationHash) external onlyAuthorizedAgency {
        require(tenderId > 0, "Invalid tender ID");
        require(bidId > 0, "Invalid bid ID");
        require(justificationHash != bytes32(0), "Empty hash");
        emit WinnerSelected(tenderId, bidId, msg.sender, justificationHash, block.timestamp);
    }

    // --- SUPPLIER FUNCTIONS ---

    function recordBidHash(uint256 tenderId, uint256 bidId, bytes32 bidHash) external onlyAuthorizedSupplier {
        require(tenderId > 0, "Invalid tender ID");
        require(bidId > 0, "Invalid bid ID");
        require(bidHash != bytes32(0), "Empty hash");
        emit BidSubmitted(tenderId, bidId, msg.sender, bidHash, block.timestamp);
    }
}
