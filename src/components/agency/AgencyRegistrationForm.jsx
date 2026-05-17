'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Landmark, Mail, Phone, Hash, ShieldCheck, Wallet, FileUp, Send, CheckCircle2, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import PayloadPreview from '@/components/common/PayloadPreview';
import { useRouter } from 'next/navigation';
import { useNDI } from '@/hooks/useNDI';
import { RabbyWallet } from '@/lib/wallet/rabby';
import { NDIVerifier } from '@/lib/ndi/ndi-verifier';
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

    const ndiIdentifier = NDIVerifier.extractNDIIdentifierFromProof(ndiProfile);

    try {
      const res = await fetch('/api/agency/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          formData: {
            ...formData,
            ndi_identifier: ndiIdentifier,
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
    <div className="w-full max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-10">
        {/* Section 1: Official Details */}
        <div className="space-y-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1.5 h-6 bg-emerald-500 rounded-full" />
            <h3 className="text-lg font-bold text-zinc-900 tracking-tight">Official Details</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest ml-1">Agency Name</label>
              <div className="relative group">
                <input 
                  name="agency_name" 
                  value={formData.agency_name} 
                  onChange={handleChange}
                  placeholder="Ministry of Finance" 
                  className="w-full h-14 bg-zinc-50 border border-zinc-200 rounded-2xl px-12 text-sm font-medium focus:bg-white focus:border-zinc-900 focus:ring-0 transition-all outline-none" 
                  required 
                />
                <Landmark className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-zinc-900 transition-colors" size={18} />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest ml-1">Official Email</label>
              <div className="relative group">
                <input 
                  name="email" 
                  type="email"
                  value={formData.email} 
                  onChange={handleChange}
                  placeholder="gov@bhutan.bt" 
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
              <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest ml-1">Registration No.</label>
              <div className="relative group">
                <input 
                  name="registration_number" 
                  value={formData.registration_number} 
                  onChange={handleChange}
                  placeholder="RGN-XXXX-XXX" 
                  className="w-full h-14 bg-zinc-50 border border-zinc-200 rounded-2xl px-12 text-sm font-medium focus:bg-white focus:border-zinc-900 focus:ring-0 transition-all outline-none" 
                  required 
                />
                <Hash className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-zinc-900 transition-colors" size={18} />
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Identity Verification */}
        <div className="space-y-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1.5 h-6 bg-emerald-500 rounded-full" />
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
            <div className="w-1.5 h-6 bg-emerald-500 rounded-full" />
            <h3 className="text-lg font-bold text-zinc-900 tracking-tight">Authorization Documents</h3>
          </div>

          <div className="group relative w-full h-40 border-2 border-dashed border-zinc-100 rounded-3xl flex flex-col items-center justify-center gap-3 hover:border-emerald-500 hover:bg-emerald-50/30 transition-all cursor-pointer overflow-hidden">
            <div className="w-12 h-12 rounded-2xl bg-zinc-50 flex items-center justify-center text-zinc-400 group-hover:bg-white group-hover:text-emerald-500 transition-all shadow-sm">
              <FileUp size={24} />
            </div>
            <div className="text-center">
              <p className="text-xs font-bold text-zinc-900">Upload official certificate (PDF)</p>
              <p className="text-[10px] text-zinc-400 mt-1 font-medium">Max file size: 10MB</p>
            </div>
            <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" />
          </div>
        </div>

        {/* Final Submission */}
        <div className="pt-6">
          <div className="bg-emerald-50/50 border border-emerald-100/50 p-6 rounded-[32px] mb-8 flex gap-4 items-start">
            <div className="w-10 h-10 rounded-2xl bg-white border border-emerald-100 flex items-center justify-center text-emerald-500 shrink-0 shadow-sm">
              <ShieldCheck size={20} />
            </div>
            <div>
              <p className="text-[11px] text-emerald-800 font-bold uppercase tracking-tight">Approval Workflow</p>
              <p className="text-[10px] text-emerald-600 font-medium leading-relaxed mt-1">
                Your agency will enter <span className="font-bold">Pending</span> status. An administrator will verify your credentials before blockchain authorization is granted.
              </p>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading || !ndiProfile || !walletAddress}
            className="w-full h-16 bg-zinc-900 hover:bg-black text-white rounded-[24px] font-bold flex items-center justify-center gap-3 transition-all disabled:opacity-20 disabled:grayscale shadow-2xl shadow-zinc-200"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : (
              <>
                <span>Submit Registration Request</span>
                <Send size={18} />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
