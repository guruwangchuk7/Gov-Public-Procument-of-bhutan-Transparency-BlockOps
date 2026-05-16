'use client';

import { useState, useEffect, useCallback } from 'react';
import { RabbyWallet } from '@/lib/wallet/rabby';
import { toast } from 'sonner';

/**
 * Hook for managing Rabby Wallet connection state.
 */
export function useRabbyWallet() {
  const [address, setAddress] = useState(null);
  const [chainId, setChainId] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Status Model:
   * - idle: No action yet
   * - detected: Provider found, but absolutely no reading done yet
   * - connecting: User clicked connect, popup should be open
   * - connected: Approved by user
   * - rejected: Rejected by user
   * - unavailable: No Rabby/Ethereum provider found
   * - error: Other error
   */
  const [walletStatus, setWalletStatus] = useState('idle');

  // Passive detection ONLY for provider existence
  useEffect(() => {
    if (typeof window === 'undefined') return;

    if (RabbyWallet.isInstalled()) {
      if (walletStatus === 'idle') setWalletStatus('detected');
    } else {
      setWalletStatus('unavailable');
    }
  }, [walletStatus]);

  // Setup listeners ONLY after explicit connection
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (walletStatus !== 'connected' && walletStatus !== 'connecting') return;

    const handleAccounts = (accounts) => {
      const acc = accounts[0] || null;
      setAddress(acc);
      if (!acc) {
        setWalletStatus('detected');
        setAddress(null);
      }
    };

    const handleChain = (cid) => setChainId(cid);

    if (window.ethereum) {
      window.ethereum.on('accountsChanged', handleAccounts);
      window.ethereum.on('chainChanged', handleChain);
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleAccounts);
        window.ethereum.removeListener('chainChanged', handleChain);
      }
    };
  }, [walletStatus]);

  /**
   * Triggers the wallet connection flow.
   * MUST only be called from button onClick.
   */
  const connect = useCallback(async () => {
    // 1. Strict Requirement: Check if provider exists
    if (!RabbyWallet.isInstalled()) {
      setWalletStatus('unavailable');
      toast.error('Rabby Wallet not detected. Please install or enable Rabby Wallet.');
      return null;
    }

    setWalletStatus('connecting');
    setIsConnecting(true);
    setError(null);

    // Show the "Connecting..." notification as requested
    const loadingToast = toast.loading('Connecting to Rabby Wallet...');

    try {
      // 2. Handle Mock Mode (explicitly gated)
      if (process.env.NEXT_PUBLIC_WALLET_MODE === 'mock') {
        const mockAddr = '0x' + Math.random().toString(16).slice(2, 42);
        setAddress(mockAddr);
        setChainId('0xaa36a7'); // Sepolia
        setWalletStatus('connected');
        toast.dismiss(loadingToast);
        toast.success('Wallet Linked (Mock Mode)');
        return mockAddr;
      }

      // 3. THE CORE CALL: Explicit eth_requestAccounts
      // This will trigger the Rabby Wallet "Connect to Dapp" popup
      const addr = await RabbyWallet.connect();

      setAddress(addr);
      setWalletStatus('connected');

      toast.dismiss(loadingToast);
      toast.success('Rabby Wallet connected.');

      return addr;
    } catch (err) {
      toast.dismiss(loadingToast);

      const isRejected = err.message.toLowerCase().includes('rejected') || err.code === 4001;

      if (isRejected) {
        setWalletStatus('rejected');
        toast.error('Wallet connection was rejected. Please approve the request in Rabby Wallet.');
      } else {
        setWalletStatus('error');
        toast.error(err.message || 'Connection failed.');
      }

      setError(err.message);
      return null;
    } finally {
      setIsConnecting(false);
    }
  }, []);

  const disconnect = useCallback(() => {
    setAddress(null);
    setWalletStatus('detected');
    localStorage.removeItem('bgps_wallet_address');
    toast.info('Wallet Disconnected');
  }, []);

  return {
    address,
    chainId,
    isConnecting,
    error,
    walletStatus,
    connect,
    disconnect,
    isConnected: walletStatus === 'connected',
    isInstalled: RabbyWallet.isInstalled()
  };
}
