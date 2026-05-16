'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Landmark, Mail, Phone, Hash, ShieldCheck, Wallet, FileUp, Send, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import PayloadPreview from '@/components/common/PayloadPreview';
import { useRouter } from 'next/navigation';
import { useNDI } from '@/hooks/useNDI';
import { RabbyWallet } from '@/lib/wallet/rabby';
import IdentityLinkingCard from '@/components/auth/IdentityLinkingCard';

export default function AgencyRegistrationForm() {
  const router = useRouter();
  const { ndiProfile, verifyIdentity, isVerifying: isVerifyingNDI, status: ndiStatus, proofRequest } = useNDI();
  const [walletAddress, setWalletAddress] = useState(null);
  const [isConnectingWallet, setIsConnectingWallet] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    agency_name: '',
    email: '',
    phone: '',
    registration_number: '',
    status: 'pending',
    blockchain_authorized: false
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!ndiProfile || !walletAddress) {
      toast.error('Please link both NDI and Wallet before registering');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/agency/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          formData: {
            ...formData,
            ndi_identifier: ndiProfile.ndi_identifier,
            wallet_address: walletAddress
          },
          documentData: {
            file_name: 'agency_cert.pdf',
            storage_url: 'https://supabase.com/mock-storage/cert.pdf',
            document_hash: 'sha256-' + Math.random().toString(16).slice(2, 66),
            hash_algorithm: 'SHA-256'
          }
        })
      });

      const result = await res.json();
      if (result.success) {
        toast.success('Agency registration submitted successfully!');
        router.push('/agency/pending');
      } else {
        toast.error(result.error || 'Registration failed');
      }
    } catch (err) {
      toast.error('Submission failed: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="card space-y-8"
      >
        <div className="space-y-2">
          <div className="flex items-center gap-3 text-primary">
            <Landmark size={24} />
            <h2 className="text-2xl font-black text-slate-900">Agency Registration</h2>
          </div>
          <p className="text-sm text-slate-500 font-medium">Register your government unit for the BGPS platform.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="label-text">Agency Name</label>
              <div className="relative">
                <input 
                  name="agency_name" 
                  value={formData.agency_name} 
                  onChange={handleChange}
                  placeholder="e.g. Ministry of Finance" 
                  className="input-field pl-11" 
                  required 
                />
                <Landmark className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="label-text">Official Email</label>
              <div className="relative">
                <input 
                  name="email" 
                  type="email"
                  value={formData.email} 
                  onChange={handleChange}
                  placeholder="gov@bhutan.bt" 
                  className="input-field pl-11" 
                  required 
                />
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="label-text">Phone Number</label>
              <div className="relative">
                <input 
                  name="phone" 
                  value={formData.phone} 
                  onChange={handleChange}
                  placeholder="+975-XXXXXXX" 
                  className="input-field pl-11" 
                />
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="label-text">Registration No.</label>
              <div className="relative">
                <input 
                  name="registration_number" 
                  value={formData.registration_number} 
                  onChange={handleChange}
                  placeholder="RGN-2024-XXX" 
                  className="input-field pl-11" 
                  required 
                />
                <Hash className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              </div>
            </div>
          </div>

          <IdentityLinkingCard 
            ndiProfile={ndiProfile}
            walletAddress={walletAddress}
            isVerifyingNDI={isVerifyingNDI}
            isConnectingWallet={isConnectingWallet}
            onVerifyNDI={verifyIdentity}
            onConnectWallet={async () => {
              setIsConnectingWallet(true);
              try {
                const addr = await RabbyWallet.connect();
                setWalletAddress(addr);
                toast.success('Wallet Linked Successfully');
              } catch (err) {
                toast.error(err.message);
              } finally {
                setIsConnectingWallet(false);
              }
            }}
            ndiStatus={ndiStatus}
            proofRequest={proofRequest}
          />

          <div className="space-y-1.5">
            <label className="label-text">Official Authorization Document</label>
            <div className="group relative w-full h-32 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center gap-2 hover:border-primary hover:bg-primary/5 transition-all cursor-pointer">
              <FileUp className="text-slate-400 group-hover:text-primary" size={24} />
              <p className="text-xs font-bold text-slate-400 group-hover:text-primary">Click to upload official certificate (PDF)</p>
              <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" />
            </div>
          </div>

          <div className="pt-4 flex items-center gap-4">
            <button 
              type="submit" 
              disabled={loading}
              className="btn btn-primary flex-1 h-14"
            >
              {loading ? 'Submitting...' : 'Submit Registration'} <Send size={18} />
            </button>
            <button type="reset" className="btn btn-outline h-14 px-6 text-slate-400">Reset</button>
          </div>
        </form>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="space-y-8"
      >
        <PayloadPreview data={formData} />
        
        <div className="card bg-emerald-50 border-emerald-100">
          <div className="flex gap-4">
            <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-emerald-500 shadow-sm">
              <CheckCircle2 size={20} />
            </div>
            <div>
              <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight">Workflow Hint</h4>
              <p className="text-xs text-slate-500 font-medium leading-relaxed mt-1">
                Upon submission, your agency will enter <span className="text-emerald-600 font-bold">Pending</span> status. An admin will review your NDI and wallet credentials before authorizing you on the blockchain.
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
