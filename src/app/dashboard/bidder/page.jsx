import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

const sidebarItems = [
  { label: 'Dashboard', href: '/dashboard/bidder', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg> },
  { label: 'Vendor Profile', href: '/dashboard/bidder/profile', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg> },
  { label: 'Available Tenders', href: '/dashboard/bidder/tenders', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg> },
  { label: 'My Bids', href: '/dashboard/bidder/bids', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> },
  { label: 'Procurement Status', href: '/dashboard/bidder/status', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg> },
];

export default function BidderDashboard() {
  return (
    <DashboardLayout sidebarItems={sidebarItems} userRole="REGISTERED VENDOR">
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-dark">Druk IT Solutions</h1>
          <p className="text-muted text-sm">NDI Verified Vendor. Trust Score: <span className="font-bold text-success">98%</span></p>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-4 gap-6">
          <Card>
            <p className="text-sm font-medium text-muted mb-1">Active Bids</p>
            <h4 className="text-2xl font-bold text-dark">3</h4>
          </Card>
          <Card>
            <p className="text-sm font-medium text-muted mb-1">Won Tenders</p>
            <h4 className="text-2xl font-bold text-accent">6</h4>
          </Card>
          <Card>
            <p className="text-sm font-medium text-muted mb-1">Pending Results</p>
            <h4 className="text-2xl font-bold text-amber-500">2</h4>
          </Card>
          <Card>
            <p className="text-sm font-medium text-muted mb-1">Contracts Value</p>
            <h4 className="text-2xl font-bold text-dark">BTN 28M</h4>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <Card title="Recent Bid Status" headerAction={<Link href="/dashboard/bidder/bids" className="text-accent text-xs font-bold hover:underline">View All</Link>}>
            <div className="space-y-4">
               <BidStatusItem 
                 id="BID-4522" 
                 tender="IT Infrastructure Upgrade" 
                 amount="BTN 2.4M" 
                 status="In Review" 
                 date="May 12, 2026" 
               />
               <BidStatusItem 
                 id="BID-4501" 
                 tender="National Fiber Backbone Expansion" 
                 amount="BTN 11.8M" 
                 status="Awarded" 
                 date="May 10, 2026" 
               />
            </div>
          </Card>

          <Card title="Recommended Opportunities">
            <div className="space-y-4">
              <OpportunityItem 
                title="Cloud Migration for Ministry of Finance"
                deadline="20th June 2026"
                category="IT Services"
              />
              <OpportunityItem 
                title="Cybersecurity Audit for RBP"
                deadline="18th June 2026"
                category="Security"
              />
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}

function BidStatusItem({ id, tender, amount, status, date }) {
  return (
    <div className="flex justify-between items-center p-4 bg-slate-50/50 rounded-xl border border-slate-100 hover:border-accent/30 transition-all">
      <div>
        <p className="text-[10px] font-mono text-muted font-bold">{id}</p>
        <p className="text-sm font-bold text-dark">{tender}</p>
        <p className="text-[10px] text-muted mt-1 uppercase font-bold tracking-widest">{date}</p>
      </div>
      <div className="text-right">
        <p className="text-sm font-bold text-dark mb-1">{amount}</p>
        <span className={`status-badge ${status === 'Awarded' ? 'status-approved' : 'status-pending'}`}>
          {status}
        </span>
      </div>
    </div>
  );
}

function OpportunityItem({ title, deadline, category }) {
  return (
    <div className="p-4 border border-slate-100 rounded-xl hover:bg-slate-50 transition-colors">
      <p className="text-[10px] font-bold text-accent mb-1 uppercase tracking-widest">{category}</p>
      <h5 className="font-bold text-dark mb-3">{title}</h5>
      <div className="flex justify-between items-center">
        <p className="text-[11px] text-muted font-medium italic">Deadline: {deadline}</p>
        <Link href="/dashboard/bidder/tenders">
          <Button size="sm" className="px-4 py-1 text-xs">View Tender</Button>
        </Link>
      </div>
    </div>
  );
}
