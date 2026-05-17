'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Building2, Mail, Phone, Hash, ShieldCheck, Wallet, FileUp, Send, CheckCircle2, Briefcase, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { useNDI } from '@/hooks/useNDI';
import { RabbyWallet } from '@/lib/wallet/rabby';
import { NDIVerifier } from '@/lib/ndi/ndi-verifier';
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

    const ndiIdentifier = NDIVerifier.extractNDIIdentifierFromProof(ndiProfile);

    try {
      const res = await fetch('/api/supplier/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          formData: {
            ...formData,
            ndi_identifier: ndiIdentifier,
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
    <div className="w-full max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-10">
        {/* Section 1: Business Details */}
        <div className="space-y-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1.5 h-6 bg-blue-600 rounded-full" />
            <h3 className="text-lg font-bold text-zinc-900 tracking-tight">Business Details</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest ml-1">Company Name</label>
              <div className="relative group">
                <input 
                  name="company_name" 
                  value={formData.company_name} 
                  onChange={handleChange}
                  placeholder="Bhutan Tech Solutions" 
                  className="w-full h-14 bg-zinc-50 border border-zinc-200 rounded-2xl px-12 text-sm font-medium focus:bg-white focus:border-zinc-900 focus:ring-0 transition-all outline-none" 
                  required 
                />
                <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-zinc-900 transition-colors" size={18} />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest ml-1">Business Email</label>
              <div className="relative group">
                <input 
                  name="email" 
                  type="email"
                  value={formData.email} 
                  onChange={handleChange}
                  placeholder="contact@business.bt" 
                  className="w-full h-14 bg-zinc-50 border border-zinc-200 rounded-2xl px-12 text-sm font-medium focus:bg-white focus:border-zinc-900 focus:ring-0 transition-all outline-none" 
                  required 
                />
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-zinc-900 transition-colors" size={18} />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest ml-1">Phone Number</label>
              <div className="relative group">
                <input 
                  name="phone" 
                  value={formData.phone} 
                  onChange={handleChange}
                  placeholder="+975 17XXXXXX" 
                  className="w-full h-14 bg-zinc-50 border border-zinc-200 rounded-2xl px-12 text-sm font-medium focus:bg-white focus:border-zinc-900 focus:ring-0 transition-all outline-none" 
                />
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-zinc-900 transition-colors" size={18} />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest ml-1">Trade License No.</label>
              <div className="relative group">
                <input 
                  name="license_number" 
                  value={formData.license_number} 
                  onChange={handleChange}
                  placeholder="LIC-XXXX-XXX" 
                  className="w-full h-14 bg-zinc-50 border border-zinc-200 rounded-2xl px-12 text-sm font-medium focus:bg-white focus:border-zinc-900 focus:ring-0 transition-all outline-none" 
                  required 
                />
                <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-zinc-900 transition-colors" size={18} />
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Identity Verification */}
        <div className="space-y-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1.5 h-6 bg-blue-600 rounded-full" />
            <h3 className="text-lg font-bold text-zinc-900 tracking-tight">Identity Handshake</h3>
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
        </div>

        {/* Section 3: Authorization */}
        <div className="space-y-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1.5 h-6 bg-blue-600 rounded-full" />
            <h3 className="text-lg font-bold text-zinc-900 tracking-tight">Authorization Documents</h3>
          </div>

          <div className="group relative w-full h-40 border-2 border-dashed border-zinc-100 rounded-3xl flex flex-col items-center justify-center gap-3 hover:border-blue-600 hover:bg-blue-50/30 transition-all cursor-pointer overflow-hidden">
            <div className="w-12 h-12 rounded-2xl bg-zinc-50 flex items-center justify-center text-zinc-400 group-hover:bg-white group-hover:text-blue-600 transition-all shadow-sm">
              <FileUp size={24} />
            </div>
            <div className="text-center">
              <p className="text-xs font-bold text-zinc-900">Upload scanned Trade License (PDF/Image)</p>
              <p className="text-[10px] text-zinc-400 mt-1 font-medium">Max file size: 10MB</p>
            </div>
            <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" />
          </div>
        </div>

        {/* Final Submission */}
        <div className="pt-6">
          <div className="bg-blue-50/50 border border-blue-100/50 p-6 rounded-[32px] mb-8 flex gap-4 items-start">
            <div className="w-10 h-10 rounded-2xl bg-white border border-blue-100 flex items-center justify-center text-blue-600 shrink-0 shadow-sm">
              <ShieldCheck size={20} />
            </div>
            <div>
              <p className="text-[11px] text-blue-800 font-bold uppercase tracking-tight">Eligibility Verification</p>
              <p className="text-[10px] text-blue-600 font-medium leading-relaxed mt-1">
                Once submitted, your business will enter <span className="font-bold">Pending</span> status. Our administrators will verify your credentials and license before on-chain authorization.
              </p>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading || !ndiProfile || !walletAddress}
            className="w-full h-16 bg-zinc-900 hover:bg-black text-white rounded-[24px] font-bold flex items-center justify-center gap-3 transition-all disabled:opacity-20 disabled:grayscale shadow-2xl shadow-blue-100"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : (
              <>
                <span>Register Business Account</span>
                <Send size={18} />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
