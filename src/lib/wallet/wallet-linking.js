/**
 * Utility for normalizing and matching Ethereum wallet addresses.
 */
export const WalletLinking = {
  /**
   * Normalizes an address and validates its format.
   * - Lowercase
   * - Trimmed
   * - Null check
   */
  normalizeWalletAddress(address) {
    if (!address) return null;
    
    try {
      const normalized = address.toString().trim().toLowerCase();
      
      // Minimal validation: must start with 0x and be at least 42 chars
      if (!normalized.startsWith('0x') || normalized.length < 42) {
        return null;
      }
      
      return normalized;
    } catch (e) {
      return null;
    }
  },

  /**
   * Checks if two wallet addresses are the same.
   * Case-insensitive comparison.
   */
  isSameWallet(addressA, addressB) {
    const normA = this.normalizeWalletAddress(addressA);
    const normB = this.normalizeWalletAddress(addressB);
    
    if (!normA || !normB) return false;
    return normA === normB;
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
