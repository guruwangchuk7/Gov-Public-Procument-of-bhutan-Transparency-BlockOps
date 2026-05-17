'use client';
import { useState, useEffect } from 'react';
import { ShieldCheck, UserCheck, Award, Building2, Bell, ExternalLink, Loader2 } from 'lucide-react';
import { format } from 'date-fns';

export default function PublicTrustDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('agencies');

  useEffect(() => {
    fetchTrustData();
  }, []);

  const fetchTrustData = async () => {
    try {
      const res = await fetch('/api/public/notifications');
      const result = await res.json();
      if (result.success) {
        setData(result.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'agencies', label: 'Verified Agencies', icon: Building2 },
    { id: 'suppliers', label: 'Verified Suppliers', icon: UserCheck },
    { id: 'auditors', label: 'Verified Auditors', icon: ShieldCheck },
    { id: 'awards', label: 'Winning Bids', icon: Award },
  ];

  if (loading) return (
    <div className="py-20 flex flex-col items-center justify-center text-zinc-400 gap-4">
      <Loader2 className="animate-spin text-zinc-900" size={32} />
      <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Syncing Trust Ledger...</p>
    </div>
  );

  return (
    <div className="py-12">
      <div className="flex items-center gap-3 mb-10">
        <div className="w-10 h-10 rounded-[12px] bg-zinc-900 flex items-center justify-center text-white shadow-md">
          <ShieldCheck size={20} />
        </div>
        <div>
          <h2 className="text-2xl font-semibold text-zinc-900 tracking-tightest">Public Trust Explorer</h2>
          <p className="text-[11px] text-zinc-500 font-bold uppercase tracking-widest mt-1">Real-time Verified Network</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-3 mb-10">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-6 py-3 rounded-[16px] text-sm font-semibold transition-all ${
              activeTab === tab.id 
              ? 'bg-zinc-900 text-white shadow-[0_8px_16px_-6px_rgba(0,0,0,0.2)]' 
              : 'bg-white border border-zinc-200 text-zinc-500 hover:border-zinc-900 hover:text-zinc-900'
            }`}
          >
            <tab.icon size={16} />
            {tab.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 min-h-[300px]">
        {activeTab === 'agencies' && (data?.verified_agencies?.length > 0 ? (
          data.verified_agencies.map((agency, i) => (
            <TrustCard key={i} title={agency.agency_name} date={agency.verified_at} tx={agency.authorization_tx_hash} type="Agency" />
          ))
        ) : <EmptyState />)}

        {activeTab === 'suppliers' && (data?.verified_suppliers?.length > 0 ? (
          data.verified_suppliers.map((supplier, i) => (
            <TrustCard key={i} title={supplier.company_name} date={supplier.verified_at} tx={supplier.authorization_tx_hash} type="Supplier" />
          ))
        ) : <EmptyState />)}

        {activeTab === 'auditors' && (data?.verified_auditors?.length > 0 ? (
          data.verified_auditors.map((auditor, i) => (
            <TrustCard key={i} title={auditor.full_name} date={auditor.activated_at} type="Auditor" />
          ))
        ) : <EmptyState />)}

        {activeTab === 'awards' && (data?.winning_bid_results?.length > 0 ? (
          data.winning_bid_results.map((award, i) => (
            <TrustCard 
                key={i} 
                title={award.tenders?.title} 
                subtitle={award.suppliers?.company_name}
                date={award.awarded_at} 
                tx={award.blockchain_tx_hash} 
                type="Award" 
            />
          ))
        ) : <EmptyState />)}
      </div>
    </div>
  );
}

function TrustCard({ title, subtitle, date, tx, type }) {
  return (
    <div className="bg-white border border-zinc-200 p-6 rounded-[24px] hover:border-zinc-900 transition-all group flex flex-col justify-between shadow-sm hover:shadow-xl">
      <div>
        <div className="flex justify-between items-start mb-6">
          <span className="px-2.5 py-1 bg-zinc-100 text-zinc-900 text-[9px] font-black uppercase tracking-widest rounded-md border border-zinc-200">
            {type}
          </span>
          {tx && (
            <a href={`https://sepolia.etherscan.io/tx/${tx}`} target="_blank" className="text-zinc-400 hover:text-zinc-900 transition-colors bg-zinc-50 p-1.5 rounded-lg border border-zinc-100 hover:border-zinc-300">
              <ExternalLink size={14} />
            </a>
          )}
        </div>
        <h4 className="font-semibold text-zinc-900 text-sm line-clamp-2 leading-snug mb-2">{title}</h4>
        {subtitle && <p className="text-[11px] text-zinc-500 font-medium mb-2">{subtitle}</p>}
      </div>
      <div className="mt-6 pt-4 border-t border-zinc-100 flex items-center justify-between">
        <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">{date ? format(new Date(date), 'MMM dd, yyyy') : 'Recently Verified'}</p>
        <div className="flex items-center gap-1.5 text-zinc-900 font-bold text-[10px] uppercase tracking-wider">
          <ShieldCheck size={14} className="text-zinc-900" />
          On-Chain
        </div>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="col-span-full flex flex-col items-center justify-center py-24 text-zinc-400 bg-white border border-zinc-200 border-dashed rounded-[32px]">
      <ShieldCheck size={40} className="opacity-20 mb-4 text-zinc-900" />
      <p className="text-[11px] font-bold uppercase tracking-widest text-zinc-500">No verified records in this ledger</p>
    </div>
  );
}
