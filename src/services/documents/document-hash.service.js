import crypto from 'crypto';

/**
 * Service for generating consistent SHA-256 hashes for documents.
 */
export const DocumentHashService = {
  /**
   * Generates a SHA-256 hash from a Buffer or String.
   */
  async generateHash(content) {
    const hash = crypto.createHash('sha256');
    hash.update(content);
    return hash.digest('hex');
  },

  /**
   * Verifies a hash against content.
   */
  async verifyHash(content, expectedHash) {
    const actualHash = await this.generateHash(content);
    return actualHash === expectedHash;
  },

  /**
   * Generates a hash for a file (for browser-side hashing).
   */
  async hashFileBrowser(file) {
    const buffer = await file.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }
};
