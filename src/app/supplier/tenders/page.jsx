'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, Filter, Calendar, Building2, ChevronRight, FileText, Globe } from 'lucide-react';
import { format } from 'date-fns';

export default function SupplierOpenTendersPage() {
  const [tenders, setTenders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchOpenTenders();
  }, []);

  const fetchOpenTenders = async () => {
    try {
      const res = await fetch('/api/supplier/open-tenders');
      const data = await res.json();
      setTenders(data);
    } catch (err) {
      console.error('Failed to fetch open tenders:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredTenders = tenders.filter(t => 
    t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.agencies?.agency_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Open Tenders</h1>
          <p className="text-gray-500">Discover and bid on government procurement opportunities.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text"
              placeholder="Search tenders or agencies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all w-80"
            />
          </div>
          <button className="p-2 bg-white border border-gray-200 rounded-xl text-gray-500 hover:text-primary transition-colors">
            <Filter size={20} />
          </button>
        </div>
      </div>

      {loading ? (
        <div className="p-20 text-center text-gray-400">Loading opportunities...</div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredTenders.map((tender) => (
            <div key={tender.id} className="card group hover:border-primary transition-all duration-300">
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-primary-50 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                    <Building2 size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 group-hover:text-primary transition-colors">{tender.title}</h3>
                    <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">{tender.agencies?.agency_name}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-[10px] bg-emerald-100 text-emerald-600 px-2 py-0.5 rounded-full font-bold uppercase mb-1">
                    Published
                  </span>
                  {tender.blockchain_tx_hash && (
                    <div className="flex items-center gap-1 text-[10px] text-indigo-500 font-bold uppercase">
                      <Globe size={10} /> On-Chain
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="p-3 bg-gray-50 rounded-xl">
                  <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">Estimated Amount</p>
                  <p className="text-sm font-black text-gray-900">Nu. {parseFloat(tender.estimated_amount).toLocaleString()}</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-xl">
                  <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">Submission Deadline</p>
                  <p className="text-sm font-black text-red-500">{format(new Date(tender.submission_deadline), 'MMM dd, yyyy')}</p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Calendar size={14} />
                  Published {format(new Date(tender.published_at), 'MMM dd')}
                </div>
                <Link 
                  href={`/supplier/tenders/${tender.id}`}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg text-xs font-bold hover:bg-primary transition-colors"
                >
                  View & Submit Bid <ChevronRight size={14} />
                </Link>
              </div>
            </div>
          ))}

          {filteredTenders.length === 0 && (
            <div className="lg:col-span-2 p-20 text-center">
              <FileText size={64} className="mx-auto text-gray-200 mb-4" />
              <p className="text-gray-500 font-medium">No open tenders found matching your criteria.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
