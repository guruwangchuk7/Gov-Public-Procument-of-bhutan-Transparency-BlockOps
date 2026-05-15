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

const PENDING_DATA = [
  { id: 'REG-2026-101', name: 'Thimphu Construction Group', type: 'Vendor', date: 'May 14, 2026', email: 'contact@thimphuconstruction.bt', status: 'Pending Verification' },
  { id: 'REG-2026-102', name: 'Department of Forest', type: 'Agency', date: 'May 14, 2026', email: 'admin@forest.gov.bt', status: 'Document Review' },
  { id: 'REG-2026-103', name: 'Druk Hospitality Supplies', type: 'Vendor', date: 'May 13, 2026', email: 'sales@drukhospitality.bt', status: 'Pending Verification' },
  { id: 'REG-2026-104', name: 'Paro IT Solutions', type: 'Vendor', date: 'May 12, 2026', email: 'info@paroit.bt', status: 'Document Review' },
];

export default function PendingRegistrations() {
  return (
    <DashboardLayout sidebarItems={sidebarItems} userRole="PMDD OFFICIAL">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-dark">Pending Registrations</h1>
            <p className="text-muted text-sm">Review and approve new agency and vendor applications.</p>
          </div>
          <div className="flex gap-3">
            <Button variant="secondary" size="sm">Export CSV</Button>
          </div>
        </div>

        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="px-6 py-4 text-xs font-bold text-muted uppercase">ID</th>
                  <th className="px-6 py-4 text-xs font-bold text-muted uppercase">Organization</th>
                  <th className="px-6 py-4 text-xs font-bold text-muted uppercase">Type</th>
                  <th className="px-6 py-4 text-xs font-bold text-muted uppercase">Status</th>
                  <th className="px-6 py-4 text-xs font-bold text-muted uppercase">Date</th>
                  <th className="px-6 py-4 text-xs font-bold text-muted uppercase text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {PENDING_DATA.map((req) => (
                  <tr key={req.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 text-sm font-mono font-medium text-accent">{req.id}</td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-dark">{req.name}</div>
                      <div className="text-xs text-muted">{req.email}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${req.type === 'Agency' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'}`}>
                        {req.type}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="status-badge status-pending">{req.status}</span>
                    </td>
                    <td className="px-6 py-4 text-sm text-muted">{req.date}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="primary" size="sm">Review</Button>
                        <Button variant="secondary" size="sm">Reject</Button>
                      </div>
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
