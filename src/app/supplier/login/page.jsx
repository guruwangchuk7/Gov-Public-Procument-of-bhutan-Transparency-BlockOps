'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, User } from 'lucide-react';
import IdentityWalletVerifier from '@/components/auth/IdentityWalletVerifier';
import { useRoleSession } from '@/hooks/useRoleSession';
import { motion } from 'framer-motion';

const MOCK_SUPPLIERS = [
  {
    id: 'supplier-001',
    company_name: 'Druk Infrastructure Pvt Ltd',
    ndi_identifier: 'MOCK_NDI_ID', 
    wallet_address: '0xMockWalletAddress',
    status: 'approved',
    blockchain_authorized: true
  }
];

export default function SupplierLoginPage() {
  const { selectRole } = useRoleSession();

  useEffect(() => {
    selectRole('Supplier_Bidder');
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
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/5 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="relative z-10 w-full max-w-[440px]">
        {/* Focused Security Square */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="bg-white border border-zinc-200 rounded-[32px] p-10 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08)] flex flex-col items-center"
        >
          <div className="w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center text-white mb-8 shadow-xl shadow-blue-100">
            <User size={28} />
          </div>

          <div className="text-center mb-10">
            <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">Supplier Network</h1>
          </div>

          <div className="w-full">
            <IdentityWalletVerifier 
              role="Supplier_Bidder" 
              mockRecords={MOCK_SUPPLIERS}
            />
          </div>

          {/* Minimal Footer */}
          <div className="mt-10 pt-8 border-t border-zinc-100 w-full flex flex-col gap-4">
            <p className="text-[10px] text-zinc-400 text-center font-medium">
              New business? <Link href="/supplier/register" className="text-zinc-900 font-bold hover:underline">Apply for registration</Link>
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
