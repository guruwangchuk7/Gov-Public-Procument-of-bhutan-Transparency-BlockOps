'use client';
import { useState, useEffect } from 'react';
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
  Filter,
  ChevronRight,
  Shield
} from 'lucide-react';

export default function AuditorDashboard() {
  const [data, setData] = useState({ stats: {}, events: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/auditor/dashboard');
        const json = await res.json();
        setData(json);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const stats = [
    { label: 'Total Verified TX', value: data.stats.verifiedTx || '0', icon: ShieldCheck },
    { label: 'Pending Audits', value: data.stats.pendingAudits || '0', icon: Activity, highlight: true },
    { label: 'Network', value: 'Sepolia', icon: Cpu },
    { label: 'System Health', value: '99.9%', icon: Database }
  ];

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 bg-zinc-100 rounded-full mb-3">
            <span className="w-1.5 h-1.5 bg-zinc-900 rounded-full" />
            <span className="text-[10px] font-semibold text-zinc-500 uppercase tracking-widest">Compliance Review</span>
          </div>
          <h1 className="text-4xl font-semibold text-zinc-900 tracking-tightest">Auditor Oversight</h1>
          <p className="text-zinc-500 mt-2">Independent blockchain verification & system integrity monitoring.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="btn btn-outline gap-2 px-4 h-11">
            <Filter size={16} />
            Filter View
          </button>
          <button className="btn btn-primary gap-2 px-4 h-11">
            <Shield size={16} />
            Run Validation
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={stat.label} className="card p-6 border-zinc-200 shadow-sm flex flex-col justify-between h-32 hover:border-zinc-300 transition-all group">
            <div className="flex justify-between items-start">
              <p className="text-[11px] font-semibold text-zinc-400 uppercase tracking-widest">{stat.label}</p>
              <div className="w-8 h-8 rounded-lg bg-zinc-50 border border-zinc-100 flex items-center justify-center text-zinc-400 group-hover:text-zinc-900 transition-colors">
                <stat.icon size={16} />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <p className="text-3xl font-semibold text-zinc-900 tracking-tightest">{stat.value}</p>
              {stat.highlight && parseInt(stat.value) > 0 && (
                <span className="text-[10px] font-bold text-amber-500 uppercase tracking-widest">Review Needed</span>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Feed */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-zinc-900 tracking-tight flex items-center gap-2">
              <Activity size={16} className="text-zinc-400" />
              System Activity Log
            </h3>
            <span className="text-xs text-zinc-400 font-medium">Real-time blockchain feed</span>
          </div>
          
          <div className="table-container shadow-none border-zinc-200">
            <div className="divide-y divide-zinc-100">
              {data.events.length > 0 ? data.events.map((event, i) => (
                <div key={i} className="flex items-center justify-between p-4 hover:bg-zinc-50 transition-colors group">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-zinc-50 border border-zinc-100 flex items-center justify-center text-zinc-400 group-hover:text-zinc-900 transition-colors">
                      <Cpu size={18} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-zinc-900">{event.event_name}</span>
                        <span className={`badge ${event.tx_status === 'confirmed' ? 'bg-sky-50 text-sky-600 border border-sky-100' : 'bg-amber-50 text-amber-600 border border-amber-100'}`}>
                          {event.tx_status}
                        </span>
                      </div>
                      <code className="text-[10px] text-zinc-400 font-mono mt-0.5">{event.tx_hash?.slice(0, 24)}...</code>
                    </div>
                  </div>
                  <a 
                    href={`https://sepolia.etherscan.io/tx/${event.tx_hash}`}
                    target="_blank"
                    className="w-9 h-9 rounded-lg border border-zinc-200 flex items-center justify-center text-zinc-400 hover:text-zinc-900 hover:border-zinc-300 hover:bg-white transition-all"
                  >
                    <ExternalLink size={14} />
                  </a>
                </div>
              )) : (
                <div className="p-12 text-center text-zinc-400 text-xs font-semibold uppercase tracking-widest">No recent events detected</div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-4 space-y-8">
          <div className="card bg-zinc-900 border-zinc-800 p-6 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center text-zinc-400">
                <ShieldCheck size={18} />
              </div>
              <h3 className="text-sm font-semibold text-white tracking-tight">Audit Insight</h3>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Discrepancy detection engine is currently scanning the Ethereum Sepolia network for hash mismatches. No critical anomalies found.
            </p>
            <div className="pt-4 border-t border-zinc-800 flex items-center justify-between">
              <span className="text-[10px] font-semibold text-zinc-500 uppercase tracking-widest">Engine Status</span>
              <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest flex items-center gap-1.5">
                <div className="w-1 h-1 bg-emerald-400 rounded-full animate-pulse" />
                Active
              </span>
            </div>
          </div>

          <div className="card border-zinc-200 p-6 space-y-6 shadow-none">
            <h4 className="text-[11px] font-semibold text-zinc-400 uppercase tracking-widest">Compliance Matrix</h4>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-zinc-600">NDI Identity Sync</span>
                <CheckCircle2 size={16} className="text-emerald-500" />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-zinc-600">Wallet Authorization</span>
                <CheckCircle2 size={16} className="text-emerald-500" />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-zinc-600">Smart Contract Hash</span>
                <CheckCircle2 size={16} className="text-emerald-500" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
