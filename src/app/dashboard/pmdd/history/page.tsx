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

const HISTORY_DATA = [
  { id: 'REG-2026-085', name: 'Zimdra Group', type: 'Vendor', date: 'May 05, 2026', action: 'Approved', actor: 'PMDD Officer A' },
  { id: 'REG-2026-082', name: 'Ministry of Agriculture', type: 'Agency', date: 'May 02, 2026', action: 'Approved', actor: 'PMDD Officer B' },
  { id: 'REG-2026-078', name: 'Local Supplies Ltd', type: 'Vendor', date: 'Apr 28, 2026', action: 'Rejected', actor: 'PMDD Officer A' },
];

export default function RegistrationHistory() {
  return (
    <DashboardLayout sidebarItems={sidebarItems} userRole="PMDD OFFICIAL">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-dark">Registration History</h1>
          <p className="text-muted text-sm">Log of all past registration decisions.</p>
        </div>

        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="px-6 py-4 text-xs font-bold text-muted uppercase">ID</th>
                  <th className="px-6 py-4 text-xs font-bold text-muted uppercase">Organization</th>
                  <th className="px-6 py-4 text-xs font-bold text-muted uppercase">Action</th>
                  <th className="px-6 py-4 text-xs font-bold text-muted uppercase">Decision Date</th>
                  <th className="px-6 py-4 text-xs font-bold text-muted uppercase">Approved By</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {HISTORY_DATA.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 text-sm font-mono font-medium text-muted">{item.id}</td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-dark">{item.name}</div>
                      <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">{item.type}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`status-badge ${item.action === 'Approved' ? 'status-approved' : 'status-rejected'}`}>
                        {item.action}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-muted">{item.date}</td>
                    <td className="px-6 py-4 text-sm font-medium text-dark">{item.actor}</td>
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
