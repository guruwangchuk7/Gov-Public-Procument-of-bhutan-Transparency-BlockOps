/**
 * Utility for enforcing the Sepolia network in the user's wallet.
 */
export const SepoliaGuard = {
  SEPOLIA_CHAIN_ID: '0xaa36a7', // 11155111

  /**
   * Checks if the provided chainId is Sepolia.
   */
  isSepolia(chainId) {
    return chainId === this.SEPOLIA_CHAIN_ID;
  },

  /**
   * Requests the wallet to switch to the Sepolia network.
   * If Sepolia is not added, it will attempt to add it.
   */
  async ensureSepolia() {
    if (typeof window === 'undefined' || !window.ethereum) return;

    try {
      // Attempt to switch to Sepolia
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: this.SEPOLIA_CHAIN_ID }],
      });
      return true;
    } catch (switchError) {
      // This error code indicates that the chain has not been added to the wallet.
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: this.SEPOLIA_CHAIN_ID,
                chainName: 'Sepolia',
                nativeCurrency: {
                  name: 'Sepolia ETH',
                  symbol: 'ETH',
                  decimals: 18,
                },
                rpcUrls: [process.env.NEXT_PUBLIC_SEPOLIA_RPC_URL || 'https://rpc.sepolia.org'],
                blockExplorerUrls: ['https://sepolia.etherscan.io'],
              },
            ],
          });
          return true;
        } catch (addError) {
          throw new Error('Failed to add Sepolia network to your wallet.');
        }
      }
      throw new Error('Please switch your wallet to the Sepolia network.');
    }
  }
};
