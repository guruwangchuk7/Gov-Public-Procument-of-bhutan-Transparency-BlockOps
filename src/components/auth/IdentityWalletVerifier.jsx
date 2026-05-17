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

  useEffect(() => {
    if (ndiProfile) updateNDI(ndiProfile);
  }, [ndiProfile, updateNDI]);

  useEffect(() => {
    if (isConnected && walletAddress) {
      updateWallet(walletAddress);
    }
  }, [walletAddress, updateWallet, isConnected]);

  const handleVerifyAccess = async () => {
    if (!isConnected) return;
    setIsFinalizing(true);
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
    <div className="space-y-6 w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
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
        <div className="p-3 bg-red-50/50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600 animate-in shake duration-300">
          <AlertCircle size={14} className="shrink-0" />
          <p className="text-[10px] font-bold uppercase tracking-tight">{error_message}</p>
        </div>
      )}

      <button
        onClick={handleVerifyAccess}
        disabled={!ndiProfile || !isConnected || isFinalizing}
        className="w-full h-14 bg-zinc-900 hover:bg-black text-white rounded-2xl font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-20 disabled:grayscale shadow-xl shadow-zinc-200"
      >
        {isFinalizing ? (
          <Loader2 className="animate-spin" size={20} />
        ) : (
          <>
            <span>Access Dashboard</span>
            <ChevronRight size={18} />
          </>
        )}
      </button>

      {/* Modern Horizontal Stepper */}
      <div className="flex items-center justify-center gap-2">
        <div className={`h-1 w-8 rounded-full transition-colors ${ndiProfile ? 'bg-blue-600' : 'bg-zinc-200'}`} />
        <div className={`h-1 w-8 rounded-full transition-colors ${isConnected ? 'bg-indigo-600' : 'bg-zinc-200'}`} />
        <div className={`h-1 w-8 rounded-full transition-colors ${access_status === 'allowed' ? 'bg-zinc-900' : 'bg-zinc-200'}`} />
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
