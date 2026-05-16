'use client';

import React from 'react';
import { Fingerprint, Loader2, CheckCircle2 } from 'lucide-react';

/**
 * Connect button for Bhutan NDI with status feedback.
 */
export default function NDIConnectButton({ 
  status, 
  onConnect, 
  isVerifying,
  profile 
}) {
  const isVerified = status === 'verified' || !!profile;
  const isPending = status === 'requested' || isVerifying;

  return (
    <button
      onClick={onConnect}
      disabled={isPending || isVerified}
      className={`w-full h-14 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all ${
        isVerified 
          ? 'bg-emerald-50 text-emerald-600 border border-emerald-100 cursor-default'
          : 'bg-slate-900 text-white hover:bg-black disabled:opacity-70'
      }`}
    >
      {isPending ? (
        <Loader2 className="animate-spin" size={20} />
      ) : isVerified ? (
        <CheckCircle2 size={20} />
      ) : (
        <Fingerprint size={20} />
      )}
      
      {isVerified ? 'Bhutan NDI Verified' : isPending ? 'Waiting for Scan...' : 'Connect Bhutan NDI'}
    </button>
  );
}
