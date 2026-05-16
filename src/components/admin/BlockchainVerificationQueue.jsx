'use client';
import { useState, useEffect } from 'react';
import { ShieldCheck, Cpu, ArrowRight, Loader2, CheckCircle2, Link as LinkIcon } from 'lucide-react';
import { toast } from 'sonner';
import { createClient } from '@/lib/supabase/client';

export default function BlockchainVerificationQueue() {
  const [pendingEvents, setPendingEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [verifyingId, setVerifyingId] = useState(null);
  const supabase = createClient();

  useEffect(() => {
    fetchPendingEvents();
  }, []);

  const fetchPendingEvents = async () => {
    const { data, error } = await supabase
      .from('blockchain_events')
      .select('*, agencies(agency_name, email)')
      .eq('tx_status', 'pending')
      .order('created_at', { ascending: false });

    if (!error) setPendingEvents(data);
    setLoading(false);
  };

  const handleConfirm = async (event) => {
    setVerifyingId(event.id);
    try {
      const res = await fetch('/api/admin/confirm-blockchain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          agencyId: event.related_agency_id,
          eventId: event.id 
        })
      });
      
      const result = await res.json();
      if (result.success) {
        toast.success('Blockchain verification confirmed!');
        fetchPendingEvents();
      } else {
        toast.error(result.error);
      }
    } catch (err) {
      toast.error('Verification failed');
    } finally {
      setVerifyingId(null);
    }
  };

  if (loading) return null;
  if (pendingEvents.length === 0) return null;

  return (
    <div className="card bg-slate-900 border-slate-800 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-emerald-400">
          <Cpu size={18} className="animate-pulse" />
          <h3 className="text-xs font-black uppercase tracking-[0.2em]">Blockchain Verification Queue</h3>
        </div>
        <span className="badge bg-emerald-500/10 text-emerald-400">{pendingEvents.length} Actions Required</span>
      </div>

      <div className="space-y-4">
        {pendingEvents.map((event) => (
          <div key={event.id} className="p-4 bg-slate-800/50 rounded-2xl border border-slate-800 flex items-center justify-between group">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-primary">
                <ShieldCheck size={20} />
              </div>
              <div>
                <p className="text-sm font-bold text-white">{event.agencies?.agency_name || 'System Action'}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{event.event_name}</span>
                  <div className="w-1 h-1 bg-slate-700 rounded-full" />
                  <span className="text-[9px] font-bold text-emerald-500/70 italic">Ready for handshake</span>
                </div>
              </div>
            </div>

            <button 
              onClick={() => handleConfirm(event)}
              disabled={verifyingId === event.id}
              className="btn bg-emerald-500 text-white hover:bg-emerald-600 px-4 py-2 text-[10px] uppercase tracking-widest disabled:opacity-50"
            >
              {verifyingId === event.id ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <>Confirm Proof <ArrowRight size={14} /></>
              )}
            </button>
          </div>
        ))}
      </div>

      <div className="p-3 bg-slate-800/30 rounded-xl border border-slate-800/50 flex items-center gap-3">
        <LinkIcon size={12} className="text-slate-500" />
        <p className="text-[9px] text-slate-500 font-medium italic">
          Confirming these actions will record immutable proofs on the Ethereum Sepolia testnet.
        </p>
      </div>
    </div>
  );
}
