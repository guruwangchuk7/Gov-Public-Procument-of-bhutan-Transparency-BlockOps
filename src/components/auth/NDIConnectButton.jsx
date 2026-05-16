'use client';
import { useState } from 'react';
import { ShieldCheck, Loader2 } from 'lucide-react';

export default function NDIConnectButton({ onVerify, verified }) {
  const [loading, setLoading] = useState(false);

  const handleVerify = async () => {
    setLoading(true);
    // Simulate NDI verification flow
    setTimeout(() => {
      setLoading(false);
      onVerify({ id: 'NDI-TAS-123', name: 'Tashi Wangchuk' });
    }, 2000);
  };

  return (
    <button
      onClick={handleVerify}
      disabled={loading || verified}
      className={`w-full flex items-center justify-center gap-3 px-6 py-4 rounded-xl font-bold transition-all ${
        verified 
          ? 'bg-emerald-50 text-emerald-600 border-2 border-emerald-100' 
          : 'bg-primary text-white hover:bg-opacity-90 shadow-lg shadow-primary/20'
      }`}
    >
      {loading ? (
        <Loader2 className="animate-spin" size={20} />
      ) : verified ? (
        <ShieldCheck size={20} />
      ) : (
        <div className="w-5 h-5 bg-white rounded-full flex items-center justify-center">
          <div className="w-2 h-2 bg-primary rounded-full" />
        </div>
      )}
      {verified ? 'Identity Verified via NDI' : 'Verify with Bhutan NDI'}
    </button>
  );
}
