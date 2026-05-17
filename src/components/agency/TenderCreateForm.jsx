'use client';
import { useState } from 'react';
import { 
  FileText, 
  DollarSign, 
  Calendar, 
  Upload, 
  Loader2, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';
import { generateDocumentHash } from '@/lib/hash/document-hash';

export default function TenderCreateForm({ onSubmit }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    estimatedAmount: '',
    submissionDeadline: '',
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
      alert('Please upload the tender document.');
      return;
    }

    setLoading(true);
    try {
      // 1. Generate hash
      const reader = new FileReader();
      reader.onload = async (event) => {
        const hash = generateDocumentHash(event.target.result);
        
        // 2. Submit
        await onSubmit({
          ...formData,
          file,
          tenderHash: hash
        });
      };
      reader.readAsArrayBuffer(file);
    } catch (err) {
      console.error(err);
      alert('Failed to save tender.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-1.5">
        <label className="text-xs font-bold text-zinc-700 uppercase tracking-wider">Tender Title</label>
        <div className="relative">
          <FileText className="absolute left-3 top-2.5 text-zinc-400" size={16} />
          <input
            required
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full pl-9 pr-4 py-2 bg-zinc-50 border border-zinc-200 rounded-lg focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-900 outline-none transition-all font-medium text-sm"
            placeholder="e.g. Rural Road Maintenance Project Phase II"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-bold text-zinc-700 uppercase tracking-wider">Description</label>
        <textarea
          required
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={3}
          className="w-full px-4 py-2 bg-zinc-50 border border-zinc-200 rounded-lg focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-900 outline-none transition-all text-sm"
          placeholder="Briefly describe the procurement requirement..."
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-zinc-700 uppercase tracking-wider">Estimated Amount (Nu.)</label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
            <input
              required
              type="number"
              name="estimatedAmount"
              value={formData.estimatedAmount}
              onChange={handleChange}
              className="w-full pl-9 pr-4 py-2 bg-zinc-50 border border-zinc-200 rounded-lg focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-900 outline-none transition-all text-sm"
              placeholder="0.00"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-zinc-700 uppercase tracking-wider">Submission Deadline</label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
            <input
              required
              type="datetime-local"
              name="submissionDeadline"
              value={formData.submissionDeadline}
              onChange={handleChange}
              className="w-full pl-9 pr-4 py-2 bg-zinc-50 border border-zinc-200 rounded-lg focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-900 outline-none transition-all text-sm"
            />
          </div>
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-bold text-zinc-700 uppercase tracking-wider">Tender Document (SBD/Technical Spec)</label>
        <div className={`relative border-2 border-dashed rounded-xl p-6 transition-all flex flex-col items-center justify-center gap-2 ${
          file ? 'border-indigo-200 bg-indigo-50/50' : 'border-zinc-200 bg-zinc-50/50 hover:border-zinc-300'
        }`}>
          <input
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          {file ? (
            <>
              <CheckCircle2 className="text-indigo-600" size={32} />
              <p className="text-sm font-bold text-zinc-900">{file.name}</p>
              <p className="text-[10px] text-zinc-500 font-mono uppercase tracking-widest">Proof Hash will be generated on submit</p>
            </>
          ) : (
            <>
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-zinc-400 shadow-sm border border-zinc-100">
                <Upload size={20} />
              </div>
              <p className="text-sm font-bold text-zinc-700 mt-1">Upload PDF Document</p>
              <p className="text-[10px] text-zinc-400 uppercase tracking-widest font-bold">Encrypted & Hashed</p>
            </>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3 p-3 bg-amber-50 rounded-lg border border-amber-100">
        <AlertCircle className="text-amber-500 shrink-0" size={16} />
        <p className="text-[11px] text-amber-700 font-medium leading-relaxed">
          Saving as draft will not record the tender on the blockchain. 
          You must publish the tender manually after saving to make it official.
        </p>
      </div>

      <button
        disabled={loading}
        className="btn-primary rounded-lg w-full h-10 text-sm font-bold flex items-center justify-center gap-2 shadow-sm transition-all"
      >
        {loading ? (
          <>
            <Loader2 className="animate-spin" size={16} />
            Creating Tender Draft...
          </>
        ) : (
          'Save Tender Draft'
        )}
      </button>
    </form>
  );
}
