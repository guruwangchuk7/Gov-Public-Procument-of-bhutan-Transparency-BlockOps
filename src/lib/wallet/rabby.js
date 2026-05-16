import { ethers } from 'ethers';

/**
 * Utility for interacting with Rabby Wallet (and other EIP-1193 providers).
 * Ensures compatibility with window.ethereum.
 */
export const RabbyWallet = {
  /**
   * Checks if a compatible Ethereum provider (like Rabby) is installed.
   */
  isInstalled() {
    return typeof window !== 'undefined' && typeof window.ethereum !== 'undefined';
  },

  /**
   * Requests the user to connect their wallet.
   * @returns {Promise<string>} The connected wallet address
   */
  async connect() {
    if (!this.isInstalled()) {
      throw new Error('Rabby Wallet or compatible provider not found. Please install Rabby.');
    }

    try {
      // Use Ethers Web3Provider (v5 syntax) to interact with window.ethereum
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const accounts = await provider.send('eth_requestAccounts', []);
      return accounts[0];
    } catch (error) {
      if (error.code === 4001) {
        throw new Error('Connection rejected. Please approve the request in your wallet.');
      }
      throw error;
    }
  },

  /**
   * Gets the currently connected wallet address without prompting.
   */
  async getAccount() {
    if (!this.isInstalled()) return null;
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const accounts = await provider.send('eth_accounts', []);
      return accounts[0] || null;
    } catch (error) {
      return null;
    }
  },

  /**
   * Gets the current Chain ID from the wallet.
   */
  async getChainId() {
    if (!this.isInstalled()) return null;
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const network = await provider.getNetwork();
      return '0x' + network.chainId.toString(16);
    } catch (error) {
      return null;
    }
  },

  /**
   * Listens for account changes (e.g., user switching accounts in Rabby).
   */
  listenToAccountChanges(callback) {
    if (!this.isInstalled()) return;
    window.ethereum.on('accountsChanged', (accounts) => {
      callback(accounts[0] || null);
    });
  },

  /**
   * Listens for network changes.
   */
  listenToChainChanges(callback) {
    if (!this.isInstalled()) return;
    window.ethereum.on('chainChanged', (chainId) => {
      callback(chainId);
    });
  }
};
