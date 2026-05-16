import { ethers } from 'ethers';

/**
 * Utility for SHA-256 hashing and bytes32 normalization.
 * Ensures that all data sent to the blockchain is in the correct cryptographic format.
 */
export const HashUtils = {
  /**
   * Validates if a string is a valid bytes32 hex string.
   */
  isValidBytes32(hash) {
    if (!hash || typeof hash !== 'string') return false;
    // Must start with 0x and be 66 characters total (0x + 64 hex chars)
    return /^0x[0-9a-fA-F]{64}$/.test(hash);
  },

  /**
   * Normalizes an input into a bytes32 hash.
   * If the input is already a valid bytes32 hash, it returns it.
   * If it's a string or other data, it performs a Keccak-256 hash.
   */
  normalizeBytes32Hash(input) {
    if (!input) return ethers.constants.HashZero;
    
    // If it's already a valid bytes32 hash, return it as is
    if (this.isValidBytes32(input)) {
      return input;
    }

    // Otherwise, hash the input
    // We use Keccak-256 (standard for Ethereum) to generate the bytes32
    return ethers.utils.keccak256(ethers.utils.toUtf8Bytes(input.toString()));
  },

  /**
   * Generates a hash for a file/document.
   * Currently uses a string representation for the prototype.
   */
  generateDocumentHash(content) {
    return this.normalizeBytes32Hash(content);
  }
};
