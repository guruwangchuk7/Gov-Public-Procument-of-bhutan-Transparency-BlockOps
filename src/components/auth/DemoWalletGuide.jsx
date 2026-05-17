'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Copy, Check, Info } from 'lucide-react';
import { DEMO_ROLE_WALLETS } from '@/config/demoRoleWallets';

export default function DemoWalletGuide() {
  const [isOpen, setIsOpen] = useState(false);
  const [copiedKey, setCopiedKey] = useState(null);

  // Only show in development or if flag is true
  const showGuide = process.env.NODE_ENV === 'development' || process.env.NEXT_PUBLIC_SHOW_DEMO_GUIDE === 'true';

  if (!showGuide) return null;

  const handleCopy = (address) => {
    try {
      navigator.clipboard.writeText(address);
      setCopiedKey(address);
      setTimeout(() => setCopiedKey(null), 2000);
    } catch (err) {
      console.warn('Failed to copy text', err);
    }
  };

  return (
    <div className="w-full mt-6 bg-slate-50 border border-slate-200 rounded-2xl overflow-hidden">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 flex items-center justify-between text-slate-700 hover:bg-slate-100 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Info size={16} className="text-blue-500" />
          <span className="text-xs font-bold uppercase tracking-widest text-slate-600">Demo Wallet Guide</span>
        </div>
        {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>

      {isOpen && (
        <div className="p-4 border-t border-slate-200 bg-white space-y-3">
          <p className="text-[11px] text-slate-500 mb-2 leading-relaxed">
            For local testing, import the corresponding private key into your Rabby extension and switch to it before clicking connect.
          </p>
          
          {Object.entries(DEMO_ROLE_WALLETS).map(([key, data]) => (
            <div key={key} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 bg-slate-50 rounded-xl border border-slate-100">
              <div>
                <p className="text-[10px] font-black uppercase text-indigo-600 tracking-widest">{data.roleLabel}</p>
                <p className="text-xs font-mono text-slate-700 mt-0.5">{data.shortWallet}</p>
              </div>
              <button
                onClick={() => handleCopy(data.expectedWallet)}
                className="flex items-center justify-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg text-xs font-medium text-slate-600 transition-colors"
              >
                {copiedKey === data.expectedWallet ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
                {copiedKey === data.expectedWallet ? 'Copied' : 'Copy Full'}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
