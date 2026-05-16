'use client';
import { useState } from 'react';
import { Wallet, Loader2, CheckCircle2 } from 'lucide-react';
import { ethers } from 'ethers';

export default function RabbyConnectButton({ onConnect, walletAddress }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const connectWallet = async () => {
    if (!window.ethereum) {
      setError('Rabby Wallet not found. Please install it.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.send("eth_requestAccounts", []);
      const network = await provider.getNetwork();
      
      // Check if on Sepolia (Chain ID 11155111)
      if (network.chainId !== 11155111n) {
        setError('Please switch to Ethereum Sepolia network in Rabby.');
        setLoading(false);
        return;
      }

      onConnect(accounts[0]);
    } catch (err) {
      console.error(err);
      setError('Failed to connect wallet.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full space-y-2">
      <button
        onClick={connectWallet}
        disabled={loading || walletAddress}
        className={`w-full flex items-center justify-center gap-3 px-6 py-4 rounded-xl font-bold transition-all ${
          walletAddress 
            ? 'bg-blue-50 text-blue-600 border-2 border-blue-100' 
            : 'bg-gray-900 text-white hover:bg-gray-800 shadow-lg shadow-gray-200'
        }`}
      >
        {loading ? (
          <Loader2 className="animate-spin" size={20} />
        ) : walletAddress ? (
          <CheckCircle2 size={20} />
        ) : (
          <Wallet size={20} />
        )}
        {walletAddress 
          ? `Wallet Connected: ${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}` 
          : 'Connect Rabby Wallet'}
      </button>
      {error && <p className="text-xs text-red-500 text-center font-medium">{error}</p>}
    </div>
  );
}
