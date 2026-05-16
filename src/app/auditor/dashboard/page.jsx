'use client';
import { motion } from 'framer-motion';
import { 
  Search, 
  ShieldCheck, 
  Database, 
  Cpu, 
  Activity, 
  History, 
  CheckCircle2, 
  AlertTriangle,
  ExternalLink,
  Eye,
  Filter
} from 'lucide-react';
import BlockchainVerificationQueue from '@/components/admin/BlockchainVerificationQueue';

const MOCK_AUDIT_STATS = [
  { label: 'Total Verified TX', value: '1,248', icon: ShieldCheck, color: 'emerald' },
  { label: 'Pending Audits', value: '14', icon: Activity, color: 'amber' },
  { label: 'Blockchain Height', value: '8,492,012', icon: Cpu, color: 'indigo' },
  { label: 'System Health', value: '99.9%', icon: Database, color: 'primary' }
];

export default function AuditorDashboard() {
  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex items-end justify-between">
        <div className="space-y-2">
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Auditor Oversight</h1>
          <p className="text-sm font-medium text-slate-500 italic">Independent blockchain verification & system integrity monitoring</p>
        </div>
        <div className="flex gap-3">
          <button className="btn btn-outline h-12 px-6">
            <History size={16} /> Audit History
          </button>
          <button className="btn bg-indigo-600 text-white h-12 px-6 shadow-lg shadow-indigo-200">
            <ShieldCheck size={16} /> Start New Verification
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {MOCK_AUDIT_STATS.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="card group hover:border-indigo-500 transition-all cursor-default"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white bg-${stat.color === 'primary' ? 'primary' : stat.color + '-500'} shadow-lg`}>
                <stat.icon size={22} />
              </div>
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Live Feed</div>
            </div>
            <div className="space-y-1">
              <h3 className="text-2xl font-black text-slate-900">{stat.value}</h3>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-tight">{stat.label}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Feed */}
        <div className="lg:col-span-2 space-y-8">
          <div className="card space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center">
                  <Activity size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900">System Activity Log</h3>
                  <p className="text-xs text-slate-500 font-medium">Real-time procurement events detected on-chain</p>
                </div>
              </div>
              <button className="text-indigo-600 font-black text-[10px] uppercase tracking-widest flex items-center gap-2 hover:underline">
                <Filter size={14} /> Filter Events
              </button>
            </div>

            <div className="space-y-4">
              {[1, 2, 3].map((_, i) => (
                <div key={i} className="p-4 rounded-2xl border border-slate-50 bg-slate-50/30 flex items-center justify-between group hover:bg-white hover:border-slate-200 transition-all">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-white border border-slate-100 flex items-center justify-center text-indigo-500 shadow-sm">
                      <Cpu size={18} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black text-slate-900">TenderCreated</span>
                        <span className="text-[10px] px-2 py-0.5 bg-emerald-50 text-emerald-600 rounded-full font-black uppercase">Verified</span>
                      </div>
                      <p className="text-[10px] font-medium text-slate-400 font-mono mt-0.5">0x72a...d8c9 • Block #8492012</p>
                    </div>
                  </div>
                  <button className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-300 hover:text-indigo-600 hover:bg-indigo-50 transition-all">
                    <ExternalLink size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          <div className="card bg-slate-900 text-white space-y-6">
            <div className="flex items-center gap-3">
              <ShieldCheck className="text-indigo-400" size={24} />
              <h3 className="text-lg font-black uppercase tracking-tight">Audit Alert</h3>
            </div>
            <p className="text-sm text-slate-400 font-medium leading-relaxed">
              Discrepancy detected in <span className="text-white font-bold underline decoration-indigo-500">Tender #AQ-2024</span> between database state and blockchain hash.
            </p>
            <button className="btn bg-indigo-600 text-white w-full border-none hover:bg-indigo-700">
              Investigate Issue <Eye size={16} />
            </button>
          </div>

          <div className="card space-y-4">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Compliance Check</h4>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-600">NDI Identity Sync</span>
                <CheckCircle2 size={14} className="text-emerald-500" />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-600">Wallet Authorization</span>
                <CheckCircle2 size={14} className="text-emerald-500" />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-600">Audit Log Immuntability</span>
                <AlertTriangle size={14} className="text-amber-500" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
