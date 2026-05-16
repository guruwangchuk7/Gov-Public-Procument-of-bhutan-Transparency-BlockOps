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
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <label className="text-sm font-bold text-gray-700">Tender Title</label>
        <div className="relative">
          <FileText className="absolute left-3 top-3.5 text-gray-400" size={18} />
          <input
            required
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-medium"
            placeholder="e.g. Rural Road Maintenance Project Phase II"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-bold text-gray-700">Description</label>
        <textarea
          required
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={4}
          className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm"
          placeholder="Briefly describe the procurement requirement..."
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-700">Estimated Amount (Nu.)</label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              required
              type="number"
              name="estimatedAmount"
              value={formData.estimatedAmount}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
              placeholder="0.00"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-700">Submission Deadline</label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              required
              type="datetime-local"
              name="submissionDeadline"
              value={formData.submissionDeadline}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
            />
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-bold text-gray-700">Tender Document (SBD/Technical Spec)</label>
        <div className={`relative border-2 border-dashed rounded-2xl p-10 transition-all flex flex-col items-center justify-center gap-3 ${
          file ? 'border-primary-200 bg-primary-50/30' : 'border-gray-200 bg-gray-50/50 hover:border-primary'
        }`}>
          <input
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          {file ? (
            <>
              <CheckCircle2 className="text-primary" size={40} />
              <p className="text-sm font-bold text-gray-900">{file.name}</p>
              <p className="text-xs text-gray-500 font-mono">Proof Hash will be generated on submit</p>
            </>
          ) : (
            <>
              <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center text-gray-400 shadow-sm">
                <Upload size={28} />
              </div>
              <p className="text-sm font-bold text-gray-700">Upload PDF Document</p>
              <p className="text-xs text-gray-400 uppercase tracking-widest font-bold">Encrypted & Hashed</p>
            </>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3 p-4 bg-amber-50 rounded-xl border border-amber-100">
        <AlertCircle className="text-amber-500" size={20} />
        <p className="text-xs text-amber-700 font-medium">
          Saving as draft will not record the tender on the blockchain. 
          You must publish the tender manually after saving to make it official.
        </p>
      </div>

      <button
        disabled={loading}
        className="btn-primary w-full py-4 text-lg font-bold flex items-center justify-center gap-2 shadow-lg shadow-primary/20"
      >
        {loading ? (
          <>
            <Loader2 className="animate-spin" size={20} />
            Creating Tender Draft...
          </>
        ) : (
          'Save Tender Draft'
        )}
      </button>
    </form>
  );
}
