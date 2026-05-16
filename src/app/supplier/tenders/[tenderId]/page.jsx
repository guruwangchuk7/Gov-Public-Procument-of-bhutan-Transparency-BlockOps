'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Building2, 
  Calendar, 
  DollarSign, 
  FileText, 
  Globe, 
  ShieldCheck,
  ExternalLink
} from 'lucide-react';
import { format } from 'date-fns';
import BidSubmissionForm from '@/components/supplier/BidSubmissionForm';
import { ethers } from 'ethers';
import BGPS_ABI from '@/lib/blockchain/abis/BGPSProcurement.json';

export default function TenderDetailsPage({ params }) {
  const [tender, setTender] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchTenderDetails();
  }, [params.tenderId]);

  const fetchTenderDetails = async () => {
    try {
      const res = await fetch(`/api/public/tender-record?tenderId=${params.tenderId}`);
      const data = await res.json();
      setTender(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitBid = async (bidData) => {
    try {
      // 1. Blockchain Transaction
      if (!window.ethereum) throw new Error('Rabby Wallet not found');
      
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(
        process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
        BGPS_ABI,
        signer
      );

      const tenderIdNum = parseInt(tender.id.slice(0, 8), 16);
      const bidIdNum = Math.floor(Math.random() * 1000000); // Random ID for MVP
      
      console.log('Recording bid hash on Sepolia...');
      const tx = await contract.recordBidHash(tenderIdNum, bidIdNum, `0x${bidData.bidHash}`);
      await tx.wait();

      // 2. Database Submission
      const formData = new FormData();
      formData.append('tenderId', tender.id);
      formData.append('bidAmount', bidData.bidAmount);
      formData.append('proposalSummary', bidData.proposalSummary);
      formData.append('bidHash', bidData.bidHash);
      formData.append('txHash', tx.hash);
      formData.append('file', bidData.file);
      formData.append('supplierId', 'supplier-uuid'); // From session

      const res = await fetch('/api/supplier/submit-bid', {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        alert('Bid submitted successfully and confirmed on-chain!');
        router.push('/supplier/bids');
      }
    } catch (err) {
      console.error(err);
      alert(`Bidding failed: ${err.message}`);
    }
  };

  if (loading) return <div className="p-20 text-center text-gray-400">Loading tender details...</div>;
  if (!tender) return <div className="p-20 text-center text-gray-400">Tender not found.</div>;

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <Link href="/supplier/tenders" className="flex items-center gap-2 text-gray-500 hover:text-primary transition-colors font-bold text-sm">
        <ArrowLeft size={16} /> Back to Open Tenders
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Tender Info */}
        <div className="lg:col-span-2 space-y-8">
          <div className="card">
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-primary-50 flex items-center justify-center text-primary">
                  <Building2 size={32} />
                </div>
                <div>
                  <h1 className="text-3xl font-black text-gray-900">{tender.title}</h1>
                  <p className="text-gray-500 font-medium uppercase tracking-widest text-xs mt-1">
                    {tender.agencies?.agency_name} • ID: {tender.id.slice(0, 8)}
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                <div className="flex items-center gap-2 text-gray-400 mb-1">
                  <DollarSign size={14} />
                  <span className="text-[10px] font-bold uppercase">Budget Estimate</span>
                </div>
                <p className="text-lg font-black text-gray-900">Nu. {parseFloat(tender.estimated_amount).toLocaleString()}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                <div className="flex items-center gap-2 text-gray-400 mb-1">
                  <Calendar size={14} />
                  <span className="text-[10px] font-bold uppercase">Deadline</span>
                </div>
                <p className="text-lg font-black text-red-500">{format(new Date(tender.submission_deadline), 'MMM dd, yyyy')}</p>
              </div>
              <div className="p-4 bg-indigo-50 rounded-2xl border border-indigo-100">
                <div className="flex items-center gap-2 text-indigo-400 mb-1">
                  <Globe size={14} />
                  <span className="text-[10px] font-bold uppercase">Blockchain Proof</span>
                </div>
                <a 
                  href={`https://sepolia.etherscan.io/tx/${tender.blockchain_tx_hash}`}
                  target="_blank"
                  className="text-xs font-bold text-indigo-600 hover:underline flex items-center gap-1"
                >
                  Verified Confirmed <ExternalLink size={10} />
                </a>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-bold text-gray-900">Description</h3>
              <p className="text-gray-600 leading-relaxed text-sm">{tender.description}</p>
            </div>

            <div className="mt-8 pt-8 border-t border-gray-100">
              <h3 className="font-bold text-gray-900 mb-4">Official Documents</h3>
              <div className="flex items-center gap-4 p-4 bg-primary-50 rounded-2xl border border-primary-100">
                <FileText className="text-primary" size={24} />
                <div className="flex-1">
                  <p className="text-sm font-bold text-gray-900">Standard Bidding Document (SBD)</p>
                  <p className="text-[10px] text-gray-500 font-mono">HASH: {tender.tender_hash.slice(0, 16)}...</p>
                </div>
                <a 
                  href={tender.documents?.[0]?.storage_url} 
                  target="_blank"
                  className="px-4 py-2 bg-white text-primary border border-primary-100 rounded-lg text-xs font-bold hover:bg-primary hover:text-white transition-all"
                >
                  Download Spec
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bid Form */}
        <div className="space-y-6">
          <div className="card border-emerald-100 bg-emerald-50/10">
            <h2 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-2">
              <ShieldCheck className="text-emerald-500" />
              Submit Your Bid
            </h2>
            <BidSubmissionForm tender={tender} onSubmit={handleSubmitBid} />
          </div>

          <div className="card bg-gray-900 text-white p-6">
            <h4 className="font-bold mb-3 flex items-center gap-2">
              <ShieldCheck size={18} className="text-emerald-400" />
              Blockchain Guarantee
            </h4>
            <p className="text-xs text-gray-400 leading-relaxed">
              Your bid amount and proposal are hashed together. The government cannot open or 
              alter your bid until the submission deadline passes. The blockchain records the 
              exact time of your submission.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
