'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, 
  ShieldCheck, 
  Building2, 
  Calendar, 
  DollarSign, 
  Globe, 
  ExternalLink,
  History,
  FileText,
  Award,
  Users,
  Eye
} from 'lucide-react';
import { format } from 'date-fns';
import PublicProofCard from '@/components/public/PublicProofCard';

export default function PublicTenderDetailPage({ params }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [params.tenderId]);

  const fetchData = async () => {
    try {
      const res = await fetch(`/api/public/tender-record?tenderId=${params.tenderId}`);
      const result = await res.json();
      if (result.success) {
        setData(result.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-20 text-center text-gray-400">Loading public record...</div>;
  if (!data) return <div className="p-20 text-center text-gray-400">Record not found.</div>;

  const { tender, award, events, stats } = data;

  return (
    <main className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <nav className="bg-white border-b border-gray-100 py-6 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/transparency" className="flex items-center gap-2">
            <ArrowLeft size={18} className="text-gray-400" />
            <span className="text-sm font-bold text-gray-500">Back to Portal</span>
          </Link>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 px-3 py-1 bg-gray-100 rounded-full text-gray-500 text-[10px] font-black uppercase">
                <Eye size={12} /> {stats.views} Public Views
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-8">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 rounded-full text-emerald-600 text-[10px] font-black uppercase tracking-widest border border-emerald-100">
                <ShieldCheck size={12} /> Immutable Record
              </div>
              <h1 className="text-4xl font-black text-gray-900 leading-tight">{tender.title}</h1>
              <p className="text-gray-500 leading-relaxed text-lg">{tender.description}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="card bg-white p-6">
                <Building2 size={24} className="text-emerald-500 mb-4" />
                <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">Procuring Agency</p>
                <p className="text-sm font-black text-gray-900">{tender.agency_name}</p>
              </div>
              <div className="card bg-white p-6">
                <DollarSign size={24} className="text-emerald-500 mb-4" />
                <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">Estimated Amount</p>
                <p className="text-sm font-black text-gray-900">Nu. {tender.estimated_amount?.toLocaleString()}</p>
              </div>
              <div className="card bg-white p-6">
                <Calendar size={24} className="text-emerald-500 mb-4" />
                <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">Published Date</p>
                <p className="text-sm font-black text-gray-900">{tender.published_at ? format(new Date(tender.published_at), 'MMM dd, yyyy') : 'N/A'}</p>
              </div>
            </div>

            {/* Award Section */}
            {award && (
              <div className="card bg-emerald-900 text-white p-8 overflow-hidden relative">
                <Award className="absolute -right-10 -bottom-10 text-emerald-800 opacity-50" size={200} />
                <div className="relative z-10 space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-emerald-400 backdrop-blur-md">
                      <Award size={28} />
                    </div>
                    <div>
                      <h3 className="text-2xl font-black">Contract Awarded</h3>
                      <p className="text-emerald-400 text-xs font-bold uppercase tracking-widest">Final Winning Selection</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-6 border-t border-white/10">
                    <div>
                      <p className="text-[10px] text-emerald-400 font-bold uppercase mb-2">Winning Supplier</p>
                      <p className="text-lg font-black">{award.supplier_name}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-emerald-400 font-bold uppercase mb-2">Contract Amount</p>
                      <p className="text-lg font-black text-emerald-400 font-mono">Nu. {award.amount?.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-emerald-400 font-bold uppercase mb-2">Award Date</p>
                      <p className="text-lg font-black">{format(new Date(award.awarded_at), 'MMM dd, yyyy')}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Audit Status */}
            {data.audits?.length > 0 && (
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <UserCheck className="text-blue-500" />
                  <h2 className="text-2xl font-black text-gray-900">Official Auditor Sign-offs</h2>
                </div>
                <div className="space-y-4">
                  {data.audits.map((audit, i) => (
                    <div key={i} className="card bg-blue-50 border-blue-200 p-6 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">
                          {audit.auditors?.full_name?.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-black text-gray-900">Verified by {audit.auditors?.full_name}</p>
                          <p className="text-[10px] text-blue-600 font-bold uppercase tracking-widest">Independent Audit Confirmation</p>
                        </div>
                      </div>
                      <div className="text-right">
                         <span className="px-3 py-1 bg-blue-500 text-white text-[10px] font-black uppercase rounded-full">Verified Match</span>
                         <p className="text-[10px] text-gray-400 font-bold mt-1 uppercase">{format(new Date(audit.created_at), 'MMM dd, yyyy')}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Blockchain History */}
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <History className="text-emerald-500" />
                <h2 className="text-2xl font-black text-gray-900">Blockchain Event Ledger</h2>
              </div>
              <div className="space-y-4">
                {events.map((event) => (
                  <div key={event.id} className="card bg-white p-6 border-l-4 border-emerald-500">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-sm font-black text-gray-900">{event.event_name}</span>
                          <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 text-[9px] font-black uppercase rounded border border-emerald-100">Confirmed</span>
                        </div>
                        <p className="text-xs text-gray-500 font-medium mb-4">Confirmed on Ethereum Sepolia at block #{event.block_number}</p>
                        <div className="flex items-center gap-4">
                            <a href={`https://sepolia.etherscan.io/tx/${event.tx_hash}`} target="_blank" className="text-[10px] font-bold text-emerald-600 hover:underline flex items-center gap-1">
                                <Globe size={10} /> View Transaction
                            </a>
                            <span className="text-[10px] font-mono text-gray-400">TX: {event.tx_hash.slice(0, 16)}...</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">Confirmed At</p>
                        <p className="text-xs font-black text-gray-700">{format(new Date(event.confirmed_at), 'MMM dd, HH:mm')}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar: Proof Verification */}
          <div className="lg:col-span-1 space-y-8">
            <div className="sticky top-8 space-y-8">
              <PublicProofCard 
                tenderId={tender.id}
                tenderHash={tender.tender_hash}
                awardHash={award?.justification_hash}
                txHash={tender.blockchain_tx_hash}
              />
              
              <div className="card bg-amber-50 border-amber-200">
                <h4 className="font-bold text-amber-800 mb-2">Public Audit Info</h4>
                <p className="text-xs text-amber-700 leading-relaxed">
                  Every tender published on BGPS undergoes cryptographic hashing before 
                  being recorded on the Ethereum blockchain. This ensures that the document 
                  you view today is exactly what was approved by the government.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
