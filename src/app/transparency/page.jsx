'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Trophy, 
  Building2, 
  Calendar, 
  DollarSign, 
  Globe, 
  ExternalLink,
  Search,
  CheckCircle2
} from 'lucide-react';
import { format } from 'date-fns';

export default function TransparencyPortalPage() {
  const [awards, setAwards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchAwards();
  }, []);

  const fetchAwards = async () => {
    try {
      const res = await fetch('/api/public/awards');
      const data = await res.json();
      setAwards(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredAwards = awards.filter(a => 
    a.tenders?.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.suppliers?.company_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <main className="min-h-screen bg-gray-50 pb-20">
      <nav className="bg-white border-b border-gray-100 py-6 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center text-white font-bold">B</div>
            <span className="text-2xl font-black text-gray-900 tracking-tight">BGPS</span>
          </Link>
          <div className="flex items-center gap-6">
            <Link href="/verify" className="text-sm font-bold text-gray-500 hover:text-emerald-500 transition-colors">Verify Proof</Link>
            <Link href="/select-role" className="btn-primary !bg-emerald-500 !py-2 text-xs">Portal Login</Link>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 rounded-full text-emerald-600 text-[10px] font-black uppercase tracking-widest mb-4 border border-emerald-100">
              <Trophy size={12} /> Awarded Contracts
            </div>
            <h1 className="text-4xl font-black text-gray-900 leading-tight">Transparency Dashboard</h1>
            <p className="text-gray-500 font-medium mt-2">Public record of all government contract awards and their blockchain proofs.</p>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text"
              placeholder="Search contracts, agencies, suppliers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all w-80 shadow-sm"
            />
          </div>
        </div>

        {loading ? (
          <div className="p-20 text-center text-gray-400">Loading public records...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredAwards.map((award) => (
              <div key={award.id} className="card group hover:border-emerald-500 transition-all duration-300 flex flex-col">
                <div className="flex justify-between items-start mb-6">
                  <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-500 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                    <Trophy size={24} />
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1 text-[10px] text-emerald-600 font-black uppercase mb-1">
                      <CheckCircle2 size={10} /> Verified Award
                    </div>
                    <p className="text-[10px] text-gray-400 font-mono">AWARD-ID: {award.id.slice(0, 8)}</p>
                  </div>
                </div>

                <div className="flex-1 space-y-4 mb-6">
                  <h3 className="text-lg font-black text-gray-900 line-clamp-2 leading-tight group-hover:text-emerald-600 transition-colors">
                    {award.tenders?.title}
                  </h3>
                  
                  <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl border border-gray-100">
                    <Building2 size={16} className="text-gray-400" />
                    <div>
                      <p className="text-[10px] text-gray-400 font-bold uppercase leading-none mb-1">Winning Supplier</p>
                      <p className="text-xs font-bold text-gray-800">{award.suppliers?.company_name}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-emerald-50/50 rounded-xl">
                      <p className="text-[10px] text-emerald-600 font-bold uppercase mb-1">Amount</p>
                      <p className="text-sm font-black text-emerald-700">Nu. {award.bids?.bid_amount.toLocaleString()}</p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-xl">
                      <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">Date</p>
                      <p className="text-sm font-bold text-gray-700">{format(new Date(award.awarded_at), 'MMM dd, yyyy')}</p>
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-gray-100 mt-auto">
                  <a 
                    href={`https://sepolia.etherscan.io/tx/${award.blockchain_tx_hash}`}
                    target="_blank"
                    className="flex items-center justify-center gap-2 w-full py-3 bg-gray-900 text-white rounded-xl text-xs font-bold hover:bg-emerald-600 transition-all shadow-lg shadow-gray-200"
                  >
                    <Globe size={14} /> View Blockchain Proof <ExternalLink size={12} />
                  </a>
                </div>
              </div>
            ))}

            {filteredAwards.length === 0 && (
              <div className="lg:col-span-3 p-20 text-center card bg-gray-50">
                <Trophy size={64} className="mx-auto text-gray-200 mb-4" />
                <p className="text-gray-500 font-medium">No contract awards have been recorded yet.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
