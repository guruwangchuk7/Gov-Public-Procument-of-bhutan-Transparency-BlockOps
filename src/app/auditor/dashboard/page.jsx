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
    { label: 'Total Verified TX', value: data.stats.verifiedTx || '0', icon: ShieldCheck, color: 'emerald' },
    { label: 'Pending Audits', value: data.stats.pendingAudits || '0', icon: Activity, color: 'amber' },
    { label: 'Network', value: 'Sepolia', icon: Cpu, color: 'indigo' },
    { label: 'System Health', value: data.stats.systemHealth || '...', icon: Database, color: 'primary' }
  ];

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex items-end justify-between">
        <div className="space-y-2">
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Auditor Oversight</h1>
          <p className="text-sm font-medium text-slate-500 italic">Independent blockchain verification & system integrity monitoring</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="card group hover:border-indigo-500 transition-all cursor-default"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white bg-${stat.color === 'primary' ? 'primary' : (stat.color === 'emerald' ? 'emerald-500' : (stat.color === 'amber' ? 'amber-500' : 'indigo-600'))} shadow-lg`}>
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
            </div>

            <div className="space-y-4">
              {data.events.length > 0 ? data.events.map((event, i) => (
                <div key={i} className="p-4 rounded-2xl border border-slate-50 bg-slate-50/30 flex items-center justify-between group hover:bg-white hover:border-slate-200 transition-all">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-white border border-slate-100 flex items-center justify-center text-indigo-500 shadow-sm">
                      <Cpu size={18} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black text-slate-900">{event.event_name}</span>
                        <span className={`text-[10px] px-2 py-0.5 ${event.tx_status === 'confirmed' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'} rounded-full font-black uppercase`}>
                          {event.tx_status}
                        </span>
                      </div>
                      <p className="text-[10px] font-medium text-slate-400 font-mono mt-0.5">{event.tx_hash?.slice(0, 16)}...</p>
                    </div>
                  </div>
                  <a 
                    href={`https://sepolia.etherscan.io/tx/${event.tx_hash}`}
                    target="_blank"
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-300 hover:text-indigo-600 hover:bg-indigo-50 transition-all"
                  >
                    <ExternalLink size={14} />
                  </a>
                </div>
              )) : (
                <div className="p-10 text-center text-gray-400 text-xs font-bold uppercase">No events found</div>
              )}
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
              Discrepancy detection engine is currently scanning the Ethereum Sepolia network for hash mismatches.
            </p>
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
