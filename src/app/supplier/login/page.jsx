'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, User } from 'lucide-react';
import IdentityWalletVerifier from '@/components/auth/IdentityWalletVerifier';
import { useRoleSession } from '@/hooks/useRoleSession';

// Mock records for approved/pending suppliers
const MOCK_SUPPLIERS = [
  {
    id: 'supplier-001',
    company_name: 'Druk Infrastructure Pvt Ltd',
    ndi_identifier: 'MOCK_NDI_ID', // Matches demo scan
    wallet_address: '0xMockWalletAddress',
    status: 'approved',
    blockchain_authorized: true
  },
  {
    id: 'supplier-002',
    company_name: 'Bhutan Tech Solutions',
    ndi_identifier: 'NDI-SUPPLIER-002',
    wallet_address: '0x1234567890abcdef1234567890abcdef12345678',
    status: 'pending',
    blockchain_authorized: false
  }
];

export default function SupplierLoginPage() {
  const { selectRole } = useRoleSession();

  useEffect(() => {
    selectRole('Supplier_Bidder');
  }, [selectRole]);

  return (
    <main className="min-h-screen bg-gray-50 py-20 px-4">
      <div className="max-w-md mx-auto">
        <div className="flex items-center justify-between mb-12">
          <Link href="/select-role" className="flex items-center gap-2 text-gray-500 hover:text-emerald-500 transition-colors font-medium">
            <ArrowLeft size={18} /> Back
          </Link>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-emerald-500 rounded flex items-center justify-center text-white font-bold text-xs">B</div>
            <span className="font-bold text-gray-900 uppercase tracking-tighter">Supplier Portal</span>
          </div>
        </div>

        <div className="card shadow-2xl border-white p-8">
          <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-500 mx-auto mb-6">
            <User size={32} />
          </div>
          
          <div className="text-center mb-8">
            <h1 className="text-2xl font-black text-gray-900 mb-2">Supplier Login</h1>
            <p className="text-gray-500 text-sm">Secure access to government procurement opportunities.</p>
          </div>

          <IdentityWalletVerifier 
            role="Supplier_Bidder" 
            mockRecords={MOCK_SUPPLIERS}
          />

          <p className="mt-8 text-center text-xs text-gray-400">
            Bid securely with blockchain-backed integrity. <br />
            New business? <Link href="/supplier/register" className="text-emerald-600 font-bold hover:underline">Apply for registration</Link>
          </p>
        </div>
      </div>
    </main>
  );
}
