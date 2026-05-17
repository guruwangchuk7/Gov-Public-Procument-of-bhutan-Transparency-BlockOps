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
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center gap-6 border-b border-zinc-100 pb-6">
        <div className="w-24 h-24 rounded-2xl bg-zinc-900 flex items-center justify-center text-white text-4xl font-bold shadow-md">
          {profile.name.charAt(0)}
        </div>
        <div className="space-y-1.5 flex-1">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-3xl font-bold text-zinc-900 tracking-tight">{profile.name}</h1>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-600 rounded-lg text-xs font-bold uppercase tracking-wider border border-emerald-100 shadow-sm">
              <ShieldCheck size={16} /> Verified Auditor
            </div>
          </div>
          <p className="text-sm font-medium text-zinc-500">{profile.role} &bull; Joined {profile.joined}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white border border-zinc-200 rounded-2xl p-6 sm:p-8 space-y-8 shadow-sm">
          <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-widest border-b border-zinc-100 pb-4">Cryptographic Identity</h3>
          
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-zinc-50 flex items-center justify-center text-zinc-400 border border-zinc-100">
                <Landmark size={20} />
              </div>
              <div>
                <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Bhutan NDI Identifier</p>
                <p className="text-sm font-bold text-zinc-900">{profile.ndi}</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-zinc-50 flex items-center justify-center text-zinc-400 border border-zinc-100">
                <Wallet size={20} />
              </div>
              <div className="flex-1">
                <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Web3 Wallet Address</p>
                <p className="text-xs font-bold text-indigo-600 font-mono break-all">{profile.wallet}</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-zinc-50 flex items-center justify-center text-zinc-400 border border-zinc-100">
                <Mail size={20} />
              </div>
              <div>
                <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Professional Email</p>
                <p className="text-sm font-bold text-zinc-900">{profile.email}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-zinc-900 text-white rounded-2xl p-6 sm:p-8 space-y-6 shadow-md">
            <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-100 border-b border-zinc-800 pb-4">Security Status</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Key size={16} className="text-zinc-400" />
                  <span className="text-sm font-bold text-zinc-100">Two-Factor Auth</span>
                </div>
                <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">Enabled</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShieldAlert size={16} className="text-zinc-400" />
                  <span className="text-sm font-bold text-zinc-100">Session Security</span>
                </div>
                <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">Secure</span>
              </div>
            </div>
            <button className="w-full py-2.5 bg-zinc-800 hover:bg-zinc-700 text-sm font-bold text-white rounded-lg transition-colors border border-zinc-700">
              Manage Security Keys
            </button>
          </div>

          <div className="bg-emerald-50/50 border border-emerald-100 rounded-2xl p-6 flex items-start sm:items-center gap-4">
            <CheckCircle2 className="text-emerald-500 shrink-0" size={24} />
            <div>
              <h4 className="text-sm font-bold text-zinc-900 tracking-tight">Active Duty</h4>
              <p className="text-xs text-zinc-600 font-medium leading-relaxed mt-0.5">
                You are currently authorized to verify high-value procurement tenders.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
