'use client';

import React from 'react';
import { Activity, Shield, Database, Cpu } from 'lucide-react';

/**
 * UI Component for system-wide blockchain health status.
 */
export default function ContractStatusCard({ stats }) {
  const mode = process.env.NEXT_PUBLIC_BLOCKCHAIN_MODE || 'mock';

  return (
    <div className="bg-[#0f172a] rounded-2xl p-6 text-white shadow-2xl overflow-hidden relative group">
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full -mr-32 -mt-32 blur-3xl group-hover:bg-indigo-500/20 transition-all duration-700" />
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-500/20 rounded-lg border border-indigo-500/30">
              <Shield className="text-indigo-400" size={20} />
            </div>
            <div>
              <h3 className="text-lg font-bold">Network Security</h3>
              <p className="text-xs text-indigo-300/60 uppercase tracking-widest font-bold">Protocol Health</p>
            </div>
          </div>
          <div className="flex items-center gap-2 px-3 py-1 bg-green-500/10 border border-green-500/30 rounded-full">
            <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
            <span className="text-[10px] font-bold text-green-400 uppercase">Operational</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-indigo-300/40">
              <Cpu size={14} />
              <span className="text-[10px] font-bold uppercase tracking-wider">Engine Mode</span>
            </div>
            <p className="text-xl font-bold uppercase tracking-tight">{mode}</p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 text-indigo-300/40">
              <Activity size={14} />
              <span className="text-[10px] font-bold uppercase tracking-wider">TPS Status</span>
            </div>
            <p className="text-xl font-bold uppercase tracking-tight">Optimal</p>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between text-[10px] font-bold text-indigo-300/40 uppercase tracking-widest">
          <div className="flex items-center gap-2">
            <Database size={12} />
            On-Chain Indexing Active
          </div>
          <span>BGPS v1.0</span>
        </div>
      </div>
    </div>
  );
}
