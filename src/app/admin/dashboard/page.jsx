'use client';
import { motion } from 'framer-motion';
import { ShieldCheck, Database, Activity, LayoutGrid, ListFilter } from 'lucide-react';
import PendingAgencyTable from '@/components/admin/PendingAgencyTable';
import PendingSupplierTable from '@/components/admin/PendingSupplierTable';
import AdminDashboardSummary from '@/components/admin/AdminDashboardSummary';
import BlockchainVerificationQueue from '@/components/admin/BlockchainVerificationQueue';
import AddAuditorForm from '@/components/admin/AddAuditorForm';

export default function AdminDashboard() {
  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 bg-zinc-100 rounded-full mb-3">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
            <span className="text-[10px] font-semibold text-zinc-500 uppercase tracking-widest">Admin Control Center</span>
          </div>
          <h1 className="text-4xl font-semibold text-zinc-900 tracking-tightest">System Oversight</h1>
          <p className="text-zinc-500 mt-2">Manage agency verifications, supplier approvals, and system compliance.</p>
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
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        <div className="xl:col-span-8 space-y-8">
          <BlockchainVerificationQueue />
          <PendingAgencyTable />
          <PendingSupplierTable />
        </div>
        
        <div className="xl:col-span-4 space-y-8">
          <AddAuditorForm />
          
          <div className="card border-zinc-200 shadow-none bg-zinc-900 text-white">
            <div className="p-6 space-y-6">
              <div className="flex items-center justify-between">
                <h4 className="text-[11px] font-semibold text-zinc-400 uppercase tracking-widest">Supabase Health</h4>
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                  <span className="text-[10px] text-emerald-400 font-semibold uppercase tracking-widest">Online</span>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 text-sm">
                    <Database size={16} className="text-zinc-400" />
                    <span className="font-medium">PostgreSQL Database</span>
                  </div>
                  <span className="text-xs font-mono text-zinc-500">v15.1</span>
                </div>
                <div className="h-1 w-full bg-zinc-800 rounded-full overflow-hidden">
                  <div className="h-full w-full bg-white opacity-90" />
                </div>
              </div>
              
              <p className="text-[11px] text-zinc-500 leading-relaxed italic">
                Service Role Key active for administrative operations. Real-time synchronization enabled.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
