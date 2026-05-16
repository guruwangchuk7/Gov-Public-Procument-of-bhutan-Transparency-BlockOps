'use client';

import React from 'react';
import { Loader2, CheckCircle2, XCircle, ExternalLink, ShieldCheck } from 'lucide-react';
import { SepoliaProvider } from '@/lib/blockchain/sepolia-provider';

/**
 * UI Component for monitoring a live blockchain transaction.
 * Displays pending, confirmed, or failed states with Etherscan links.
 */
export default function BlockchainActionPanel({ event, onRetry }) {
  if (!event) return null;

  const isPending = event.tx_status === 'pending';
  const isConfirmed = event.tx_status === 'confirmed';
  const isFailed = event.tx_status === 'failed';

  return (
    <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm overflow-hidden relative">
      {/* Background Accent */}
      <div className={`absolute top-0 right-0 w-32 h-32 -mr-16 -mt-16 rounded-full opacity-5 ${
        isConfirmed ? 'bg-green-500' : isFailed ? 'bg-red-500' : 'bg-blue-500'
      }`} />

      <div className="flex items-start gap-4">
        <div className={`p-3 rounded-xl ${
          isConfirmed ? 'bg-green-50' : isFailed ? 'bg-red-50' : 'bg-blue-50'
        }`}>
          {isPending && <Loader2 size={24} className="text-blue-500 animate-spin" />}
          {isConfirmed && <CheckCircle2 size={24} className="text-green-600" />}
          {isFailed && <XCircle size={24} className="text-red-600" />}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
              Blockchain Status
            </h4>
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
              isConfirmed ? 'bg-green-100 text-green-700' : 
              isFailed ? 'bg-red-100 text-red-700' : 
              'bg-blue-100 text-blue-700'
            }`}>
              {event.tx_status}
            </span>
          </div>

          <p className="text-sm text-gray-600 mb-4">
            {isPending && `Recording ${event.event_name} proof on Ethereum Sepolia...`}
            {isConfirmed && `Successfully secured ${event.event_name} proof on-chain.`}
            {isFailed && `Failed to record proof: ${event.error_message || 'Transaction rejected'}`}
          </p>

          {event.tx_hash && (
            <div className="space-y-3">
              <div className="flex flex-col gap-1">
                <span className="text-[10px] text-gray-400 font-bold uppercase">Transaction Hash</span>
                <code className="text-xs bg-gray-50 p-2 rounded border border-gray-100 text-gray-500 break-all block">
                  {event.tx_hash}
                </code>
              </div>

              <div className="flex items-center gap-4">
                <a 
                  href={SepoliaProvider.getTxUrl(event.tx_hash)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors"
                >
                  <ExternalLink size={14} />
                  View on Etherscan
                </a>

                {isConfirmed && (
                  <div className="flex items-center gap-1.5 text-xs font-bold text-green-600">
                    <ShieldCheck size={14} />
                    Verified On-Chain
                  </div>
                )}
              </div>
            </div>
          )}

          {isFailed && onRetry && (
            <button
              onClick={onRetry}
              className="mt-4 px-4 py-2 bg-red-600 text-white text-xs font-bold rounded-lg hover:bg-red-700 transition-all uppercase"
            >
              Retry Transaction
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
