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
    setIsVerifying(true);
    setStatus('requested');
    try {
      const res = await fetch('/api/auth/ndi/request');
      const data = await res.json();
      
      if (data.threadId) {
        setProofRequest(data);
        toast.info('Scan the QR code with your Bhutan NDI app');
        return data;
      } else {
        throw new Error(data.error || 'Invalid proof request response');
      }
    } catch (error) {
      toast.error('Failed to connect to Bhutan NDI');
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

    if (status === 'requested' && proofRequest?.threadId) {
      pollInterval = setInterval(async () => {
        try {
          const res = await fetch(`/api/auth/ndi/status?threadId=${proofRequest.threadId}`);
          const result = await res.json();

          // Check if proof is validated
          if (result.status === 'ProofValidated') {
            const profile = result.profile;
            setNdiProfile(profile);
            setStatus('verified');
            setIsVerifying(false);
            clearInterval(pollInterval);
            toast.success(`Identity Verified: ${profile.fullName}`);
          } else if (result.status === 'ProofRejected') {
            setStatus('failed');
            setIsVerifying(false);
            clearInterval(pollInterval);
            toast.error('Identity Verification Rejected');
          }
        } catch (err) {
          console.warn('NDI Polling error:', err);
        }
      }, 3000); // Poll every 3 seconds
    }

    return () => clearInterval(pollInterval);
  }, [status, proofRequest]);


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
