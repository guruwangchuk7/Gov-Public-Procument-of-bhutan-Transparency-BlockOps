'use client';
import { useState, useEffect } from 'react';
import { ShieldCheck, Cpu, ArrowRight, Loader2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { createClient } from '@/lib/supabase/client';
import { WalletAuthorizationService } from '@/services/blockchain/wallet-authorization.service';

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
      .select('*, agencies(agency_name, wallet_address), suppliers(company_name, wallet_address)')
      .eq('tx_status', 'pending')
      .order('created_at', { ascending: false });

    if (!error) setPendingEvents(data);
    setLoading(false);
  };

  const handleConfirm = async (event) => {
    setVerifyingId(event.id);
    try {
      let txResult;
      
      if (event.event_name === 'AgencyWalletAuthorized') {
        const wallet = event.agencies?.wallet_address || event.wallet_address;
        if (!wallet) throw new Error('Agency wallet address missing');
        
        toast.info('Please sign the Agency Authorization in Rabby...');
        txResult = await WalletAuthorizationService.authorizeAgencyWallet({
          agency_id: event.related_agency_id,
          agency_wallet: wallet,
          proof_hash: event.payload_hash
        });
      } else if (event.event_name === 'SupplierWalletAuthorized') {
        const wallet = event.suppliers?.wallet_address || event.wallet_address;
        if (!wallet) throw new Error('Supplier wallet address missing');

        toast.info('Please sign the Supplier Authorization in Rabby...');
        txResult = await WalletAuthorizationService.authorizeSupplierWallet({
          supplier_id: event.related_supplier_id,
          supplier_wallet: wallet,
          proof_hash: event.payload_hash
        });
      } else {
        throw new Error('Unsupported event type in queue');
      }

      const { data: { user } } = await supabase.auth.getUser();

      const res = await fetch('/api/admin/confirm-blockchain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          agencyId: event.related_agency_id,
          supplierId: event.related_supplier_id,
          eventId: event.id,
          txHash: txResult.tx_hash,
          adminId: user?.id
        })
      });
      
      const result = await res.json();
      if (result.success) {
        toast.success('Blockchain handshake completed successfully!');
        fetchPendingEvents();
      } else {
        toast.error(result.error);
      }
    } catch (err) {
      console.error(err);
      toast.error(err.message || 'Blockchain transaction failed');
    } finally {
      setVerifyingId(null);
    }
  };

  if (loading) return null;
  if (pendingEvents.length === 0) return null;

  return (
    <div className="card bg-zinc-900 border-zinc-800 p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
            <Cpu size={16} className="text-emerald-500" />
          </div>
          <h3 className="text-[11px] font-semibold text-zinc-400 uppercase tracking-widest">Verification Queue</h3>
        </div>
        <div className="badge bg-emerald-500/10 text-emerald-400 text-[10px] border border-emerald-500/20">
          {pendingEvents.length} Pending Actions
        </div>
      </div>

      <div className="space-y-3">
        {pendingEvents.map((event) => (
          <div key={event.id} className="p-4 bg-zinc-800/40 rounded-xl border border-zinc-800 flex items-center justify-between hover:bg-zinc-800/60 transition-all group">
            <div className="flex items-center gap-4">
              <div className="w-9 h-9 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-400 group-hover:text-white transition-colors">
                <ShieldCheck size={18} />
              </div>
              <div>
                <p className="text-sm font-medium text-white">
                  {event.agencies?.agency_name || event.suppliers?.company_name || 'System Action'}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider">{event.event_name}</span>
                  <div className="w-1 h-1 bg-zinc-700 rounded-full" />
                  <code className="text-[10px] text-zinc-500 font-mono">
                    {event.payload_hash?.slice(0, 8)}...
                  </code>
                </div>
              </div>
            </div>

            <button 
              onClick={() => handleConfirm(event)}
              disabled={verifyingId === event.id}
              className="btn btn-primary bg-white text-zinc-900 hover:bg-zinc-100 h-9 px-4 text-xs disabled:opacity-50"
            >
              {verifyingId === event.id ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <span className="flex items-center gap-2">Sign & Authorize <ArrowRight size={14} /></span>
              )}
            </button>
          </div>
        ))}
      </div>

      <div className="p-3 bg-zinc-800/20 rounded-lg border border-zinc-800/50 flex items-center gap-3">
        <AlertCircle size={14} className="text-zinc-500" />
        <p className="text-[11px] text-zinc-500 font-medium italic">
          Wallet authorization requires an Admin signature. This commits the registration hash to Ethereum Sepolia.
        </p>
      </div>
    </div>
  );
}
