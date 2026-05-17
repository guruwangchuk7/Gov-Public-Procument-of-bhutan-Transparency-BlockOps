'use client';
import { motion } from 'framer-motion';
import { ShieldCheck, Database, Activity, LayoutGrid, ListFilter } from 'lucide-react';
import PendingAgencyTable from '@/components/admin/PendingAgencyTable';
import PendingSupplierTable from '@/components/admin/PendingSupplierTable';
import AdminDashboardSummary from '@/components/admin/AdminDashboardSummary';
import BlockchainVerificationQueue from '@/components/admin/BlockchainVerificationQueue';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminDashboard() {
  const router = useRouter();
  const [session, setSession] = useState(null);
  const [wallet, setWallet] = useState(null);

  useEffect(() => {
    const savedSession = localStorage.getItem('bgps_ndi_session');
    const savedWallet = localStorage.getItem('bgps_wallet_address');
    
    if (!savedSession || !savedWallet) {
      router.push('/select-role');
      return;
    }
    
    setSession(JSON.parse(savedSession));
    setWallet(savedWallet);
  }, [router]);

  if (!session) return null;

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 bg-zinc-100 rounded-full mb-3">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
            <span className="text-[10px] font-semibold text-zinc-500 uppercase tracking-widest">Verified Admin</span>
          </div>
          <h1 className="text-4xl font-semibold text-zinc-900 tracking-tightest">
            Hello, {session.fullName || session.full_name?.split(' ')[0] || 'Admin'}
          </h1>
          <div className="flex flex-wrap items-center gap-3 mt-3">
            <code className="text-xs text-indigo-700 font-mono bg-indigo-50 px-2 py-1 rounded border border-indigo-100 flex items-center gap-2 shadow-sm">
               <ShieldCheck size={14} className="text-indigo-500" />
              {wallet?.slice(0, 6)}...{wallet?.slice(-4)}
            </code>
            <div className="flex gap-2">
               {session.idNumber && <span className="text-[10px] font-bold text-zinc-500 bg-zinc-100 px-2 py-1 rounded uppercase">{session.idType || 'ID'}: {session.idNumber}</span>}
               {session.dzongkhag && <span className="text-[10px] font-bold text-zinc-500 bg-zinc-100 px-2 py-1 rounded uppercase">{session.dzongkhag}, {session.gewog}</span>}
               {session.dateOfBirth && <span className="text-[10px] font-bold text-zinc-500 bg-zinc-100 px-2 py-1 rounded uppercase">DOB: {session.dateOfBirth}</span>}
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="btn btn-outline gap-2 px-4">
            <ListFilter size={16} />
            Filter
          </button>
          <button className="btn btn-primary gap-2 px-4">
            <Activity size={16} />
            System Logs
          </button>
        </div>
      </div>

      {/* Stats Summary */}
      <AdminDashboardSummary />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 gap-8">
        <div className="space-y-8">
          <BlockchainVerificationQueue />
          <PendingAgencyTable />
          <PendingSupplierTable />
        </div>
      </div>
    </div>
  );
}
