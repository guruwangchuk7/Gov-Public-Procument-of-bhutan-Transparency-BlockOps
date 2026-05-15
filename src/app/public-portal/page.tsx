import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

const MOCK_TENDERS = [
  { id: 'TP-2026-001', title: 'National Fiber Backbone Expansion', agency: 'Ministry of Information', budget: 'BTN 12,000,000', status: 'Awarded', winner: 'Druk Telecom', date: 'May 10, 2026' },
  { id: 'TP-2026-002', title: 'Thimphu Hospital Medical Equipment', agency: 'Ministry of Health', budget: 'BTN 8,500,000', status: 'Awarded', winner: 'MedTech Bhutan', date: 'May 08, 2026' },
  { id: 'TP-2026-003', title: 'Royal University Solar Installation', agency: 'RUB', budget: 'BTN 4,200,000', status: 'In Review', winner: '-', date: 'May 05, 2026' },
  { id: 'TP-2026-004', title: 'Bridge Construction - Paro Highway', agency: 'Department of Roads', budget: 'BTN 25,000,000', status: 'Awarded', winner: 'Gaki Construction', date: 'May 02, 2026' },
];

export default function TransparencyPortal() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <Navbar />
      
      <main className="flex-grow py-16 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-12 border-l-4 border-primary pl-8">
            <h1 className="text-3xl font-black text-primary uppercase tracking-tight mb-2">Public Transparency Portal</h1>
            <p className="text-slate-500 font-medium text-sm">Official audit records and procurement outcomes. Verified by the Kingdom of Bhutan Blockchain Infrastructure.</p>
          </div>

          {/* Search & Filter */}
          <div className="bg-white p-6 rounded border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4 mb-10">
            <div className="flex-grow relative">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input 
                type="text" 
                placeholder="Search Tender ID, Agency, or Awardee..." 
                className="w-full pl-12 pr-4 py-3 rounded border border-slate-200 focus:outline-none focus:border-accent bg-slate-50/50 text-sm font-bold text-primary placeholder:text-slate-400 placeholder:font-medium"
              />
            </div>
            <div className="flex gap-4">
              <select className="px-4 py-3 rounded border border-slate-200 bg-slate-50/50 text-[13px] font-bold text-slate-600 focus:outline-none">
                <option>All Departments</option>
                <option>Ministry of Health</option>
                <option>Ministry of Information</option>
              </select>
              <Button className="px-10">Filter Records</Button>
            </div>
          </div>

          {/* Results Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {MOCK_TENDERS.map((tender) => (
              <Card key={tender.id} className="hover:border-accent group p-6 rounded">
                <div className="flex justify-between items-start mb-6">
                  <span className="text-[10px] font-black text-slate-400 px-2 py-1 bg-slate-50 border border-slate-100 rounded uppercase tracking-widest">{tender.id}</span>
                  <span className={`status-badge ${tender.status === 'Awarded' ? 'status-approved' : 'status-pending'}`}>
                    {tender.status}
                  </span>
                </div>
                <h3 className="text-lg font-black text-primary mb-2 leading-tight min-h-[3rem]">
                  {tender.title}
                </h3>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-6">{tender.agency}</p>
                
                <div className="space-y-4 mb-8 pt-6 border-t border-slate-50">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Total Value</span>
                    <span className="text-sm font-black text-slate-900">{tender.budget}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Awarded To</span>
                    <span className="text-sm font-black text-accent">{tender.winner}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Finalized On</span>
                    <span className="text-[11px] font-bold text-slate-900">{tender.date}</span>
                  </div>
                </div>

                <Button variant="secondary" className="w-full text-[11px] font-black uppercase tracking-widest border-slate-200">
                  View Verified Audit Trail
                </Button>
              </Card>
            ))}
          </div>

          {/* Pagination */}
          <div className="mt-16 text-center">
            <Button variant="secondary" className="text-[11px] font-black uppercase tracking-widest border-slate-200">
              Show Next Page
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
