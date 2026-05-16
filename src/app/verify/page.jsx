'use client';
import Link from 'next/link';
import { ShieldCheck, ArrowLeft, Globe, Lock } from 'lucide-react';
import PublicVerifyTool from '@/components/transparency/PublicVerifyTool';

export default function PublicVerifyPage() {
  return (
    <main className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <nav className="bg-white border-b border-gray-100 py-6 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white font-bold">B</div>
            <span className="text-2xl font-black text-gray-900 tracking-tight">BGPS</span>
          </Link>
          <div className="flex items-center gap-6">
            <Link href="/transparency" className="text-sm font-bold text-gray-500 hover:text-primary transition-colors">Transparency Portal</Link>
            <Link href="/select-role" className="btn-primary !py-2 text-xs">Portal Login</Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="bg-gray-900 text-white py-20 px-4 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-primary/10 blur-[120px] rounded-full -mr-20 -mt-20" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full text-primary text-[10px] font-black uppercase tracking-widest mb-6 backdrop-blur-md border border-white/10">
            <Globe size={12} /> Live Blockchain Ledger
          </div>
          <h1 className="text-5xl font-black mb-6 leading-tight">Citizens' Audit Portal</h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto font-medium">
            Every tender, bid, and award in Bhutan's procurement system is cryptographically 
            sealed on the Ethereum blockchain. Verify any document below.
          </p>
        </div>
      </div>

      {/* Verification Tool */}
      <div className="-mt-16 px-4">
        <PublicVerifyTool />
      </div>

      {/* Trust Badges */}
      <div className="max-w-4xl mx-auto mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 px-4 text-center">
        <div className="space-y-3">
          <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-primary mx-auto shadow-sm">
            <Lock size={24} />
          </div>
          <h4 className="font-bold text-gray-900">Immutable Records</h4>
          <p className="text-xs text-gray-500 leading-relaxed">Once a hash is recorded on-chain, it can never be deleted or modified by anyone.</p>
        </div>
        <div className="space-y-3">
          <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-primary mx-auto shadow-sm">
            <ShieldCheck size={24} />
          </div>
          <h4 className="font-bold text-gray-900">Public Verification</h4>
          <p className="text-xs text-gray-500 leading-relaxed">Cryptographic proof is accessible to every citizen 24/7 without needing permission.</p>
        </div>
        <div className="space-y-3">
          <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-primary mx-auto shadow-sm">
            <Globe size={24} />
          </div>
          <h4 className="font-bold text-gray-900">Total Transparency</h4>
          <p className="text-xs text-gray-500 leading-relaxed">Follow the procurement lifecycle from initial tender to final contract award.</p>
        </div>
      </div>
    </main>
  );
}
