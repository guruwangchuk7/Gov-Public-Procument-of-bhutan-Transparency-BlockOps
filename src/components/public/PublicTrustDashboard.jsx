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
    <div className="py-12 flex flex-col items-center justify-center text-gray-400 gap-3">
      <Loader2 className="animate-spin" size={32} />
      <p className="text-sm font-bold uppercase tracking-widest">Loading Trust Data...</p>
    </div>
  );

  return (
    <div className="py-10">
      <div className="flex items-center gap-2 mb-8">
        <Bell className="text-emerald-500" size={20} />
        <h2 className="text-xl font-black text-gray-900">BGPS Public Trust Explorer</h2>
      </div>

      <div className="flex flex-wrap gap-4 mb-8">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all ${
              activeTab === tab.id 
              ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-200' 
              : 'bg-white border border-gray-100 text-gray-500 hover:border-emerald-200 hover:bg-emerald-50/30'
            }`}
          >
            <tab.icon size={18} />
            {tab.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 min-h-[300px]">
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
    <div className="bg-white border border-gray-100 p-5 rounded-2xl hover:border-emerald-500 transition-all group flex flex-col justify-between">
      <div>
        <div className="flex justify-between items-start mb-4">
          <span className="px-2 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase rounded-lg border border-emerald-100">
            {type}
          </span>
          {tx && (
            <a href={`https://sepolia.etherscan.io/tx/${tx}`} target="_blank" className="text-gray-400 hover:text-emerald-500 transition-colors">
              <ExternalLink size={14} />
            </a>
          )}
        </div>
        <h4 className="font-bold text-gray-900 text-sm line-clamp-2 leading-tight mb-2">{title}</h4>
        {subtitle && <p className="text-xs text-gray-500 font-medium mb-2">{subtitle}</p>}
      </div>
      <div className="mt-4 pt-4 border-t border-gray-50 flex items-center justify-between">
        <p className="text-[10px] text-gray-400 font-bold uppercase">{date ? format(new Date(date), 'MMM dd, yyyy') : 'Recently Verified'}</p>
        <div className="flex items-center gap-1 text-emerald-600 font-black text-[10px] uppercase">
          <ShieldCheck size={12} />
          On-Chain
        </div>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="col-span-full flex flex-col items-center justify-center py-20 text-gray-400">
      <Bell size={48} className="opacity-10 mb-4" />
      <p className="text-sm font-medium">No verified records found in this category.</p>
    </div>
  );
}
