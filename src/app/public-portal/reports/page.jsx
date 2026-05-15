import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export default function TransparencyReports() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <Navbar />
      
      <main className="flex-grow py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12">
            <h1 className="text-3xl font-black text-primary uppercase tracking-tight mb-2">Transparency Reports</h1>
            <p className="text-slate-500 font-medium text-sm">Download official procurement performance and transparency audits.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <ReportCard 
              title="Annual Procurement Summary 2025" 
              date="Jan 2026" 
              size="4.2 MB"
            />
            <ReportCard 
              title="Q4 2025 Transparency Audit" 
              date="Dec 2025" 
              size="2.8 MB"
            />
            <ReportCard 
              title="Vendor Diversity & Local Impact" 
              date="Nov 2025" 
              size="1.5 MB"
            />
          </div>
        </div>
      </main>
    </div>
  );
}

function ReportCard({ title, date, size }) {
  return (
    <Card className="p-8 flex flex-col justify-between">
      <div>
        <div className="w-12 h-12 bg-red-50 text-red-600 rounded-xl flex items-center justify-center mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
        </div>
        <h3 className="text-lg font-bold text-dark mb-2">{title}</h3>
        <p className="text-sm text-muted mb-6">Published on {date} • {size}</p>
      </div>
      <Button variant="secondary" className="w-full">Download PDF</Button>
    </Card>
  );
}
