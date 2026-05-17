'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, ShieldCheck } from 'lucide-react';
import IdentityWalletVerifier from '@/components/auth/IdentityWalletVerifier';
import { useRoleSession } from '@/hooks/useRoleSession';
import { motion } from 'framer-motion';

const MOCK_AUDITORS = [
  {
    id: 'auditor-001',
    full_name: 'Druk Audit Commission',
    ndi_identifier: 'MOCK_NDI_ID',
    wallet_address: '0xMockWalletAddress',
    is_active: true
  }
];

export default function AuditorLoginPage() {
  const { selectRole } = useRoleSession();

  useEffect(() => {
    selectRole('Auditor');
  }, [selectRole]);

  return (
    <main className="h-screen w-screen bg-zinc-50 flex items-center justify-center p-6 overflow-hidden selection:bg-zinc-900 selection:text-white font-sans relative">
      {/* Absolute Navigation */}
      <Link
        href="/select-role"
        className="absolute top-10 left-10 text-zinc-400 hover:text-zinc-900 transition-colors flex items-center gap-2 text-[10px] font-medium z-50"
      >
        <ArrowLeft size={12} /> Back to Selection
      </Link>

      {/* Subtle Ambient Background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="relative z-10 w-full max-w-[440px]">
        {/* Focused Security Square */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="bg-white border border-zinc-200 rounded-[32px] p-10 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08)] flex flex-col items-center"
        >
          <div className="w-14 h-14 rounded-2xl bg-indigo-600 flex items-center justify-center text-white mb-8 shadow-xl shadow-indigo-100">
            <ShieldCheck size={28} />
          </div>

          <div className="text-center mb-10">
            <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">System Auditor</h1>
          </div>

          <div className="w-full">
            <IdentityWalletVerifier
              role="Auditor"
              mockRecords={MOCK_AUDITORS}
            />
          </div>

          {/* Minimal Footer */}
          <div className="mt-10 pt-8 border-t border-zinc-100 w-full flex flex-col gap-4">
            <p className="text-[10px] text-zinc-400 text-center font-medium">
              Received an invitation? <Link href="/auditor/invitation/valid-token" className="text-zinc-900 font-bold hover:underline">Activate account</Link>
            </p>
            <div className="flex items-center justify-between text-[10px] font-bold text-zinc-300 uppercase tracking-widest">
              <span>Secured by NDI</span>
              <span>v2.4.1</span>
            </div>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
