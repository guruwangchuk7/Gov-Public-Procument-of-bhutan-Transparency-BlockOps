/**
 * Mock implementation of the Bhutan NDI SDK.
 * Simulates the biometric verification and digital signature process.
 */
export const NdiClient = {
  /**
   * Generates a mock NDI verification request.
   */
  async requestVerification() {
    console.log('NDI: Requesting biometric verification...');
    return new Promise((resolve) => {
      // Simulate user scanning QR code and verifying on mobile
      setTimeout(() => {
        resolve({
          success: true,
          ndi_identifier: 'BHUTAN-NDI-' + Math.random().toString(36).substring(2, 10).toUpperCase(),
          full_name: 'Bhutanese Citizen',
          verified_at: new Date().toISOString(),
          signature: '0x_mock_ndi_digital_signature_' + Math.random().toString(16).substring(2, 32)
        });
      }, 2500);
    });
  },

  /**
   * Simulates verifying a digital signature.
   */
  async verifySignature(signature, identifier) {
    return signature.includes(identifier.split('-').pop().toLowerCase());
  }
};
