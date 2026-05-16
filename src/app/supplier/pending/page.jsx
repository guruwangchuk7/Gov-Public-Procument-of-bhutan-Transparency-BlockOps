'use client';
import Link from 'next/link';
import { Clock, ShieldCheck, FileText, ArrowLeft } from 'lucide-react';

export default function SupplierPendingPage() {
  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-10">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 bg-emerald-500 rounded-lg flex items-center justify-center text-white font-bold">B</div>
            <span className="text-2xl font-black text-gray-900">BGPS</span>
          </Link>
          <div className="w-20 h-20 rounded-full bg-emerald-50 border-4 border-white shadow-xl flex items-center justify-center text-emerald-500 mx-auto mb-6">
            <Clock size={40} className="animate-pulse" />
          </div>
          <h1 className="text-3xl font-black text-gray-900 mb-2">Registration Submitted</h1>
          <p className="text-gray-500 font-medium text-sm px-6">
            Your supplier profile is currently being reviewed for blockchain authorization.
          </p>
        </div>

        <div className="card space-y-6">
          <div className="space-y-4">
            {[
              { 
                title: "Business Verified", 
                desc: "Your NDI and wallet link are cryptographically confirmed.", 
                icon: ShieldCheck, 
                status: "completed" 
              },
              { 
                title: "License Uploaded", 
                desc: "Your trade license has been securely hashed and stored.", 
                icon: FileText, 
                status: "completed" 
              },
              { 
                title: "Network Authorization", 
                desc: "Awaiting Admin to authorize your wallet on Ethereum Sepolia.", 
                icon: Clock, 
                status: "pending" 
              }
            ].map((step, i) => (
              <div key={i} className="flex gap-4 p-4 rounded-xl border border-gray-100 bg-white shadow-sm">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  step.status === 'completed' ? 'bg-emerald-50 text-emerald-500' : 'bg-amber-50 text-amber-500'
                }`}>
                  <step.icon size={20} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-gray-900">{step.title}</p>
                  <p className="text-xs text-gray-500 leading-tight">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100 text-center">
            <p className="text-xs text-emerald-700 font-bold">
              Notifications will be sent to your registered email upon approval.
            </p>
          </div>

          <Link href="/" className="flex items-center justify-center gap-2 text-gray-400 hover:text-emerald-500 transition-colors text-sm font-bold">
            <ArrowLeft size={16} /> Return to Home
          </Link>
        </div>
      </div>
    </main>
  );
}
