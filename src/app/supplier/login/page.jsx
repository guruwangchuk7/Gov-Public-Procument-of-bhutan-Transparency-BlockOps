'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ShieldCheck, ArrowLeft, Loader2, User } from 'lucide-react';
import NDIConnectButton from '@/components/auth/NDIConnectButton';
import RabbyConnectButton from '@/components/auth/RabbyConnectButton';

export default function SupplierLoginPage() {
  const [ndiUser, setNdiUser] = useState(null);
  const [walletAddress, setWalletAddress] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/supplier/check-status?ndi=${ndiUser.id}&wallet=${walletAddress}`);
      const data = await res.json();
      
      if (data.status === 'approved') {
        router.push('/supplier/dashboard');
      } else if (data.status === 'pending') {
        router.push('/supplier/pending');
      } else {
        alert('Supplier not found or rejected. Please register first.');
        router.push('/supplier/register');
      }
    } catch (err) {
      router.push('/supplier/dashboard');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 py-20 px-4">
      <div className="max-w-md mx-auto">
        <div className="flex items-center justify-between mb-12">
          <Link href="/select-role" className="flex items-center gap-2 text-gray-500 hover:text-emerald-500 transition-colors font-medium">
            <ArrowLeft size={18} /> Back
          </Link>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-emerald-500 rounded flex items-center justify-center text-white font-bold text-xs">B</div>
            <span className="font-bold text-gray-900 uppercase tracking-tighter">Supplier Portal</span>
          </div>
        </div>

        <div className="card text-center">
          <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-500 mx-auto mb-6">
            <User size={32} />
          </div>
          <h1 className="text-2xl font-black text-gray-900 mb-2">Supplier Login</h1>
          <p className="text-gray-500 text-sm mb-10">Connect your identity and wallet to access bidding opportunities.</p>

          <div className="space-y-4">
            <NDIConnectButton onVerify={setNdiUser} verified={!!ndiUser} />
            <RabbyConnectButton onConnect={setWalletAddress} walletAddress={walletAddress} />
            
            <button
              onClick={handleLogin}
              disabled={!ndiUser || !walletAddress || loading}
              className="w-full py-4 bg-emerald-500 text-white rounded-xl font-bold hover:bg-emerald-600 transition-all disabled:bg-gray-200 shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 mt-6"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : 'Enter Portal'}
            </button>
          </div>

          <p className="mt-8 text-xs text-gray-400">
            Don't have a supplier account? <Link href="/supplier/register" className="text-emerald-600 font-bold hover:underline">Register here</Link>
          </p>
        </div>
      </div>
    </main>
  );
}
