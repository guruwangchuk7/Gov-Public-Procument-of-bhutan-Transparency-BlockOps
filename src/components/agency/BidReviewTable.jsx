'use client';
import { useState } from 'react';
import { 
  User, 
  DollarSign, 
  FileText, 
  ShieldCheck, 
  Trophy, 
  Loader2,
  ExternalLink,
  CheckCircle2
} from 'lucide-react';

export default function BidReviewTable({ bids, onSelectWinner, tenderStatus }) {
  const [processingId, setProcessingId] = useState(null);

  const handleSelect = async (bid) => {
    setProcessingId(bid.id);
    await onSelectWinner(bid);
    setProcessingId(null);
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-separate border-spacing-y-2">
        <thead>
          <tr className="text-gray-400 text-xs uppercase font-bold tracking-wider">
            <th className="px-6 py-3">Supplier / Bidder</th>
            <th className="px-6 py-3">Bid Amount</th>
            <th className="px-6 py-3">Proof Status</th>
            <th className="px-6 py-3">Status</th>
            <th className="px-6 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="space-y-4">
          {bids.map((bid) => (
            <tr key={bid.id} className={`bg-white hover:bg-primary-50/30 transition-colors ${bid.status === 'winner' ? 'ring-2 ring-emerald-500 bg-emerald-50/20' : ''}`}>
              <td className="px-6 py-4 rounded-l-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-gray-500 font-bold">
                    <User size={20} />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">{bid.suppliers?.company_name}</p>
                    <p className="text-[10px] text-gray-400 font-mono">ID: {bid.id.slice(0, 8)}</p>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 text-sm font-black text-gray-900">
                Nu. {parseFloat(bid.bid_amount).toLocaleString()}
              </td>
              <td className="px-6 py-4">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-1.5 text-indigo-600 text-[10px] font-bold uppercase">
                    <ShieldCheck size={12} /> On-Chain Valid
                  </div>
                  <a 
                    href={`https://sepolia.etherscan.io/tx/${bid.blockchain_tx_hash}`} 
                    target="_blank"
                    className="text-[10px] text-gray-400 hover:text-indigo-600 flex items-center gap-1"
                  >
                    View TX <ExternalLink size={10} />
                  </a>
                </div>
              </td>
              <td className="px-6 py-4">
                <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${
                  bid.status === 'winner' ? 'bg-emerald-100 text-emerald-600' :
                  bid.status === 'on_chain_confirmed' ? 'bg-blue-100 text-blue-600' :
                  'bg-gray-100 text-gray-600'
                }`}>
                  {bid.status.replace('_', ' ')}
                </span>
              </td>
              <td className="px-6 py-4 rounded-r-xl text-right">
                <div className="flex items-center justify-end gap-2">
                  <button className="p-2 text-gray-400 hover:text-primary transition-colors" title="View Proposal">
                    <FileText size={18} />
                  </button>
                  {tenderStatus === 'closed' && bid.status !== 'winner' && (
                    <button 
                      onClick={() => handleSelect(bid)}
                      disabled={processingId === bid.id}
                      className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500 text-white rounded-lg text-xs font-bold hover:bg-emerald-600 transition-all shadow-md shadow-emerald-500/10"
                    >
                      {processingId === bid.id ? (
                        <Loader2 size={14} className="animate-spin" />
                      ) : (
                        <Trophy size={14} />
                      )}
                      Select Winner
                    </button>
                  )}
                  {bid.status === 'winner' && (
                    <div className="flex items-center gap-1 px-3 py-1.5 bg-emerald-50 text-emerald-600 rounded-lg text-xs font-bold border border-emerald-100">
                      <CheckCircle2 size={14} /> Awarded
                    </div>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
