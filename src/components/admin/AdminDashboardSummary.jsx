'use client';
import { useState, useEffect } from 'react';
import { Landmark, Users, Search, AlertCircle } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export default function AdminDashboardSummary() {
  const supabase = createClient();
  const [stats, setStats] = useState({
    agencies: 0,
    suppliers: 0,
    auditors: 0,
    pending: 0
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    const { count: aCount } = await supabase.from('agencies').select('*', { count: 'exact', head: true });
    const { count: sCount } = await supabase.from('suppliers').select('*', { count: 'exact', head: true });
    const { count: pCount } = await supabase.from('agencies').select('*', { count: 'exact', head: true }).eq('status', 'pending');
    const { count: auCount } = await supabase.from('auditors').select('*', { count: 'exact', head: true });
    
    setStats({
      agencies: aCount || 0,
      suppliers: sCount || 0,
      auditors: auCount || 0,
      pending: pCount || 0
    });
  };

  const statCards = [
    { title: 'Total Agencies', value: stats.agencies, icon: Landmark },
    { title: 'Total Suppliers', value: stats.suppliers, icon: Users },
    { title: 'Active Auditors', value: stats.auditors, icon: Search },
    { title: 'Pending Approval', value: stats.pending, icon: AlertCircle, highlight: true },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statCards.map((stat, i) => (
        <div key={i} className="card p-6 border-zinc-200 shadow-none hover:border-zinc-400 transition-all flex flex-col justify-between h-32 group">
          <div className="flex justify-between items-start">
            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{stat.title}</p>
            <div className="w-8 h-8 rounded-lg bg-zinc-50 border border-zinc-100 flex items-center justify-center text-zinc-400 group-hover:text-zinc-900 group-hover:border-zinc-200 transition-all">
              <stat.icon size={16} />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <p className="text-3xl font-semibold text-zinc-900 tracking-tightest">{stat.value}</p>
            {stat.highlight && stats.pending > 0 && (
              <div className="bg-zinc-900 text-white px-1.5 py-0.5 rounded text-[9px] font-bold tracking-widest uppercase">
                ACTION
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
