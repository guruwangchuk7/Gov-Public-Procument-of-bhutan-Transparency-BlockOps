import React from 'react';
import { ShieldCheck, CheckCircle2, Loader2, QrCode, Link, Wallet, AlertCircle } from 'lucide-react';
import QRCode from 'react-qr-code';
import { NDIVerifier } from '@/lib/ndi/ndi-verifier';

/**
 * Premium UI Component for Multi-Factor Identity Linking.
 * Visualizes the connection between Bhutan NDI (Digital Identity) and Rabby Wallet (On-Chain Identity).
 */
export default function IdentityLinkingCard({
  ndiProfile,
  walletAddress,
  isVerifyingNDI,
  isConnectingWallet,
  onVerifyNDI,
  onConnectWallet,
  ndiStatus,
  proofRequest,
  walletStatus = 'idle',
  isConnected = false
}) {
  const isNDIReady = !!ndiProfile;
  const isWalletReady = isConnected && !!walletAddress;
  const isFullyLinked = isNDIReady && isWalletReady;
  const ndiIdentifier = NDIVerifier.extractNDIIdentifierFromProof(ndiProfile);

  return (
    <div className="w-full space-y-3">
      {/* Step 1: Bhutan NDI - Sleek Input Style */}
      <div className={`group relative h-14 rounded-2xl border transition-all duration-300 flex items-center px-4 gap-4 ${
        isNDIReady ? 'border-blue-200 bg-blue-50/30' : 'border-zinc-200 bg-zinc-50/50'
      }`}>
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${isNDIReady ? 'bg-white shadow-sm' : 'bg-white shadow-sm border border-zinc-100'}`}>
          <img src="/assets/NDI_logo.png" alt="NDI" className="w-6 h-6 object-contain" />
        </div>
        
        <div className="flex-1 text-left">
          <p className={`text-[10px] font-bold uppercase tracking-tight ${isNDIReady ? 'text-blue-600' : 'text-zinc-400'}`}>
            {isNDIReady ? 'Sovereign ID Linked' : 'Step 1: Bhutan NDI'}
          </p>
          <p className="text-xs font-semibold text-zinc-900 truncate max-w-[180px]">
            {isNDIReady ? ndiIdentifier : 'Digital Identity Verification'}
          </p>
        </div>

        {isNDIReady ? (
          <CheckCircle2 size={18} className="text-blue-500" />
        ) : (
          <button
            onClick={onVerifyNDI}
            disabled={isVerifyingNDI || ndiStatus === 'requested'}
            className="text-[10px] font-black uppercase text-blue-600 hover:text-blue-700 transition-colors"
          >
            {isVerifyingNDI ? <Loader2 size={14} className="animate-spin" /> : 'Verify'}
          </button>
        )}

        {/* NDI QR Popover Style */}
        {(ndiStatus === 'requested' || ndiStatus === 'processing') && proofRequest?.proofRequestURL && !isNDIReady && (
          <div className="absolute top-full left-0 right-0 mt-2 p-4 bg-white rounded-2xl border border-zinc-100 shadow-2xl z-50 flex flex-col items-center gap-3 animate-in fade-in zoom-in-95">
             <QRCode value={proofRequest.proofRequestURL} size={120} />
             <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest animate-pulse">Scan with NDI App</span>
          </div>
        )}
      </div>

      {/* Step 2: Rabby Wallet - Sleek Input Style */}
      <div className={`relative h-14 rounded-2xl border transition-all duration-300 flex items-center px-4 gap-4 ${
        isWalletReady ? 'border-indigo-200 bg-indigo-50/30' : 'border-zinc-200 bg-zinc-50/50'
      }`}>
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${isWalletReady ? 'bg-indigo-600 text-white shadow-sm' : 'bg-white shadow-sm border border-zinc-100 text-zinc-300'}`}>
          <Wallet size={16} />
        </div>

        <div className="flex-1 text-left">
          <p className={`text-[10px] font-bold uppercase tracking-tight ${isWalletReady ? 'text-indigo-600' : 'text-zinc-400'}`}>
            {isWalletReady ? 'Wallet Connected' : 'Step 2: Rabby Wallet'}
          </p>
          <p className="text-xs font-semibold text-zinc-900 truncate max-w-[180px]">
            {isWalletReady ? walletAddress : 'Cryptographic Handshake'}
          </p>
        </div>

        {isWalletReady ? (
          <CheckCircle2 size={18} className="text-indigo-500" />
        ) : (
          <button
            onClick={onConnectWallet}
            disabled={isConnectingWallet || !isNDIReady}
            className="text-[10px] font-black uppercase text-indigo-600 hover:text-indigo-700 disabled:opacity-30 transition-colors"
          >
            {isConnectingWallet ? <Loader2 size={14} className="animate-spin" /> : 'Connect'}
          </button>
        )}
      </div>

      {!isFullyLinked && (
        <div className="mt-4 flex items-start gap-2 p-3 bg-amber-50/50 rounded-2xl border border-amber-100/50">
          <AlertCircle size={14} className="text-amber-600 mt-0.5 shrink-0" />
          <p className="text-[10px] text-amber-700 leading-relaxed font-bold uppercase tracking-tight">
            {isNDIReady ? 'Link Rabby Wallet to complete the handshake.' : 'Verify NDI identity to begin.'}
          </p>
        </div>
      )}
    </div>
  );
}
