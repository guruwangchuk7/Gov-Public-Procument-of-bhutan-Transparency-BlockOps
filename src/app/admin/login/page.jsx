'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, ShieldCheck } from 'lucide-react';
import IdentityWalletVerifier from '@/components/auth/IdentityWalletVerifier';
import { useRoleSession } from '@/hooks/useRoleSession';

const MOCK_ADMINS = [
  {
    id: 'admin-001',
    full_name: 'BGPS System Administrator',
    ndi_identifier: 'NDI-ADMIN-777',
    wallet_address: '0xa537bdbfa4ca9c82e9218e3a8a8f44b038fc63df8100e258d5ba90ee34ce8f66',
    is_active: true
  },
  {
    // Fallback for demo scan
    id: 'admin-demo',
    full_name: 'Bhutanese Citizen (Mock)',
    ndi_identifier: 'MOCK_NDI_ID', 
    wallet_address: '0xMockWalletAddress',
    is_active: true
  }
];

export default function AdminLoginPage() {
  const { selectRole } = useRoleSession();

  useEffect(() => {
    selectRole('Admin');
  }, [selectRole]);

  return (
    <main className="min-h-screen bg-slate-900 py-20 px-4 text-white">
      <div className="max-w-md mx-auto">
        <div className="flex items-center justify-between mb-12">
          <Link href="/select-role" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors font-medium">
            <ArrowLeft size={18} /> Back
          </Link>
          <div className="flex items-center gap-2">
            <ShieldCheck className="text-primary" size={20} />
            <span className="font-bold uppercase tracking-tighter">BGPS Admin Portal</span>
          </div>
        </div>

        <div className="bg-slate-800/50 p-8 rounded-3xl border border-slate-700/50 backdrop-blur-xl">
          <div className="text-slate-900">
            <IdentityWalletVerifier 
              role="Admin" 
              mockRecords={MOCK_ADMINS}
            />
          </div>

          <div className="mt-8 p-4 bg-slate-900/50 rounded-2xl border border-slate-700/30">
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest text-center leading-relaxed">
              Administrative access requires dual biometric and cryptographic proof. <br />
              Mode: {process.env.NEXT_PUBLIC_AUTH_MODE?.toUpperCase() || 'STAGING'}
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
