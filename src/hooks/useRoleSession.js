'use client';

import { useState, useCallback, useEffect } from 'react';
import { resolveRoleAccess } from '@/lib/access-control/role-access';
import { NDISession } from '@/lib/ndi/ndi-session';

/**
 * Unified hook for managing the role-based authentication session.
 */
export function useRoleSession() {
  const [session, setSession] = useState({
    selected_role: null,
    ndi_identity: null,
    wallet_address: null,
    ndi_verified: false,
    wallet_connected: false,
    role_verified: false,
    access_status: 'idle',
    redirect_target: '',
    error_message: ''
  });

  // Sync with storage on mount
  useEffect(() => {
    const savedNdi = NDISession.getSession();
    const savedRole = localStorage.getItem('bgps_selected_role');
    const savedWallet = localStorage.getItem('bgps_wallet_address');

    if (savedNdi || savedRole || savedWallet) {
      setSession(prev => ({
        ...prev,
        ndi_identity: savedNdi,
        ndi_verified: !!savedNdi,
        wallet_address: savedWallet,
        wallet_connected: !!savedWallet,
        selected_role: savedRole || prev.selected_role
      }));
    }
  }, []);

  const selectRole = useCallback((role) => {
    setSession(prev => ({ ...prev, selected_role: role }));
    localStorage.setItem('bgps_selected_role', role);
  }, []);

  const updateNDI = useCallback((profile) => {
    setSession(prev => ({
      ...prev,
      ndi_identity: profile,
      ndi_verified: !!profile
    }));
    if (profile) NDISession.saveSession(profile);
    else NDISession.clearSession();
  }, []);

  const updateWallet = useCallback((address) => {
    setSession(prev => ({
      ...prev,
      wallet_address: address,
      wallet_connected: !!address
    }));
    if (address) localStorage.setItem('bgps_wallet_address', address);
    else localStorage.removeItem('bgps_wallet_address');
  }, []);

  const verifyRoleAccess = useCallback(async (mockRecords = []) => {
    setSession(prev => ({ ...prev, access_status: 'checking' }));

    const result = await resolveRoleAccess({
      selected_role: session.selected_role,
      ndi_profile: session.ndi_identity,
      wallet_address: session.wallet_address,
      mock_records: mockRecords
    });

    setSession(prev => ({
      ...prev,
      role_verified: result.allowed,
      access_status: result.status,
      redirect_target: result.redirect_target || '',
      error_message: result.reason || ''
    }));

    return result;
  }, [session.selected_role, session.ndi_identity, session.wallet_address]);

  const logoutRoleSession = useCallback(() => {
    NDISession.clearSession();
    localStorage.removeItem('bgps_wallet_address');
    localStorage.removeItem('bgps_selected_role');
    setSession({
      selected_role: null,
      ndi_identity: null,
      wallet_address: null,
      ndi_verified: false,
      wallet_connected: false,
      role_verified: false,
      access_status: 'idle',
      redirect_target: '',
      error_message: ''
    });
  }, []);

  return {
    ...session,
    selectRole,
    updateNDI,
    updateWallet,
    verifyRoleAccess,
    logoutRoleSession
  };
}
