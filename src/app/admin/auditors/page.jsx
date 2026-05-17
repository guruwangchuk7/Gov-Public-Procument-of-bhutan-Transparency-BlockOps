'use client';
import { useState, useEffect } from 'react';
import { ShieldCheck, UserPlus, Mail, Search, Filter, Loader2, CheckCircle2 } from 'lucide-react';
import AddAuditorForm from '@/components/admin/AddAuditorForm';

export default function AuditorManagementPage() {
  const [auditors, setAuditors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAuditors();
  }, []);

  const fetchAuditors = async () => {
    try {
      const res = await fetch('/api/admin/auditors');
      const data = await res.json();
      setAuditors(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900 tracking-tight">Auditor Management</h1>
          <p className="text-zinc-500 mt-1">Invite and manage independent auditors for the platform.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Invitation Form */}
        <div className="lg:col-span-1">
          <div className="sticky top-8">
            <AddAuditorForm onSuccess={fetchAuditors} />
          </div>
        </div>

        {/* Auditor List */}
        <div className="lg:col-span-2">
          <div className="card !p-0 overflow-hidden bg-white border-zinc-200 shadow-sm">
            <div className="p-6 border-b border-zinc-100 flex items-center justify-between bg-white">
              <h3 className="font-bold text-zinc-900">Registered Auditors</h3>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={14} />
                  <input 
                    type="text" 
                    placeholder="Search auditors..." 
                    className="pl-9 pr-4 py-2 bg-zinc-50 border border-zinc-200 rounded-lg text-xs outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-900 transition-all w-48"
                  />
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              {loading ? (
                <div className="p-20 flex flex-col items-center justify-center text-zinc-400 space-y-4">
                  <Loader2 size={32} className="animate-spin text-zinc-300" />
                  <p className="text-sm font-medium">Loading auditors...</p>
                </div>
              ) : auditors.length > 0 ? (
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest bg-zinc-50/80 border-b border-zinc-100">
                      <th className="px-6 py-4">Auditor Name</th>
                      <th className="px-6 py-4">Email</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100">
                    {auditors.map((auditor) => (
                      <tr key={auditor.id} className="hover:bg-zinc-50/50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-zinc-100 border border-zinc-200 flex items-center justify-center text-zinc-900 font-bold text-xs uppercase shadow-sm">
                              {auditor.full_name?.charAt(0)}
                            </div>
                            <span className="text-sm font-bold text-zinc-900">{auditor.full_name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-zinc-500 font-medium">{auditor.email}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border ${
                            auditor.is_active 
                              ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
                              : 'bg-amber-50 text-amber-600 border-amber-100'
                          }`}>
                            {auditor.is_active ? 'Active' : 'Pending'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button className="text-xs font-bold text-zinc-400 hover:text-red-500 transition-colors bg-white border border-zinc-200 hover:border-red-200 px-3 py-1.5 rounded-md shadow-sm">
                            Deactivate
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="p-20 text-center">
                  <ShieldCheck size={48} className="mx-auto text-zinc-200 mb-4" />
                  <p className="text-zinc-500 font-medium text-sm">No auditors invited yet.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
