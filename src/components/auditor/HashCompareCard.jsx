'use client';
import { useState, useEffect } from 'react';
import { ShieldCheck, ShieldAlert, CheckCircle2, XCircle, Loader2, RefreshCw, AlertCircle, Clock } from 'lucide-react';
import { compareHashes, normalizeHash } from '@/lib/hash/hash-normalization';

export default function HashCompareCard({ dbHash, blockchainHash, label, status: eventStatus }) {
  const [verifying, setVerifying] = useState(false);
  const [result, setResult] = useState(null);

  // Auto-verify on load if hashes are available
  useEffect(() => {
    if (dbHash && blockchainHash) {
       handleVerify();
    }
  }, [dbHash, blockchainHash]);

  const handleVerify = () => {
    setVerifying(true);
    setTimeout(() => {
      if (!blockchainHash || blockchainHash === 'PENDING') {
        setResult('missing');
      } else if (compareHashes(dbHash, blockchainHash)) {
        setResult('match');
      } else {
        setResult('mismatch');
      }
      setVerifying(false);
    }, 1000);
  };

  const getStatusDisplay = () => {
    if (eventStatus === 'pending') return { color: 'text-amber-500', bg: 'bg-amber-50', icon: Clock, label: 'On-Chain Pending' };
    if (eventStatus === 'failed') return { color: 'text-rose-500', bg: 'bg-rose-50', icon: XCircle, label: 'On-Chain Failed' };
    
    switch (result) {
      case 'match': return { color: 'text-emerald-500', bg: 'bg-emerald-50', icon: CheckCircle2, label: 'Verified Match' };
      case 'mismatch': return { color: 'text-red-500', bg: 'bg-red-50', icon: ShieldAlert, label: 'Integrity Breach' };
      case 'missing': return { color: 'text-gray-400', bg: 'bg-gray-50', icon: AlertCircle, label: 'Missing Proof' };
      default: return { color: 'text-gray-400', bg: 'bg-gray-50', icon: ShieldCheck, label: 'Awaiting Proof' };
    }
  };

  const status = getStatusDisplay();

  return (
    <div className={`card border-2 transition-all duration-500 ${
      result === 'match' ? 'border-emerald-500 bg-emerald-50/10' : 
      result === 'mismatch' ? 'border-red-500 bg-red-50/10' : 
      result === 'missing' ? 'border-amber-500 bg-amber-50/10' :
      'border-gray-200'
    }`}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${
            result === 'match' ? 'bg-emerald-500 text-white' : 
            result === 'mismatch' ? 'bg-red-500 text-white' : 
            'bg-gray-100 text-gray-400'
          }`}>
            <status.icon size={20} />
          </div>
          <div>
            <h4 className="font-black text-gray-900 leading-none">{label}</h4>
            <p className={`text-[10px] font-black uppercase mt-1 ${status.color}`}>{status.label}</p>
          </div>
        </div>
        
        <button
          onClick={handleVerify}
          disabled={verifying}
          className="p-2 text-gray-400 hover:text-primary transition-all disabled:opacity-50"
        >
          {verifying ? <Loader2 className="animate-spin" size={16} /> : <RefreshCw size={16} />}
        </button>
      </div>

      <div className="space-y-4">
        <div className="space-y-1.5">
          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Database Hash (Supabase)</p>
          <div className="p-3 bg-white border border-gray-100 rounded-xl font-mono text-[10px] break-all text-gray-600">
            {normalizeHash(dbHash) || 'N/A'}
          </div>
        </div>

        <div className="flex justify-center py-2">
            {verifying ? (
                <div className="h-12 flex items-center justify-center">
                    <Loader2 className="animate-spin text-primary" size={24} />
                </div>
            ) : result === 'match' ? (
                <div className="flex flex-col items-center">
                  <CheckCircle2 size={32} className="text-emerald-500" />
                  <span className="text-[10px] font-black text-emerald-600 uppercase mt-1">Verified Cryptographic Match</span>
                </div>
            ) : result === 'mismatch' ? (
                <div className="flex flex-col items-center animate-bounce">
                  <ShieldAlert size={32} className="text-red-500" />
                  <span className="text-[10px] font-black text-red-600 uppercase mt-1">Hashes Do Not Match</span>
                </div>
            ) : (
                <div className="h-12 flex items-center justify-center">
                    <div className="w-0.5 h-full bg-gray-100" />
                </div>
            )}
        </div>

        <div className="space-y-1.5">
          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">On-Chain Hash (Ethereum)</p>
          <div className={`p-3 bg-white border border-gray-100 rounded-xl font-mono text-[10px] break-all font-bold ${
              result === 'match' ? 'text-emerald-600' : 'text-indigo-600'
          }`}>
            {(!blockchainHash || blockchainHash === 'PENDING') ? 'missing_blockchain_proof' : normalizeHash(blockchainHash)}
          </div>
        </div>
      </div>
    </div>
  );
}
