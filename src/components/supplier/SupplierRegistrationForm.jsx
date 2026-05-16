'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Building2, Mail, Phone, Hash, ShieldCheck, Wallet, FileUp, Send, CheckCircle2, Briefcase } from 'lucide-react';
import { toast } from 'sonner';
import PayloadPreview from '@/components/common/PayloadPreview';
import { useRouter } from 'next/navigation';
import { useNDI } from '@/hooks/useNDI';
import { RabbyWallet } from '@/lib/wallet/rabby';
import IdentityLinkingCard from '@/components/auth/IdentityLinkingCard';

export default function SupplierRegistrationForm() {
  const router = useRouter();
  const { ndiProfile, verifyIdentity, isVerifying: isVerifyingNDI, status: ndiStatus, proofRequest } = useNDI();
  const [walletAddress, setWalletAddress] = useState(null);
  const [isConnectingWallet, setIsConnectingWallet] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    company_name: '',
    email: '',
    phone: '',
    license_number: '',
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
      const res = await fetch('/api/supplier/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          formData: {
            ...formData,
            ndi_identifier: ndiProfile.ndi_identifier,
            wallet_address: walletAddress
          },
          documentData: {
            file_name: 'trade_license.pdf',
            storage_url: 'https://supabase.com/mock-storage/license.pdf',
            document_hash: 'sha256-' + Math.random().toString(16).slice(2, 66),
            hash_algorithm: 'SHA-256'
          }
        })
      });

      const result = await res.json();
      if (result.success) {
        toast.success('Supplier registration submitted successfully!');
        router.push('/supplier/pending');
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
          <div className="flex items-center gap-3 text-emerald-500">
            <Building2 size={24} />
            <h2 className="text-2xl font-black text-slate-900">Supplier Registration</h2>
          </div>
          <p className="text-sm text-slate-500 font-medium">Onboard your business as an authorized government bidder.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="label-text">Company Name</label>
              <div className="relative">
                <input 
                  name="company_name" 
                  value={formData.company_name} 
                  onChange={handleChange}
                  placeholder="e.g. Bhutan Tech Solutions" 
                  className="input-field pl-11" 
                  required 
                />
                <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="label-text">Business Email</label>
              <div className="relative">
                <input 
                  name="email" 
                  type="email"
                  value={formData.email} 
                  onChange={handleChange}
                  placeholder="contact@business.bt" 
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
              <label className="label-text">Trade License No.</label>
              <div className="relative">
                <input 
                  name="license_number" 
                  value={formData.license_number} 
                  onChange={handleChange}
                  placeholder="LIC-2024-XXX" 
                  className="input-field pl-11" 
                  required 
                />
                <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
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
            <label className="label-text">Valid Trade License</label>
            <div className="group relative w-full h-32 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center gap-2 hover:border-emerald-500 hover:bg-emerald-50/50 transition-all cursor-pointer">
              <FileUp className="text-slate-400 group-hover:text-emerald-500" size={24} />
              <p className="text-xs font-bold text-slate-400 group-hover:text-emerald-500">Upload scanned Trade License (PDF/Image)</p>
              <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" />
            </div>
          </div>

          <div className="pt-4 flex items-center gap-4">
            <button 
              type="submit" 
              disabled={loading}
              className="btn bg-emerald-500 text-white hover:bg-emerald-600 flex-1 h-14"
            >
              {loading ? 'Submitting...' : 'Register Business'} <Send size={18} />
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
        <PayloadPreview data={formData} title="Supplier Payload (ERD)" />
        
        <div className="card bg-emerald-50 border-emerald-100">
          <div className="flex gap-4">
            <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-emerald-500 shadow-sm">
              <CheckCircle2 size={20} />
            </div>
            <div>
              <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight">Eligibility Hint</h4>
              <p className="text-xs text-slate-500 font-medium leading-relaxed mt-1">
                Approved suppliers can browse open tenders and submit cryptographically signed bids. Registration ensures your business identity is verified on the <span className="text-emerald-600 font-bold">BGPS Blockchain</span>.
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
