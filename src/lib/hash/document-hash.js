import CryptoJS from 'crypto-js';

/**
 * Generates a SHA-256 hash of a file or string.
 * Used for creating document proofs for blockchain.
 * 
 * @param {string|ArrayBuffer} data - The content to hash.
 * @returns {string} - The hex-encoded SHA-256 hash.
 */
export const generateDocumentHash = (data) => {
  let wordArray;
  if (typeof data === 'string') {
    wordArray = CryptoJS.enc.Utf8.parse(data);
  } else {
    // For ArrayBuffer/Uint8Array from file uploads
    wordArray = CryptoJS.lib.WordArray.create(data);
  }
  return CryptoJS.SHA256(wordArray).toString(CryptoJS.enc.Hex);
};

/**
 * Compares a local hash with a blockchain hash.
 * 
 * @param {string} localHash 
 * @param {string} blockchainHash 
 * @returns {boolean}
 */
export const verifyHash = (localHash, blockchainHash) => {
  if (!localHash || !blockchainHash) return false;
  // Normalize both to lowercase and remove 0x prefix if present
  const h1 = localHash.toLowerCase().replace(/^0x/, '');
  const h2 = blockchainHash.toLowerCase().replace(/^0x/, '');
  return h1 === h2;
};
