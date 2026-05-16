/**
 * Central registry for BGPS smart contract addresses across different networks.
 */
export const CONTRACT_ADDRESSES = {
  sepolia: {
    BGPSProcurement: process.env.NEXT_PUBLIC_BGPS_CONTRACT_ADDRESS || "0x0000000000000000000000000000000000000000",
  },
  // Add other networks (e.g., mainnet, goerli) here as needed
};

/**
 * Helper to get the contract address for the current active network.
 */
export const getActiveContractAddress = (network = 'sepolia') => {
  return CONTRACT_ADDRESSES[network]?.BGPSProcurement || "";
};
