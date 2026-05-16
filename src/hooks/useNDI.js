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
    const startTime = Date.now();
    const TIMEOUT_MS = 120000; // 2 minute maximum wait

    // Poll if status is requested or processing
    if ((status === 'requested' || status === 'processing') && proofRequest?.threadId) {
      pollInterval = setInterval(async () => {
        // Check for timeout
        if (Date.now() - startTime > TIMEOUT_MS) {
          setStatus('failed');
          setIsVerifying(false);
          clearInterval(pollInterval);
          toast.error('Identity verification timed out. Please try scanning again.');
          return;
        }

        try {
          const res = await fetch(`/api/auth/ndi/status?threadId=${proofRequest.threadId}`);
          if (!res.ok) throw new Error('Status check failed');
          
          const result = await res.json();

          // Handle transition to processing
          if (result.status === 'processing' && status !== 'processing') {
            setStatus('processing');
            toast.info('Proof received, verifying identity...');
          }

          // Check if proof is validated
          if (result.status === 'ProofValidated') {
            const profile = result.profile;
            setNdiProfile(profile);
            setStatus('verified');
            setIsVerifying(false);
            clearInterval(pollInterval);
            toast.success(`Identity Verified: ${profile.fullName || 'User'}`);
          } else if (result.status === 'ProofRejected') {
            setStatus('failed');
            setIsVerifying(false);
            clearInterval(pollInterval);
            toast.error('Identity Verification Rejected');
          }
        } catch (err) {
          console.warn('NDI Polling error:', err);
          // Don't stop polling on minor network glitches, wait for timeout
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
