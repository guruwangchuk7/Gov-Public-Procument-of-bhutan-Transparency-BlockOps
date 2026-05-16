'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Building2 } from 'lucide-react';
import IdentityWalletVerifier from '@/components/auth/IdentityWalletVerifier';
import { useRoleSession } from '@/hooks/useRoleSession';

// Mock records for approved/pending agencies
const MOCK_AGENCIES = [
  {
    id: 'agency-001',
    agency_name: 'Ministry of Infrastructure',
    ndi_identifier: 'MOCK_NDI_ID', // Matches demo scan
    wallet_address: '0xMockWalletAddress',
    status: 'approved',
    blockchain_authorized: true
  },
  {
    id: 'agency-002',
    agency_name: 'Department of IT',
    ndi_identifier: 'NDI-AGENCY-002',
    wallet_address: '0x669877b026639906646199623838383838383838',
    status: 'pending',
    blockchain_authorized: false
  }
];

export default function AgencyLoginPage() {
  const { selectRole } = useRoleSession();

  useEffect(() => {
    selectRole('Procuring_Agency');
  }, [selectRole]);

  return (
    <main className="min-h-screen bg-gray-50 py-20 px-4">
      <div className="max-w-md mx-auto">
        <div className="flex items-center justify-between mb-12">
          <Link href="/select-role" className="flex items-center gap-2 text-gray-500 hover:text-primary transition-colors font-medium">
            <ArrowLeft size={18} /> Back
          </Link>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded flex items-center justify-center text-white font-bold text-xs">B</div>
            <span className="font-bold text-gray-900 uppercase tracking-tighter">Agency Portal</span>
          </div>
        </div>

        <div className="card shadow-2xl border-white p-8">
          <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mx-auto mb-6">
            <Building2 size={32} />
          </div>
          
          <div className="text-center mb-8">
            <h1 className="text-2xl font-black text-gray-900 mb-2">Agency Workspace</h1>
            <p className="text-gray-500 text-sm">Secure identity-gated access for government officers.</p>
          </div>

          <IdentityWalletVerifier 
            role="Procuring_Agency" 
            mockRecords={MOCK_AGENCIES}
          />

          <p className="mt-8 text-center text-xs text-gray-400">
            Unauthorized access to government systems is strictly prohibited. <br />
            New agency? <Link href="/agency/register" className="text-primary font-bold hover:underline">Register your office</Link>
          </p>
        </div>
      </div>
    </main>
  );
}
