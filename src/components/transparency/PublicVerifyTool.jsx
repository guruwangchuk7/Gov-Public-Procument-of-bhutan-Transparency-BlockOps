'use client';
import { useState } from 'react';
import { Search, ShieldCheck, Globe, Loader2, CheckCircle2, XCircle, ArrowRight } from 'lucide-react';

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
      // Simulate/Fetch verification from public endpoint
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
      <div className="card shadow-2xl border-primary-100 p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary-50 rounded-2xl flex items-center justify-center text-primary mx-auto mb-4">
            <ShieldCheck size={32} />
          </div>
          <h2 className="text-2xl font-black text-gray-900">Blockchain Proof Verifier</h2>
          <p className="text-gray-500 text-sm mt-1">Paste a Document Hash or Tender ID to verify its integrity on Ethereum Sepolia.</p>
        </div>

        <form onSubmit={handleVerify} className="space-y-4">
          <div className="relative">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Enter Hash (0x...) or Tender ID..."
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
            result.verified ? 'border-emerald-500 bg-emerald-50/20' : 'border-red-500 bg-red-50/20'
          }`}>
            <div className="flex items-center gap-4 mb-4">
              {result.verified ? (
                <CheckCircle2 size={32} className="text-emerald-500" />
              ) : (
                <XCircle size={32} className="text-red-500" />
              )}
              <div>
                <h3 className="font-black text-gray-900">
                  {result.verified ? 'Cryptographic Proof Verified' : 'Verification Failed'}
                </h3>
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">
                  Result for: {query.slice(0, 16)}...
                </p>
              </div>
            </div>

            {result.verified && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-white/50 rounded-xl border border-gray-100">
                    <p className="text-[10px] text-gray-400 font-bold uppercase">Entity Type</p>
                    <p className="text-sm font-bold text-gray-800 uppercase">{result.type}</p>
                  </div>
                  <div className="p-3 bg-white/50 rounded-xl border border-gray-100">
                    <p className="text-[10px] text-gray-400 font-bold uppercase">Timestamp</p>
                    <p className="text-sm font-bold text-gray-800">{new Date(result.timestamp).toLocaleDateString()}</p>
                  </div>
                </div>
                <a 
                  href={`https://sepolia.etherscan.io/tx/${result.txHash}`}
                  target="_blank"
                  className="flex items-center justify-center gap-2 w-full py-3 bg-white text-indigo-600 border border-indigo-100 rounded-xl text-xs font-bold hover:bg-indigo-50 transition-all"
                >
                  <Globe size={14} /> View Immutable Proof on Sepolia Etherscan
                </a>
              </div>
            )}
            
            {!result.verified && (
              <p className="text-sm text-red-600 font-medium">
                No matching record found on the blockchain ledger. This document or ID may be invalid or tampered with.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
