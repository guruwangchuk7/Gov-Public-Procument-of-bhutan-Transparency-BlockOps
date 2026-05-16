/**
 * Utility for verifying and matching Bhutan NDI identities.
 */
export const NDIVerifier = {
  /**
   * Normalizes an NDI identifier (usually a DID or system-generated ID).
   */
  normalizeNDIIdentifier(value) {
    if (!value) return '';
    return value.toString().trim();
  },

  /**
   * Compares two NDI identifiers for equality.
   */
  isSameNDIIdentity(ndiA, ndiB) {
    if (!ndiA || !ndiB) return false;
    return this.normalizeNDIIdentifier(ndiA) === this.normalizeNDIIdentifier(ndiB);
  },

  /**
   * Extracts a stable identifier from an NDI proof result.
   * Depending on the NDI schema, this might be a DID or an ID Number.
   */
  extractNDIIdentifierFromProof(proofResult) {
    if (!proofResult) return null;
    
    // In our implementation, we use the holder_did or a specific attribute
    return proofResult.ndi_identifier || proofResult.holder_did || null;
  },

  /**
   * Validates if the NDI profile matches the expected role record.
   */
  matchNDIToRoleRecord(ndiProfile, roleRecord) {
    if (!ndiProfile || !roleRecord) return false;
    
    const profileId = this.extractNDIIdentifierFromProof(ndiProfile);
    const recordId = roleRecord.ndi_identifier;

    return this.isSameNDIIdentity(profileId, recordId);
  }
};
