'use client';
import { useState, useEffect } from 'react';
import { Bell, CheckCircle2, UserCheck, Award, ShieldCheck } from 'lucide-react';
import { useBgpsFlow } from '@/hooks/useBgpsFlowState';
import { motion, AnimatePresence } from 'framer-motion';

export default function PublicNotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const { supabase } = useBgpsFlow();
  const [stats, setStats] = useState({ agencies: 0, suppliers: 0, awards: 0 });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    const { count: aCount } = await supabase.from('agencies').select('*', { count: 'exact', head: true }).eq('status', 'approved').eq('blockchain_authorized', true);
    const { count: sCount } = await supabase.from('suppliers').select('*', { count: 'exact', head: true }).eq('status', 'approved').eq('blockchain_authorized', true);
    const { count: rCount } = await supabase.from('awards').select('*', { count: 'exact', head: true }).eq('wallet_confirmed', true);
    setStats({ agencies: aCount || 0, suppliers: sCount || 0, awards: rCount || 0 });
  };

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-500 hover:bg-slate-100 transition-colors relative"
      >
        <Bell size={20} />
        <span className="absolute top-2 right-2 w-2 h-2 bg-emerald-500 rounded-full border-2 border-white" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute top-14 right-0 w-80 glass rounded-3xl shadow-2xl border-slate-100 overflow-hidden z-50"
          >
            <div className="p-4 border-b border-slate-100 bg-slate-50/50">
              <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">Public Activity Feed</h4>
            </div>
            
            <div className="p-2 space-y-1">
              <NotificationItem 
                icon={Landmark} 
                title="Verified Agencies" 
                value={stats.agencies} 
                color="text-primary" 
                desc="Active government units"
              />
              <NotificationItem 
                icon={UserCheck} 
                title="Verified Suppliers" 
                value={stats.suppliers} 
                color="text-emerald-500" 
                desc="Authorized bidders"
              />
              <NotificationItem 
                icon={Award} 
                title="Winning Results" 
                value={stats.awards} 
                color="text-amber-500" 
                desc="Awarded on-chain"
              />
            </div>

            <div className="p-4 bg-slate-900 text-[10px] font-bold text-center text-slate-400 uppercase tracking-widest">
              Live Verification Enabled
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function NotificationItem({ icon: Icon, title, value, color, desc }) {
  return (
    <div className="flex items-center gap-4 p-3 hover:bg-slate-50 rounded-2xl transition-colors cursor-pointer">
      <div className={`w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center ${color} shadow-sm`}>
        <Icon size={18} />
      </div>
      <div>
        <div className="flex items-center gap-2">
          <p className="text-sm font-black text-slate-900">{value}</p>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{title}</p>
        </div>
        <p className="text-[10px] text-slate-400 font-medium italic">{desc}</p>
      </div>
    </div>
  );
}
import { Landmark } from 'lucide-react';
