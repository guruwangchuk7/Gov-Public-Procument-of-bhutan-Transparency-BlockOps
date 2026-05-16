'use client';
import { useState } from 'react';
import { ShieldCheck, ShieldAlert, CheckCircle2, XCircle, Loader2, RefreshCw, ExternalLink } from 'lucide-react';

export default function PublicProofCard({ tenderId, tenderHash, awardHash, txHash }) {
  const [verifying, setVerifying] = useState(false);
  const [result, setResult] = useState(null);

  const handleVerify = async () => {
    setVerifying(true);
    try {
      const res = await fetch(`/api/public/verify?q=${tenderId}`);
      const data = await res.json();
      setResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setVerifying(false);
    }
  };

  return (
    <div className={`card border-2 transition-all duration-500 bg-white ${
      result?.status === 'trusted' ? 'border-emerald-500' : 
      result?.status === 'suspicious' ? 'border-red-500' : 
      'border-gray-100'
    }`}>
      <div className="p-6 border-b border-gray-50 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
            result?.status === 'trusted' ? 'bg-emerald-500 text-white' : 
            result?.status === 'suspicious' ? 'bg-red-500 text-white' : 
            'bg-gray-100 text-gray-400'
          }`}>
            <ShieldCheck size={20} />
          </div>
          <div>
            <h4 className="font-black text-gray-900 leading-none text-sm">Blockchain Proof</h4>
            <p className="text-[10px] text-gray-400 font-bold uppercase mt-1">Status: {result?.status || 'Pending Verification'}</p>
          </div>
        </div>
        
        {!result && (
          <button
            onClick={handleVerify}
            disabled={verifying}
            className="px-4 py-2 bg-gray-900 text-white rounded-lg text-[10px] font-black uppercase hover:bg-emerald-600 transition-all disabled:opacity-50"
          >
            {verifying ? <Loader2 className="animate-spin" size={14} /> : 'Verify Now'}
          </button>
        )}
      </div>

      <div className="p-6 space-y-6">
        <div className="space-y-4">
          <div className="space-y-1.5">
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Database Record Hash</p>
            <div className="p-3 bg-gray-50 rounded-xl font-mono text-[9px] break-all text-gray-600 border border-gray-100">
              {tenderHash}
            </div>
          </div>

          <div className="flex justify-center py-2 relative">
             <div className="absolute top-1/2 left-0 right-0 h-px bg-gray-100 -z-0" />
             <div className="bg-white px-4 relative z-10">
                {result?.status === 'trusted' ? (
                    <CheckCircle2 size={24} className="text-emerald-500" />
                ) : result?.status === 'suspicious' ? (
                    <XCircle size={24} className="text-red-500" />
                ) : (
                    <div className="w-6 h-6 rounded-full bg-gray-100 border border-gray-200" />
                )}
             </div>
          </div>

          <div className="space-y-1.5">
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Blockchain Proof Hash</p>
            <div className={`p-3 rounded-xl font-mono text-[9px] break-all border ${
                result ? 'bg-white font-bold' : 'bg-gray-50 text-gray-300 border-gray-50'
            } ${
                result?.status === 'trusted' ? 'text-emerald-600 border-emerald-100' : 
                result?.status === 'suspicious' ? 'text-red-600 border-red-100' : 
                'border-gray-100'
            }`}>
              {result?.blockchain_hash || 'Verify to load...'}
            </div>
          </div>
        </div>

        {result && (
            <div className="pt-6 border-t border-gray-50 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                        <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">Block Number</p>
                        <p className="text-xs font-black text-gray-900">{result.block_number}</p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                        <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">Event Name</p>
                        <p className="text-xs font-black text-gray-900 truncate">{result.event_name}</p>
                    </div>
                </div>
                <a 
                    href={result.etherscan_url} 
                    target="_blank"
                    className="flex items-center justify-center gap-2 w-full py-3 bg-emerald-50 text-emerald-700 rounded-xl text-xs font-bold hover:bg-emerald-100 transition-all"
                >
                    <ExternalLink size={14} /> Open Etherscan Proof
                </a>
                <button 
                    onClick={() => setResult(null)}
                    className="w-full text-[10px] font-bold text-gray-400 uppercase tracking-widest hover:text-gray-600 flex items-center justify-center gap-2"
                >
                    <RefreshCw size={10} /> Reset Verification
                </button>
            </div>
        )}
      </div>
    </div>
  );
}
