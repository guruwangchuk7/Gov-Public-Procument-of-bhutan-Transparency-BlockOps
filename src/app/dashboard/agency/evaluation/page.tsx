import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

const sidebarItems = [
  { label: 'Dashboard', href: '/dashboard/agency', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg> },
  { label: 'Create Tender', href: '/dashboard/agency/create', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg> },
  { label: 'Active Tenders', href: '/dashboard/agency/active', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg> },
  { label: 'Submitted Bids', href: '/dashboard/agency/bids', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" /></svg> },
  { label: 'Vendor Evaluation', href: '/dashboard/agency/evaluation', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002 2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg> },
  { label: 'Procurement Approval', href: '/dashboard/agency/approval', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> },
  { label: 'History', href: '/dashboard/agency/history', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> },
];

const EVALUATIONS = [
  { id: 'EV-101', tender: 'Smart Street Lighting', vendor: 'Druk IT Solutions', score: '92/100', status: 'Passed Technical' },
  { id: 'EV-102', tender: 'Smart Street Lighting', vendor: 'Thimphu Construction', score: '88/100', status: 'Passed Technical' },
  { id: 'EV-103', tender: 'IT Upgrade 2026', vendor: 'Paro IT Solutions', score: '75/100', status: 'Failed Technical' },
];

export default function VendorEvaluation() {
  return (
    <DashboardLayout sidebarItems={sidebarItems} userRole="PROCURING AGENCY">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-dark">Vendor Evaluation</h1>
          <p className="text-muted text-sm">Compare and score vendor proposals based on technical and financial criteria.</p>
        </div>

        <div className="grid gap-6">
          {EVALUATIONS.map((ev) => (
            <Card key={ev.id} className="p-6">
              <div className="flex justify-between items-center">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-bold text-muted uppercase tracking-widest">{ev.id}</span>
                    <span className={`status-badge ${ev.status.includes('Passed') ? 'status-approved' : 'status-rejected'}`}>{ev.status}</span>
                  </div>
                  <h3 className="text-lg font-bold text-dark">{ev.vendor}</h3>
                  <p className="text-sm text-muted">Tender: {ev.tender}</p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-black text-primary mb-1">{ev.score}</div>
                  <Button variant="secondary" size="sm">View Report</Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
