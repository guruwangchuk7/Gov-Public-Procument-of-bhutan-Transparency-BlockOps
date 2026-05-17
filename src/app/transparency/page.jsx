'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Trophy, 
  Building2, 
  Globe, 
  Search,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';
import { format } from 'date-fns';
import PublicTrustDashboard from '@/components/public/PublicTrustDashboard';

export default function TransparencyPortalPage() {
  const [awards, setAwards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchAwards();
  }, []);

  const fetchAwards = async () => {
    try {
      const res = await fetch('/api/public/winning-bids');
      const result = await res.json();
      if (result.success) {
        setAwards(result.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredAwards = awards.filter(a => 
    a.tenders?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.suppliers?.company_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <main className="min-h-screen bg-zinc-50 pb-20 font-sans selection:bg-zinc-900 selection:text-white">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-zinc-100 py-5 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-8 h-8 bg-zinc-900 rounded-[10px] flex items-center justify-center text-white font-bold text-xs shadow-md">B</div>
            <span className="text-lg font-bold text-zinc-900 tracking-tightest uppercase">BGPS</span>
          </Link>
          <div className="flex items-center gap-8">
            <Link href="/verify" className="text-[13px] font-semibold text-zinc-500 hover:text-zinc-900 transition-colors">Verify Proof</Link>
            <Link href="/select-role" className="bg-zinc-900 text-white px-5 py-2.5 rounded-[12px] text-[13px] font-bold hover:bg-black transition-colors shadow-md">
              Portal Login
            </Link>
          </div>
        </div>
      </nav>

      {/* Trust Explorer Section */}
      <div className="bg-white border-b border-zinc-200">
        <div className="max-w-7xl mx-auto px-6">
          <PublicTrustDashboard />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-24">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-10 mb-16">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-zinc-900 rounded-lg mb-6 shadow-sm">
              <Trophy size={14} className="text-zinc-300" />
              <span className="text-[10px] font-bold text-white uppercase tracking-widest">Public Procurement Record</span>
            </div>
            <h1 className="text-5xl font-semibold text-zinc-900 tracking-tightest leading-[1.1]">
              Transparency Dashboard
            </h1>
            <p className="text-lg text-zinc-500 mt-4 leading-relaxed font-medium max-w-xl">
              Open access to all government contract awards and their corresponding blockchain proofs.
            </p>
          </div>

          <div className="relative group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-zinc-900 transition-colors" size={18} />
            <input 
              type="text"
              placeholder="Search contracts, agencies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 pr-6 py-4 bg-white border border-zinc-200 rounded-[20px] text-sm font-medium focus:ring-0 focus:border-zinc-900 outline-none transition-all w-full md:w-96 shadow-[0_8px_24px_-12px_rgba(0,0,0,0.1)]"
            />
          </div>
        </div>

        {loading ? (
          <div className="py-32 flex flex-col items-center justify-center text-zinc-400 gap-4">
            <div className="w-12 h-12 border-4 border-zinc-200 border-t-zinc-900 rounded-full animate-spin"></div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Syncing Records...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredAwards.map((award) => (
              <div key={award.id} className="bg-white p-8 rounded-[32px] border border-zinc-200 hover:border-zinc-900 transition-all duration-300 group flex flex-col shadow-[0_12px_40px_-16px_rgba(0,0,0,0.05)] hover:shadow-[0_16px_48px_-16px_rgba(0,0,0,0.1)]">
                <div className="flex justify-between items-start mb-8">
                  <div className="w-14 h-14 rounded-[16px] bg-zinc-900 flex items-center justify-center text-white shadow-lg">
                    <Trophy size={24} />
                  </div>
                  <div className="text-right">
                    <div className="flex items-center justify-end gap-1.5 text-[10px] text-zinc-900 font-bold uppercase tracking-widest mb-1.5">
                      <CheckCircle2 size={14} className="text-emerald-500" /> Verified
                    </div>
                    <code className="text-[10px] text-zinc-400 font-bold tracking-wider">#{award.id.slice(0, 8).toUpperCase()}</code>
                  </div>
                </div>

                <div className="flex-1 space-y-8 mb-10">
                  <h3 className="text-xl font-semibold text-zinc-900 leading-snug">
                    {award.tenders?.title}
                  </h3>
                  
                  <div className="space-y-5">
                    <div className="flex items-center gap-4 p-4 rounded-[20px] bg-zinc-50 border border-zinc-100">
                      <div className="w-10 h-10 rounded-[12px] bg-white border border-zinc-200 flex items-center justify-center text-zinc-900 shadow-sm">
                        <Building2 size={18} />
                      </div>
                      <div>
                        <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest mb-0.5">Winning Supplier</p>
                        <p className="text-sm font-semibold text-zinc-900">{award.suppliers?.company_name}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest mb-1">Award Amount</p>
                        <p className="text-lg font-bold text-zinc-900 tracking-tight">Nu. {award.bids?.bid_amount?.toLocaleString()}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest mb-1">Finalized On</p>
                        <p className="text-sm font-semibold text-zinc-900">{award.awarded_at ? format(new Date(award.awarded_at), 'MMM dd, yyyy') : 'N/A'}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 mt-auto">
                  <Link
                    href={`/transparency/tenders/${award.tenders?.id}`}
                    className="w-full h-14 bg-zinc-900 text-white rounded-[20px] flex items-center justify-center gap-2 text-sm font-bold hover:bg-black transition-colors group/btn shadow-md"
                  >
                    Read Full Record <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                  </Link>
                  <a 
                    href={`https://sepolia.etherscan.io/tx/${award.blockchain_tx_hash}`}
                    target="_blank"
                    className="w-full h-14 bg-white border border-zinc-200 text-zinc-900 rounded-[20px] flex items-center justify-center gap-2 text-sm font-bold hover:border-zinc-900 transition-colors"
                  >
                    <Globe size={16} className="text-zinc-400" /> Verify on Blockchain
                  </a>
                </div>
              </div>
            ))}

            {filteredAwards.length === 0 && (
              <div className="col-span-full py-24 text-center border-2 border-dashed border-zinc-200 bg-white rounded-[40px]">
                <Trophy size={48} className="mx-auto text-zinc-300 mb-6" />
                <p className="text-[13px] text-zinc-500 font-bold uppercase tracking-widest">No procurement records found</p>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
