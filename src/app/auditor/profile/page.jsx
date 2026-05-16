'use client';
import { motion } from 'framer-motion';
import { User, Mail, ShieldCheck, Wallet, Landmark, Key, ShieldAlert, CheckCircle2 } from 'lucide-react';

export default function AuditorProfilePage() {
  const profile = {
    name: 'Guru Wangchuk',
    email: 'guruwangchuk1234@gmail.com',
    role: 'Senior System Auditor',
    ndi: 'NDI-AUD-7492-BX',
    wallet: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F',
    joined: 'May 16, 2026'
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12">
      <div className="flex items-center gap-8">
        <div className="w-32 h-32 rounded-3xl bg-indigo-600 flex items-center justify-center text-white text-5xl font-black shadow-2xl shadow-indigo-200">
          {profile.name.charAt(0)}
        </div>
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">{profile.name}</h1>
            <span className="badge bg-indigo-50 text-indigo-600 border border-indigo-100">
              <ShieldCheck size={12} /> Verified Auditor
            </span>
          </div>
          <p className="text-lg font-medium text-slate-500 italic">{profile.role}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="card space-y-8">
          <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest border-b border-slate-100 pb-4">Cryptographic Identity</h3>
          
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400">
                <Landmark size={20} />
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Bhutan NDI Identifier</p>
                <p className="text-sm font-bold text-slate-900">{profile.ndi}</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400">
                <Wallet size={20} />
              </div>
              <div className="flex-1">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Web3 Wallet Address</p>
                <p className="text-[10px] font-bold text-indigo-600 font-mono break-all">{profile.wallet}</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400">
                <Mail size={20} />
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Professional Email</p>
                <p className="text-sm font-bold text-slate-900">{profile.email}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="card space-y-6 bg-slate-900 text-white">
            <h3 className="text-sm font-black uppercase tracking-widest border-b border-slate-700 pb-4">Security Status</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Key size={14} className="text-indigo-400" />
                  <span className="text-xs font-bold">Two-Factor Auth</span>
                </div>
                <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Enabled</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShieldAlert size={14} className="text-indigo-400" />
                  <span className="text-xs font-bold">Session Security</span>
                </div>
                <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Secure</span>
              </div>
            </div>
            <button className="btn bg-white/10 hover:bg-white/20 text-white w-full border-none">
              Manage Security Keys
            </button>
          </div>

          <div className="card border-emerald-100 bg-emerald-50/30 flex items-center gap-4">
            <CheckCircle2 className="text-emerald-500" size={24} />
            <div>
              <h4 className="text-xs font-black text-slate-900 uppercase tracking-tight">Active Duty</h4>
              <p className="text-[10px] text-slate-500 font-medium leading-relaxed">
                You are currently authorized to verify high-value procurement tenders.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
