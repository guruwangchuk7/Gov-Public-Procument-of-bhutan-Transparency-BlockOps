import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

const sidebarItems = [
  { label: 'Dashboard', href: '/dashboard/agency', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg> },
  { label: 'Create Tender', href: '/dashboard/agency/create', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg> },
  { label: 'Active Tenders', href: '/dashboard/agency/active', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg> },
  { label: 'Submitted Bids', href: '/dashboard/agency/bids', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" /></svg> },
  { label: 'Vendor Evaluation', href: '/dashboard/agency/evaluation', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002 2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg> },
  { label: 'Procurement Approval', href: '/dashboard/agency/approval', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> },
  { label: 'History', href: '/dashboard/agency/history', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> },
];

export default function AgencyDashboard() {
  return (
    <DashboardLayout sidebarItems={sidebarItems} userRole="PROCURING AGENCY">
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
            <h1 className="text-2xl font-bold text-dark">Ministry of Infrastructure</h1>
            <p className="text-muted text-sm">Main procurement operations dashboard. 3 tasks require your attention.</p>
          </div>
          <Link href="/dashboard/agency/create">
            <Button className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              Create New Tender
            </Button>
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          <Card>
            <p className="text-sm font-medium text-muted mb-1">Active Tenders</p>
            <div className="flex items-baseline gap-2">
              <h4 className="text-3xl font-bold text-dark">8</h4>
              <span className="text-xs text-success font-bold">+2 this month</span>
            </div>
          </Card>
          <Card>
            <p className="text-sm font-medium text-muted mb-1">Total Bids Received</p>
            <div className="flex items-baseline gap-2">
              <h4 className="text-3xl font-bold text-dark">124</h4>
              <span className="text-xs text-accent font-bold">15.5 avg/tender</span>
            </div>
          </Card>
          <Card>
            <p className="text-sm font-medium text-muted mb-1">Awarded (YTD)</p>
            <div className="flex items-baseline gap-2">
              <h4 className="text-3xl font-bold text-dark">BTN 14.2M</h4>
            </div>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card title="Priority Tenders" headerAction={<Link href="/dashboard/agency/active" className="text-accent text-xs font-bold hover:underline">View All</Link>}>
              <div className="space-y-4">
                <TenderItem 
                  id="TND-001" 
                  title="Smart Street Lighting Project" 
                  budget="BTN 3.5M" 
                  deadline="May 30, 2026" 
                  bids={12} 
                  status="Open"
                />
                <TenderItem 
                  id="TND-002" 
                  title="Office Stationery Supply 2026" 
                  budget="BTN 0.8M" 
                  deadline="Jun 15, 2026" 
                  bids={4} 
                  status="Open"
                />
              </div>
            </Card>
          </div>

          <div className="space-y-6">
            <Card title="Quick Actions">
              <div className="space-y-3">
                <Button variant="secondary" className="w-full justify-start gap-3">
                   <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
                   Upload Procurement Plan
                </Button>
                <Button variant="secondary" className="w-full justify-start gap-3">
                   <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                   Invite Verified Vendors
                </Button>
              </div>
            </Card>

            <Card title="Approvals Needed">
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="w-1.5 h-auto bg-amber-400 rounded-full"></div>
                  <div>
                    <p className="text-xs font-bold text-dark">TND-003 Evaluation Complete</p>
                    <p className="text-[10px] text-muted">Awaiting your final award approval.</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

function TenderItem({ id, title, budget, deadline, bids, status }) {
  return (
    <div className="p-4 border border-slate-100 rounded-xl hover:border-accent/30 transition-all group">
      <div className="flex justify-between items-start mb-2">
        <h5 className="font-bold text-dark group-hover:text-accent transition-colors">{title}</h5>
        <span className="status-badge status-approved">{status}</span>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div>
          <p className="text-[10px] text-muted uppercase font-bold tracking-widest">Budget</p>
          <p className="text-sm font-semibold">{budget}</p>
        </div>
        <div>
          <p className="text-[10px] text-muted uppercase font-bold tracking-widest">Deadline</p>
          <p className="text-sm font-semibold">{deadline}</p>
        </div>
        <div>
          <p className="text-[10px] text-muted uppercase font-bold tracking-widest">Bids</p>
          <p className="text-sm font-semibold text-accent">{bids} Submissions</p>
        </div>
      </div>
    </div>
  );
}
