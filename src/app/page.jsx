'use client';
import Link from 'next/link';
import { ShieldCheck, ArrowRight, Building2, Users, Search, Landmark, Bell } from 'lucide-react';
import { motion } from 'framer-motion';
import PublicNotificationDropdown from '@/components/public/PublicNotificationDropdown';

export default function LandingPage() {
  return (
    <div className="relative overflow-hidden bg-white">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-40 glass border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white font-black shadow-xl">
              B
            </div>
            <div>
              <h1 className="text-xl font-black text-slate-900 tracking-tight">BGPS</h1>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none">Bhutan Procurement</p>
            </div>
          </div>
          
          <div className="flex items-center gap-8">
            <Link href="/verify" className="text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors">Verify Proof</Link>
            <Link href="/transparency" className="text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors">Portal</Link>
            <div className="h-6 w-px bg-slate-200" />
            <PublicNotificationDropdown />
            <Link href="/select-role" className="btn btn-primary">
              Portal Login <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-40 pb-24 px-6 relative">
        <div className="absolute top-0 right-0 -z-10 w-1/2 h-full bg-gradient-to-l from-primary-light/50 to-transparent blur-3xl opacity-50" />
        
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 rounded-full border border-emerald-100">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Live on Ethereum Sepolia</span>
            </div>
            
            <h2 className="text-6xl md:text-7xl font-black text-slate-900 leading-[0.95] tracking-tight">
              Trust the <span className="text-primary italic">Process</span>. <br />
              Verify the <span className="underline decoration-primary/30 underline-offset-8">Record</span>.
            </h2>
            
            <p className="text-lg text-slate-500 font-medium max-w-lg leading-relaxed">
              The Bhutan Government Procurement System (BGPS) brings absolute transparency to public tenders using blockchain verification and NDI identity.
            </p>
            
            <div className="flex flex-wrap items-center gap-4">
              <Link href="/select-role" className="btn btn-primary h-14 px-8 text-base">
                Get Started
              </Link>
              <Link href="/transparency" className="btn btn-outline h-14 px-8 text-base">
                View Transparency Portal
              </Link>
            </div>

            <div className="grid grid-cols-3 gap-8 pt-8 border-t border-slate-100">
              <div>
                <p className="text-3xl font-black text-slate-900">100%</p>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Immutable</p>
              </div>
              <div>
                <p className="text-3xl font-black text-slate-900">0.0s</p>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Verify Latency</p>
              </div>
              <div>
                <p className="text-3xl font-black text-slate-900">∞</p>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Public Access</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            className="relative"
          >
            <div className="card aspect-square max-w-md mx-auto p-0 overflow-hidden shadow-2xl animate-float border-white">
              <div className="bg-slate-900 p-8 text-white space-y-6">
                <div className="flex justify-between items-start">
                  <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center">
                    <ShieldCheck size={24} />
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-slate-400 font-bold uppercase">Tender Hash</p>
                    <code className="text-xs text-primary">0x4a...8f92</code>
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-2xl font-black">National Fiber Backbone</p>
                  <p className="text-sm text-slate-400 font-medium italic">Verified by Gov.bt Auditor</p>
                </div>
                <div className="pt-4 flex items-center justify-between border-t border-white/10">
                  <div className="flex -space-x-3">
                    {[1,2,3].map(i => (
                      <div key={i} className="w-8 h-8 rounded-full bg-slate-800 border-2 border-slate-900" />
                    ))}
                  </div>
                  <p className="text-xs font-bold text-emerald-400">12 Active Bids</p>
                </div>
              </div>
              <div className="p-8 space-y-4">
                <div className="flex justify-between items-center text-sm font-bold">
                  <span className="text-slate-400 italic">Current Status:</span>
                  <span className="text-emerald-500 uppercase tracking-widest text-[10px] font-black">Blockchain Awarded</span>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full w-full bg-emerald-500" />
                </div>
              </div>
            </div>
            
            {/* Decorative dots */}
            <div className="absolute -top-12 -left-12 grid grid-cols-4 gap-4 opacity-10">
              {[...Array(16)].map((_, i) => (
                <div key={i} className="w-2 h-2 rounded-full bg-slate-900" />
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-slate-100 text-center">
        <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em]">
          &copy; 2026 Bhutan Blockchain Initiative &bull; Verified Procurement
        </p>
      </footer>
    </div>
  );
}
