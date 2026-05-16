'use client';

import React from 'react';
import { Wallet, Loader2, CheckCircle2 } from 'lucide-react';

/**
 * Connect button for Rabby Wallet with status feedback.
 */
export default function RabbyConnectButton({ 
  address, 
  onConnect, 
  isConnecting 
}) {
  const isConnected = !!address;

  return (
    <button
      onClick={onConnect}
      disabled={isConnecting || isConnected}
      className={`w-full h-14 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all ${
        isConnected 
          ? 'bg-blue-50 text-blue-600 border border-blue-100 cursor-default'
          : 'bg-white border-2 border-slate-900 text-slate-900 hover:bg-slate-50 disabled:opacity-70'
      }`}
    >
      {isConnecting ? (
        <Loader2 className="animate-spin" size={20} />
      ) : isConnected ? (
        <CheckCircle2 size={20} />
      ) : (
        <Wallet size={20} />
      )}
      
      {isConnected ? (
        <span className="font-mono text-xs">
          {address.slice(0, 6)}...{address.slice(-4)}
        </span>
      ) : isConnecting ? (
        'Connecting...'
      ) : (
        'Connect Rabby Wallet'
      )}
    </button>
  );
}
