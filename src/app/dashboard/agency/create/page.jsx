import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

const sidebarItems = [
  { label: 'Dashboard', href: '/dashboard/agency', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg> },
  { label: 'Create Tender', href: '/dashboard/agency/create', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg> },
  { label: 'Active Tenders', href: '/dashboard/agency/active', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg> },
  { label: 'Submitted Bids', href: '/dashboard/agency/bids', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" /></svg> },
  { label: 'Vendor Evaluation', href: '/dashboard/agency/evaluation', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002 2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg> },
  { label: 'Procurement Approval', href: '/dashboard/agency/approval', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> },
  { label: 'History', href: '/dashboard/agency/history', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> },
];

export default function CreateTender() {
  return (
    <DashboardLayout sidebarItems={sidebarItems} userRole="PROCURING AGENCY">
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-dark">Create New Tender</h1>
          <p className="text-muted text-sm">Enter the details to publish a new procurement opportunity.</p>
        </div>

        <Card className="p-8 space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-dark">Tender Title</label>
              <input type="text" className="w-full p-3 rounded-xl border border-slate-200 focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-all" placeholder="e.g. Smart Street Lighting Project" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-dark">Tender Category</label>
              <select className="w-full p-3 rounded-xl border border-slate-200 focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-all">
                <option>Infrastructure</option>
                <option>IT & Electronics</option>
                <option>Medical Supplies</option>
                <option>Office Stationery</option>
                <option>Consultancy</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-dark">Description</label>
            <textarea className="w-full p-3 rounded-xl border border-slate-200 focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-all min-h-[150px]" placeholder="Provide a detailed description of the procurement requirement..."></textarea>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-dark">Estimated Budget (BTN)</label>
              <input type="number" className="w-full p-3 rounded-xl border border-slate-200 focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-all" placeholder="0.00" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-dark">Submission Deadline</label>
              <input type="date" className="w-full p-3 rounded-xl border border-slate-200 focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-all" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-dark">Tender Fee (BTN)</label>
              <input type="number" className="w-full p-3 rounded-xl border border-slate-200 focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-all" placeholder="0.00" />
            </div>
          </div>

          <div className="pt-6 border-t border-slate-100 flex justify-end gap-3">
            <Button variant="secondary">Save as Draft</Button>
            <Button variant="primary">Publish Tender</Button>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
