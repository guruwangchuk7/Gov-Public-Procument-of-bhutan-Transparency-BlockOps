'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useRoleSession } from '@/hooks/useRoleSession';
import { resolveRoleAccess } from '@/lib/access-control/role-access';
import { Loader2, ShieldAlert, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

/**
 * Higher-Order Component to protect dashboard routes based on verified role and status.
 */
export default function RoleGuard({ 
  children, 
  requiredRole, 
  requireApproved = false,
  requireBlockchainAuthorized = false 
}) {
  const router = useRouter();
  const { 
    selected_role, 
    ndi_identity,
    wallet_address,
    role_verified, 
    access_status, 
    ndi_verified, 
    wallet_connected,
    redirect_target,
    error_message
  } = useRoleSession();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    // 0. Bypass for login, register, and pending routes
    const path = window.location.pathname;
    if (path.includes('/login') || path.includes('/register') || path.includes('/pending')) {
      setChecking(false);
      setIsAuthorized(true);
      return;
    }

    const checkAccess = async () => {
      // 1. Basic role match
      if (selected_role !== requiredRole) {
        setChecking(false);
        setIsAuthorized(false);
        return;
      }

      // 2. Identity and Wallet must be linked
      if (!ndi_verified || !wallet_connected) {
        setChecking(false);
        setIsAuthorized(false);
        return;
      }

      // 3. Status checks
      if (requireApproved) {
        if (access_status === 'allowed') {
          setChecking(false);
          setIsAuthorized(true);
          return;
        }

        // Dynamic verification on mount/reload since state is lost across navigation
        const result = await resolveRoleAccess({
          selected_role,
          ndi_profile: ndi_identity,
          wallet_address
        });

        if (result.status === 'allowed') {
          setChecking(false);
          setIsAuthorized(true);
          return;
        }

        setChecking(false);
        setIsAuthorized(false);
        return;
      }

      setChecking(false);
      setIsAuthorized(true);
    };

    // Small delay to allow session hydration
    const timer = setTimeout(checkAccess, 500);
    return () => clearTimeout(timer);
  }, [selected_role, requiredRole, ndi_verified, wallet_connected, access_status, requireApproved, ndi_identity, wallet_address]);

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center space-y-4">
          <Loader2 className="animate-spin text-primary mx-auto" size={40} />
          <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Verifying Identity Proof...</p>
        </div>
      </div>
    );
  }

  if (!isAuthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
        <div className="max-w-md w-full card p-8 text-center shadow-2xl border-white">
          <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center text-red-500 mx-auto mb-6">
            <ShieldAlert size={32} />
          </div>
          <h2 className="text-xl font-black text-gray-900 mb-2">Access Restricted</h2>
          <p className="text-sm text-gray-500 mb-8 leading-relaxed">
            Your current identity or wallet does not have permission to access this area. 
            {error_message && <span className="block mt-2 font-bold text-red-600">{error_message}</span>}
          </p>
          
          <Link 
            href={redirect_target || "/select-role"} 
            className="btn-primary w-full h-14 flex items-center justify-center gap-2"
          >
            <ArrowLeft size={18} />
            Resolve Access
          </Link>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
