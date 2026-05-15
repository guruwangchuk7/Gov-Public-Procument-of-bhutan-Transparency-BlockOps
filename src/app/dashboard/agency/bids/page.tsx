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

const BIDS = [
  { id: 'BID-7701', vendor: 'Druk IT Solutions', tender: 'Smart Street Lighting', amount: 'BTN 3,200,000', status: 'Pending Review', date: 'May 14, 2026' },
  { id: 'BID-7705', vendor: 'Thimphu Construction', tender: 'Smart Street Lighting', amount: 'BTN 3,500,000', status: 'In Evaluation', date: 'May 13, 2026' },
  { id: 'BID-7712', vendor: 'Gaki Supplies', tender: 'Office Stationery 2026', amount: 'BTN 750,000', status: 'Pending Review', date: 'May 14, 2026' },
];

export default function SubmittedBids() {
  return (
    <DashboardLayout sidebarItems={sidebarItems} userRole="PROCURING AGENCY">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-dark">Submitted Bids</h1>
          <p className="text-muted text-sm">Review proposals submitted by vendors for your tenders.</p>
        </div>

        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="px-6 py-4 text-xs font-bold text-muted uppercase">Bid ID</th>
                  <th className="px-6 py-4 text-xs font-bold text-muted uppercase">Vendor</th>
                  <th className="px-6 py-4 text-xs font-bold text-muted uppercase">Tender Name</th>
                  <th className="px-6 py-4 text-xs font-bold text-muted uppercase">Amount</th>
                  <th className="px-6 py-4 text-xs font-bold text-muted uppercase">Status</th>
                  <th className="px-6 py-4 text-xs font-bold text-muted uppercase text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {BIDS.map((bid) => (
                  <tr key={bid.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 text-sm font-mono font-medium text-accent">{bid.id}</td>
                    <td className="px-6 py-4 font-bold text-dark">{bid.vendor}</td>
                    <td className="px-6 py-4 text-sm text-muted">{bid.tender}</td>
                    <td className="px-6 py-4 text-sm font-bold text-dark">{bid.amount}</td>
                    <td className="px-6 py-4">
                      <span className="status-badge status-pending">{bid.status}</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Button variant="secondary" size="sm">Evaluate</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
