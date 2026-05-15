import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

const sidebarItems = [
  { label: 'Dashboard', href: '/dashboard/bidder', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg> },
  { label: 'Vendor Profile', href: '/dashboard/bidder/profile', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg> },
  { label: 'Available Tenders', href: '/dashboard/bidder/tenders', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg> },
  { label: 'My Bids', href: '/dashboard/bidder/bids', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> },
  { label: 'Procurement Status', href: '/dashboard/bidder/status', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg> },
];

const MY_BIDS = [
  { id: 'BID-4501', tender: 'National Fiber Backbone Expansion', amount: 'BTN 11,800,000', status: 'Approved', date: 'May 10, 2026' },
  { id: 'BID-4522', tender: 'IT Infrastructure Upgrade', amount: 'BTN 2,400,000', status: 'Submitted', date: 'May 12, 2026' },
  { id: 'BID-4530', tender: 'Smart City Data Center', amount: 'BTN 24,500,000', status: 'In Review', date: 'May 14, 2026' },
];

export default function MyBids() {
  return (
    <DashboardLayout sidebarItems={sidebarItems} userRole="REGISTERED VENDOR">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-dark">My Bid Submissions</h1>
            <p className="text-muted text-sm">Track the status of your submitted proposals and pricing.</p>
          </div>
          <Button variant="secondary" size="sm">Export Report</Button>
        </div>

        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="px-6 py-4 text-xs font-bold text-muted uppercase">Bid ID</th>
                  <th className="px-6 py-4 text-xs font-bold text-muted uppercase">Tender Title</th>
                  <th className="px-6 py-4 text-xs font-bold text-muted uppercase">Submitted Amount</th>
                  <th className="px-6 py-4 text-xs font-bold text-muted uppercase">Status</th>
                  <th className="px-6 py-4 text-xs font-bold text-muted uppercase">Date Submitted</th>
                  <th className="px-6 py-4 text-xs font-bold text-muted uppercase text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {MY_BIDS.map((bid) => (
                  <tr key={bid.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 text-sm font-mono font-medium text-accent">{bid.id}</td>
                    <td className="px-6 py-4 font-bold text-dark">{bid.tender}</td>
                    <td className="px-6 py-4 text-sm font-bold text-dark">{bid.amount}</td>
                    <td className="px-6 py-4">
                      <span className={`status-badge ${bid.status === 'Approved' ? 'status-approved' : 'status-pending'}`}>{bid.status}</span>
                    </td>
                    <td className="px-6 py-4 text-sm text-muted">{bid.date}</td>
                    <td className="px-6 py-4 text-right">
                      <Button variant="secondary" size="sm">View Submission</Button>
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
