'use client';
import { 
  FileText, 
  Send, 
  CheckCircle2, 
  Clock, 
  Activity, 
  Plus 
} from 'lucide-react';
import StatsCard from '@/components/common/StatsCard';
import Link from 'next/link';

export default function AgencyDashboard() {
  const stats = [
    {
      title: 'Active Tenders',
      value: '4',
      subtext: '2 closing this week',
      icon: FileText,
      color: 'bg-primary'
    },
    {
      title: 'Bids Received',
      value: '18',
      subtext: 'Avg. 4.5 bids per tender',
      icon: Send,
      color: 'bg-indigo-500'
    },
    {
      title: 'Awarded Tenders',
      value: '8',
      subtext: 'Nu. 32M total value',
      icon: CheckCircle2,
      color: 'bg-emerald-500'
    },
    {
      title: 'Awaiting Publish',
      value: '2',
      subtext: 'Drafts ready for blockchain',
      icon: Clock,
      color: 'bg-amber-500'
    }
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Agency Workspace</h1>
          <p className="text-gray-500">Ministry of Works and Transport Dashboard</p>
        </div>
        <Link href="/agency/tenders/create" className="btn-primary flex items-center gap-2">
          <Plus size={18} /> New Tender
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <StatsCard key={i} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Tenders */}
        <div className="card lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-gray-900 flex items-center gap-2">
              <Activity size={18} className="text-primary" />
              Latest Tenders
            </h3>
            <Link href="/agency/tenders" className="text-xs text-primary font-bold hover:underline">View All</Link>
          </div>
          <div className="space-y-4">
            {[
              { title: 'Rural Road Maintenance Project', status: 'Published', bids: 6 },
              { title: 'Supply of Office Stationery', status: 'Draft', bids: 0 },
              { title: 'Bridge Construction Phase I', status: 'Published', bids: 3 },
            ].map((tender, i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-primary-50/50 transition-colors cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-primary">
                    <FileText size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900">{tender.title}</p>
                    <p className="text-xs text-gray-500">{tender.bids} Bids Received</p>
                  </div>
                </div>
                <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                  tender.status === 'Published' ? 'bg-emerald-100 text-emerald-600' : 'bg-gray-200 text-gray-600'
                }`}>
                  {tender.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Help / Resources */}
        <div className="card">
          <h3 className="font-bold text-gray-900 mb-4">Quick Resources</h3>
          <div className="space-y-3">
            {[
              'SBD Preparation Guide',
              'Tender Evaluation Manual',
              'Blockchain Proof Verification',
              'Identity Management'
            ].map((item, i) => (
              <button key={i} className="w-full text-left p-3 text-sm font-medium text-gray-600 hover:text-primary hover:bg-primary-50 rounded-lg transition-all border border-transparent hover:border-primary-100">
                {item}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
