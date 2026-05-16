'use client';

import React from 'react';
import { ShieldAlert, RefreshCw, Globe } from 'lucide-react';
import { useSepoliaNetwork } from '@/hooks/useSepoliaNetwork';

/**
 * UI Overlay that blocks interaction if the user is on the wrong network.
 */
export default function SepoliaNetworkGuard({ children, active = true }) {
  const { isSepolia, isSwitching, switchToSepolia } = useSepoliaNetwork();

  // If guard is not active (e.g., during registration), just show children
  if (!active || isSepolia || process.env.NEXT_PUBLIC_BLOCKCHAIN_MODE === 'mock') {
    return <>{children}</>;
  }

  return (
    <div className="relative">
      {/* Blurred background content */}
      <div className="blur-[2px] pointer-events-none grayscale opacity-50">
        {children}
      </div>

      {/* Warning Overlay */}
      <div className="absolute inset-0 z-50 flex items-center justify-center p-6 bg-white/40 backdrop-blur-[4px]">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl border border-red-100 p-8 text-center animate-in fade-in zoom-in duration-300">
          <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center text-red-500 mx-auto mb-6">
            <ShieldAlert size={32} />
          </div>
          
          <h3 className="text-xl font-black text-gray-900 mb-2">Wrong Network Detected</h3>
          <p className="text-sm text-gray-500 mb-8 leading-relaxed">
            The BGPS Procurement System requires the <span className="font-bold text-gray-900">Ethereum Sepolia Testnet</span> for blockchain verification.
          </p>

          <div className="space-y-4">
            <button
              onClick={switchToSepolia}
              disabled={isSwitching}
              className="w-full h-14 bg-red-600 hover:bg-red-700 text-white font-bold rounded-2xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-red-200 disabled:opacity-50"
            >
              {isSwitching ? (
                <RefreshCw size={20} className="animate-spin" />
              ) : (
                <>
                  <Globe size={20} />
                  Switch to Sepolia
                </>
              )}
            </button>
            
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
              Required: Chain ID 11155111 (0xaa36a7)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
