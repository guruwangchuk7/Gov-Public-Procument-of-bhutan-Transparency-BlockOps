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

  // Initialize and listen for changes
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const init = async () => {
      const currentAccount = await RabbyWallet.getAccount();
      const currentChainId = await RabbyWallet.getChainId();
      setAddress(currentAccount);
      setChainId(currentChainId);
    };

    init();

    // Listen for changes
    RabbyWallet.listenToAccountChanges((acc) => setAddress(acc));
    RabbyWallet.listenToChainChanges((cid) => setChainId(cid));
  }, []);

  /**
   * Triggers the wallet connection flow.
   */
  const connect = useCallback(async () => {
    // 1. Check if we should use Mock Mode
    if (process.env.NEXT_PUBLIC_WALLET_MODE === 'mock') {
      const mockAddr = '0x' + Math.random().toString(16).slice(2, 42);
      setAddress(mockAddr);
      setChainId('0xaa36a7'); // Sepolia
      toast.success('Wallet Linked (Mock Mode)');
      return mockAddr;
    }

    setIsConnecting(true);
    setError(null);
    try {
      const addr = await RabbyWallet.connect();
      setAddress(addr);
      toast.success('Wallet Connected Successfully');
      return addr;
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
      return null;
    } finally {
      setIsConnecting(false);
    }
  }, []);

  const disconnect = useCallback(() => {
    setAddress(null);
    toast.info('Wallet Disconnected');
  }, []);

  return {
    address,
    chainId,
    isConnecting,
    error,
    connect,
    disconnect,
    isConnected: !!address,
    isInstalled: RabbyWallet.isInstalled()
  };
}
