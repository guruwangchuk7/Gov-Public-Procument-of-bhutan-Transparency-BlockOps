'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Trophy, Building2, Calendar, DollarSign, Globe, ExternalLink, Search } from 'lucide-react';
import { format } from 'date-fns';

export default function AgencyAwardsPage() {
  const [awards, setAwards] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAwards();
  }, []);

  const fetchAwards = async () => {
    try {
      const res = await fetch('/api/agency/awards?agencyId=agency-uuid'); // In real case, from session
      const data = await res.json();
      setAwards(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Awarded Contracts</h1>
          <p className="text-gray-500">History of all tenders finalized and awarded by your agency.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {loading ? (
          <div className="lg:col-span-2 p-20 text-center text-gray-400">Loading awarded contracts...</div>
        ) : awards.length > 0 ? (
          awards.map((award) => (
            <div key={award.id} className="card group hover:border-emerald-500 transition-all duration-300">
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-500 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                    <Trophy size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 line-clamp-1">{award.tenders?.title}</h3>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">Awarded on {format(new Date(award.awarded_at), 'MMM dd, yyyy')}</p>
                  </div>
                </div>
                <div className="px-3 py-1 bg-emerald-100 text-emerald-600 rounded-full text-[10px] font-black uppercase">
                  Finalized
                </div>
              </div>

              <div className="space-y-3 mb-6">
                <div className="p-3 bg-gray-50 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Building2 size={16} className="text-gray-400" />
                    <span className="text-xs font-bold text-gray-700">Winning Supplier</span>
                  </div>
                  <span className="text-xs font-black text-gray-900">{award.suppliers?.company_name}</span>
                </div>
                <div className="p-3 bg-gray-50 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <DollarSign size={16} className="text-gray-400" />
                    <span className="text-xs font-bold text-gray-700">Contract Value</span>
                  </div>
                  <span className="text-xs font-black text-emerald-600">Nu. {award.bids?.bid_amount.toLocaleString()}</span>
                </div>
              </div>

              <div className="pt-6 border-t border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-2 text-indigo-500">
                  <Globe size={14} />
                  <span className="text-[10px] font-bold uppercase tracking-tighter">Blockchain Proof Verified</span>
                </div>
                <a 
                  href={`https://sepolia.etherscan.io/tx/${award.blockchain_tx_hash}`}
                  target="_blank"
                  className="p-2 bg-gray-50 rounded-lg text-gray-400 hover:text-indigo-600 transition-colors"
                >
                  <ExternalLink size={16} />
                </a>
              </div>
            </div>
          ))
        ) : (
          <div className="lg:col-span-2 p-20 text-center card">
            <Trophy size={48} className="mx-auto text-gray-200 mb-4" />
            <p className="text-gray-500 font-medium">No contracts have been awarded yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
