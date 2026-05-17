'use client';
import { useState, useEffect } from 'react';
import { ShieldCheck, FileText, Search, Loader2, ArrowLeft, Download, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export default function AuditorReportsPage() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Simulating database fetch for auditor reports
    const timer = setTimeout(() => {
      setReports([
        {
          id: 'REP-2026-001',
          title: 'Q1 Bhutan Road Procurement Security Audit',
          auditor: 'Tenzin Choden',
          status: 'Passed',
          verifiedAt: '2026-05-10T10:30:00Z',
          hash: 'sha256-4b2a8d3c1e9f8a7c6b5d4e3f2a1b0c9d8e7f6a5b4c3d2e1f0a9b8c7d6e5f4a3'
        },
        {
          id: 'REP-2026-002',
          title: 'Ministry of Finance Stationery Bid Audit',
          auditor: 'Dorji Penjor',
          status: 'Passed',
          verifiedAt: '2026-05-12T14:45:00Z',
          hash: 'sha256-1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2'
        }
      ]);
      setLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  const filteredReports = reports.filter(r => 
    r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 max-w-7xl mx-auto p-4 md:p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Link href="/auditor/dashboard" className="text-zinc-400 hover:text-zinc-900 transition-colors flex items-center gap-1 text-xs font-bold uppercase tracking-wider">
              <ArrowLeft size={14} /> Back to Dashboard
            </Link>
          </div>
          <h1 className="text-3xl font-black text-zinc-900 tracking-tight">Audit Reports Ledger</h1>
          <p className="text-zinc-500 mt-1">Historically compiled and cryptographically verified auditor reports.</p>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
          <input 
            type="text"
            placeholder="Search reports..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 bg-white border border-zinc-200 rounded-xl text-sm focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-900 outline-none transition-all w-64 shadow-sm"
          />
        </div>
      </div>

      {/* Reports Table Card */}
      <div className="card !p-0 overflow-hidden bg-white border-zinc-200 shadow-sm rounded-2xl">
        {loading ? (
          <div className="p-20 flex flex-col items-center justify-center text-zinc-400 space-y-4">
            <Loader2 size={32} className="animate-spin text-zinc-300" />
            <p className="text-sm font-medium">Loading reports...</p>
          </div>
        ) : filteredReports.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest bg-zinc-50/80 border-b border-zinc-100">
                  <th className="px-6 py-4">Report Details</th>
                  <th className="px-6 py-4">Auditor</th>
                  <th className="px-6 py-4">Cryptographic Hash</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {filteredReports.map((report) => (
                  <tr key={report.id} className="hover:bg-zinc-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shadow-sm shrink-0">
                          <FileText size={18} />
                        </div>
                        <div>
                          <span className="text-sm font-bold text-zinc-900 block">{report.title}</span>
                          <span className="text-[10px] text-zinc-400 font-mono tracking-tight block mt-0.5">ID: {report.id}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-zinc-600 font-medium">{report.auditor}</td>
                    <td className="px-6 py-4">
                      <code className="text-xs text-zinc-400 font-mono bg-zinc-50 px-2 py-1 rounded border border-zinc-100 break-all select-all">
                        {report.hash.slice(0, 24)}...
                      </code>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-600 border border-emerald-100">
                        <CheckCircle2 size={12} /> {report.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-xs font-bold text-zinc-600 hover:text-zinc-900 transition-colors bg-white border border-zinc-200 hover:border-zinc-300 px-3 py-1.5 rounded-lg shadow-sm inline-flex items-center gap-1.5">
                        <Download size={14} /> Download PDF
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-20 text-center">
            <ShieldCheck size={48} className="mx-auto text-zinc-200 mb-4" />
            <p className="text-zinc-500 font-medium text-sm">No auditor reports matched your search.</p>
          </div>
        )}
      </div>
    </div>
  );
}
