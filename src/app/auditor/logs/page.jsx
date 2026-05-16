'use client';
import { motion } from 'framer-motion';
import { History, ShieldCheck, Cpu, Terminal, Search, Clock, ArrowRight } from 'lucide-react';

const MOCK_LOGS = [
  { time: '14:20:05', event: 'Block Verification', details: 'Block #8492012 confirmed by 12 nodes.', actor: 'System', status: 'success' },
  { time: '13:45:12', event: 'Identity Check', details: 'Agency #402 NDI verification successful.', actor: 'Bhutan NDI', status: 'success' },
  { time: '12:10:33', event: 'Audit Alert', details: 'Hash mismatch detected in Tender #AQ-2024.', actor: 'Watcher-Node', status: 'alert' },
  { time: '10:05:00', event: 'Node Sync', details: 'Synchronizing with Sepolia Testnet...', actor: 'Eth-Client', status: 'info' },
];

export default function AuditorLogsPage() {
  return (
    <div className="space-y-10">
      <div className="space-y-2">
        <h1 className="text-4xl font-black text-slate-900 tracking-tight">System Logs</h1>
        <p className="text-sm font-medium text-slate-500 italic">Immutable record of blockchain and identity-sync events</p>
      </div>

      <div className="card overflow-hidden !p-0">
        <div className="p-6 bg-slate-900 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Terminal className="text-indigo-400" size={20} />
            <span className="text-xs font-black text-white uppercase tracking-widest">Real-time Node Output</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Connected</span>
            </div>
            <button className="btn bg-white/10 hover:bg-white/20 text-white text-[10px] py-1 px-3 border-none">
              CLEAR TERMINAL
            </button>
          </div>
        </div>

        <div className="p-2 bg-slate-800 space-y-1">
          {MOCK_LOGS.map((log, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="group flex items-start gap-4 p-4 rounded-xl hover:bg-slate-700/50 transition-colors"
            >
              <span className="text-[10px] font-bold text-indigo-400 font-mono pt-1">{log.time}</span>
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <span className={`text-[9px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded ${log.status === 'success' ? 'bg-emerald-500/20 text-emerald-400' : log.status === 'alert' ? 'bg-rose-500/20 text-rose-400' : 'bg-indigo-500/20 text-indigo-400'}`}>
                    {log.event}
                  </span>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">— {log.actor}</span>
                </div>
                <p className="text-xs font-medium text-slate-300 leading-relaxed font-mono">{log.details}</p>
              </div>
              <button className="opacity-0 group-hover:opacity-100 transition-opacity text-slate-500 hover:text-white">
                <ArrowRight size={14} />
              </button>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card bg-slate-50 border-slate-100 flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Events</p>
            <h4 className="text-2xl font-black text-slate-900">4,281</h4>
          </div>
          <Clock className="text-slate-300" size={32} />
        </div>
        <div className="card bg-slate-50 border-slate-100 flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Hash Consistency</p>
            <h4 className="text-2xl font-black text-emerald-600">99.98%</h4>
          </div>
          <ShieldCheck className="text-emerald-200" size={32} />
        </div>
        <div className="card bg-slate-50 border-slate-100 flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Node Uptime</p>
            <h4 className="text-2xl font-black text-indigo-600">14d 6h</h4>
          </div>
          <Cpu className="text-indigo-200" size={32} />
        </div>
      </div>
    </div>
  );
}
