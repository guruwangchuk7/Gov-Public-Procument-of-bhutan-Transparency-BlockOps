'use client';
import { useState, useEffect } from 'react';
import { ShieldCheck, UserPlus, Mail, Search, Filter, Loader2, CheckCircle2 } from 'lucide-react';

export default function AuditorManagementPage() {
  const [auditors, setAuditors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [inviting, setInviting] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '' });

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

  const handleInvite = async (e) => {
    e.preventDefault();
    setInviting(true);
    try {
      const res = await fetch('/api/admin/invite-auditor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        alert('Invitation sent successfully!');
        setFormData({ name: '', email: '' });
        fetchAuditors();
      }
    } catch (err) {
      alert('Failed to send invitation');
    } finally {
      setInviting(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Auditor Management</h1>
          <p className="text-gray-500">Invite and manage independent auditors for the platform.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Invitation Form */}
        <div className="lg:col-span-1">
          <div className="card sticky top-8">
            <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
              <UserPlus className="text-primary" size={20} />
              Invite New Auditor
            </h3>
            <form onSubmit={handleInvite} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Full Name</label>
                <input
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                  placeholder="e.g. Karma Dorji"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    required
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                    placeholder="auditor@domain.bt"
                  />
                </div>
              </div>
              <button
                disabled={inviting}
                className="btn-primary w-full py-4 font-bold flex items-center justify-center gap-2"
              >
                {inviting ? <Loader2 className="animate-spin" size={20} /> : 'Send Activation Link'}
              </button>
            </form>
          </div>
        </div>

        {/* Auditor List */}
        <div className="lg:col-span-2">
          <div className="card !p-0 overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-bold text-gray-900">Registered Auditors</h3>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                  <input 
                    type="text" 
                    placeholder="Search..." 
                    className="pl-8 pr-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              {loading ? (
                <div className="p-20 text-center text-gray-400">Loading auditors...</div>
              ) : auditors.length > 0 ? (
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-[10px] font-black text-gray-400 uppercase tracking-widest bg-gray-50/50">
                      <th className="px-6 py-4">Auditor Name</th>
                      <th className="px-6 py-4">Email</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {auditors.map((auditor) => (
                      <tr key={auditor.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-primary-50 flex items-center justify-center text-primary font-bold text-xs uppercase">
                              {auditor.full_name?.charAt(0)}
                            </div>
                            <span className="text-sm font-bold text-gray-900">{auditor.full_name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">{auditor.email}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded-full text-[10px] font-black uppercase ${
                            auditor.is_active ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'
                          }`}>
                            {auditor.is_active ? 'Active' : 'Pending'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button className="text-xs font-bold text-gray-400 hover:text-red-500 transition-colors">Deactivate</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="p-20 text-center">
                  <ShieldCheck size={48} className="mx-auto text-gray-200 mb-4" />
                  <p className="text-gray-500 font-medium text-sm">No auditors invited yet.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
