'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Search } from 'lucide-react';
import IdentityWalletVerifier from '@/components/auth/IdentityWalletVerifier';
import { useRoleSession } from '@/hooks/useRoleSession';

// Mock records for active auditors
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
    <main className="min-h-screen bg-indigo-50/30 py-20 px-4">
      <div className="max-w-md mx-auto">
        <div className="flex items-center justify-between mb-12">
          <Link href="/select-role" className="flex items-center gap-2 text-indigo-400 hover:text-indigo-900 transition-colors font-medium">
            <ArrowLeft size={18} /> Back
          </Link>
          <div className="flex items-center gap-2 text-indigo-900">
            <Search size={20} />
            <span className="font-bold uppercase tracking-tighter">Auditor Access</span>
          </div>
        </div>

        <div className="card shadow-2xl border-indigo-100 p-8">
          <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 mx-auto mb-6">
            <Search size={32} />
          </div>
          
          <div className="text-center mb-8">
            <h1 className="text-2xl font-black text-gray-900 mb-2">Audit Portal</h1>
            <p className="text-gray-500 text-sm">Independent verification of on-chain procurement logs.</p>
          </div>

          <IdentityWalletVerifier 
            role="Auditor" 
            mockRecords={MOCK_AUDITORS}
          />

          <p className="mt-8 text-center text-xs text-gray-400">
            Received an invitation? <Link href="/auditor/invitation/valid-token" className="text-indigo-600 font-bold hover:underline">Activate your account</Link>
          </p>
        </div>
      </div>
    </main>
  );
}
