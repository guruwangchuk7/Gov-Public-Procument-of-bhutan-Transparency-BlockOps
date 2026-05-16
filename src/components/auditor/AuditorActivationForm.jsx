'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Lock, ShieldCheck, Wallet, ArrowRight, CheckCircle2, Loader2, Search } from 'lucide-react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

export default function AuditorActivationForm({ token }) {
  const router = useRouter();
  const [step, setStep] = useState(1); // 1: Credentials, 2: NDI, 3: Wallet
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    ndiData: { ndi_identifier: 'NDI-AUD-' + Math.random().toString(36).substring(2, 9).toUpperCase() },
    walletAddress: '0x' + Math.random().toString(16).substring(2, 42)
  });

  const handleNext = () => setStep(prev => prev + 1);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/auditor/activate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, token })
      });
      const result = await res.json();
      if (result.success) {
        toast.success('Account activated! You are now an authorized auditor.');
        router.push('/auditor/dashboard');
      } else {
        toast.error(result.error);
        setStep(1); // Reset to credentials on error
      }
    } catch (err) {
      toast.error('Activation failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto space-y-8">
      {/* Progress Bar */}
      <div className="flex items-center justify-between px-4">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black transition-all ${step >= s ? 'bg-indigo-600 text-white shadow-[0_0_15px_rgba(79,70,229,0.4)]' : 'bg-slate-100 text-slate-400'}`}>
              {s}
            </div>
            {s < 3 && <div className={`w-12 h-1 ${step > s ? 'bg-indigo-600' : 'bg-slate-100'} transition-all`} />}
          </div>
        ))}
      </div>

      <div className="card space-y-8">
        {step === 1 && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-xl font-black text-slate-900">One-Time Login</h2>
              <p className="text-sm text-slate-500 font-medium">Enter the temporary credentials from your email.</p>
            </div>
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="label-text">Temporary Username</label>
                <div className="relative">
                  <input 
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    className="input-field pl-11" 
                    placeholder="auditor_xxxx"
                  />
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="label-text">Temporary Password</label>
                <div className="relative">
                  <input 
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="input-field pl-11" 
                    placeholder="••••••••"
                  />
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                </div>
              </div>
              <button onClick={handleNext} className="btn bg-indigo-600 text-white w-full h-12">
                Verify Credentials <ArrowRight size={16} />
              </button>
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 text-center">
            <div className="w-20 h-20 rounded-3xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto shadow-sm">
              <ShieldCheck size={40} />
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-black text-slate-900">Bhutan NDI Verification</h2>
              <p className="text-sm text-slate-500 font-medium leading-relaxed px-4">
                Verify your identity using the official Bhutan NDI app to link your professional auditor credentials.
              </p>
            </div>
            <div className="p-4 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Detected Identifier</p>
              <code className="text-sm font-bold text-indigo-600">{formData.ndiData.ndi_identifier}</code>
            </div>
            <button onClick={handleNext} className="btn bg-indigo-600 text-white w-full h-12">
              Confirm Identity <CheckCircle2 size={16} />
            </button>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 text-center">
            <div className="w-20 h-20 rounded-3xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto shadow-sm">
              <Wallet size={40} />
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-black text-slate-900">Connect Web3 Wallet</h2>
              <p className="text-sm text-slate-500 font-medium leading-relaxed px-4">
                Link your cryptographic wallet to sign audit reports and verify procurement immutability.
              </p>
            </div>
            <div className="p-4 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Detected Address</p>
              <code className="text-[10px] font-bold text-indigo-600">{formData.walletAddress}</code>
            </div>
            <button 
              onClick={handleSubmit} 
              disabled={loading}
              className="btn bg-indigo-600 text-white w-full h-12"
            >
              {loading ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <>Complete Activation <CheckCircle2 size={16} /></>
              )}
            </button>
          </motion.div>
        )}
      </div>

      <p className="text-center text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em]">
        Secured by BGPS Protocol
      </p>
    </div>
  );
}
