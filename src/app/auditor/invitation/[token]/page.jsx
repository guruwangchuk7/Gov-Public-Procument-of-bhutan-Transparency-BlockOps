'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ShieldCheck, Loader2, ArrowLeft, Key, Mail, Fingerprint, Wallet } from 'lucide-react';
import { useNDI } from '@/hooks/useNDI';
import { useRabbyWallet } from '@/hooks/useRabbyWallet';
import { toast } from 'sonner';
import IdentityLinkingCard from '@/components/auth/IdentityLinkingCard';

export default function AuditorInvitationPage() {
  const params = useParams();
  const router = useRouter();
  const { token } = params;
  
  const [step, setStep] = useState(1); // 1: Credentials, 2: Identity Link
  const [loading, setLoading] = useState(false);
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  
  const { ndiProfile, verifyIdentity, isVerifying: isVerifyingNDI, status: ndiStatus, proofRequest } = useNDI();
  const { address: walletAddress, connect: connectWallet, isConnecting: isConnectingWallet } = useRabbyWallet();

  const handleCredentialSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call to verify token and credentials
    setTimeout(() => {
      if (token === 'valid-token' || process.env.NEXT_PUBLIC_AUTH_MODE === 'mock') {
        toast.success('Credentials Validated');
        setStep(2);
      } else {
        toast.error('Invalid or Expired Invitation Token');
      }
      setLoading(false);
    }, 1500);
  };

  const handleActivate = async () => {
    if (!ndiProfile || !walletAddress) {
      toast.error('Please link both NDI and Wallet');
      return;
    }
    setLoading(true);
    
    // Simulate account activation
    setTimeout(() => {
      toast.success('Auditor Account Activated Successfully');
      localStorage.setItem('bgps_ndi_session', JSON.stringify(ndiProfile));
      localStorage.setItem('bgps_wallet_address', walletAddress);
      router.push('/auditor/dashboard');
    }, 2000);
  };

  return (
    <main className="min-h-screen bg-slate-50 py-20 px-4">
      <div className="max-w-md mx-auto">
        <div className="flex items-center justify-between mb-12">
          <Link href="/select-role" className="flex items-center gap-2 text-slate-400 hover:text-indigo-600 transition-colors font-medium">
            <ArrowLeft size={18} /> Exit
          </Link>
          <div className="flex items-center gap-2">
            <ShieldCheck className="text-indigo-600" size={20} />
            <span className="font-bold uppercase tracking-tighter text-indigo-900">Auditor Onboarding</span>
          </div>
        </div>

        <div className="card p-8 shadow-2xl border-white">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-black text-gray-900 mb-2">Activate Account</h1>
            <p className="text-gray-500 text-sm italic">Securely onboard to the BGPS Transparency Network.</p>
          </div>

          {step === 1 ? (
            <form onSubmit={handleCredentialSubmit} className="space-y-6 animate-in slide-in-from-right-4 duration-300">
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Temporary Username</label>
                  <div className="relative">
                    <input 
                      type="text"
                      required
                      placeholder="Enter from invitation email"
                      className="w-full h-14 bg-gray-50 border border-gray-100 rounded-2xl px-12 text-sm font-medium focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
                      value={credentials.username}
                      onChange={(e) => setCredentials(prev => ({ ...prev, username: e.target.value }))}
                    />
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Temporary Password</label>
                  <div className="relative">
                    <input 
                      type="password"
                      required
                      placeholder="••••••••"
                      className="w-full h-14 bg-gray-50 border border-gray-100 rounded-2xl px-12 text-sm font-medium focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
                      value={credentials.password}
                      onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
                    />
                    <Key className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full h-14 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl flex items-center justify-center gap-2 transition-all disabled:opacity-50"
              >
                {loading ? <Loader2 className="animate-spin" /> : 'Validate Invitation'}
              </button>
            </form>
          ) : (
            <div className="space-y-8 animate-in slide-in-from-right-4 duration-300">
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

              <button
                onClick={handleActivate}
                disabled={!ndiProfile || !walletAddress || loading}
                className="w-full h-16 bg-slate-900 hover:bg-black text-white rounded-2xl font-black flex items-center justify-center gap-3 transition-all disabled:opacity-30 shadow-xl shadow-slate-200"
              >
                {loading ? <Loader2 className="animate-spin" /> : 'Complete Activation'}
              </button>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
