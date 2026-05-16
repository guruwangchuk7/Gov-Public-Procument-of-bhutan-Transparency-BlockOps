/**
 * Utility for normalizing and matching Ethereum wallet addresses.
 */
export const WalletLinking = {
  /**
   * Normalizes an address to lowercase for case-insensitive comparison.
   */
  normalizeWalletAddress(address) {
    if (!address) return '';
    return address.toString().toLowerCase().trim();
  },

  /**
   * Checks if two wallet addresses are the same.
   */
  isSameWallet(addressA, addressB) {
    if (!addressA || !addressB) return false;
    return this.normalizeWalletAddress(addressA) === this.normalizeWalletAddress(addressB);
  },

  /**
   * Matches a connected wallet address against a stored role record.
   */
  matchWalletToRoleRecord(wallet_address, role_record) {
    if (!wallet_address || !role_record) return false;
    
    // Some records might have the field as wallet_address or blockchain_address
    const recordAddress = role_record.wallet_address || role_record.blockchain_address;
    
    return this.isSameWallet(wallet_address, recordAddress);
  }
};
