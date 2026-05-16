'use client';

import { useState, useEffect, useCallback } from 'react';
import { SepoliaGuard } from '@/lib/wallet/sepolia-guard';
import { toast } from 'sonner';

/**
 * Hook for managing the Sepolia network state and switching logic.
 */
export function useSepoliaNetwork() {
  const [currentChainId, setCurrentChainId] = useState(null);
  const [isSepolia, setIsSepolia] = useState(false);
  const [isSwitching, setIsSwitching] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.ethereum) return;

    const checkNetwork = async () => {
      const chainId = await window.ethereum.request({ method: 'eth_chainId' });
      setCurrentChainId(chainId);
      setIsSepolia(SepoliaGuard.isSepolia(chainId));
    };

    checkNetwork();

    window.ethereum.on('chainChanged', (chainId) => {
      setCurrentChainId(chainId);
      setIsSepolia(SepoliaGuard.isSepolia(chainId));
    });
  }, []);

  const switchToSepolia = useCallback(async () => {
    setIsSwitching(true);
    try {
      const success = await SepoliaGuard.switchToSepolia();
      if (success) {
        toast.success('Switched to Sepolia Testnet');
      } else {
        toast.error('Failed to switch network. Please do it manually in Rabby.');
      }
      return success;
    } catch (err) {
      toast.error(err.message);
      return false;
    } finally {
      setIsSwitching(false);
    }
  }, []);

  return {
    currentChainId,
    isSepolia,
    isSwitching,
    switchToSepolia,
    requiredChainId: SepoliaGuard.SEPOLIA_CHAIN_ID
  };
}
