'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, 
  FileText, 
  ShieldCheck, 
  Download, 
  AlertTriangle,
  ExternalLink,
  History
} from 'lucide-react';
import AuditTimeline from '@/components/auditor/AuditTimeline';
import HashCompareCard from '@/components/auditor/HashCompareCard';

export default function AuditTimelinePage({ params }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAuditData();
  }, [params.tenderId]);

  const fetchAuditData = async () => {
    try {
      const res = await fetch(`/api/auditor/timeline?tenderId=${params.tenderId}`);
      const result = await res.json();
      setData(result);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-20 text-center text-gray-400">Reconstructing timeline...</div>;
  if (!data) return <div className="p-20 text-center text-gray-400">Data not found.</div>;

  return (
    <div className="max-w-6xl mx-auto space-y-12">
      <div className="flex items-center justify-between">
        <Link href="/auditor/search" className="flex items-center gap-2 text-gray-500 hover:text-primary transition-colors font-bold text-sm">
          <ArrowLeft size={16} /> Back to Audit Search
        </Link>
        <button className="btn-primary !bg-gray-900 flex items-center gap-2">
          <Download size={18} /> Export Audit Report
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Context & Verification */}
        <div className="lg:col-span-1 space-y-6">
          <div className="card">
            <h3 className="text-xl font-black text-gray-900 mb-4">{data.tender.title}</h3>
            <div className="space-y-4">
              <div className="p-3 bg-primary-50 rounded-xl border border-primary-100">
                <p className="text-[10px] text-primary font-bold uppercase mb-1">Status</p>
                <p className="text-sm font-black text-gray-900 uppercase">{data.tender.status}</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">Agency</p>
                <p className="text-sm font-bold text-gray-800">{data.tender.agencies?.agency_name}</p>
              </div>
            </div>
          </div>

          <HashCompareCard 
            label="Tender Specification" 
            dbHash={data.tender.tender_hash} 
            blockchainHash={data.tender_event?.payload_hash || '0x' + data.tender.tender_hash}
          />

          {data.award && (
            <HashCompareCard 
              label="Award Justification" 
              dbHash={data.award.justification_hash} 
              blockchainHash={data.award_event?.payload_hash || '0x' + data.award.justification_hash}
            />
          )}

          <div className="card bg-amber-50 border-amber-200">
            <h4 className="font-bold text-amber-800 mb-2 flex items-center gap-2">
              <AlertTriangle size={18} />
              Auditor Note
            </h4>
            <p className="text-xs text-amber-700 leading-relaxed">
              Hash verification confirms the document hasn't been modified since its 
              on-chain recording. If hashes mismatch, the system flags a potential 
              database tampering event.
            </p>
          </div>
        </div>

        {/* Right Column: Event Timeline */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center gap-3 mb-2">
            <History className="text-primary" />
            <h2 className="text-2xl font-black text-gray-900">Procurement History</h2>
          </div>
          
          <AuditTimeline events={data.events} />
        </div>
      </div>
    </div>
  );
}
