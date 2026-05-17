'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, UserPlus, Mail, ShieldCheck, Send, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function AddAuditorForm({ onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/admin/invite-auditor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const result = await res.json();
      if (result.success) {
        toast.success('Auditor invitation sent successfully!');
        setFormData({ name: '', email: '' });
        if (onSuccess) onSuccess();
      } else {
        toast.error(result.error);
      }
    } catch (err) {
      toast.error('Failed to send invitation');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white border border-zinc-200 rounded-2xl shadow-sm p-6 space-y-6">
      <div className="flex items-center gap-3 text-zinc-900">
        <UserPlus size={20} className="text-emerald-600" />
        <h3 className="text-sm font-black text-zinc-900 uppercase tracking-tight">Onboard System Auditor</h3>
      </div>
      
      <p className="text-xs text-zinc-500 font-medium leading-relaxed">
        Invitations generate one-time credentials. Auditors must verify their identity via 
        <span className="text-emerald-600 font-bold"> Bhutan NDI</span> during first login.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <label className="label-text text-zinc-700 font-bold text-xs uppercase tracking-wider">Full Name</label>
          <div className="relative">
            <input 
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Tenzin Wangchuk" 
              className="w-full pl-11 pr-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-900 outline-none transition-all text-sm" 
              required 
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="label-text text-zinc-700 font-bold text-xs uppercase tracking-wider">Official Email</label>
          <div className="relative">
            <input 
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="auditor@raa.gov.bt" 
              className="w-full pl-11 pr-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-900 outline-none transition-all text-sm" 
              required 
            />
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
          </div>
        </div>

        <button 
          disabled={loading}
          className="btn-primary rounded-xl w-full h-12 flex items-center justify-center gap-2 mt-6 shadow-md shadow-zinc-200 transition-all hover:-translate-y-0.5"
        >
          {loading ? (
            <Loader2 size={18} className="animate-spin" />
          ) : (
            <>Send Secure Invitation <Send size={16} /></>
          )}
        </button>
      </form>

      <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100 flex items-center gap-3">
        <ShieldCheck size={14} className="text-emerald-600" />
        <span className="text-[10px] text-emerald-700 font-bold uppercase tracking-tight">Identity Enforcement Active</span>
      </div>
    </div>
  );
}
