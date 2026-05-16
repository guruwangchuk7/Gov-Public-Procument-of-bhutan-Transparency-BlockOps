'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, UserPlus, Mail, ShieldCheck, Send, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function AddAuditorForm() {
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
    <div className="card space-y-6">
      <div className="flex items-center gap-3 text-indigo-500">
        <UserPlus size={20} />
        <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight">Onboard System Auditor</h3>
      </div>
      
      <p className="text-xs text-slate-500 font-medium leading-relaxed">
        Invitations generate one-time credentials. Auditors must verify their identity via 
        <span className="text-indigo-600 font-bold"> Bhutan NDI</span> during first login.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <label className="label-text">Full Name</label>
          <div className="relative">
            <input 
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Tenzin Wangchuk" 
              className="input-field pl-11" 
              required 
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="label-text">Official Email</label>
          <div className="relative">
            <input 
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="auditor@raa.gov.bt" 
              className="input-field pl-11" 
              required 
            />
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          </div>
        </div>

        <button 
          disabled={loading}
          className="btn bg-indigo-600 text-white hover:bg-indigo-700 w-full h-12"
        >
          {loading ? (
            <Loader2 size={18} className="animate-spin" />
          ) : (
            <>Send Secure Invitation <Send size={16} /></>
          )}
        </button>
      </form>

      <div className="p-3 bg-indigo-50 rounded-xl border border-indigo-100 flex items-center gap-3">
        <ShieldCheck size={14} className="text-indigo-500" />
        <span className="text-[10px] text-indigo-700 font-bold uppercase tracking-tight">Identity Enforcement Active</span>
      </div>
    </div>
  );
}
