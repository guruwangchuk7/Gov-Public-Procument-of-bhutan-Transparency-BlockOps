'use client';

import React, { useState } from 'react';
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
  const { address: walletAddress, connect: connectWallet, isConnecting: isConnectingWallet } = useRabbyWallet();
  const { updateNDI, updateWallet, verifyRoleAccess, access_status, error_message, redirect_target } = useRoleSession();
  const [isFinalizing, setIsFinalizing] = useState(false);

  const handleVerifyAccess = async () => {
    setIsFinalizing(true);
    // Sync hooks with the session
    updateNDI(ndiProfile);
    updateWallet(walletAddress);

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
      />

      {error_message && (
        <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-start gap-3 text-red-600 animate-in shake duration-300">
          <AlertCircle size={18} className="mt-0.5" />
          <div className="space-y-1">
            <p className="text-sm font-bold">Access Denied</p>
            <p className="text-xs font-medium opacity-80">{error_message}</p>
          </div>
        </div>
      )}

      <button
        onClick={handleVerifyAccess}
        disabled={!ndiProfile || !walletAddress || isFinalizing}
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
    <div className={`py-2 px-3 rounded-xl border flex items-center justify-center gap-2 transition-all ${
      active ? 'bg-emerald-50 border-emerald-100 text-emerald-600' : 'bg-gray-50 border-gray-100 text-gray-300'
    }`}>
      {active ? <CheckCircle2 size={12} /> : <div className="w-3 h-3 rounded-full border-2 border-current opacity-20" />}
      <span className="text-[10px] font-black uppercase tracking-widest">{label}</span>
    </div>
  );
}
