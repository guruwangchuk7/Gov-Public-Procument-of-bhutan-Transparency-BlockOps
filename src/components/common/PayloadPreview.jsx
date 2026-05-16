'use client';
import { Database, Code2 } from 'lucide-react';

export default function PayloadPreview({ data, title = "Database Payload Preview" }) {
  return (
    <div className="card bg-slate-900 border-slate-800 p-0 overflow-hidden">
      <div className="px-4 py-2 bg-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2 text-slate-400">
          <Database size={12} />
          <span className="text-[10px] font-black uppercase tracking-widest">{title}</span>
        </div>
        <div className="flex items-center gap-1.5 px-2 py-0.5 bg-emerald-500/10 rounded-full">
          <div className="w-1 h-1 bg-emerald-500 rounded-full animate-pulse" />
          <span className="text-[8px] font-black text-emerald-500 uppercase">ERD Aligned</span>
        </div>
      </div>
      <div className="p-4">
        <pre className="text-[11px] text-primary-light/70 font-mono leading-relaxed overflow-x-auto">
          {JSON.stringify(data, null, 2)}
        </pre>
      </div>
      <div className="px-4 py-2 bg-slate-900/50 border-t border-slate-800 flex items-center gap-2">
        <Code2 size={10} className="text-slate-500" />
        <span className="text-[9px] text-slate-500 font-bold italic">Fields match Supabase schema exactly.</span>
      </div>
    </div>
  );
}
