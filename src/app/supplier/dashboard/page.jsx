'use client';
import { 
  FileText, 
  Send, 
  Trophy, 
  Search, 
  Activity, 
  ExternalLink 
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
      icon: Send,
      color: 'bg-emerald-500'
    },
    {
      title: 'Open Tenders',
      value: '14',
      subtext: '5 new this week',
      icon: Search,
      color: 'bg-primary'
    },
    {
      title: 'Won Contracts',
      value: '1',
      subtext: 'Ministry of Education',
      icon: Trophy,
      color: 'bg-amber-500'
    },
    {
      title: 'Proof Verified',
      value: '100%',
      subtext: 'On-chain integrity',
      icon: ExternalLink,
      color: 'bg-indigo-500'
    }
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-black text-gray-900">Supplier Workspace</h1>
        <p className="text-gray-500 font-medium">Welcome back, <span className="text-emerald-600 font-bold">{session.full_name || 'Verified Supplier'}</span></p>
        <div className="flex items-center gap-2 mt-2">
          <div className="px-2 py-0.5 bg-emerald-100 text-emerald-600 text-[10px] font-bold rounded-md uppercase tracking-widest border border-emerald-200">Verified NDI</div>
          <code className="text-[10px] text-gray-400 font-mono truncate max-w-[200px]">{wallet}</code>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <StatsCard key={i} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Bids */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-gray-900 flex items-center gap-2">
              <Activity size={18} className="text-emerald-500" />
              My Recent Bids
            </h3>
            <Link href="/supplier/bids" className="text-xs text-primary font-bold hover:underline">View All</Link>
          </div>
          <div className="space-y-4">
            {[
              { title: 'Rural Road Maintenance', amount: 'Nu. 4,200,000', status: 'On-chain' },
              { title: 'Bridge Construction Phase I', amount: 'Nu. 8,500,000', status: 'Submitted' },
            ].map((bid, i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-emerald-50 transition-colors cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-emerald-500">
                    <Send size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900">{bid.title}</p>
                    <p className="text-xs text-gray-500">{bid.amount}</p>
                  </div>
                </div>
                <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                  bid.status === 'On-chain' ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'
                }`}>
                  {bid.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recommended Tenders */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-gray-900 flex items-center gap-2">
              <Search size={18} className="text-primary" />
              Recommended Tenders
            </h3>
            <Link href="/supplier/tenders" className="text-xs text-primary font-bold hover:underline">Browse All</Link>
          </div>
          <div className="space-y-4">
            {[
              { title: 'Sewerage Upgrade Works', deadline: '2 days left', budget: 'Nu. 3.2M' },
              { title: 'Solar Panel Installation', deadline: '5 days left', budget: 'Nu. 1.8M' },
            ].map((tender, i) => (
              <div key={i} className="p-4 border border-gray-100 rounded-xl hover:border-primary transition-all">
                <div className="flex justify-between items-start mb-2">
                  <p className="text-sm font-bold text-gray-900">{tender.title}</p>
                  <p className="text-[10px] font-bold text-red-500 uppercase">{tender.deadline}</p>
                </div>
                <p className="text-xs text-gray-500 mb-3">Est. Budget: {tender.budget}</p>
                <Link href="/supplier/tenders" className="text-[10px] font-black text-primary uppercase tracking-widest hover:underline flex items-center gap-1">
                  View Details <ExternalLink size={10} />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
