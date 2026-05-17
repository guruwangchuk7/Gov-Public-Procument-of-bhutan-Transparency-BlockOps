'use client';

import AgencyRegistrationForm from '@/components/agency/AgencyRegistrationForm';
import Link from 'next/link';
import { ArrowLeft, Landmark } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AgencyRegisterPage() {
  return (
    <main className="min-h-screen bg-zinc-50 flex flex-col items-center py-20 px-6 selection:bg-zinc-900 selection:text-white font-sans relative">
      {/* Absolute Navigation */}
      <Link 
        href="/select-role" 
        className="absolute top-10 left-10 text-zinc-400 hover:text-zinc-900 transition-colors flex items-center gap-2 text-[10px] font-medium z-50"
      >
        <ArrowLeft size={12} /> Back to Selection
      </Link>

      <div className="w-full max-w-4xl space-y-12">
        {/* Header Section */}
        <div className="flex flex-col items-center text-center space-y-6">
          <div className="w-16 h-16 rounded-[24px] bg-zinc-900 flex items-center justify-center text-white shadow-2xl shadow-zinc-200">
            <Landmark size={28} />
          </div>
          
          <div className="space-y-2">
            <h1 className="text-4xl font-semibold text-zinc-900 tracking-tightest uppercase">Agency Onboarding</h1>
            <p className="text-zinc-500 text-sm max-w-md mx-auto">Register your government unit to begin creating and awarding secure, blockchain-verified tenders.</p>
          </div>
        </div>

        {/* Focused Form Container */}
        <div className="bg-white border border-zinc-200 rounded-[40px] p-8 md:p-12 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.06)]">
          <AgencyRegistrationForm />
        </div>

        {/* Support Footer */}
        <div className="text-center">
          <p className="text-[10px] font-bold text-zinc-300 uppercase tracking-widest leading-relaxed">
            Secured by Bhutan National Digital Identity<br />
            Official Government Procurement Gateway
          </p>
        </div>
      </div>
    </main>
  );
}
