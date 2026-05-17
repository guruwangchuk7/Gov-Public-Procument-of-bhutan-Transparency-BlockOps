'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ShieldCheck, ArrowLeft, Globe, Loader2, CheckCircle2, XCircle, ExternalLink } from 'lucide-react';

export default function VerificationProofPage() {
  const { txHash } = useParams();
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState(null);

  useEffect(() => {
    if (!txHash) return;

    const verifyHash = async () => {
      try {
        const res = await fetch(`/api/public/verify?q=${txHash}`);
        const data = await res.json();
        setResult(data);
      } catch (err) {
        console.error('Verification failed:', err);
      } finally {
        setLoading(false);
      }
    };

    verifyHash();
  }, [txHash]);

  return (
    <main className="min-h-screen bg-zinc-50 pb-20 font-sans selection:bg-zinc-900 selection:text-white">
      {/* Navigation */}
      <nav className="bg-white border-b border-zinc-100 py-5 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-6 flex items-center justify-between">
          <Link href="/transparency" className="flex items-center gap-3">
            <div className="w-8 h-8 bg-zinc-900 rounded-[10px] flex items-center justify-center text-white font-bold text-xs shadow-md">B</div>
            <span className="text-lg font-bold text-zinc-900 tracking-tightest uppercase">BGPS</span>
          </Link>
          <Link href="/transparency" className="text-sm font-bold text-zinc-500 hover:text-zinc-900 transition-colors flex items-center gap-1.5">
            <ArrowLeft size={16} /> Back to Transparency Portal
          </Link>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-6 py-16">
        {loading ? (
          <div className="py-32 flex flex-col items-center justify-center text-zinc-400 gap-4">
            <Loader2 className="animate-spin text-zinc-300" size={36} />
            <p className="text-xs font-bold uppercase tracking-widest text-zinc-500">Retrieving Blockchain Proof...</p>
          </div>
        ) : result ? (
          <div className="space-y-8">
            <div className="text-center mb-8">
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 border ${
                result.status === 'trusted' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-red-50 text-red-600 border-red-100'
              }`}>
                {result.status === 'trusted' ? <CheckCircle2 size={36} /> : <XCircle size={36} />}
              </div>
              <h1 className="text-3xl font-black text-zinc-900 tracking-tight">
                {result.status === 'trusted' ? 'Cryptographic Certificate Verified' : 'Integrity Check Disputed'}
              </h1>
              <p className="text-zinc-500 text-sm mt-1">Immutable proof verification status logged on Ethereum Sepolia ledger.</p>
            </div>

            <div className={`card border-2 p-8 bg-white ${
              result.status === 'trusted' ? 'border-emerald-500' : 'border-red-500'
            }`}>
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="p-4 bg-zinc-50 rounded-2xl border border-zinc-100">
                    <p className="text-[10px] text-zinc-400 font-bold uppercase mb-1">Blockchain Event Type</p>
                    <p className="text-sm font-black text-zinc-800 uppercase">{result.event_name || 'N/A'}</p>
                  </div>
                  <div className="p-4 bg-zinc-50 rounded-2xl border border-zinc-100">
                    <p className="text-[10px] text-zinc-400 font-bold uppercase mb-1">Block Number</p>
                    <p className="text-sm font-black text-zinc-800">{result.block_number || 'Pending confirmation'}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-[10px] text-zinc-400 font-bold uppercase">Database Sealed Hash</p>
                  <p className="text-[11px] font-mono p-3 bg-zinc-50 rounded-xl border border-zinc-100 break-all select-all">{result.database_hash || 'No Local Record Hash'}</p>
                </div>

                <div className="space-y-2">
                  <p className="text-[10px] text-zinc-400 font-bold uppercase">On-Chain Registered Hash</p>
                  <p className="text-[11px] font-mono p-3 bg-zinc-50 rounded-xl border border-zinc-100 break-all select-all">{result.blockchain_hash || 'Pending blockchain registry'}</p>
                </div>

                {result.tx_hash && (
                  <div className="pt-4">
                    <a 
                      href={`https://sepolia.etherscan.io/tx/${result.tx_hash}`}
                      target="_blank"
                      className="flex items-center justify-center gap-2 w-full py-4 bg-zinc-900 text-white rounded-2xl text-sm font-bold hover:bg-black transition-all shadow-md"
                    >
                      <Globe size={18} /> View Block Explorer (Etherscan) <ExternalLink size={14} />
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="py-24 text-center border border-dashed border-zinc-200 bg-white rounded-[32px]">
            <XCircle size={48} className="mx-auto text-red-500 mb-4" />
            <p className="text-[13px] text-zinc-500 font-bold uppercase tracking-widest">Failed to retrieve proof records</p>
          </div>
        )}
      </div>
    </main>
  );
}
