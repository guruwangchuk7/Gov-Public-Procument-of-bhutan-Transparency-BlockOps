'use client';
import { useState, useEffect } from 'react';
import { Building2, Mail, Phone, ShieldCheck, Globe, User, Hash, Calendar, Wallet, Landmark, ShieldAlert } from 'lucide-react';

export default function AgencyProfilePage() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In real case, fetch from session
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await fetch('/api/agency/profile?id=agency-uuid');
      const data = await res.json();
      setProfile(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-20 text-center text-gray-400">Loading profile...</div>;

  return (
    <div className="max-w-5xl mx-auto space-y-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-100 pb-10">
        <div className="space-y-2">
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Agency Profile</h1>
          <p className="text-sm font-medium text-slate-500 italic">Official procurement department credentials and system permissions</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-600 rounded-2xl text-[10px] font-black uppercase border border-emerald-100 shadow-sm">
            <ShieldCheck size={14} /> Verified Agency
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Card */}
        <div className="lg:col-span-1 space-y-8">
          <div className="card text-center space-y-6">
            <div className="w-28 h-28 rounded-[2.5rem] bg-indigo-50 flex items-center justify-center text-indigo-600 mx-auto border-4 border-white shadow-2xl shadow-indigo-100">
              <Building2 size={48} />
            </div>
            <div className="space-y-1">
              <h2 className="text-xl font-black text-slate-900 leading-tight">{profile?.agency_name}</h2>
              <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em]">Procuring Agency</p>
            </div>
          </div>

          <div className="card bg-slate-900 text-white space-y-6 border-none shadow-2xl shadow-slate-200">
            <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
              <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center text-indigo-400">
                <Globe size={16} />
              </div>
              <h4 className="text-xs font-black uppercase tracking-widest">On-Chain Identity</h4>
            </div>
            
            <div className="space-y-5">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-slate-500">
                  <Wallet size={12} />
                  <p className="text-[10px] font-black uppercase tracking-widest">Wallet Address</p>
                </div>
                <code className="text-[10px] font-mono break-all text-indigo-300 block bg-slate-800/50 p-3 rounded-xl border border-slate-700">
                  {profile?.wallet_address}
                </code>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-slate-500">
                  <Landmark size={12} />
                  <p className="text-[10px] font-black uppercase tracking-widest">NDI Identifier</p>
                </div>
                <code className="text-[10px] font-mono text-slate-400 block bg-slate-800/50 p-3 rounded-xl border border-slate-700 italic">
                  {profile?.ndi_identifier || 'NDI-PENDING-SYNC'}
                </code>
              </div>
            </div>
          </div>
        </div>

        {/* Details & Permissions */}
        <div className="lg:col-span-2 space-y-8">
          <div className="card space-y-8">
            <div className="flex items-center gap-3 border-b border-slate-50 pb-6">
              <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400">
                <User size={20} />
              </div>
              <h3 className="text-lg font-black text-slate-900">General Information</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-10 gap-x-12">
              <div className="space-y-2">
                <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Official Email</p>
                <div className="flex items-center gap-3 text-sm font-bold text-slate-700">
                  <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-300">
                    <Mail size={16} />
                  </div>
                  {profile?.email}
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Phone Number</p>
                <div className="flex items-center gap-3 text-sm font-bold text-slate-700">
                  <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-300">
                    <Phone size={16} />
                  </div>
                  {profile?.phone || 'Not provided'}
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Registration No.</p>
                <div className="flex items-center gap-3 text-sm font-bold text-slate-700">
                  <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-300">
                    <Hash size={16} />
                  </div>
                  {profile?.registration_number}
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Authorized Since</p>
                <div className="flex items-center gap-3 text-sm font-bold text-slate-700">
                  <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-300">
                    <Calendar size={16} />
                  </div>
                  {profile?.verified_at ? new Date(profile.verified_at).toLocaleDateString() : 'N/A'}
                </div>
              </div>
            </div>
          </div>

          <div className="card space-y-6">
            <div className="flex items-center gap-3 border-b border-slate-50 pb-6">
              <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400">
                <ShieldAlert size={20} />
              </div>
              <h3 className="text-lg font-black text-slate-900">System Permissions</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { label: 'Create Tenders', active: true },
                { label: 'Review Bids', active: true },
                { label: 'Award Contracts', active: true },
                { label: 'Blockchain Sync', active: profile?.blockchain_authorized },
              ].map((perm, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-slate-50/50 rounded-2xl border border-slate-100 hover:bg-white hover:shadow-sm transition-all group">
                  <span className="text-xs font-bold text-slate-600 group-hover:text-slate-900 transition-colors">{perm.label}</span>
                  {perm.active ? (
                    <div className="flex items-center gap-1.5 text-[9px] font-black text-emerald-600 uppercase tracking-widest">
                      Active <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_#10b981]" />
                    </div>
                  ) : (
                    <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Restricted</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
