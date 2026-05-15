import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

const sidebarItems = [
  { label: 'Audit Hub', href: '/dashboard/auditor', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg> },
  { label: 'Audit Logs', href: '/dashboard/auditor/logs', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg> },
  { label: 'Verification Timeline', href: '/dashboard/auditor/timeline', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> },
  { label: 'Audit Alerts', href: '/dashboard/auditor/alerts', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg> },
];

export default function AuditorDashboard() {
  return (
    <DashboardLayout sidebarItems={sidebarItems} userRole="OVERSIGHT BODY / AUDITOR">
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-dark">Audit & Monitoring Hub</h1>
          <p className="text-muted text-sm">Real-time oversight of procurement integrity and blockchain verification.</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card title="Live Audit Timeline" subtitle="Immutable blockchain activity feed">
              <div className="relative pl-6 border-l-2 border-slate-100 space-y-8">
                <TimelineItem 
                  time="10:45 AM"
                  action="Ministry Award Approval"
                  detail="TND-2026-ITX • Approved by Admin MoF"
                  status="Verified"
                />
                <TimelineItem 
                  time="09:20 AM"
                  action="Technical Evaluation Complete"
                  detail="TND-2026-ITX • Scored by Committee B"
                  status="Verified"
                />
                <TimelineItem 
                  time="Yesterday"
                  action="Blockchain Block Finalized"
                  detail="Height: 882192 • Hash: 0x7f2...a11"
                  status="Verified"
                />
              </div>
            </Card>
          </div>

          <div className="space-y-6">
            <Card title="Integrity Health">
              <div className="space-y-4">
                <HealthItem label="Blockchain Sync" value="100% Synced" status="success" />
                <HealthItem label="Audit Trail Coverage" value="99.9%" status="success" />
                <HealthItem label="Anomalies Detected" value="0" status="success" />
              </div>
            </Card>

            <Card title="Security Alerts" className="border-l-4 border-amber-400">
               <div className="p-3 bg-amber-50 rounded-lg">
                 <p className="text-xs font-bold text-amber-800 mb-1 uppercase tracking-widest">Duplicate Registration</p>
                 <p className="text-xs text-amber-700 leading-tight">Same NDI ID used for multiple vendor requests: BT-8812.</p>
               </div>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

function TimelineItem({ time, action, detail, status }) {
  return (
    <div className="relative">
      <div className="absolute -left-[31px] top-1.5 w-2.5 h-2.5 rounded-full bg-accent ring-4 ring-white shadow-sm"></div>
      <div className="flex justify-between items-start">
        <div>
          <p className="text-[10px] font-bold text-muted mb-1 uppercase tracking-widest">{time}</p>
          <h5 className="font-bold text-dark">{action}</h5>
          <p className="text-xs text-muted">{detail}</p>
        </div>
        <span className="status-badge status-approved py-0.5 text-[9px]">{status}</span>
      </div>
    </div>
  );
}

function HealthItem({ label, value, status }) {
  return (
    <div className="flex justify-between items-center py-2 border-b border-slate-50 last:border-0">
      <span className="text-sm text-muted">{label}</span>
      <span className={`text-sm font-bold ${status === 'success' ? 'text-success' : 'text-danger'}`}>{value}</span>
    </div>
  );
}
