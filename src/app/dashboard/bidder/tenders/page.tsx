import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

const sidebarItems = [
  { label: 'Dashboard', href: '/dashboard/bidder', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg> },
  { label: 'Vendor Profile', href: '/dashboard/bidder/profile', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg> },
  { label: 'Available Tenders', href: '/dashboard/bidder/tenders', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg> },
  { label: 'My Bids', href: '/dashboard/bidder/bids', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> },
  { label: 'Procurement Status', href: '/dashboard/bidder/status', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg> },
];

const TENDERS = [
  { id: 'TND-2026-015', title: 'National Fiber Backbone Expansion', agency: 'Ministry of Infrastructure', budget: 'BTN 15M', deadline: 'Jun 30, 2026', category: 'IT' },
  { id: 'TND-2026-018', title: 'Medical Equipment Supply', agency: 'Ministry of Health', budget: 'BTN 4.2M', deadline: 'Jul 15, 2026', category: 'Medical' },
  { id: 'TND-2026-022', title: 'Smart City Data Center', agency: 'Thimphu Thromde', budget: 'BTN 25M', deadline: 'Aug 05, 2026', category: 'IT' },
  { id: 'TND-2026-025', title: 'Education Portal Development', agency: 'Ministry of Education', budget: 'BTN 2.8M', deadline: 'Jul 10, 2026', category: 'Software' },
];

export default function AvailableTenders() {
  return (
    <DashboardLayout sidebarItems={sidebarItems} userRole="REGISTERED VENDOR">
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-dark">Available Tenders</h1>
            <p className="text-muted text-sm">Browse and apply for active procurement opportunities.</p>
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            <input type="text" placeholder="Search tenders..." className="flex-grow md:w-64 p-2 rounded-lg border border-slate-200 text-sm outline-none focus:border-accent transition-all" />
            <Button variant="secondary" size="sm">Filter</Button>
          </div>
        </div>

        <div className="grid gap-4">
          {TENDERS.map((tender) => (
            <Card key={tender.id} className="p-6">
              <div className="flex flex-col md:flex-row justify-between gap-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-slate-100 text-[10px] font-bold text-muted rounded uppercase tracking-wider">{tender.category}</span>
                    <span className="text-xs font-mono text-muted">{tender.id}</span>
                  </div>
                  <h3 className="text-lg font-bold text-dark">{tender.title}</h3>
                  <p className="text-sm text-accent font-medium">{tender.agency}</p>
                </div>
                
                <div className="flex flex-wrap md:flex-nowrap items-center gap-8">
                  <div className="text-center md:text-left">
                    <p className="text-[10px] text-muted font-bold uppercase tracking-widest mb-1">Budget</p>
                    <p className="text-sm font-bold text-dark">{tender.budget}</p>
                  </div>
                  <div className="text-center md:text-left">
                    <p className="text-[10px] text-muted font-bold uppercase tracking-widest mb-1">Deadline</p>
                    <p className="text-sm font-bold text-danger">{tender.deadline}</p>
                  </div>
                  <Button variant="primary" size="sm">View Details</Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
