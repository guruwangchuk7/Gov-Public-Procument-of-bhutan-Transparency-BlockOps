'use client';
import { 
  FileText, 
  Send, 
  CheckCircle2, 
  Clock, 
  Activity, 
  Plus,
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import StatsCard from '@/components/common/StatsCard';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AgencyDashboard() {
  const router = useRouter();
  const [session, setSession] = useState(null);
  const [wallet, setWallet] = useState(null);

  useEffect(() => {
    const savedSession = localStorage.getItem('bgps_ndi_session');
    const savedWallet = localStorage.getItem('bgps_wallet_address');
    
    if (!savedSession || !savedWallet) {
      router.push('/agency/login');
      return;
    }
    
    setSession(JSON.parse(savedSession));
    setWallet(savedWallet);
  }, [router]);

  if (!session) return null;

  const stats = [
    {
      title: 'Active Tenders',
      value: '4',
      subtext: '2 closing this week',
      icon: FileText
    },
    {
      title: 'Bids Received',
      value: '18',
      subtext: 'Avg. 4.5 bids per tender',
      icon: Send
    },
    {
      title: 'Awarded Tenders',
      value: '8',
      subtext: 'Nu. 32M total value',
      icon: CheckCircle2
    },
    {
      title: 'Awaiting Publish',
      value: '2',
      subtext: 'Drafts ready for blockchain',
      icon: Clock
    }
  ];

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 bg-zinc-100 rounded-full mb-3">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
            <span className="text-[10px] font-semibold text-zinc-500 uppercase tracking-widest">Authenticated Agency</span>
          </div>
          <h1 className="text-4xl font-semibold text-zinc-900 tracking-tightest">
            Welcome, {session.full_name?.split(' ')[0] || 'Officer'}
          </h1>
          <div className="flex items-center gap-3 mt-2">
            <code className="text-xs text-zinc-400 font-mono bg-zinc-50 px-2 py-0.5 rounded border border-zinc-100">
              {wallet?.slice(0, 18)}...
            </code>
          </div>
        </div>
        <Link href="/agency/tenders/create" className="btn btn-primary px-6 h-11">
          <Plus size={18} /> New Tender
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <StatsCard key={i} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Recent Tenders */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-zinc-900 tracking-tight flex items-center gap-2">
              <Activity size={16} className="text-zinc-400" />
              Latest Tenders
            </h3>
            <Link href="/agency/tenders" className="text-xs font-semibold text-zinc-400 hover:text-zinc-900 transition-colors">View All</Link>
          </div>
          
          <div className="table-container shadow-none border-zinc-200">
            <div className="divide-y divide-zinc-100">
              {[
                { title: 'Rural Road Maintenance Project', status: 'Published', bids: 6, date: '2 days ago' },
                { title: 'Supply of Office Stationery', status: 'Draft', bids: 0, date: '5 days ago' },
                { title: 'Bridge Construction Phase I', status: 'Published', bids: 3, date: '1 week ago' },
              ].map((tender, i) => (
                <div key={i} className="flex items-center justify-between p-4 hover:bg-zinc-50 transition-colors cursor-pointer group">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-zinc-50 border border-zinc-100 flex items-center justify-center text-zinc-400 group-hover:text-zinc-900 transition-colors">
                      <FileText size={18} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-zinc-900">{tender.title}</p>
                      <p className="text-[11px] text-zinc-400 font-medium tracking-tight">
                        {tender.bids} Bids Received • Last modified {tender.date}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`badge ${
                      tender.status === 'Published' ? 'bg-sky-50 text-sky-600 border border-sky-100' : 'bg-zinc-100 text-zinc-500 border border-zinc-200'
                    }`}>
                      {tender.status}
                    </span>
                    <ChevronRight size={14} className="text-zinc-300 group-hover:text-zinc-500 transition-colors" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Help / Resources */}
        <div className="lg:col-span-4 space-y-4">
          <h3 className="text-sm font-semibold text-zinc-900 tracking-tight">Quick Resources</h3>
          <div className="card border-zinc-200 shadow-none overflow-hidden">
            <div className="divide-y divide-zinc-100">
              {[
                'SBD Preparation Guide',
                'Tender Evaluation Manual',
                'Blockchain Proof Verification',
                'Identity Management'
              ].map((item, i) => (
                <button key={i} className="w-full flex items-center justify-between p-4 text-xs font-medium text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50 transition-all text-left group">
                  {item}
                  <ExternalLink size={12} className="text-zinc-300 group-hover:text-zinc-500" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
