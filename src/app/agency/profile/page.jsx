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

  if (loading) return <div className="p-20 text-center text-zinc-400 font-medium">Loading profile...</div>;

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-zinc-100 pb-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold text-zinc-900 tracking-tight">Agency Profile</h1>
          <p className="text-sm font-medium text-zinc-500">Official procurement department credentials and system permissions</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-600 rounded-lg text-xs font-bold uppercase tracking-wider border border-emerald-100 shadow-sm">
            <ShieldCheck size={16} /> Verified Agency
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Card */}
        <div className="lg:col-span-1 space-y-8">
          <div className="bg-white border border-zinc-200 rounded-2xl p-8 text-center space-y-6 shadow-sm">
            <div className="w-24 h-24 rounded-2xl bg-zinc-50 flex items-center justify-center text-zinc-900 mx-auto border border-zinc-100 shadow-sm">
              <Building2 size={40} />
            </div>
            <div className="space-y-1.5">
              <h2 className="text-xl font-bold text-zinc-900 leading-tight">{profile?.agency_name}</h2>
              <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Procuring Agency</p>
            </div>
          </div>

          <div className="bg-zinc-900 text-white rounded-2xl p-6 space-y-6 shadow-md">
            <div className="flex items-center gap-3 border-b border-zinc-800 pb-4">
              <div className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center text-zinc-300">
                <Globe size={16} />
              </div>
              <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-300">On-Chain Identity</h4>
            </div>
            
            <div className="space-y-5">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-zinc-400">
                  <Wallet size={14} />
                  <p className="text-[10px] font-bold uppercase tracking-widest">Wallet Address</p>
                </div>
                <code className="text-xs font-mono break-all text-zinc-100 block bg-zinc-800/50 p-3 rounded-xl border border-zinc-700">
                  {profile?.wallet_address}
                </code>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-zinc-400">
                  <Landmark size={14} />
                  <p className="text-[10px] font-bold uppercase tracking-widest">NDI Identifier</p>
                </div>
                <code className="text-xs font-mono text-zinc-500 block bg-zinc-800/50 p-3 rounded-xl border border-zinc-700 italic">
                  {profile?.ndi_identifier || 'NDI-PENDING-SYNC'}
                </code>
              </div>
            </div>
          </div>
        </div>

        {/* Details & Permissions */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white border border-zinc-200 rounded-2xl p-6 sm:p-8 space-y-8 shadow-sm">
            <div className="flex items-center gap-3 border-b border-zinc-100 pb-5">
              <div className="w-10 h-10 rounded-xl bg-zinc-50 flex items-center justify-center text-zinc-400 border border-zinc-100">
                <User size={20} />
              </div>
              <h3 className="text-lg font-bold text-zinc-900">General Information</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-12">
              <div className="space-y-2">
                <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Official Email</p>
                <div className="flex items-center gap-3 text-sm font-bold text-zinc-800">
                  <div className="w-8 h-8 rounded-lg bg-zinc-50 flex items-center justify-center text-zinc-400 border border-zinc-100">
                    <Mail size={16} />
                  </div>
                  {profile?.email}
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Phone Number</p>
                <div className="flex items-center gap-3 text-sm font-bold text-zinc-800">
                  <div className="w-8 h-8 rounded-lg bg-zinc-50 flex items-center justify-center text-zinc-400 border border-zinc-100">
                    <Phone size={16} />
                  </div>
                  {profile?.phone || 'Not provided'}
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Registration No.</p>
                <div className="flex items-center gap-3 text-sm font-bold text-zinc-800">
                  <div className="w-8 h-8 rounded-lg bg-zinc-50 flex items-center justify-center text-zinc-400 border border-zinc-100">
                    <Hash size={16} />
                  </div>
                  {profile?.registration_number}
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Authorized Since</p>
                <div className="flex items-center gap-3 text-sm font-bold text-zinc-800">
                  <div className="w-8 h-8 rounded-lg bg-zinc-50 flex items-center justify-center text-zinc-400 border border-zinc-100">
                    <Calendar size={16} />
                  </div>
                  {profile?.verified_at ? new Date(profile.verified_at).toLocaleDateString() : 'N/A'}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white border border-zinc-200 rounded-2xl p-6 sm:p-8 space-y-6 shadow-sm">
            <div className="flex items-center gap-3 border-b border-zinc-100 pb-5">
              <div className="w-10 h-10 rounded-xl bg-zinc-50 flex items-center justify-center text-zinc-400 border border-zinc-100">
                <ShieldAlert size={20} />
              </div>
              <h3 className="text-lg font-bold text-zinc-900">System Permissions</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { label: 'Create Tenders', active: true },
                { label: 'Review Bids', active: true },
                { label: 'Award Contracts', active: true },
                { label: 'Blockchain Sync', active: profile?.blockchain_authorized },
              ].map((perm, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-zinc-50/50 rounded-xl border border-zinc-200 hover:bg-white hover:border-zinc-300 hover:shadow-sm transition-all group">
                  <span className="text-xs font-bold text-zinc-600 group-hover:text-zinc-900 transition-colors">{perm.label}</span>
                  {perm.active ? (
                     <div className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-600 uppercase tracking-widest">
                       Active <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_#10b981]" />
                     </div>
                  ) : (
                     <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Restricted</span>
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
