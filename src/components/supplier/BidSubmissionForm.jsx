'use client';
import { useState } from 'react';
import { 
  DollarSign, 
  FileText, 
  Upload, 
  Loader2, 
  CheckCircle2, 
  AlertCircle,
  ShieldCheck
} from 'lucide-react';
import { generateDocumentHash } from '@/lib/hash/document-hash';

export default function BidSubmissionForm({ tender, onSubmit }) {
  const [formData, setFormData] = useState({
    bidAmount: '',
    proposalSummary: '',
  });
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      alert('Please upload your proposal document.');
      return;
    }

    setLoading(true);
    try {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const hash = generateDocumentHash(event.target.result);
        await onSubmit({
          ...formData,
          file,
          bidHash: hash
        });
      };
      reader.readAsArrayBuffer(file);
    } catch (err) {
      console.error(err);
      alert('Failed to process bid.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100 flex items-center gap-3">
        <ShieldCheck className="text-emerald-500" size={24} />
        <div>
          <p className="text-xs font-bold text-emerald-700 uppercase tracking-wider">Secure Bidding Active</p>
          <p className="text-sm text-emerald-800">Your proposal will be hashed and timestamped on-chain.</p>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-bold text-gray-700">Your Bid Amount (Nu.)</label>
        <div className="relative">
          <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            required
            type="number"
            name="bidAmount"
            value={formData.bidAmount}
            onChange={handleChange}
            className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-black text-lg"
            placeholder="0.00"
          />
        </div>
        <p className="text-[10px] text-gray-400 italic">Official budget estimate: Nu. {parseFloat(tender.estimated_amount).toLocaleString()}</p>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-bold text-gray-700">Proposal Summary</label>
        <textarea
          required
          name="proposalSummary"
          value={formData.proposalSummary}
          onChange={handleChange}
          rows={3}
          className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm"
          placeholder="Briefly summarize your technical approach..."
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-bold text-gray-700">Full Technical & Financial Proposal (PDF)</label>
        <div className={`relative border-2 border-dashed rounded-2xl p-10 transition-all flex flex-col items-center justify-center gap-3 ${
          file ? 'border-emerald-200 bg-emerald-50/30' : 'border-gray-200 bg-gray-50/50 hover:border-emerald-500'
        }`}>
          <input
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          {file ? (
            <>
              <CheckCircle2 className="text-emerald-500" size={40} />
              <p className="text-sm font-bold text-gray-900">{file.name}</p>
              <p className="text-xs text-gray-500 font-mono">Blockchain hash: Ready</p>
            </>
          ) : (
            <>
              <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center text-gray-400 shadow-sm">
                <Upload size={28} />
              </div>
              <p className="text-sm font-bold text-gray-700">Upload Bid Proposal</p>
              <p className="text-xs text-gray-400 uppercase tracking-widest font-bold text-center">
                This document remains private <br /> until evaluation begins
              </p>
            </>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3 p-4 bg-amber-50 rounded-xl border border-amber-100">
        <AlertCircle className="text-amber-500" size={20} />
        <p className="text-[10px] text-amber-700 font-medium">
          Once submitted, you must confirm the blockchain transaction via Rabby Wallet. 
          Your bid is not valid until the on-chain confirmation is recorded.
        </p>
      </div>

      <button
        disabled={loading}
        className="btn-primary !bg-emerald-500 w-full py-4 text-lg font-bold flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
      >
        {loading ? (
          <>
            <Loader2 className="animate-spin" size={20} />
            Hashing & Preparing Transaction...
          </>
        ) : (
          'Confirm & Submit On-Chain Bid'
        )}
      </button>
    </form>
  );
}
