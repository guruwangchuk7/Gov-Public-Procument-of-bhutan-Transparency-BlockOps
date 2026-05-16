'use client';
import Link from 'next/link';
import { ShieldCheck, ArrowRight, Gavel, FileCheck } from 'lucide-react';

export default function HeroSection() {
  return (
    <section className="relative pt-32 pb-20 overflow-hidden">
      {/* Background Ornaments */}
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-[800px] h-[800px] bg-primary-50 rounded-full blur-3xl opacity-50 z-0" />
      <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary-100 rounded-full blur-3xl opacity-30 z-0" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-50 border border-primary-100 text-primary text-xs font-bold mb-6 animate-bounce">
            <ShieldCheck size={14} />
            <span>Secured by Ethereum Sepolia</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-black text-gray-900 leading-[1.1] mb-8">
            Blockchain-Based <br />
            <span className="text-primary">Government Procurement</span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
            Enhancing transparency, accountability, and efficiency in public procurement 
            for the Kingdom of Bhutan using distributed ledger technology and 
            NDI-verified identities.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/select-role" className="btn-primary text-lg px-8 py-4 flex items-center gap-2 shadow-lg shadow-primary/20">
              Launch Application <ArrowRight size={20} />
            </Link>
            <Link href="/transparency" className="px-8 py-4 text-lg font-bold text-gray-700 hover:text-primary transition-colors flex items-center gap-2">
              View Public Records <Gavel size={20} />
            </Link>
          </div>
        </div>

        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              title: "Verified Identity",
              desc: "Every actor is verified via Bhutan NDI to ensure high-trust interactions.",
              icon: ShieldCheck,
              color: "bg-blue-500"
            },
            {
              title: "On-Chain Proof",
              desc: "Tenders and bids are hashed and timestamped on Ethereum Sepolia.",
              icon: FileCheck,
              color: "bg-primary"
            },
            {
              title: "Auditable Lifecycle",
              desc: "Complete transparency from tender publication to winner selection.",
              icon: Gavel,
              color: "bg-indigo-500"
            }
          ].map((feature, i) => (
            <div key={i} className="card group hover:border-primary transition-all duration-300 hover:-translate-y-2">
              <div className={`w-12 h-12 rounded-xl ${feature.color} text-white flex items-center justify-center mb-6 shadow-lg shadow-primary/10`}>
                <feature.icon size={24} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed text-sm">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
