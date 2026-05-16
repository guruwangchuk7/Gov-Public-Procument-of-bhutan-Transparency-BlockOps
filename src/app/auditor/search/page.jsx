'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Search, ShieldAlert, ChevronRight, FileText, User, Building2 } from 'lucide-react';
import AuditSearchBar from '@/components/auditor/AuditSearchBar';

export default function AuditorSearchPage() {
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (query, type) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/auditor/search?q=${query}&type=${type}`);
      const data = await res.json();
      setResults(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-black text-gray-900">System Audit & Verification</h1>
        <p className="text-gray-500 max-w-xl mx-auto">
          Search the entire procurement lifecycle by ID or cryptographic hash to verify compliance and integrity.
        </p>
      </div>

      <AuditSearchBar onSearch={handleSearch} />

      {loading ? (
        <div className="p-20 text-center text-gray-400">Searching global ledger...</div>
      ) : results ? (
        <div className="space-y-6">
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Search Results</h3>
          {results.length > 0 ? (
            <div className="grid grid-cols-1 gap-4">
              {results.map((item) => (
                <Link 
                  key={item.id}
                  href={`/auditor/timeline/${item.id}`}
                  className="card flex items-center justify-between hover:border-primary transition-all group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-primary-50 group-hover:text-primary transition-colors">
                      {item.type === 'tender' ? <FileText size={24} /> : 
                       item.type === 'agency' ? <Building2 size={24} /> : 
                       <User size={24} />}
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900">{item.title || item.name}</h4>
                      <p className="text-xs text-gray-500 uppercase font-medium">{item.type} • ID: {item.id}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-black text-emerald-500 uppercase px-2 py-1 bg-emerald-50 rounded-md">
                      Verified On-Chain
                    </span>
                    <ChevronRight className="text-gray-300 group-hover:text-primary transition-colors" />
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="p-20 text-center card bg-gray-50">
              <ShieldAlert size={48} className="mx-auto text-gray-200 mb-4" />
              <p className="text-gray-500 font-medium">No records found matching your query.</p>
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}
