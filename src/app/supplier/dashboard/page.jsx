'use client';
import { 
  FileText, 
  Send, 
  Trophy, 
  Search, 
  Activity, 
  ExternalLink,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import StatsCard from '@/components/common/StatsCard';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function SupplierDashboard() {
  const router = useRouter();
  const [session, setSession] = useState(null);
  const [wallet, setWallet] = useState(null);

  useEffect(() => {
    const savedSession = localStorage.getItem('bgps_ndi_session');
    const savedWallet = localStorage.getItem('bgps_wallet_address');
    
    if (!savedSession || !savedWallet) {
      router.push('/supplier/login');
      return;
    }
    
    setSession(JSON.parse(savedSession));
    setWallet(savedWallet);
  }, [router]);

  if (!session) return null;

  const stats = [
    {
      title: 'Active Bids',
      value: '3',
      subtext: 'Nu. 12.4M total value',
      icon: Send
    },
    {
      title: 'Open Tenders',
      value: '14',
      subtext: '5 new this week',
      icon: Search
    },
    {
      title: 'Won Contracts',
      value: '1',
      subtext: 'Ministry of Education',
      icon: Trophy
    },
    {
      title: 'Proof Verified',
      value: '100%',
      subtext: 'On-chain integrity',
      icon: ShieldCheck
    }
  ];

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 bg-zinc-100 rounded-full mb-3">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
            <span className="text-[10px] font-semibold text-zinc-500 uppercase tracking-widest">Verified Supplier</span>
          </div>
          <h1 className="text-4xl font-semibold text-zinc-900 tracking-tightest">
            Hello, {session.full_name?.split(' ')[0] || 'Member'}
          </h1>
          <div className="flex items-center gap-3 mt-2">
            <code className="text-xs text-zinc-400 font-mono bg-zinc-50 px-2 py-0.5 rounded border border-zinc-100">
              {wallet?.slice(0, 18)}...
            </code>
          </div>
        </div>
        <Link href="/supplier/tenders" className="btn btn-primary px-6 h-11">
          <Search size={18} /> Browse Tenders
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <StatsCard key={i} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Recent Bids */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-zinc-900 tracking-tight flex items-center gap-2">
              <Activity size={16} className="text-zinc-400" />
              My Recent Bids
            </h3>
            <Link href="/supplier/bids" className="text-xs font-semibold text-zinc-400 hover:text-zinc-900 transition-colors">View All</Link>
          </div>
          
          <div className="table-container shadow-none border-zinc-200">
            <div className="divide-y divide-zinc-100">
              {[
                { title: 'Rural Road Maintenance', amount: 'Nu. 4,200,000', status: 'On-chain' },
                { title: 'Bridge Construction Phase I', amount: 'Nu. 8,500,000', status: 'Submitted' },
              ].map((bid, i) => (
                <div key={i} className="flex items-center justify-between p-4 hover:bg-zinc-50 transition-colors cursor-pointer group">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-zinc-50 border border-zinc-100 flex items-center justify-center text-zinc-400 group-hover:text-zinc-900 transition-colors">
                      <Send size={18} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-zinc-900">{bid.title}</p>
                      <p className="text-[11px] text-zinc-400 font-medium">{bid.amount}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`badge ${
                      bid.status === 'On-chain' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-amber-50 text-amber-600 border border-amber-100'
                    }`}>
                      {bid.status}
                    </span>
                    <ChevronRight size={14} className="text-zinc-300 group-hover:text-zinc-500 transition-colors" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recommended Tenders */}
        <div className="lg:col-span-5 space-y-4">
          <h3 className="text-sm font-semibold text-zinc-900 tracking-tight">Recommended Tenders</h3>
          <div className="space-y-3">
            {[
              { title: 'Sewerage Upgrade Works', deadline: '2 days left', budget: 'Nu. 3.2M' },
              { title: 'Solar Panel Installation', deadline: '5 days left', budget: 'Nu. 1.8M' },
            ].map((tender, i) => (
              <div key={i} className="card p-5 border-zinc-200 shadow-none hover:border-zinc-300 transition-all group">
                <div className="flex justify-between items-start mb-2">
                  <p className="text-sm font-semibold text-zinc-900 group-hover:text-zinc-950">{tender.title}</p>
                  <p className="text-[10px] font-bold text-red-500 uppercase tracking-wider bg-red-50 px-1.5 py-0.5 rounded">{tender.deadline}</p>
                </div>
                <p className="text-[11px] text-zinc-400 font-medium mb-4">Estimated Budget: {tender.budget}</p>
                <Link href="/supplier/tenders" className="inline-flex items-center gap-2 text-[10px] font-bold text-zinc-900 uppercase tracking-widest hover:translate-x-1 transition-transform">
                  View Details <ArrowRight size={12} />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

import { ArrowRight } from 'lucide-react';
