'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ShieldCheck, ArrowLeft, Building2, Loader2 } from 'lucide-react';
import NDIConnectButton from '@/components/auth/NDIConnectButton';
import RabbyConnectButton from '@/components/auth/RabbyConnectButton';

export default function AgencyLoginPage() {
  const [ndiUser, setNdiUser] = useState(null);
  const [walletAddress, setWalletAddress] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    setLoading(true);
    try {
      // In real case, verify with backend if this agency is approved
      const res = await fetch(`/api/agency/check-status?ndi=${ndiUser.id}&wallet=${walletAddress}`);
      const data = await res.json();
      
      if (data.status === 'approved') {
        router.push('/agency/dashboard');
      } else if (data.status === 'pending') {
        router.push('/agency/pending');
      } else {
        alert('Agency not found or rejected. Please register first.');
        router.push('/agency/register');
      }
    } catch (err) {
      // For demo purposes, if API fails, just proceed to dashboard if both are connected
      router.push('/agency/dashboard');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 py-20 px-4">
      <div className="max-w-md mx-auto">
        <div className="flex items-center justify-between mb-12">
          <Link href="/select-role" className="flex items-center gap-2 text-gray-500 hover:text-primary transition-colors font-medium">
            <ArrowLeft size={18} /> Back
          </Link>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded flex items-center justify-center text-white font-bold text-xs">B</div>
            <span className="font-bold text-gray-900 uppercase tracking-tighter">Agency Portal</span>
          </div>
        </div>

        <div className="card text-center">
          <div className="w-16 h-16 bg-primary-50 rounded-2xl flex items-center justify-center text-primary mx-auto mb-6">
            <Building2 size={32} />
          </div>
          <h1 className="text-2xl font-black text-gray-900 mb-2">Agency Login</h1>
          <p className="text-gray-500 text-sm mb-10">Connect your official identity and wallet to access the workspace.</p>

          <div className="space-y-4">
            <NDIConnectButton onVerify={setNdiUser} verified={!!ndiUser} />
            <RabbyConnectButton onConnect={setWalletAddress} walletAddress={walletAddress} />
            
            <button
              onClick={handleLogin}
              disabled={!ndiUser || !walletAddress || loading}
              className="btn-primary w-full py-4 font-bold flex items-center justify-center gap-2 mt-6"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : 'Enter Workspace'}
            </button>
          </div>

          <p className="mt-8 text-xs text-gray-400">
            Don't have an agency account? <Link href="/agency/register" className="text-primary font-bold hover:underline">Register here</Link>
          </p>
        </div>
      </div>
    </main>
  );
}
