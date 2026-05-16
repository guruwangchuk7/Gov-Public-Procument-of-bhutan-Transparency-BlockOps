'use client';
import { useState, useEffect } from 'react';
import { Building2, Mail, Phone, ShieldCheck, Globe, User, Hash, Lock } from 'lucide-react';

export default function SupplierSettingsPage() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await fetch('/api/supplier/profile?id=supplier-uuid');
      const data = await res.json();
      setProfile(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-20 text-center text-gray-400">Loading settings...</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-black text-gray-900">Supplier Settings</h1>
        <div className="flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase">
          <ShieldCheck size={12} /> Authorized Bidder
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Profile Sidebar */}
        <div className="md:col-span-1 space-y-6">
          <div className="card text-center">
            <div className="w-24 h-24 rounded-3xl bg-emerald-50 flex items-center justify-center text-emerald-500 mx-auto mb-4 border-4 border-white shadow-lg">
              <Building2 size={40} />
            </div>
            <h2 className="text-lg font-black text-gray-900">{profile?.company_name}</h2>
            <p className="text-xs text-gray-500 font-medium uppercase tracking-widest mt-1">Verified Supplier</p>
          </div>

          <div className="card bg-gray-900 text-white space-y-4">
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
              <Lock size={14} className="text-emerald-400" />
              Crypto Identity
            </h4>
            <div className="space-y-3">
              <div>
                <p className="text-[10px] text-gray-500 font-bold uppercase">Authorized Wallet</p>
                <code className="text-[10px] font-mono break-all text-emerald-300">{profile?.wallet_address}</code>
              </div>
            </div>
          </div>
        </div>

        {/* Settings Content */}
        <div className="md:col-span-2 space-y-6">
          <div className="card space-y-6">
            <h3 className="font-bold text-gray-900 border-b border-gray-50 pb-4">Business Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <p className="text-[10px] text-gray-400 font-bold uppercase">Contact Email</p>
                <p className="text-sm font-bold text-gray-900">{profile?.email}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] text-gray-400 font-bold uppercase">Trade License</p>
                <p className="text-sm font-bold text-gray-900">{profile?.license_number}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] text-gray-400 font-bold uppercase">Verification Date</p>
                <p className="text-sm font-bold text-gray-900">{profile?.verified_at ? new Date(profile.verified_at).toLocaleDateString() : 'N/A'}</p>
              </div>
            </div>
          </div>

          <div className="card">
            <h3 className="font-bold text-gray-900 mb-4">Account Security</h3>
            <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100 flex items-center gap-4">
              <ShieldCheck className="text-emerald-500" size={24} />
              <div>
                <p className="text-sm font-bold text-emerald-900">Blockchain-Linked Identity</p>
                <p className="text-xs text-emerald-700">Your account is linked to your Bhutan NDI. All bids are cryptographically signed.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
