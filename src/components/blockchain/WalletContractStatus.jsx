'use client';

import React from 'react';
import { Wallet, Link2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { getActiveContractAddress } from '@/lib/blockchain/contract-addresses';

/**
 * UI Component for displaying wallet connection and contract identity.
 * Shows the current address, network status, and contract proof-of-identity.
 */
export default function WalletContractStatus({ address, chainId, isSepolia }) {
  const contractAddress = getActiveContractAddress();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Wallet Card */}
      <div className="bg-white border border-gray-100 rounded-xl p-4 flex items-center gap-4 shadow-sm">
        <div className={`p-3 rounded-xl ${address ? 'bg-blue-50 text-blue-600' : 'bg-gray-50 text-gray-400'}`}>
          <Wallet size={20} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Connected Wallet</p>
          <p className="text-sm font-mono text-gray-900 truncate">
            {address || 'Not Connected'}
          </p>
        </div>
        {address && (
          <div className={`flex items-center gap-1.5 px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
            isSepolia ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}>
            {isSepolia ? (
              <CheckCircle2 size={12} />
            ) : (
              <AlertCircle size={12} />
            )}
            {isSepolia ? 'Sepolia' : 'Wrong Network'}
          </div>
        )}
      </div>

      {/* Contract Card */}
      <div className="bg-white border border-gray-100 rounded-xl p-4 flex items-center gap-4 shadow-sm">
        <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
          <Link2 size={20} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">BGPS Smart Contract</p>
          <p className="text-sm font-mono text-gray-900 truncate">
            {contractAddress}
          </p>
        </div>
        <div className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded-full text-[10px] font-bold uppercase">
          v1.0.0
        </div>
      </div>
    </div>
  );
}
