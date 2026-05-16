'use client';
import { motion } from 'framer-motion';
import { ShieldCheck, Landmark, Users, Search, Activity, Mail, Database } from 'lucide-react';
import PendingAgencyTable from '@/components/admin/PendingAgencyTable';
import PendingSupplierTable from '@/components/admin/PendingSupplierTable';
import AdminDashboardSummary from '@/components/admin/AdminDashboardSummary';
import BlockchainVerificationQueue from '@/components/admin/BlockchainVerificationQueue';
import AddAuditorForm from '@/components/admin/AddAuditorForm';

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-6 py-12 space-y-12">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_#34d399]" />
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Admin Control Center</span>
            </div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">System Oversight</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-bold text-slate-900">Admin User</p>
              <p className="text-[10px] text-emerald-500 font-black uppercase tracking-widest">Super Administrator</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-slate-900 flex items-center justify-center text-white">
              <ShieldCheck size={24} />
            </div>
          </div>
        </div>

        {/* Stats Summary */}
        <AdminDashboardSummary />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          <div className="xl:col-span-2 space-y-8">
            <BlockchainVerificationQueue />
            <PendingAgencyTable />
            <PendingSupplierTable />
          </div>
          
          <div className="space-y-8">
            <AddAuditorForm />
            
            <div className="card bg-slate-900 text-white space-y-4">
              <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Supabase Health</h4>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold">
                  <Database size={14} className="text-primary" />
                  <span>PostgreSQL Database</span>
                </div>
                <span className="text-[10px] text-emerald-400 font-black uppercase tracking-widest">Connected</span>
              </div>
              <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full w-full bg-primary" />
              </div>
              <p className="text-[9px] text-slate-500 font-medium italic">Service Role Key active for administrative operations.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
