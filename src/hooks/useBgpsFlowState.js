'use client';
import { createContext, useContext, useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner'; // I'll assume sonner or similar is used for notifications

const BgpsContext = createContext();

export function BgpsProvider({ children }) {
  const supabase = createClient();
  const [session, setSession] = useState({
    user: null,
    role: null, // ADMIN, AGENCY, SUPPLIER, AUDITOR, PUBLIC
    ndiVerified: false,
    walletConnected: false,
    walletAddress: null,
  });

  const [loading, setLoading] = useState(false);

  // Simulated Integrations
  const connectFakeNDI = async (userData) => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 1500));
    setSession(prev => ({ ...prev, ndiVerified: true, user: userData }));
    setLoading(false);
    return true;
  };

  const connectFakeWallet = async (address) => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 1200));
    setSession(prev => ({ ...prev, walletConnected: true, walletAddress: address }));
    setLoading(false);
    return true;
  };

  const confirmBlockchainTx = async (eventName, payload) => {
    // 1. Create pending event in Supabase
    const { data: event, error } = await supabase
      .from('blockchain_events')
      .insert({
        event_name: eventName,
        tx_status: 'pending',
        payload_hash: payload.hash || '0x' + Math.random().toString(16).slice(2, 42),
        wallet_address: session.walletAddress,
      })
      .select()
      .single();

    if (error) throw error;

    // 2. Simulate Wait
    await new Promise(r => setTimeout(r, 3000));

    // 3. Confirm on "Blockchain" (Update DB)
    const txHash = '0x' + Math.random().toString(16).slice(2, 66);
    const { data: confirmedEvent } = await supabase
      .from('blockchain_events')
      .update({
        tx_status: 'confirmed',
        tx_hash: txHash,
        confirmed_at: new Date().toISOString(),
      })
      .eq('id', event.id)
      .select()
      .single();

    return confirmedEvent;
  };

  const logActivity = async (action, entityType, entityId, details) => {
    await supabase.from('activity_logs').insert({
      actor_type: session.role || 'System',
      actor_id: session.user?.id,
      action,
      entity_type: entityType,
      entity_id: entityId,
      details,
    });
  };

  const value = {
    session,
    setSession,
    loading,
    connectFakeNDI,
    connectFakeWallet,
    confirmBlockchainTx,
    logActivity,
    supabase
  };

  return <BgpsContext.Provider value={value}>{children}</BgpsContext.Provider>;
}

export const useBgpsFlow = () => {
  const context = useContext(BgpsContext);
  if (!context) throw new Error('useBgpsFlow must be used within a BgpsProvider');
  return context;
};
