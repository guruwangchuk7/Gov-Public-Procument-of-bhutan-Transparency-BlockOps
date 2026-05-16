'use client';
import { motion } from 'framer-motion';
import { FileText, Download, Filter, Search, ShieldCheck } from 'lucide-react';

const MOCK_REPORTS = [
  { id: 'REP-001', title: 'Q1 Procurement Integrity Report', date: '2024-03-15', status: 'verified', auditor: 'Tenzin W.' },
  { id: 'REP-002', title: 'Agency #402 Compliance Audit', date: '2024-04-02', status: 'pending', auditor: 'Karma D.' },
  { id: 'REP-003', title: 'Annual Blockchain Hash Audit', date: '2024-05-10', status: 'verified', auditor: 'Guru W.' },
];

export default function AuditorReportsPage() {
  return (
    <div className="space-y-10">
      <div className="flex items-end justify-between">
        <div className="space-y-2">
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Audit Reports</h1>
          <p className="text-sm font-medium text-slate-500 italic">Formal verification documents and compliance findings</p>
        </div>
        <button className="btn bg-indigo-600 text-white h-12 px-6 shadow-lg shadow-indigo-200">
          <FileText size={16} /> Generate New Report
        </button>
      </div>

      <div className="card space-y-6">
        <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
          <div className="relative flex-1">
            <input placeholder="Search reports..." className="input-field pl-11 bg-white" />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          </div>
          <button className="btn btn-outline bg-white px-6 h-12">
            <Filter size={16} /> Filter
          </button>
        </div>

        <div className="space-y-4">
          {MOCK_REPORTS.map((report, i) => (
            <motion.div
              key={report.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="flex items-center justify-between p-6 rounded-3xl border border-slate-100 hover:border-indigo-500 hover:shadow-xl transition-all group"
            >
              <div className="flex items-center gap-6">
                <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shadow-sm group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                  <FileText size={24} />
                </div>
                <div>
                  <div className="flex items-center gap-3">
                    <h3 className="text-lg font-black text-slate-900">{report.title}</h3>
                    <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${report.status === 'verified' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                      {report.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 mt-1">
                    <span className="text-xs font-bold text-slate-400 font-mono">{report.id}</span>
                    <span className="text-xs font-medium text-slate-400">Issued by {report.auditor}</span>
                    <span className="text-xs font-medium text-slate-400">• {report.date}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="btn btn-outline p-3 hover:bg-slate-50">
                  <Download size={18} />
                </button>
                <button className="btn bg-slate-900 text-white px-6">
                  View Full Report
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
