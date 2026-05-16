'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Search, Filter, FileText } from 'lucide-react';
import TenderDraftTable from '@/components/agency/TenderDraftTable';
import { ethers } from 'ethers';
import BGPS_ABI from '@/lib/blockchain/abis/BGPSProcurement.json';

export default function AgencyTendersPage() {
  const [tenders, setTenders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchTenders();
  }, []);

  const fetchTenders = async () => {
    try {
      // In a real scenario, the agencyId would come from the auth session.
      // For the demo, we fetch all or handle invalid UUIDs gracefully.
      const res = await fetch('/api/agency/tenders'); 
      const data = await res.json();
      
      if (Array.isArray(data)) {
        setTenders(data);
      } else {
        console.error('API Error:', data.error);
        setTenders([]); // Ensure it's an array
      }
    } catch (err) {
      console.error('Failed to fetch tenders:', err);
      setTenders([]);
    } finally {
      setLoading(false);
    }
  };

  const handlePublish = async (tender) => {
    try {
      if (!window.ethereum) throw new Error('Wallet not found');
      
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
        BGPS_ABI,
        signer
      );

      // 1. Prepare numerical ID for contract (simplification for MVP)
      // Converting first 8 chars of UUID to a number
      const tenderIdNum = parseInt(tender.id.slice(0, 8), 16);
      
      console.log('Publishing tender to Sepolia...');
      const tx = await contract.recordTenderHash(tenderIdNum, `0x${tender.tender_hash}`);
      await tx.wait();

      // 2. Update DB
      const res = await fetch('/api/agency/publish-tender', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tenderId: tender.id,
          txHash: tx.hash,
          publishedAt: new Date().toISOString()
        })
      });

      if (res.ok) {
        fetchTenders();
        alert('Tender published to Ethereum Sepolia!');
      }
    } catch (err) {
      console.error('Publishing failed:', err);
      alert(`Publishing failed: ${err.message}`);
    }
  };

  const filteredTenders = Array.isArray(tenders) ? tenders.filter(t => 
    t.title?.toLowerCase().includes(searchTerm.toLowerCase())
  ) : [];

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Procurement Tenders</h1>
          <p className="text-sm font-medium text-slate-500 italic">Manage your department's tender cycles and contract awards</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="relative">
            <input 
              type="text"
              placeholder="Search tenders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-11 w-72 bg-white"
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          </div>
          <Link href="/agency/tenders/create" className="btn bg-slate-900 text-white h-12 px-6 shadow-xl shadow-slate-200">
            <Plus size={18} /> Create Tender
          </Link>
        </div>
      </div>

      <div className="card !p-0 overflow-hidden min-h-[400px] flex flex-col">
        {loading ? (
          <div className="flex-1 flex flex-col items-center justify-center space-y-4">
            <div className="w-12 h-12 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin" />
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Loading Tenders...</p>
          </div>
        ) : filteredTenders.length > 0 ? (
          <TenderDraftTable 
            tenders={filteredTenders} 
            onPublish={handlePublish}
          />
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-20 text-center space-y-6">
            <div className="w-24 h-24 rounded-3xl bg-slate-50 flex items-center justify-center text-slate-200">
              <FileText size={48} />
            </div>
            <div className="space-y-2">
              <p className="text-xl font-black text-slate-900">No tenders found</p>
              <p className="text-sm text-slate-500 font-medium max-w-xs mx-auto">
                You haven't created any procurement cycles yet or no results match your search.
              </p>
            </div>
            <Link href="/agency/tenders/create" className="btn btn-outline px-8 h-12">
              Create your first tender
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
