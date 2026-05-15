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

const VENDORS = [
  { id: 'VN-001', name: 'Druk IT Solutions', category: 'IT Services', contact: 'contact@drukit.bt', rating: '4.8/5', status: 'Active' },
  { id: 'VN-002', name: 'Thimphu Construction', category: 'Infrastructure', contact: 'info@tcg.bt', rating: '4.5/5', status: 'Active' },
  { id: 'VN-003', name: 'Bhutan Medics', category: 'Medical', contact: 'sales@bmedics.bt', rating: '4.9/5', status: 'Active' },
  { id: 'VN-004', name: 'Gaki Supplies', category: 'General', contact: 'admin@gaki.bt', rating: '4.2/5', status: 'Under Review' },
];

export default function ApprovedVendors() {
  return (
    <DashboardLayout sidebarItems={sidebarItems} userRole="PMDD OFFICIAL">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-dark">Approved Vendors</h1>
            <p className="text-muted text-sm">Manage verified suppliers and service providers.</p>
          </div>
          <Button variant="primary" size="sm">+ Onboard Vendor</Button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {VENDORS.map((vendor) => (
            <Card key={vendor.id} className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <span className={`status-badge ${vendor.status === 'Active' ? 'status-approved' : 'status-pending'}`}>{vendor.status}</span>
              </div>
              <h3 className="text-lg font-bold text-dark mb-1">{vendor.name}</h3>
              <p className="text-xs text-muted mb-4">{vendor.category}</p>
              
              <div className="space-y-2 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-muted">Contact:</span>
                  <span className="font-medium">{vendor.contact}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted">Trust Score:</span>
                  <span className="font-medium text-accent">{vendor.rating}</span>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button variant="secondary" size="sm" className="w-full">View Details</Button>
                <Button variant="secondary" size="sm" className="px-3 text-danger">Suspend</Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
