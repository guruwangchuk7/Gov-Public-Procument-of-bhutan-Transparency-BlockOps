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
  proofRequest
}) {
  const isNDIReady = !!ndiProfile;
  const isWalletReady = !!walletAddress;
  const isFullyLinked = isNDIReady && isWalletReady;
  const ndiIdentifier = NDIVerifier.extractNDIIdentifierFromProof(ndiProfile);

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-gray-900">Identity Verification</h3>
          <p className="text-xs text-gray-500">Link your Bhutan NDI and Blockchain Wallet to proceed.</p>
        </div>
        <div className={`p-2 rounded-lg ${isFullyLinked ? 'bg-green-50 text-green-600' : 'bg-gray-50 text-gray-400'}`}>
          <ShieldCheck size={20} />
        </div>
      </div>

      <div className="space-y-4">
        {/* Step 1: Bhutan NDI */}
        <div className={`p-4 rounded-xl border transition-all ${
          isNDIReady ? 'border-green-200 bg-green-50/30' : 'border-gray-100 bg-gray-50/50'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`p-1 rounded-lg ${isNDIReady ? 'bg-green-100' : 'bg-white shadow-sm'}`}>
                <img src="/assets/NDI_logo.png" alt="NDI Logo" className="w-8 h-8 object-contain" />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Step 1: Digital ID</p>
                <h4 className="text-sm font-bold text-gray-900">Bhutan NDI Verification</h4>
              </div>
            </div>
            {isNDIReady ? (
              <CheckCircle2 size={20} className="text-green-500" />
            ) : (
              <button
                onClick={onVerifyNDI}
                disabled={isVerifyingNDI || ndiStatus === 'requested'}
                className="px-4 py-2 bg-black text-white text-xs font-bold rounded-lg hover:bg-gray-800 disabled:opacity-50 transition-all flex items-center gap-2"
              >
                {isVerifyingNDI && ndiStatus !== 'requested' ? <Loader2 size={14} className="animate-spin" /> : 'Verify NDI'}
              </button>
            )}
          </div>
          
          {/* NDI QR Code Display */}
          {ndiStatus === 'requested' && proofRequest?.proofRequestURL && !isNDIReady && (
            <div className="mt-4 p-4 bg-white rounded-xl border border-gray-100 flex flex-col items-center gap-3 animate-in fade-in slide-in-from-top-2">
              <div className="p-2 bg-white rounded-lg shadow-sm border border-gray-50">
                <QRCode value={proofRequest.proofRequestURL} size={150} />
              </div>
              <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase">
                <Loader2 size={12} className="animate-spin" />
                Waiting for scan...
              </div>
              
              {proofRequest.deepLinkURL && (
                <a 
                  href={proofRequest.deepLinkURL}
                  className="btn btn-outline btn-sm w-full text-[10px] uppercase tracking-tighter"
                >
                  Open in NDI App <QrCode size={12} />
                </a>
              )}
            </div>
          )}

          {isNDIReady && (
            <div className="mt-3 pt-3 border-t border-green-100/50 flex flex-col gap-1">
              <span className="text-[10px] text-green-600 font-bold uppercase">Linked Identifier</span>
              <code className="text-xs text-green-700 font-mono">{ndiIdentifier}</code>
            </div>
          )}
        </div>


        <div className="flex justify-center -my-2 relative z-10">
          <div className={`p-1.5 rounded-full border bg-white ${isFullyLinked ? 'text-green-500 border-green-200' : 'text-gray-300 border-gray-100'}`}>
            <Link size={14} />
          </div>
        </div>

        {/* Step 2: Rabby Wallet */}
        <div className={`p-4 rounded-xl border transition-all ${
          isWalletReady ? 'border-blue-200 bg-blue-50/30' : 'border-gray-100 bg-gray-50/50'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${isWalletReady ? 'bg-blue-100 text-blue-600' : 'bg-white text-gray-400 shadow-sm'}`}>
                <Wallet size={18} />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Step 2: On-Chain ID</p>
                <h4 className="text-sm font-bold text-gray-900">Rabby Wallet Address</h4>
              </div>
            </div>
            {isWalletReady ? (
              <CheckCircle2 size={20} className="text-blue-500" />
            ) : !window.ethereum && !window.rabby ? (
              <a
                href="https://rabby.io/"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-orange-600 text-white text-[10px] font-black rounded-lg hover:bg-orange-700 transition-all flex items-center gap-2"
              >
                Install Rabby
              </a>
            ) : (
              <button
                onClick={onConnectWallet}
                disabled={isConnectingWallet}
                className="px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-all flex items-center gap-2"
              >
                {isConnectingWallet ? <Loader2 size={14} className="animate-spin" /> : 'Link Wallet'}
              </button>
            )}
          </div>
          {isWalletReady && (
            <div className="mt-3 pt-3 border-t border-blue-100/50 flex flex-col gap-1">
              <span className="text-[10px] text-blue-600 font-bold uppercase">Linked Address</span>
              <code className="text-xs text-blue-700 font-mono truncate">{walletAddress}</code>
            </div>
          )}
        </div>
      </div>

      {!isFullyLinked && (
        <div className="mt-6 flex items-start gap-2 p-3 bg-amber-50 rounded-lg border border-amber-100">
          <AlertCircle size={14} className="text-amber-600 mt-0.5" />
          <p className="text-[11px] text-amber-700 leading-relaxed font-medium">
            Both identities must be linked to create an immutable cryptographic proof of your registration.
          </p>
        </div>
      )}
    </div>
  );
}
