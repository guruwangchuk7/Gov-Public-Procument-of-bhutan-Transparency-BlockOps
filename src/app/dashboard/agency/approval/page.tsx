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

const PENDING_APPROVALS = [
  { id: 'APP-501', tender: 'Smart Street Lighting', recommendedVendor: 'Druk IT Solutions', amount: 'BTN 3.2M', deadline: 'May 18, 2026' },
  { id: 'APP-505', tender: 'Office Stationery Supply', recommendedVendor: 'Gaki Supplies', amount: 'BTN 0.75M', deadline: 'May 20, 2026' },
];

export default function ProcurementApproval() {
  return (
    <DashboardLayout sidebarItems={sidebarItems} userRole="PROCURING AGENCY">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-dark">Procurement Approval</h1>
          <p className="text-muted text-sm">Finalize tender awards and approve procurement decisions.</p>
        </div>

        <div className="grid gap-6">
          {PENDING_APPROVALS.map((app) => (
            <Card key={app.id} className="p-8 border-l-4 border-accent">
              <div className="flex flex-col md:flex-row justify-between gap-8">
                <div className="flex-grow space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-muted uppercase tracking-widest">{app.id}</span>
                    <span className="status-badge status-pending">Awaiting Final Approval</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-dark">{app.tender}</h3>
                    <p className="text-sm text-muted">Recommended: <span className="font-bold text-accent">{app.recommendedVendor}</span></p>
                  </div>
                  <div className="flex gap-8">
                    <div>
                      <p className="text-[10px] text-muted font-bold uppercase tracking-widest">Award Amount</p>
                      <p className="text-lg font-bold text-dark">{app.amount}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-muted font-bold uppercase tracking-widest">Review Deadline</p>
                      <p className="text-lg font-bold text-danger">{app.deadline}</p>
                    </div>
                  </div>
                </div>
                <div className="flex md:flex-col justify-end gap-3 shrink-0">
                  <Button variant="primary">Approve Award</Button>
                  <Button variant="secondary">Request Clarification</Button>
                  <Button variant="secondary" className="text-danger">Reject Recommendation</Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
