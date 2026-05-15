import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

const sidebarItems = [
  { label: 'Overview', href: '/dashboard/pmdd', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg> },
  { label: 'Pending Registrations', href: '/dashboard/pmdd/pending', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> },
  { label: 'Approved Agencies', href: '/dashboard/pmdd/agencies', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg> },
  { label: 'Approved Vendors', href: '/dashboard/pmdd/vendors', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg> },
  { label: 'Registration History', href: '/dashboard/pmdd/history', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg> },
];

export default function PMDDDashboard() {
  return (
    <DashboardLayout sidebarItems={sidebarItems} userRole="PMDD OFFICIAL">
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-dark">PMDD Control Center</h1>
          <p className="text-muted text-sm">Governance and onboarding oversight for the procurement ecosystem.</p>
        </div>

        <div className="grid md:grid-cols-4 gap-6">
          <Card className="border-l-4 border-amber-400">
            <p className="text-sm font-medium text-muted mb-1">Pending Agency</p>
            <h4 className="text-2xl font-bold text-dark">12</h4>
          </Card>
          <Card className="border-l-4 border-accent">
            <p className="text-sm font-medium text-muted mb-1">Pending Vendors</p>
            <h4 className="text-2xl font-bold text-dark">48</h4>
          </Card>
          <Card className="border-l-4 border-success">
            <p className="text-sm font-medium text-muted mb-1">Approved Entities</p>
            <h4 className="text-2xl font-bold text-dark">856</h4>
          </Card>
          <Card className="border-l-4 border-danger">
            <p className="text-sm font-medium text-muted mb-1">Flagged Activity</p>
            <h4 className="text-2xl font-bold text-dark">3</h4>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <Card title="Recent Activity" subtitle="Real-time registration stream">
            <div className="space-y-4">
              <ActivityItem 
                title="Agency Registration: Ministry of Energy"
                desc="Awaiting document verification for BT-NDI-001"
                time="2 hours ago"
                type="agency"
              />
              <ActivityItem 
                title="Vendor Onboarding: Paro Supplies"
                desc="Verified via Bhutan NDI - BT-NDI-VENDOR-X"
                time="5 hours ago"
                type="vendor"
              />
              <ActivityItem 
                title="Entity Suspension: Local Logistics"
                desc="Trust score dropped below threshold (40%)"
                time="Yesterday"
                type="flag"
              />
            </div>
          </Card>

          <Card title="Quick Tasks">
            <div className="space-y-3">
              <Button variant="secondary" className="w-full justify-start gap-3">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                Verify 12 Pending Agencies
              </Button>
              <Button variant="secondary" className="w-full justify-start gap-3">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                Review 48 Vendor Applications
              </Button>
              <Button variant="secondary" className="w-full justify-start gap-3">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                Generate Monthly Governance Report
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}

function ActivityItem({ title, desc, time, type }) {
  return (
    <div className="flex gap-4 p-4 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
      <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
        type === 'agency' ? 'bg-blue-50 text-blue-600' : 
        type === 'vendor' ? 'bg-purple-50 text-purple-600' : 'bg-red-50 text-red-600'
      }`}>
        {type === 'agency' && <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>}
        {type === 'vendor' && <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>}
        {type === 'flag' && <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>}
      </div>
      <div>
        <h5 className="text-sm font-bold text-dark">{title}</h5>
        <p className="text-xs text-muted mb-1">{desc}</p>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{time}</p>
      </div>
    </div>
  );
}
