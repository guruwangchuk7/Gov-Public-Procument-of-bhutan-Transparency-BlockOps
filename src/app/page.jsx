import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative py-24 px-6 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 opacity-10">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-black/10 blur-[120px] rounded-full"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-black/5 blur-[120px] rounded-full"></div>
        </div>
        
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-black text-primary tracking-tight mb-8 leading-[1.1]">
            Bhutan Procurement <br /> 
            <span className="text-muted">Transparency System</span>
          </h1>
          <p className="text-xl text-muted max-w-3xl mx-auto mb-12 font-medium leading-relaxed">
            A blockchain-powered platform ensuring accountability, efficiency, and public trust 
            in government procurement for the Kingdom of Bhutan.
          </p>
          
          <div className="flex flex-wrap justify-center gap-6">
            <Link href="/public-portal" className="btn-primary px-10 py-4 text-base">
              Public Transparency Portal
            </Link>
            <Link href="/auth" className="btn-secondary px-10 py-4 text-base">
              Authorized Login
            </Link>
          </div>
        </div>
      </section>

      {/* Dashboard Access Section */}
      <section className="py-24 bg-white border-y border-border">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-16 text-center">
            <h2 className="text-3xl font-black text-primary mb-4 text-balance">Stakeholder Dashboards</h2>
            <p className="text-muted font-medium">Select a portal to explore the system's core capabilities</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <DashboardCard 
              title="PMDD Dashboard" 
              desc="Registration and onboarding management for agencies and vendors."
              href="/dashboard/pmdd"
              icon={<svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>}
              color="bg-black"
            />
            <DashboardCard 
              title="Procuring Agency" 
              desc="Full tender lifecycle management from creation to award."
              href="/dashboard/agency"
              icon={<svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>}
              color="bg-neutral-800"
            />
            <DashboardCard 
              title="Bidder Dashboard" 
              desc="Participate in tenders, submit proposals and track bids."
              href="/dashboard/bidder"
              icon={<svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>}
              color="bg-neutral-700"
            />
            <DashboardCard 
              title="Auditor Portal" 
              desc="Lightweight oversight and verification of blockchain audit logs."
              href="/dashboard/auditor"
              icon={<svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>}
              color="bg-neutral-600"
            />
            <DashboardCard 
              title="Transparency Portal" 
              desc="Public access to awarded contracts and procurement timeline."
              href="/public-portal"
              icon={<svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>}
              color="bg-neutral-500"
            />
          </div>
        </div>
      </section>
    </div>
  );
}

/**
 * Interactive card component for the home page to navigate to different portals.
 * @param {Object} props
 * @param {string} props.title - Card title
 * @param {string} props.desc - Brief description
 * @param {string} props.href - Destination link
 * @param {React.ReactNode} props.icon - Icon element
 * @param {string} props.color - CSS class for the icon background color
 * @returns {React.JSX.Element}
 */
function DashboardCard({ title, desc, href, icon, color }) {
  return (
    <Link href={href} className="group glass-card p-8 block hover:no-underline">
      <div className={`w-16 h-16 ${color} rounded-2xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform shadow-lg shadow-black/10`}>
        {icon}
      </div>
      <h3 className="text-xl font-bold text-primary mb-3">{title}</h3>
      <p className="text-muted text-sm font-medium leading-relaxed mb-6">
        {desc}
      </p>
      <div className="flex items-center gap-2 text-primary text-sm font-bold group-hover:translate-x-1 transition-transform">
        Explore Dashboard
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
      </div>
    </Link>
  );
}
