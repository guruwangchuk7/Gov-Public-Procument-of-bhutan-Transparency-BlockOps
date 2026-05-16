'use client';
import { useState } from 'react';
import { ShieldCheck, ShieldAlert, CheckCircle2, XCircle, Loader2, RefreshCw } from 'lucide-react';
import { verifyHash } from '@/lib/hash/document-hash';

export default function HashCompareCard({ dbHash, blockchainHash, label }) {
  const [verifying, setVerifying] = useState(false);
  const [result, setResult] = useState(null);

  const handleVerify = () => {
    setVerifying(true);
    setTimeout(() => {
      const isMatch = verifyHash(dbHash, blockchainHash);
      setResult(isMatch ? 'match' : 'mismatch');
      setVerifying(false);
    }, 1500);
  };

  return (
    <div className={`card border-2 transition-all duration-500 ${
      result === 'match' ? 'border-emerald-500 bg-emerald-50/10' : 
      result === 'mismatch' ? 'border-red-500 bg-red-50/10' : 
      'border-gray-200'
    }`}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${
            result === 'match' ? 'bg-emerald-500 text-white' : 
            result === 'mismatch' ? 'bg-red-500 text-white' : 
            'bg-gray-100 text-gray-400'
          }`}>
            <ShieldCheck size={20} />
          </div>
          <div>
            <h4 className="font-black text-gray-900 leading-none">{label}</h4>
            <p className="text-[10px] text-gray-400 font-bold uppercase mt-1">Integrity Verification</p>
          </div>
        </div>
        
        {result ? (
          <button 
            onClick={() => setResult(null)}
            className="text-xs font-bold text-gray-400 hover:text-primary flex items-center gap-1"
          >
            <RefreshCw size={12} /> Reset
          </button>
        ) : (
          <button
            onClick={handleVerify}
            disabled={verifying}
            className="px-4 py-2 bg-gray-900 text-white rounded-lg text-xs font-bold hover:bg-primary transition-all disabled:opacity-50"
          >
            {verifying ? <Loader2 className="animate-spin" size={14} /> : 'Verify Proof'}
          </button>
        )}
      </div>

      <div className="space-y-4">
        <div className="space-y-1.5">
          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Database Record Hash</p>
          <div className="p-3 bg-white border border-gray-100 rounded-xl font-mono text-[10px] break-all text-gray-600">
            {dbHash}
          </div>
        </div>

        <div className="flex justify-center py-2">
          {result === 'match' ? (
            <div className="flex flex-col items-center animate-bounce">
              <CheckCircle2 size={32} className="text-emerald-500" />
              <span className="text-[10px] font-black text-emerald-600 uppercase mt-1">Hashes Match</span>
            </div>
          ) : result === 'mismatch' ? (
            <div className="flex flex-col items-center animate-shake">
              <XCircle size={32} className="text-red-500" />
              <span className="text-[10px] font-black text-red-600 uppercase mt-1">Integrity Breach</span>
            </div>
          ) : (
            <div className="h-12 flex items-center justify-center">
              <div className="w-0.5 h-full bg-gray-100" />
            </div>
          )}
        </div>

        <div className="space-y-1.5">
          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Blockchain Event Hash</p>
          <div className="p-3 bg-white border border-gray-100 rounded-xl font-mono text-[10px] break-all text-indigo-600 font-bold">
            {blockchainHash}
          </div>
        </div>
      </div>
    </div>
  );
}
