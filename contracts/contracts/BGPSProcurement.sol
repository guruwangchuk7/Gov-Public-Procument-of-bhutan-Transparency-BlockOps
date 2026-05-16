// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

/**
 * @title BGPSProcurement
 * @dev Blockchain-Based Government Procurement System proof recording contract.
 */
contract BGPSProcurement {
    address public owner;

    event AgencyWalletAuthorized(address indexed agencyWallet, bytes32 proofHash);
    event SupplierWalletAuthorized(address indexed supplierWallet, bytes32 proofHash);
    event TenderCreated(uint256 indexed tenderId, bytes32 tenderHash);
    event BidSubmitted(uint256 indexed tenderId, uint256 indexed bidId, bytes32 bidHash);
    event WinnerSelected(uint256 indexed tenderId, uint256 indexed bidId, bytes32 justificationHash);

    error NotOwner();
    error AlreadyAuthorized();

    modifier onlyOwner() {
        if (msg.sender != owner) revert NotOwner();
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    /**
     * @dev Authorize a procuring agency wallet.
     * @param agencyWallet Address of the agency's wallet.
     * @param proofHash Hash of the agency's approval documents/identity.
     */
    function authorizeAgency(address agencyWallet, bytes32 proofHash) external onlyOwner {
        emit AgencyWalletAuthorized(agencyWallet, proofHash);
    }

    /**
     * @dev Authorize a supplier wallet.
     * @param supplierWallet Address of the supplier's wallet.
     * @param proofHash Hash of the supplier's approval documents/identity.
     */
    function authorizeSupplier(address supplierWallet, bytes32 proofHash) external onlyOwner {
        emit SupplierWalletAuthorized(supplierWallet, proofHash);
    }

    /**
     * @dev Record a tender hash.
     * @param tenderId Numerical ID or reference for the tender (could be hash converted to uint).
     * @param tenderHash Hash of the tender document.
     */
    function recordTenderHash(uint256 tenderId, bytes32 tenderHash) external {
        // In a real system, we might check if msg.sender is an authorized agency.
        // For MVP, we emit the event for auditability.
        emit TenderCreated(tenderId, tenderHash);
    }

    /**
     * @dev Record a bid hash.
     * @param tenderId ID of the tender.
     * @param bidId ID of the bid.
     * @param bidHash Hash of the bid proposal.
     */
    function recordBidHash(uint256 tenderId, uint256 bidId, bytes32 bidHash) external {
        emit BidSubmitted(tenderId, bidId, bidHash);
    }

    /**
     * @dev Record the winner selection proof.
     * @param tenderId ID of the tender.
     * @param bidId ID of the winning bid.
     * @param justificationHash Hash of the award justification document.
     */
    function recordWinnerHash(uint256 tenderId, uint256 bidId, bytes32 justificationHash) external {
        emit WinnerSelected(tenderId, bidId, justificationHash);
    }

    /**
     * @dev Transfer ownership to a new address.
     */
    function transferOwnership(address newOwner) external onlyOwner {
        owner = newOwner;
    }
}
