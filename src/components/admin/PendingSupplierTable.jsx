'use client';
import { useState, useEffect } from 'react';
import { Building2, Check, X, ShieldCheck, Clock } from 'lucide-react';
import { toast } from 'sonner';
import { createClient } from '@/lib/supabase/client';

export default function PendingSupplierTable() {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    try {
      const res = await fetch('/api/admin/suppliers');
      const result = await res.json();
      if (result.success) setSuppliers(result.data);
    } catch (err) {
      toast.error('Failed to fetch suppliers');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (supplierId) => {
    try {
      const { data: { user } } = await createClient().auth.getUser();
      const res = await fetch('/api/admin/approve-supplier', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ supplierId, adminId: user?.id })
      });
      const result = await res.json();
      if (result.success) {
        toast.success('Supplier approved administratively!');
        fetchSuppliers();
      } else {
        toast.error(result.error);
      }
    } catch (err) {
      toast.error('Approval failed');
    }
  };

  if (loading) return null;

  return (
    <div className="card overflow-hidden p-0 border-slate-100 shadow-xl">
      <div className="px-6 py-4 bg-emerald-50/50 border-b border-emerald-100 flex items-center justify-between">
        <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight">Pending Supplier Registrations</h3>
        <span className="badge bg-emerald-500/10 text-emerald-600">{suppliers.length} Requests</span>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50/50">
              <th className="px-6 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">Company Name</th>
              <th className="px-6 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">NDI / Wallet</th>
              <th className="px-6 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {suppliers.length === 0 && (
              <tr>
                <td colSpan="3" className="px-6 py-12 text-center text-slate-400 italic text-sm">No pending supplier registrations.</td>
              </tr>
            )}
            {suppliers.map((supplier) => (
              <tr key={supplier.id} className="hover:bg-emerald-50/20 transition-colors group">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                      <Building2 size={14} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">{supplier.company_name}</p>
                      <p className="text-[10px] text-slate-400 font-medium">{supplier.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500">
                      <ShieldCheck size={10} className="text-emerald-500" />
                      <code>{supplier.ndi_identifier.slice(0, 12)}...</code>
                    </div>
                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500">
                      <Clock size={10} className="text-amber-500" />
                      <code>{supplier.wallet_address.slice(0, 12)}...</code>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => handleApprove(supplier.id)}
                      className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-500 hover:text-white transition-all flex items-center justify-center"
                    >
                      <Check size={16} />
                    </button>
                    <button className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-500 hover:text-white transition-all flex items-center justify-center">
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
