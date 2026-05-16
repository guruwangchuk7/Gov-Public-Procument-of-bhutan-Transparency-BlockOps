'use client';
import { useState } from 'react';
import { Search, ShieldCheck, FileText, Globe, ArrowRight } from 'lucide-react';

export default function AuditSearchBar({ onSearch }) {
  const [query, setQuery] = useState('');
  const [type, setType] = useState('tender');

  const handleSearch = (e) => {
    e.preventDefault();
    if (query) onSearch(query, type);
  };

  return (
    <div className="card shadow-xl border-primary-100">
      <form onSubmit={handleSearch} className="space-y-6">
        <div className="flex flex-wrap gap-4 p-2 bg-gray-50 rounded-xl">
          {[
            { id: 'tender', label: 'Tender ID', icon: FileText },
            { id: 'hash', label: 'Document Hash', icon: ShieldCheck },
            { id: 'tx', label: 'Transaction Hash', icon: Globe },
          ].map((option) => (
            <button
              key={option.id}
              type="button"
              onClick={() => setType(option.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                type === option.id 
                  ? 'bg-primary text-white shadow-md shadow-primary/20' 
                  : 'text-gray-500 hover:bg-gray-100'
              }`}
            >
              <option.icon size={14} />
              {option.label}
            </button>
          ))}
        </div>

        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="text-gray-400 group-focus-within:text-primary transition-colors" size={20} />
          </div>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="block w-full pl-12 pr-4 py-5 bg-white border border-gray-200 rounded-2xl focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all text-gray-900 font-medium"
            placeholder={`Enter ${type === 'tender' ? 'Tender UUID' : type === 'hash' ? 'SHA-256 Hash' : '0x Transaction Hash'}...`}
          />
          <button 
            type="submit"
            className="absolute right-3 top-1/2 -translate-y-1/2 bg-gray-900 text-white p-3 rounded-xl hover:bg-primary transition-all flex items-center gap-2 font-bold text-xs"
          >
            Start Audit <ArrowRight size={16} />
          </button>
        </div>
      </form>
    </div>
  );
}
