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
   */
  extractNDIIdentifierFromProof(profile) {
    if (!profile) return null;
    
    // Prioritize ID Number (Citizenship ID) as it's the most stable identifier in Bhutan
    // Alternatively use holderDid if idNumber is not available.
    return profile.idNumber || profile.holderDid || profile.ndi_identifier || null;
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
