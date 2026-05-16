/**
 * Normalizes a hash string for consistent comparison.
 * Trims whitespace, lowercases, and ensures 0x prefix.
 */
export const normalizeHash = (hash) => {
  if (!hash) return null;
  let clean = hash.trim().toLowerCase();
  if (!clean.startsWith('0x')) {
    clean = '0x' + clean;
  }
  return clean;
};

/**
 * Compares two hashes after normalization.
 * Returns true only if both are present and match.
 */
export const compareHashes = (dbHash, chainHash) => {
  const normDb = normalizeHash(dbHash);
  const normChain = normalizeHash(chainHash);
  
  if (!normDb || !normChain) return false;
  return normDb === normChain;
};
