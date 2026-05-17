'use client';
import { useState, useEffect } from 'react';
import { Send, Clock, ShieldCheck, ExternalLink, Globe } from 'lucide-react';
import { format } from 'date-fns';

export default function SupplierBidsPage() {
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBids();
  }, []);

  const fetchBids = async () => {
    try {
      let activeSupplierId = 'e1a04187-613e-460a-b33f-db77cadefcd9'; // Default Karma Construction fallback
      try {
        const savedRecord = localStorage.getItem('bgps_role_record');
        if (savedRecord) {
          const recordObj = JSON.parse(savedRecord);
          if (recordObj && recordObj.id) {
            activeSupplierId = recordObj.id;
          }
        }
      } catch (e) {
        console.warn('Failed to parse bgps_role_record, using default.', e);
      }

      const res = await fetch(`/api/supplier/bids?supplierId=${activeSupplierId}`);
      const data = await res.json();
      setBids(data);
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
          <h1 className="text-2xl font-black text-gray-900">My Submissions</h1>
          <p className="text-gray-500">Track all your bid proposals and their blockchain confirmation status.</p>
        </div>
      </div>

      <div className="card !p-0 overflow-hidden">
        {loading ? (
          <div className="p-20 text-center text-gray-400">Loading submissions...</div>
        ) : bids.length > 0 ? (
          <table className="w-full text-left">
            <thead>
              <tr className="text-[10px] font-black text-gray-400 uppercase tracking-widest bg-gray-50/50">
                <th className="px-6 py-4">Tender Title</th>
                <th className="px-6 py-4">Bid Amount</th>
                <th className="px-6 py-4">Submitted At</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Proof</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {bids.map((bid) => (
                <tr key={bid.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <p className="text-sm font-bold text-gray-900">{bid.tenders?.title}</p>
                    <p className="text-[10px] text-gray-400 font-mono">BID-ID: {bid.id.slice(0, 8)}</p>
                  </td>
                  <td className="px-6 py-4 text-sm font-black text-gray-900">
                    Nu. {bid.bid_amount.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-xs text-gray-500">
                    {format(new Date(bid.submitted_at), 'MMM dd, yyyy HH:mm')}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-[10px] font-black uppercase ${
                      bid.status === 'winner' ? 'bg-emerald-100 text-emerald-600' :
                      bid.status === 'on_chain_confirmed' ? 'bg-indigo-100 text-indigo-600' :
                      'bg-gray-100 text-gray-600'
                    }`}>
                      {bid.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <a 
                      href={`https://sepolia.etherscan.io/tx/${bid.blockchain_tx_hash}`}
                      target="_blank"
                      className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all inline-block"
                    >
                      <Globe size={16} />
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="p-20 text-center">
            <Send size={48} className="mx-auto text-gray-200 mb-4" />
            <p className="text-gray-500 font-medium">You haven't submitted any bids yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
