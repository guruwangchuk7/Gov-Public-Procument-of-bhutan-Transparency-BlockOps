'use client';
import { useState } from 'react';
import { ShieldCheck, ShieldAlert, Loader2, Send, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { createClient } from '@/lib/supabase/client';
import { compareHashes } from '@/lib/hash/hash-normalization';

export default function AuditSubmissionCard({ tenderId, bidId, documentId, dbHash, blockchainHash, blockchainEventId }) {
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const supabase = createClient();

  const handleSubmit = async () => {
    if (!blockchainHash || blockchainHash === 'PENDING') {
      toast.error('Cannot submit audit without confirmed blockchain proof');
      return;
    }

    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      const res = await fetch('/api/auditor/audit-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          auditorId: user?.id,
          tenderId,
          bidId,
          documentId,
          dbHash,
          blockchainHash,
          blockchainEventId,
          notes
        })
      });

      const result = await res.json();
      if (result.success) {
        toast.success(result.message);
        setSubmitted(true);
      } else {
        toast.error(result.error.message);
      }
    } catch (err) {
      toast.error('Failed to save audit report');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="card border-emerald-500 bg-emerald-50/20 text-center py-8">
        <CheckCircle2 size={48} className="mx-auto text-emerald-500 mb-2" />
        <h3 className="font-black text-gray-900">Audit Report Filed</h3>
        <p className="text-xs text-emerald-600 font-bold uppercase mt-1">Immutable Log Recorded</p>
      </div>
    );
  }

  const isMatch = compareHashes(dbHash, blockchainHash);

  return (
    <div className="card space-y-4">
      <div className="flex items-center gap-2">
        <ShieldCheck className="text-primary" size={20} />
        <h3 className="font-black text-gray-900">Official Auditor Verdict</h3>
      </div>

      <div className="space-y-2">
        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Audit Findings / Notes</label>
        <textarea 
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Add official notes regarding hash verification..."
          className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-4 focus:ring-primary/10 outline-none min-h-[100px]"
        />
      </div>

      <div className={`p-4 rounded-xl border flex items-center justify-between ${
          isMatch ? 'bg-emerald-50 border-emerald-100' : 'bg-red-50 border-red-100'
      }`}>
        <div>
            <p className="text-[10px] font-black uppercase text-gray-500">System Status</p>
            <p className={`text-sm font-black ${isMatch ? 'text-emerald-600' : 'text-red-600'}`}>
                {isMatch ? 'VERIFIED MATCH' : 'SUSPICIOUS MISMATCH'}
            </p>
        </div>
        {isMatch ? <ShieldCheck className="text-emerald-500" /> : <ShieldAlert className="text-red-500" />}
      </div>

      <button
        onClick={handleSubmit}
        disabled={loading || !blockchainHash}
        className="w-full py-4 bg-gray-900 text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-primary transition-all flex items-center justify-center gap-2 disabled:opacity-50"
      >
        {loading ? <Loader2 size={16} className="animate-spin" /> : <><Send size={16} /> Submit Official Report</>}
      </button>
    </div>
  );
}
