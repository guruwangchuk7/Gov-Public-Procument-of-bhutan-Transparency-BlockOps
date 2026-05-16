'use client';
import { Activity, ShieldCheck } from 'lucide-react';

export default function FlowModeBadge() {
  return (
    <div className="demo-mode-badge shadow-2xl border-white/10 glass">
      <div className="flex items-center gap-2">
        <div className="demo-mode-dot" />
        <span className="text-slate-400">Frontend Flow</span>
        <span className="text-white font-black">Demo Mode</span>
      </div>
      <div className="h-4 w-px bg-slate-700 mx-2" />
      <div className="flex items-center gap-2 text-emerald-400 font-bold">
        <Activity size={14} />
        <span>Live State</span>
      </div>
    </div>
  );
}
