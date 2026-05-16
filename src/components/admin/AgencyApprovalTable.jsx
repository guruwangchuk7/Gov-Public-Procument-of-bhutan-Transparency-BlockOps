'use client';
import { useState } from 'react';
import { Check, X, Eye, ShieldCheck, Loader2 } from 'lucide-react';

export default function AgencyApprovalTable({ agencies, onApprove, onReject }) {
  const [processingId, setProcessingId] = useState(null);

  const handleApprove = async (agency) => {
    setProcessingId(agency.id);
    await onApprove(agency);
    setProcessingId(null);
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-separate border-spacing-y-2">
        <thead>
          <tr className="text-gray-400 text-xs uppercase font-bold tracking-wider">
            <th className="px-6 py-3">Agency Name</th>
            <th className="px-6 py-3">Registration #</th>
            <th className="px-6 py-3">Wallet Address</th>
            <th className="px-6 py-3">NDI Status</th>
            <th className="px-6 py-3">Status</th>
            <th className="px-6 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="space-y-4">
          {agencies.map((agency) => (
            <tr key={agency.id} className="bg-white hover:bg-primary-50/30 transition-colors">
              <td className="px-6 py-4 rounded-l-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary-50 flex items-center justify-center text-primary font-bold">
                    {agency.agency_name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">{agency.agency_name}</p>
                    <p className="text-xs text-gray-500">{agency.email}</p>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 text-sm font-medium text-gray-700">
                {agency.registration_number}
              </td>
              <td className="px-6 py-4">
                <code className="text-[10px] bg-gray-100 px-2 py-1 rounded text-gray-600">
                  {agency.wallet_address ? `${agency.wallet_address.slice(0, 6)}...${agency.wallet_address.slice(-4)}` : 'No Wallet'}
                </code>
              </td>
              <td className="px-6 py-4">
                <span className="flex items-center gap-1.5 text-emerald-600 text-xs font-bold">
                  <ShieldCheck size={14} /> Verified
                </span>
              </td>
              <td className="px-6 py-4">
                <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${
                  agency.status === 'pending' ? 'bg-amber-100 text-amber-600' :
                  agency.status === 'approved' ? 'bg-emerald-100 text-emerald-600' :
                  'bg-red-100 text-red-600'
                }`}>
                  {agency.status}
                </span>
              </td>
              <td className="px-6 py-4 rounded-r-xl text-right">
                <div className="flex items-center justify-end gap-2">
                  <button className="p-2 text-gray-400 hover:text-primary transition-colors" title="View Documents">
                    <Eye size={18} />
                  </button>
                  {agency.status === 'pending' && (
                    <>
                      <button 
                        onClick={() => onReject(agency)}
                        className="p-2 text-gray-400 hover:text-red-500 transition-colors" 
                        title="Reject"
                      >
                        <X size={18} />
                      </button>
                      <button 
                        onClick={() => handleApprove(agency)}
                        disabled={processingId === agency.id}
                        className="p-2 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-100 transition-colors" 
                        title="Approve"
                      >
                        {processingId === agency.id ? (
                          <Loader2 size={18} className="animate-spin" />
                        ) : (
                          <Check size={18} />
                        )}
                      </button>
                    </>
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
