'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Building2, 
  Calendar, 
  DollarSign, 
  FileText, 
  ShieldCheck, 
  Gavel, 
  Loader2,
  Clock,
  ExternalLink
} from 'lucide-react';
import { format } from 'date-fns';
import BidReviewTable from '@/components/agency/BidReviewTable';
import { ethers } from 'ethers';
import BGPS_ABI from '@/lib/blockchain/abis/BGPSProcurement.json';
import { generateDocumentHash } from '@/lib/hash/document-hash';

export default function AgencyTenderDetailsPage({ params }) {
  const [tender, setTender] = useState(null);
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchTenderAndBids();
  }, [params.tenderId]);

  const fetchTenderAndBids = async () => {
    try {
      const res = await fetch(`/api/agency/tenders/${params.tenderId}`);
      const data = await res.json();
      setTender(data.tender);
      setBids(data.bids);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseTender = async () => {
    setActionLoading(true);
    try {
      const res = await fetch('/api/agency/close-tender', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tenderId: tender.id })
      });
      if (res.ok) fetchTenderAndBids();
    } catch (err) {
      alert('Failed to close tender');
    } finally {
      setActionLoading(false);
    }
  };

  const handleSelectWinner = async (bid) => {
    const justification = prompt('Enter award justification:');
    if (!justification) return;

    try {
      // 1. Generate Justification Hash
      const justificationHash = generateDocumentHash(justification);

      // 2. Blockchain Transaction
      if (!window.ethereum) throw new Error('Wallet not found');
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(
        process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
        BGPS_ABI,
        signer
      );

      const tenderIdNum = parseInt(tender.id.slice(0, 8), 16);
      const bidIdNum = parseInt(bid.id.slice(0, 8), 16);

      console.log('Recording winner selection on Sepolia...');
      const tx = await contract.recordWinnerHash(tenderIdNum, bidIdNum, `0x${justificationHash}`);
      await tx.wait();

      // 3. Database Update
      const res = await fetch('/api/agency/select-winner', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tenderId: tender.id,
          bidId: bid.id,
          supplierId: bid.supplier_id,
          justification,
          justificationHash,
          txHash: tx.hash
        })
      });

      if (res.ok) {
        alert('Winner selected and confirmed on-chain!');
        fetchTenderAndBids();
      }
    } catch (err) {
      console.error(err);
      alert(`Award failed: ${err.message}`);
    }
  };

  if (loading) return <div className="p-20 text-center text-gray-400">Loading tender review...</div>;

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <Link href="/agency/tenders" className="flex items-center gap-2 text-gray-500 hover:text-primary transition-colors font-bold text-sm">
          <ArrowLeft size={16} /> Back to Tenders
        </Link>
        {tender.status === 'published' && (
          <button 
            onClick={handleCloseTender}
            disabled={actionLoading}
            className="flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-xl font-bold hover:bg-red-500 transition-all shadow-lg shadow-gray-200"
          >
            {actionLoading ? <Loader2 className="animate-spin" size={18} /> : <Clock size={18} />}
            Close for Evaluation
          </button>
        )}
      </div>

      <div className="card">
        <div className="flex flex-col md:flex-row justify-between gap-6 mb-8">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-primary-50 flex items-center justify-center text-primary">
              <Building2 size={32} />
            </div>
            <div>
              <h1 className="text-3xl font-black text-gray-900">{tender.title}</h1>
              <p className="text-gray-500 font-medium text-sm">
                Status: <span className="uppercase font-bold text-primary">{tender.status}</span>
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-[10px] text-gray-400 font-bold uppercase">Estimated Budget</p>
              <p className="text-xl font-black text-gray-900">Nu. {parseFloat(tender.estimated_amount).toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100">
          <div className="space-y-1">
            <p className="text-[10px] text-gray-400 font-bold uppercase">Published On</p>
            <p className="text-sm font-bold text-gray-800">{format(new Date(tender.published_at), 'MMM dd, yyyy')}</p>
          </div>
          <div className="space-y-1">
            <p className="text-[10px] text-gray-400 font-bold uppercase">Deadline</p>
            <p className="text-sm font-bold text-gray-800">{format(new Date(tender.submission_deadline), 'MMM dd, yyyy')}</p>
          </div>
          <div className="space-y-1">
            <p className="text-[10px] text-gray-400 font-bold uppercase">Bids Received</p>
            <p className="text-sm font-bold text-primary">{bids.length} Submissions</p>
          </div>
          <div className="space-y-1">
            <p className="text-[10px] text-gray-400 font-bold uppercase">Blockchain ID</p>
            <code className="text-[10px] font-mono text-indigo-600">{tender.blockchain_tx_hash?.slice(0, 16)}...</code>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-black text-gray-900 flex items-center gap-3">
            <Gavel className="text-primary" />
            Bid Evaluation
          </h2>
          {tender.status === 'published' && (
            <div className="px-4 py-2 bg-amber-50 text-amber-700 rounded-lg text-xs font-bold border border-amber-100">
              Tender must be closed before selecting a winner
            </div>
          )}
        </div>

        <div className="card !p-0 overflow-hidden">
          {bids.length > 0 ? (
            <BidReviewTable 
              bids={bids} 
              tenderStatus={tender.status} 
              onSelectWinner={handleSelectWinner} 
            />
          ) : (
            <div className="p-20 text-center">
              <FileText size={48} className="mx-auto text-gray-200 mb-4" />
              <p className="text-gray-500 font-medium">No bids received for this tender yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
