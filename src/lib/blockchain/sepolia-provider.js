import { ethers } from 'ethers';

/**
 * Utility for accessing the Sepolia network provider and explorer links.
 */
export const SepoliaProvider = {
  /**
   * Returns a standard JsonRpcProvider for Sepolia.
   */
  getProvider() {
    const rpcUrl = process.env.NEXT_PUBLIC_SEPOLIA_RPC_URL;
    if (!rpcUrl) {
      console.warn('NEXT_PUBLIC_SEPOLIA_RPC_URL is not set. Falling back to public provider.');
      return new ethers.providers.JsonRpcProvider('https://rpc.sepolia.org');
    }
    return new ethers.providers.JsonRpcProvider(rpcUrl);
  },

  /**
   * Generates an Etherscan URL for a transaction hash.
   */
  getTxUrl(txHash) {
    return `https://sepolia.etherscan.io/tx/${txHash}`;
  },

  /**
   * Generates an Etherscan URL for an address.
   */
  getAddressUrl(address) {
    return `https://sepolia.etherscan.io/address/${address}`;
  }
};
