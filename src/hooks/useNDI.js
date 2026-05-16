'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';

/**
 * React hook for managing Bhutan NDI identity state with real-time polling.
 * Supports both Real Staging and Mock modes.
 */
export function useNDI() {
  const [isVerifying, setIsVerifying] = useState(false);
  const [ndiProfile, setNdiProfile] = useState(null);
  const [proofRequest, setProofRequest] = useState(null);
  const [status, setStatus] = useState('idle'); // idle, requested, verified, failed

  /**
   * Triggers the NDI verification flow.
   */
  const verifyIdentity = async () => {
    // 1. Check if we should use Mock Mode
    if (process.env.NEXT_PUBLIC_BLOCKCHAIN_MODE === 'mock') {
      return _runMockVerification();
    }

    setIsVerifying(true);
    setStatus('requested');
    try {
      // 2. Request a real proof from our API
      const res = await fetch('/api/ndi/proof-request', { method: 'POST' });
      const data = await res.json();
      
      if (data.proofRequestURL) {
        setProofRequest(data);
        toast.info('Scan the QR code with your Bhutan NDI app');
        return data;
      } else {
        throw new Error('Invalid proof request response');
      }
    } catch (error) {
      toast.error('Failed to connect to Bhutan NDI Staging');
      setIsVerifying(false);
      setStatus('failed');
      console.error(error);
    }
    return null;
  };

  /**
   * Internal polling logic for real NDI status
   */
  useEffect(() => {
    let pollInterval;

    if (status === 'requested' && proofRequest?.proofRequestThreadId) {
      pollInterval = setInterval(async () => {
        try {
          const res = await fetch(`/api/ndi/proof-status?threadId=${proofRequest.proofRequestThreadId}`);
          const result = await res.json();

          // Check if proof is validated
          if (result.data?.verification_result === 'ProofValidated') {
            const revealed = result.data.requested_presentation?.revealed_attrs || {};
            const user = {
              ndi_identifier: 'NDI-LIVE-' + proofRequest.proofRequestThreadId.slice(-8).toUpperCase(),
              full_name: revealed['Full Name']?.value || 'Verified Citizen',
              id_number: revealed['ID Number']?.value || 'Unknown',
              verified_at: new Date().toISOString()
            };
            
            setNdiProfile(user);
            setStatus('verified');
            setIsVerifying(false);
            clearInterval(pollInterval);
            toast.success('Identity Verified via Bhutan NDI');
          }
        } catch (err) {
          console.warn('NDI Polling error:', err);
        }
      }, 3000); // Poll every 3 seconds
    }

    return () => clearInterval(pollInterval);
  }, [status, proofRequest]);

  /**
   * Mock verification for demo purposes
   */
  const _runMockVerification = async () => {
    setIsVerifying(true);
    setStatus('requested');
    
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockUser = {
          ndi_identifier: 'NDI-SIM-' + Math.random().toString(36).substring(2, 10).toUpperCase(),
          full_name: 'Bhutanese Citizen (Mock)',
          id_number: '12345678901',
          verified_at: new Date().toISOString()
        };
        setNdiProfile(mockUser);
        setStatus('verified');
        setIsVerifying(false);
        toast.success('Identity Verified (Mock Mode)');
        resolve(mockUser);
      }, 2000);
    });
  };

  const disconnectIdentity = () => {
    setNdiProfile(null);
    setProofRequest(null);
    setStatus('idle');
    toast.info('NDI Identity Disconnected');
  };

  return {
    isVerifying,
    ndiProfile,
    proofRequest,
    status,
    verifyIdentity,
    disconnectIdentity,
    isAuthenticated: !!ndiProfile
  };
}
