'use client';
import { useState } from 'react';
import Link from 'next/link';
import { ShieldCheck, ArrowRight, Play, Globe, Check, ChevronDown, Plus } from 'lucide-react';
import { motion } from 'framer-motion';

export default function LandingPage() {
  const [openFaq, setOpenFaq] = useState(null);

  const faqs = [
    { q: "What is BGPS and how does it work?", a: "BGPS (Blockchain Government Procurement System) is a decentralized platform that uses Ethereum and NDI to ensure government tenders are fair, transparent, and immutable." },
    { q: "How does blockchain ensure transparency?", a: "Every bid, tender award, and verification step is recorded on the Sepolia blockchain. This creates a permanent, public audit trail that cannot be altered." },
    { q: "What tools does BGPS integrate with?", a: "We integrate with Bhutan NDI for identity verification and the Sepolia Ethereum testnet for blockchain finality." },
    { q: "How much does it cost to use?", a: "BGPS is a government initiative. Suppliers pay standard administrative fees, while public viewing is entirely free." },
    { q: "Is my procurement data secure?", a: "Yes. While tender outcomes are public, sensitive bid details are protected until the official opening date using cryptographic hashes." }
  ];

  return (
    <div className="relative min-h-screen bg-white selection:bg-zinc-900 selection:text-white font-sans">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-zinc-100">
        <div className="max-w-[1400px] mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="grid grid-cols-2 gap-0.5">
              <div className="w-[7px] h-[7px] bg-zinc-900 rounded-[1px]" />
              <div className="w-[7px] h-[7px] bg-zinc-900 rounded-[1px]" />
              <div className="w-[7px] h-[7px] bg-zinc-900 rounded-[1px]" />
              <div className="w-[7px] h-[7px] bg-zinc-900 rounded-[1px]" />
            </div>
            <span className="text-lg font-bold tracking-tightest text-zinc-900 uppercase">BGPS</span>
          </div>
          
          <div className="hidden md:flex items-center gap-10">
            <Link href="/transparency" className="text-[13px] font-medium text-zinc-500 hover:text-zinc-900 transition-colors">Transparency</Link>
            <Link href="/verify" className="text-[13px] font-medium text-zinc-500 hover:text-zinc-900 transition-colors">Verification</Link>
          </div>
          
          <div className="flex items-center gap-4">
            <Link href="/select-role" className="bg-zinc-900 text-white px-5 py-2 rounded-lg text-[13px] font-semibold hover:bg-zinc-800 transition-all">
              Enter Portal
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-44 pb-20 px-6">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-6"
          >
            <h1 className="text-5xl md:text-[64px] font-semibold text-zinc-900 leading-[1.1] tracking-tightest">
              Blockchain Based<br />Government Procurement system
            </h1>
            
            <p className="text-lg md:text-xl text-zinc-500 font-normal max-w-2xl mx-auto leading-relaxed">
              The Blockchain-Based Government Procurement System (BGPS) is Bhutan's next-generation platform for secure, transparent, and immutable public tenders.
            </p>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-center gap-4"
          >
            <Link href="/select-role" className="bg-zinc-900 text-white px-10 py-4 rounded-xl text-sm font-semibold hover:bg-zinc-800 transition-all active:scale-[0.98] shadow-2xl shadow-zinc-200">
              Explore BGPS Portal
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Tabs & App Preview */}
      <section className="pb-32 px-6">
        <div className="max-w-5xl mx-auto space-y-12">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex justify-center"
          >
            <div className="inline-flex items-center p-1 bg-zinc-100 rounded-full border border-zinc-200/50">
              <button className="px-6 py-2 bg-white rounded-full text-xs font-semibold text-zinc-900 shadow-sm">
                Transparency
              </button>
              <button className="px-6 py-2 text-xs font-semibold text-zinc-500 hover:text-zinc-900 transition-colors">
                Verification
              </button>
              <button className="px-6 py-2 text-xs font-semibold text-zinc-500 hover:text-zinc-900 transition-colors">
                Dashboards
              </button>
              <button className="px-6 py-2 text-xs font-semibold text-zinc-500 hover:text-zinc-900 transition-colors">
                Blockchain
              </button>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="relative"
          >
            <div className="rounded-2xl border border-zinc-200 bg-white shadow-[0_32px_64px_-12px_rgba(0,0,0,0.08)] overflow-hidden">
              <div className="h-12 border-b border-zinc-100 bg-zinc-50/50 flex items-center px-6 justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-zinc-200" />
                    <div className="w-2.5 h-2.5 rounded-full bg-zinc-200" />
                    <div className="w-2.5 h-2.5 rounded-full bg-zinc-200" />
                  </div>
                  <div className="h-4 w-px bg-zinc-200" />
                  <span className="text-[10px] font-medium text-zinc-400 uppercase tracking-widest">v1.0.4-stable</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-20 h-1.5 bg-zinc-200 rounded-full" />
                  <div className="w-8 h-4 bg-zinc-900 rounded text-[9px] font-bold text-white flex items-center justify-center tracking-widest">LIVE</div>
                </div>
              </div>
              <div className="aspect-[16/9] bg-white p-8 space-y-8">
                <div className="flex items-center justify-between border-b border-zinc-100 pb-6">
                  <div className="space-y-1">
                    <h3 className="text-lg font-semibold text-zinc-900 tracking-tight">Active Procurement Feed</h3>
                    <p className="text-xs text-zinc-500">Real-time synchronization with Ethereum Sepolia</p>
                  </div>
                  <div className="flex gap-2">
                    <div className="w-24 h-8 bg-zinc-100 rounded-lg" />
                    <div className="w-8 h-8 bg-zinc-900 rounded-lg" />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-6">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="p-5 border border-zinc-100 rounded-xl space-y-4">
                      <div className="w-10 h-10 rounded-lg bg-zinc-50 border border-zinc-100 flex items-center justify-center text-zinc-400">
                        <ShieldCheck size={20} />
                      </div>
                      <div className="space-y-1.5">
                        <div className="h-3 w-3/4 bg-zinc-100 rounded" />
                        <div className="h-2 w-1/2 bg-zinc-50 rounded" />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-6 bg-zinc-900 rounded-2xl flex items-center justify-between text-white">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-zinc-800 flex items-center justify-center">
                      <Globe size={20} className="text-emerald-400" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-zinc-400">Network Status</p>
                      <p className="text-sm font-medium">Synced with 4,124 nodes</p>
                    </div>
                  </div>
                  <ArrowRight size={20} className="text-zinc-500" />
                </div>
              </div>
            </div>
            <div className="absolute -z-10 -bottom-20 left-1/2 -translate-x-1/2 w-[80%] h-40 bg-zinc-100 blur-[120px] opacity-50" />
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-40 px-6 border-t border-zinc-100">
        <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-12 gap-16 md:gap-24">
          <div className="md:col-span-5 space-y-6">
            <h2 className="text-4xl md:text-[48px] font-semibold text-zinc-900 leading-tight tracking-tightest">
              Frequently<br />Asked Questions
            </h2>
            <p className="text-zinc-500 text-sm md:text-base leading-relaxed max-w-sm">
              Common questions about how BGPS works and its role in Bhutan's digital infrastructure. Reach out at <span className="text-zinc-900 font-semibold underline underline-offset-4 cursor-pointer">support@bgps.gov.bt</span> for more information.
            </p>
          </div>
          
          <div className="md:col-span-7 space-y-2">
            {faqs.map((faq, i) => (
              <div key={i} className="border-b border-zinc-100 last:border-0 overflow-hidden">
                <button 
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full py-6 flex items-center justify-between text-left group"
                >
                  <span className="text-[15px] font-semibold text-zinc-900 group-hover:text-zinc-600 transition-colors tracking-tight">
                    {faq.q}
                  </span>
                  <ChevronDown className={`text-zinc-400 transition-transform duration-300 ${openFaq === i ? 'rotate-180' : ''}`} size={20} />
                </button>
                <motion.div 
                  initial={false}
                  animate={{ height: openFaq === i ? 'auto' : 0, opacity: openFaq === i ? 1 : 0 }}
                  className="overflow-hidden"
                >
                  <p className="pb-6 text-sm text-zinc-500 leading-relaxed max-w-xl">
                    {faq.a}
                  </p>
                </motion.div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Multi-Column Footer */}
      <footer className="py-24 px-6 border-t border-zinc-100 bg-white">
        <div className="max-w-[1200px] mx-auto space-y-24">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 md:gap-6">
            <div className="space-y-6">
              <h4 className="text-[13px] font-bold text-zinc-900 uppercase tracking-widest">Platform</h4>
              <ul className="space-y-4 text-[13px] font-medium text-zinc-500">
                <li><Link href="/transparency" className="hover:text-zinc-900 transition-colors">Transparency Portal</Link></li>
                <li><Link href="/verify" className="hover:text-zinc-900 transition-colors">Proof Verification</Link></li>
                <li><Link href="/select-role" className="hover:text-zinc-900 transition-colors">Role Selection</Link></li>
              </ul>
            </div>
            <div className="space-y-6">
              <h4 className="text-[13px] font-bold text-zinc-900 uppercase tracking-widest">Resources</h4>
              <ul className="space-y-4 text-[13px] font-medium text-zinc-500">
                <li><Link href="#" className="hover:text-zinc-900 transition-colors">Procurement Rules</Link></li>
                <li><Link href="#" className="hover:text-zinc-900 transition-colors">NDI Documentation</Link></li>
                <li><Link href="#" className="hover:text-zinc-900 transition-colors">System Changelog</Link></li>
              </ul>
            </div>
            <div className="space-y-6">
              <h4 className="text-[13px] font-bold text-zinc-900 uppercase tracking-widest">Network</h4>
              <ul className="space-y-4 text-[13px] font-medium text-zinc-500">
                <li><Link href="https://sepolia.etherscan.io" className="hover:text-zinc-900 transition-colors">Sepolia Explorer</Link></li>
                <li><Link href="#" className="hover:text-zinc-900 transition-colors">Node Status</Link></li>
              </ul>
            </div>
            <div className="space-y-6">
              <h4 className="text-[13px] font-bold text-zinc-900 uppercase tracking-widest">Legal</h4>
              <ul className="space-y-4 text-[13px] font-medium text-zinc-500">
                <li><Link href="#" className="hover:text-zinc-900 transition-colors">Privacy Policy</Link></li>
                <li><Link href="#" className="hover:text-zinc-900 transition-colors">Terms of Service</Link></li>
              </ul>
            </div>
          </div>

          <div className="pt-12 border-t border-zinc-100 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-4 text-[12px] font-medium text-zinc-400">
              <span>© BGPS 2026 · Built for Bhutan National Procurement</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
