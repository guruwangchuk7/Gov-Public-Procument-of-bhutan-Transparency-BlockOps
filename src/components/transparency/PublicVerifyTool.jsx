'use client';
import { useState } from 'react';
import { Search, ShieldCheck, Globe, Loader2, CheckCircle2, XCircle, ArrowRight, ExternalLink } from 'lucide-react';

export default function PublicVerifyTool() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!query) return;

    setLoading(true);
    setResult(null);
    try {
      const res = await fetch(`/api/public/verify?q=${query}`);
      const data = await res.json();
      setResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="card shadow-2xl border-primary-100 p-8 bg-white">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary-50 rounded-2xl flex items-center justify-center text-primary mx-auto mb-4">
            <ShieldCheck size={32} />
          </div>
          <h2 className="text-2xl font-black text-gray-900">Blockchain Proof Verifier</h2>
          <p className="text-gray-500 text-sm mt-1">Verify any Tender ID or Transaction Hash against the immutable ledger.</p>
        </div>

        <form onSubmit={handleVerify} className="space-y-4">
          <div className="relative">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Enter Tender ID or 0x... Transaction Hash"
              className="w-full pl-4 pr-12 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all font-mono text-sm"
            />
            <button 
              type="submit"
              disabled={loading}
              className="absolute right-2 top-2 bottom-2 bg-gray-900 text-white px-4 rounded-lg hover:bg-primary transition-all disabled:opacity-50"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : <ArrowRight size={20} />}
            </button>
          </div>
        </form>

        {result && (
          <div className={`mt-8 p-6 rounded-2xl border-2 animate-in fade-in slide-in-from-bottom-4 duration-500 ${
            result.status === 'trusted' ? 'border-emerald-500 bg-emerald-50/20' : 
            result.status === 'suspicious' ? 'border-red-500 bg-red-50/20' :
            'border-gray-200 bg-gray-50/50'
          }`}>
            <div className="flex items-center gap-4 mb-6">
              {result.status === 'trusted' ? (
                <CheckCircle2 size={32} className="text-emerald-500" />
              ) : (
                <XCircle size={32} className="text-red-500" />
              )}
              <div>
                <h3 className="font-black text-gray-900">
                  {result.status === 'trusted' ? 'Cryptographic Proof Verified' : 
                   result.status === 'suspicious' ? 'INTEGRITY BREACH DETECTED' : 'Verification Status: ' + result.status}
                </h3>
                <p className={`text-[10px] font-bold uppercase tracking-wider ${result.status === 'suspicious' ? 'text-red-600 animate-pulse' : 'text-gray-500'}`}>
                  {result.status === 'suspicious' ? 'Official Record Under Review - Tampering Suspected' : result.message}
                </p>
              </div>
            </div>

            <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-white/50 rounded-xl border border-gray-100">
                    <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">Blockchain Event</p>
                    <p className="text-xs font-black text-gray-800 uppercase">{result.event_name || 'N/A'}</p>
                  </div>
                  <div className="p-3 bg-white/50 rounded-xl border border-gray-100">
                    <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">Block Number</p>
                    <p className="text-xs font-black text-gray-800">{result.block_number || 'Pending'}</p>
                  </div>
                </div>

                <div className="space-y-2">
                    <p className="text-[10px] text-gray-400 font-bold uppercase">Database Hash</p>
                    <p className="text-[9px] font-mono p-2 bg-white/50 rounded border border-gray-100 break-all">{result.database_hash || 'Record Missing Hash'}</p>
                </div>

                <div className="space-y-2">
                    <p className="text-[10px] text-gray-400 font-bold uppercase">On-Chain Hash</p>
                    <p className="text-[9px] font-mono p-2 bg-white/50 rounded border border-gray-100 break-all">{result.blockchain_hash || 'No On-Chain Data'}</p>
                </div>

                {result.tx_hash && (
                    <a 
                    href={result.etherscan_url}
                    target="_blank"
                    className="flex items-center justify-center gap-2 w-full py-3 bg-gray-900 text-white rounded-xl text-xs font-bold hover:bg-primary transition-all"
                    >
                    <Globe size={14} /> View Immutable Proof <ExternalLink size={12} />
                    </a>
                )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
