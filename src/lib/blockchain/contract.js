import { ethers } from 'ethers';
import BGPS_ABI from './abis/BGPSProcurement.json';
import { getActiveContractAddress } from './contract-addresses.js';

/**
 * Main bridge for interacting with the BGPS smart contract.
 * Automatically handles provider selection and error states.
 */
export const BGPSContract = {
  /**
   * Returns a read-only instance of the contract using a public RPC.
   * Useful for fetching data without needing a wallet connection.
   */
  async getReadOnly() {
    const rpcUrl = process.env.NEXT_PUBLIC_SEPOLIA_RPC_URL;
    const contractAddress = getActiveContractAddress();

    if (!rpcUrl) throw new Error('SEPOLIA_RPC_URL is not configured.');
    if (!contractAddress) throw new Error('BGPS Contract address is not configured.');

    const provider = new ethers.JsonRpcProvider(rpcUrl);
    return new ethers.Contract(contractAddress, BGPS_ABI.abi || BGPS_ABI, provider);
  },

  /**
   * Returns a write-enabled instance of the contract using the user's wallet.
   * Required for transactions (Approvals, Tenders, Bids, Awards).
   */
  async getWithSigner() {
    if (typeof window === 'undefined' || !window.ethereum) {
      throw new Error('Ethereum provider not found. Please connect Rabby Wallet.');
    }

    const contractAddress = getActiveContractAddress();
    if (!contractAddress) throw new Error('BGPS Contract address is not configured.');

    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();

    // Check if on correct network (Sepolia 11155111)
    const network = await provider.getNetwork();
    if (network.chainId !== 11155111n) {
      throw new Error('Please switch your wallet to the Sepolia Testnet.');
    }

    return new ethers.Contract(contractAddress, BGPS_ABI.abi || BGPS_ABI, signer);
  },

  /**
   * Normalizes any hash to a valid bytes32 string for the contract.
   */
  normalizeHash(hash) {
    if (!hash) return ethers.ZeroHash;
    if (hash.startsWith('0x') && hash.length === 66) return hash;
    
    // If it's a plain string, we hash it first
    return ethers.keccak256(ethers.toUtf8Bytes(hash));
  }
};
