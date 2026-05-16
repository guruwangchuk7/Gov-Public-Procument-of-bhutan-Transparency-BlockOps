'use client';
import { useState, useEffect } from 'react';
import { Trophy, Building2, ExternalLink, Globe, CheckCircle2 } from 'lucide-react';
import { format } from 'date-fns';

export default function SupplierAwardsPage() {
  const [awards, setAwards] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAwards();
  }, []);

  const fetchAwards = async () => {
    try {
      const res = await fetch('/api/supplier/awards?supplierId=supplier-uuid'); // In real case, from session
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
          <h1 className="text-2xl font-black text-gray-900">Won Contracts</h1>
          <p className="text-gray-500">Official record of your successfully awarded government projects.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {loading ? (
          <div className="lg:col-span-3 p-20 text-center text-gray-400">Loading awarded contracts...</div>
        ) : awards.length > 0 ? (
          awards.map((award) => (
            <div key={award.id} className="card border-emerald-500 bg-emerald-50/10 flex flex-col">
              <div className="flex justify-between items-start mb-6">
                <div className="w-12 h-12 rounded-xl bg-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-500/20">
                  <Trophy size={24} />
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-black text-emerald-600 uppercase flex items-center gap-1">
                    <CheckCircle2 size={10} /> On-Chain Award
                  </span>
                  <p className="text-[10px] text-gray-400 mt-1 font-mono">{format(new Date(award.awarded_at), 'yyyy-MM-dd')}</p>
                </div>
              </div>

              <div className="flex-1 space-y-4 mb-6">
                <h3 className="text-lg font-black text-gray-900 leading-tight">{award.tenders?.title}</h3>
                <div className="p-3 bg-white rounded-xl border border-emerald-100 flex items-center justify-between">
                  <span className="text-xs font-bold text-gray-500">Awarded Value</span>
                  <span className="text-sm font-black text-emerald-600">Nu. {award.bids?.bid_amount.toLocaleString()}</span>
                </div>
                <div className="p-3 bg-white rounded-xl border border-emerald-100">
                  <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">Procuring Agency</p>
                  <p className="text-xs font-bold text-gray-900">{award.tenders?.agencies?.agency_name || 'Ministry Hub'}</p>
                </div>
              </div>

              <div className="pt-6 border-t border-emerald-100">
                <a 
                  href={`https://sepolia.etherscan.io/tx/${award.blockchain_tx_hash}`}
                  target="_blank"
                  className="flex items-center justify-center gap-2 w-full py-3 bg-gray-900 text-white rounded-xl text-xs font-bold hover:bg-emerald-600 transition-all shadow-lg"
                >
                  <Globe size={14} /> View Proof on Etherscan
                </a>
              </div>
            </div>
          ))
        ) : (
          <div className="lg:col-span-3 p-20 text-center card bg-gray-50">
            <Trophy size={64} className="mx-auto text-gray-200 mb-4" />
            <p className="text-gray-500 font-medium">You haven't been awarded any contracts yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
