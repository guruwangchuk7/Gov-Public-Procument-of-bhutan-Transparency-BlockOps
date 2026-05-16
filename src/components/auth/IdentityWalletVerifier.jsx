'use client';

import React, { useState, useEffect } from 'react';
import {
  Fingerprint,
  Wallet,
  ShieldCheck,
  ArrowRight,
  Loader2,
  AlertCircle,
  ChevronRight,
  CheckCircle2
} from 'lucide-react';
import { useNDI } from '@/hooks/useNDI';
import { useRabbyWallet } from '@/hooks/useRabbyWallet';
import { useRoleSession } from '@/hooks/useRoleSession';
import { useRouter } from 'next/navigation';
import IdentityLinkingCard from './IdentityLinkingCard';

/**
 * Step-by-step UI for Multi-Factor Identity and Wallet Verification.
 */
export default function IdentityWalletVerifier({
  role,
  onVerified,
  mockRecords = []
}) {
  const router = useRouter();
  const { ndiProfile, verifyIdentity, isVerifying: isVerifyingNDI, status: ndiStatus, proofRequest } = useNDI();
  const {
    address: walletAddress,
    connect: connectWallet,
    isConnecting: isConnectingWallet,
    isConnected,
    walletStatus
  } = useRabbyWallet();
  const { updateNDI, updateWallet, verifyRoleAccess, access_status, error_message, redirect_target } = useRoleSession();
  const [isFinalizing, setIsFinalizing] = useState(false);

  // Sync hooks with the session automatically
  useEffect(() => {
    if (ndiProfile) updateNDI(ndiProfile);
  }, [ndiProfile, updateNDI]);

  useEffect(() => {
    // We only update the session's wallet if the hook actually has a connected address
    // This prevents the session from being auto-populated by the database address
    if (isConnected && walletAddress) {
      updateWallet(walletAddress);
    }
  }, [walletAddress, updateWallet, isConnected]);

  const handleVerifyAccess = async () => {
    if (!isConnected) return;
    setIsFinalizing(true);

    // Explicitly verify the role access
    const result = await verifyRoleAccess(mockRecords);

    if (result.allowed || result.status === 'registration_required' || result.status === 'pending') {
      if (onVerified) {
        onVerified(result);
      } else if (result.redirect_target) {
        router.push(result.redirect_target);
      }
    }
    setIsFinalizing(false);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
          <ShieldCheck size={28} />
        </div>
        <div>
          <h2 className="text-xl font-black text-gray-900 tracking-tight">Identity & Wallet Link</h2>
          <p className="text-sm text-gray-500 font-medium">Step-by-step verification for {role?.replace('_', ' ')} access.</p>
        </div>
      </div>

      <IdentityLinkingCard
        ndiProfile={ndiProfile}
        walletAddress={walletAddress}
        isVerifyingNDI={isVerifyingNDI}
        isConnectingWallet={isConnectingWallet}
        onVerifyNDI={verifyIdentity}
        onConnectWallet={connectWallet}
        ndiStatus={ndiStatus}
        proofRequest={proofRequest}
        walletStatus={walletStatus}
        isConnected={isConnected}
      />

      {error_message && (
        <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-start gap-3 text-red-600 animate-in shake duration-300">
          <AlertCircle size={18} className="mt-0.5" />
          <div className="space-y-1">
            <p className="text-sm font-bold">Verification Failed</p>
            <p className="text-xs font-medium opacity-80">{error_message}</p>
          </div>
        </div>
      )}

      {/* Visual Feedback for Match Status if we have a connected wallet */}
      {walletAddress && access_status === 'denied' && (
        <div className="px-4 py-3 bg-amber-50 border border-amber-100 rounded-xl flex items-center gap-3 text-amber-700 animate-in fade-in">
          <AlertCircle size={14} />
          <p className="text-[10px] font-bold uppercase tracking-tight">Wallet Mismatch: Please switch accounts in Rabby</p>
        </div>
      )}

      <button
        onClick={handleVerifyAccess}
        disabled={!ndiProfile || !isConnected || isFinalizing}
        className="w-full h-16 bg-slate-900 hover:bg-black text-white rounded-2xl font-black flex items-center justify-center gap-3 transition-all disabled:opacity-30 disabled:grayscale shadow-xl shadow-slate-200"
      >
        {isFinalizing ? (
          <Loader2 className="animate-spin" size={24} />
        ) : (
          <>
            Verify Role Access
            <ChevronRight size={20} />
          </>
        )}
      </button>

      <div className="grid grid-cols-3 gap-2">
        <StepBadge active={!!ndiProfile} label="NDI" />
        <StepBadge active={!!walletAddress} label="Wallet" />
        <StepBadge active={access_status === 'allowed'} label="Role" />
      </div>
    </div>
  );
}

function StepBadge({ active, label }) {
  return (
    <div className={`py-2 px-3 rounded-xl border flex items-center justify-center gap-2 transition-all ${active ? 'bg-emerald-50 border-emerald-100 text-emerald-600' : 'bg-gray-50 border-gray-100 text-gray-300'
      }`}>
      {active ? <CheckCircle2 size={12} /> : <div className="w-3 h-3 rounded-full border-2 border-current opacity-20" />}
      <span className="text-[10px] font-black uppercase tracking-widest">{label}</span>
    </div>
  );
}
