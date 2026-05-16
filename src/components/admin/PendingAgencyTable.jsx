'use client';
import { useState, useEffect } from 'react';
import { Landmark, Check, X, ShieldCheck, ExternalLink, Clock, UserCheck } from 'lucide-react';
import { toast } from 'sonner';
import { createClient } from '@/lib/supabase/client';

export default function PendingAgencyTable() {
  const [agencies, setAgencies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAgencies();
  }, []);

  const fetchAgencies = async () => {
    try {
      const res = await fetch('/api/admin/agencies');
      const result = await res.json();
      if (result.success) setAgencies(result.data);
    } catch (err) {
      toast.error('Failed to fetch agencies');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (agencyId) => {
    try {
      const { data: { user } } = await createClient().auth.getUser();
      const res = await fetch('/api/admin/approve-agency', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ agencyId, adminId: user?.id })
      });
      const result = await res.json();
      if (result.success) {
        toast.success('Agency approved administratively!');
        fetchAgencies();
      } else {
        toast.error(result.error);
      }
    } catch (err) {
      toast.error('Approval failed');
    }
  };

  if (loading) return <div className="p-12 text-center text-slate-400 font-bold animate-pulse uppercase tracking-widest text-xs">Loading pending requests...</div>;

  return (
    <div className="card overflow-hidden p-0 border-slate-100 shadow-xl">
      <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
        <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight">Pending Agency Registrations</h3>
        <span className="badge bg-primary/10 text-primary">{agencies.length} Requests</span>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50/50">
              <th className="px-6 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">Agency Name</th>
              <th className="px-6 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">NDI / Wallet</th>
              <th className="px-6 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">Reg No.</th>
              <th className="px-6 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {agencies.length === 0 && (
              <tr>
                <td colSpan="4" className="px-6 py-12 text-center text-slate-400 italic text-sm">No pending registrations found.</td>
              </tr>
            )}
            {agencies.map((agency) => (
              <tr key={agency.id} className="hover:bg-slate-50/50 transition-colors group">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                      <Landmark size={14} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">{agency.agency_name}</p>
                      <p className="text-[10px] text-slate-400 font-medium italic">{agency.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500">
                      <ShieldCheck size={10} className="text-emerald-500" />
                      <code>{agency.ndi_identifier.slice(0, 12)}...</code>
                    </div>
                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500">
                      <Clock size={10} className="text-amber-500" />
                      <code>{agency.wallet_address.slice(0, 12)}...</code>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-[10px] font-black text-slate-600 px-2 py-1 bg-slate-100 rounded-md">
                    {agency.registration_number}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => handleApprove(agency.id)}
                      className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-500 hover:text-white transition-all flex items-center justify-center"
                      title="Approve Agency"
                    >
                      <Check size={16} />
                    </button>
                    <button 
                      className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-500 hover:text-white transition-all flex items-center justify-center"
                      title="Reject Agency"
                    >
                      <X size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
