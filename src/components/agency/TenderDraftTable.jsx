'use client';
import { useState } from 'react';
import { 
  FileText, 
  Globe, 
  ExternalLink, 
  Clock, 
  MoreVertical, 
  Loader2,
  CheckCircle2
} from 'lucide-react';
import { format } from 'date-fns';

export default function TenderDraftTable({ tenders, onPublish }) {
  const [publishingId, setPublishingId] = useState(null);

  const handlePublish = async (tender) => {
    setPublishingId(tender.id);
    await onPublish(tender);
    setPublishingId(null);
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-separate border-spacing-y-2">
        <thead>
          <tr className="text-gray-400 text-xs uppercase font-bold tracking-wider">
            <th className="px-6 py-3">Tender Details</th>
            <th className="px-6 py-3">Estimated Amount</th>
            <th className="px-6 py-3">Deadline</th>
            <th className="px-6 py-3">Proof Status</th>
            <th className="px-6 py-3">Status</th>
            <th className="px-6 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="space-y-4">
          {tenders.map((tender) => (
            <tr key={tender.id} className="bg-white hover:bg-primary-50/30 transition-colors">
              <td className="px-6 py-4 rounded-l-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary-50 flex items-center justify-center text-primary font-bold">
                    <FileText size={20} />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">{tender.title}</p>
                    <p className="text-[10px] text-gray-400 font-mono">ID: {tender.id.slice(0, 8)}</p>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 text-sm font-bold text-gray-700">
                Nu. {parseFloat(tender.estimated_amount).toLocaleString()}
              </td>
              <td className="px-6 py-4">
                <div className="flex flex-col">
                  <span className="text-sm text-gray-800">{format(new Date(tender.submission_deadline), 'MMM dd, yyyy')}</span>
                  <span className="text-[10px] text-gray-400">{format(new Date(tender.submission_deadline), 'hh:mm a')}</span>
                </div>
              </td>
              <td className="px-6 py-4">
                {tender.blockchain_tx_hash ? (
                  <div className="flex items-center gap-1.5 text-indigo-600 text-[10px] font-bold uppercase">
                    <CheckCircle2 size={12} /> On-Chain
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 text-amber-500 text-[10px] font-bold uppercase">
                    <Clock size={12} /> Local Only
                  </div>
                )}
              </td>
              <td className="px-6 py-4">
                <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${
                  tender.status === 'draft' ? 'bg-gray-100 text-gray-600' :
                  tender.status === 'published' ? 'bg-emerald-100 text-emerald-600' :
                  'bg-indigo-100 text-indigo-600'
                }`}>
                  {tender.status}
                </span>
              </td>
              <td className="px-6 py-4 rounded-r-xl text-right">
                <div className="flex items-center justify-end gap-2">
                  {tender.status === 'draft' && (
                    <button 
                      onClick={() => handlePublish(tender)}
                      disabled={publishingId === tender.id}
                      className="flex items-center gap-2 px-3 py-1.5 bg-primary text-white rounded-lg text-xs font-bold hover:bg-opacity-90 transition-all disabled:opacity-50"
                    >
                      {publishingId === tender.id ? (
                        <Loader2 size={14} className="animate-spin" />
                      ) : (
                        <Globe size={14} />
                      )}
                      Publish to Chain
                    </button>
                  )}
                  {tender.blockchain_tx_hash && (
                    <a 
                      href={`https://sepolia.etherscan.io/tx/${tender.blockchain_tx_hash}`} 
                      target="_blank" 
                      className="p-2 text-gray-400 hover:text-indigo-600 transition-colors"
                    >
                      <ExternalLink size={18} />
                    </a>
                  )}
                  <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                    <MoreVertical size={18} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
