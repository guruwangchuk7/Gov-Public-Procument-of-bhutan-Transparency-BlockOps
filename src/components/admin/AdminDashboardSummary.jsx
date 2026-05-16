'use client';
import { useState, useEffect } from 'react';
import { Landmark, Users, Search, AlertCircle, CheckCircle2, ShieldCheck } from 'lucide-react';
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
    { title: 'Total Agencies', value: stats.agencies, icon: Landmark, color: 'text-primary', bg: 'bg-primary/10' },
    { title: 'Total Suppliers', value: stats.suppliers, icon: Users, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    { title: 'Active Auditors', value: stats.auditors, icon: Search, color: 'text-indigo-500', bg: 'bg-indigo-500/10' },
    { title: 'Pending Approval', value: stats.pending, icon: AlertCircle, color: 'text-rose-500', bg: 'bg-rose-500/10' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statCards.map((stat, i) => (
        <div key={i} className="card flex items-center gap-4 py-8">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${stat.bg} ${stat.color}`}>
            <stat.icon size={24} />
          </div>
          <div>
            <p className="text-3xl font-black text-slate-900">{stat.value}</p>
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{stat.title}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
