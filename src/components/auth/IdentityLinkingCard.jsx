import React, { useState } from 'react';
import { ShieldCheck, CheckCircle2, Loader2, QrCode, Link, Wallet, AlertCircle, Copy, Check } from 'lucide-react';
import QRCode from 'react-qr-code';
import { NDIVerifier } from '@/lib/ndi/ndi-verifier';

const shortenAddress = (addr) => addr ? `${addr.slice(0, 6)}...${addr.slice(-4)}` : '';

/**
 * Premium UI Component for Multi-Factor Identity Linking.
 * Visualizes the connection between Bhutan NDI (Digital Identity) and Rabby Wallet (On-Chain Identity).
 */
export default function IdentityLinkingCard({
  role,
  ndiProfile,
  walletAddress,
  expectedWallet,
  expectedConfig,
  isMismatch,
  isVerifyingNDI,
  isConnectingWallet,
  onVerifyNDI,
  onConnectWallet,
  onReconnectWallet,
  ndiStatus,
  proofRequest,
  walletStatus = 'idle',
  isConnected = false
}) {
  const [copiedKey, setCopiedKey] = useState(false);
  const isNDIReady = !!ndiProfile;
  const isWalletReady = isConnected && !!walletAddress;
  const isFullyLinked = isNDIReady && isWalletReady && !isMismatch;
  const ndiIdentifier = NDIVerifier.extractNDIIdentifierFromProof(ndiProfile);

  const handleCopy = (address) => {
    try {
      navigator.clipboard.writeText(address);
      setCopiedKey(true);
      setTimeout(() => setCopiedKey(false), 2000);
    } catch (e) {
      console.warn('Clipboard error', e);
    }
  };

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

      {/* Pre-connection Guidance */}
      {isNDIReady && !isWalletReady && expectedConfig && (
        <div className="mt-4 p-4 bg-zinc-50 rounded-2xl border border-zinc-200 space-y-4 animate-in fade-in slide-in-from-top-2">
          
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Current Role</span>
            <span className="text-xs font-bold text-zinc-800 bg-white px-2 py-1 rounded-md border border-zinc-100 shadow-sm">{expectedConfig.roleLabel}</span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Network</span>
            <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-1 rounded-md border border-indigo-100">{expectedConfig.network}</span>
          </div>

          <div className="bg-white rounded-xl border border-zinc-100 p-3 space-y-2">
             <div className="flex justify-between items-center">
                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Expected Demo User</span>
                <span className="text-xs font-bold text-zinc-900">{expectedConfig.demoName}</span>
             </div>
             <div className="flex justify-between items-center pt-2 border-t border-zinc-50">
                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Wallet</span>
                <div className="flex items-center gap-2">
                   <span className="text-xs font-mono text-zinc-700 font-semibold">{expectedConfig.shortWallet}</span>
                   <button onClick={() => handleCopy(expectedConfig.expectedWallet)} className="text-zinc-400 hover:text-zinc-700 transition-colors">
                     {copiedKey ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
                   </button>
                </div>
             </div>
          </div>

          <div className="flex items-start gap-2 pt-1">
            <AlertCircle size={14} className="text-zinc-500 mt-0.5 shrink-0" />
            <p className="text-[11px] text-zinc-600 leading-relaxed font-medium">
              Open Rabby and switch to this account before clicking Connect Wallet.
            </p>
          </div>
        </div>
      )}

      {/* Step 2: Rabby Wallet - Sleek Input Style */}
      <div className={`relative h-14 rounded-2xl border transition-all duration-300 flex items-center px-4 gap-4 ${
        isWalletReady ? (isMismatch ? 'border-red-200 bg-red-50/30' : 'border-indigo-200 bg-indigo-50/30') : 'border-zinc-200 bg-zinc-50/50'
      }`}>
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${isWalletReady ? (isMismatch ? 'bg-red-600 text-white' : 'bg-indigo-600 text-white shadow-sm') : 'bg-white shadow-sm border border-zinc-100 text-zinc-300'}`}>
          <Wallet size={16} />
        </div>

        <div className="flex-1 text-left">
          <p className={`text-[10px] font-bold uppercase tracking-tight ${isWalletReady ? (isMismatch ? 'text-red-600' : 'text-indigo-600') : 'text-zinc-400'}`}>
            {isWalletReady ? (isMismatch ? 'Wallet Mismatch' : 'Wallet Connected') : 'Step 2: Rabby Wallet'}
          </p>
          <p className="text-xs font-semibold text-zinc-900 truncate max-w-[180px]">
            {isWalletReady ? shortenAddress(walletAddress) : 'Cryptographic Handshake'}
          </p>
        </div>

        {isWalletReady ? (
          isMismatch ? <AlertCircle size={18} className="text-red-500" /> : <CheckCircle2 size={18} className="text-indigo-500" />
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

      {/* Mismatch Warning & Reconnect */}
      {isMismatch && (
        <div className="mt-4 p-5 bg-red-50 rounded-2xl border border-red-100 space-y-4 animate-in fade-in zoom-in-95">
          <div className="flex items-start gap-2">
            <AlertCircle size={16} className="text-red-600 mt-0.5 shrink-0" />
            <p className="text-sm text-red-700 font-bold">Wrong Rabby account connected.</p>
          </div>
          
          <div className="pl-6 space-y-3">
            <div>
              <p className="text-[10px] text-red-400 font-bold uppercase tracking-widest">Expected ({role})</p>
              <p className="text-xs font-mono text-red-900 font-medium break-all">{expectedWallet}</p>
            </div>
            <div>
              <p className="text-[10px] text-red-400 font-bold uppercase tracking-widest">Connected</p>
              <p className="text-xs font-mono text-red-900 font-medium break-all">{walletAddress}</p>
            </div>
          </div>

          <div className="pl-6 pt-2 space-y-3">
            <p className="text-[11px] text-red-700 font-medium">
              Please open Rabby Wallet, switch to the correct account, then click Reconnect Wallet.
            </p>
            <button 
              onClick={onReconnectWallet}
              disabled={isConnectingWallet}
              className="px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl transition-colors shadow-sm w-full flex items-center justify-center gap-2"
            >
              {isConnectingWallet ? <Loader2 size={14} className="animate-spin" /> : null}
              Reconnect / Switch Rabby Account
            </button>
          </div>
        </div>
      )}

      {/* Manual switch required state */}
      {walletStatus === 'manual_switch_required' && (
        <div className="mt-4 p-4 bg-amber-50 rounded-2xl border border-amber-100 animate-in fade-in">
          <div className="flex items-start gap-2">
            <AlertCircle size={14} className="text-amber-600 mt-0.5 shrink-0" />
            <p className="text-[11px] text-amber-800 leading-relaxed font-medium">
              Rabby may not show the account picker because this site is already trusted. Please open the Rabby extension manually, switch to the correct wallet, then click Reconnect.
            </p>
          </div>
        </div>
      )}

      {!isFullyLinked && !isNDIReady && (
        <div className="mt-4 flex items-start gap-2 p-3 bg-amber-50/50 rounded-2xl border border-amber-100/50">
          <AlertCircle size={14} className="text-amber-600 mt-0.5 shrink-0" />
          <p className="text-[10px] text-amber-700 leading-relaxed font-bold uppercase tracking-tight">
            Verify NDI identity to begin.
          </p>
        </div>
      )}
    </div>
  );
}
