'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ShieldCheck, ArrowRight, Lock } from 'lucide-react';
import NDIConnectButton from '@/components/auth/NDIConnectButton';
import RabbyConnectButton from '@/components/auth/RabbyConnectButton';

export default function AdminLoginPage() {
  const [ndiUser, setNdiUser] = useState(null);
  const [walletAddress, setWalletAddress] = useState(null);
  const [isAuthorizing, setIsAuthorizing] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    setIsAuthorizing(true);
    // Here we would call an API to create a session in Supabase
    // after verifying both NDI and Wallet.
    setTimeout(() => {
      router.push('/admin/dashboard');
    }, 1500);
  };

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-10">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-white font-bold">B</div>
            <span className="text-2xl font-black text-gray-900">BGPS</span>
          </Link>
          <h1 className="text-3xl font-black text-gray-900 mb-2">Admin Portal</h1>
          <p className="text-gray-500 font-medium text-sm">
            High-security access for Bhutan Procurement Authority
          </p>
        </div>

        <div className="card space-y-6">
          <div className="flex items-center gap-4 p-4 bg-primary-50 rounded-xl border border-primary-100">
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-primary">
              <Lock size={20} />
            </div>
            <div className="flex-1">
              <p className="text-xs font-bold text-primary uppercase tracking-wider">Multi-Factor Auth</p>
              <p className="text-sm text-gray-700">Verify your identity and wallet to continue.</p>
            </div>
          </div>

          <div className="space-y-4">
            <NDIConnectButton 
              onVerify={setNdiUser} 
              verified={!!ndiUser} 
            />
            <RabbyConnectButton 
              onConnect={setWalletAddress} 
              walletAddress={walletAddress} 
            />
          </div>

          <button
            onClick={handleLogin}
            disabled={!ndiUser || !walletAddress || isAuthorizing}
            className="btn-primary w-full py-4 text-lg flex items-center justify-center gap-2"
          >
            {isAuthorizing ? 'Authorizing Session...' : 'Enter Admin Dashboard'}
            {!isAuthorizing && <ArrowRight size={20} />}
          </button>
        </div>

        <p className="mt-8 text-center text-xs text-gray-400">
          By accessing this portal, you agree to the Bhutan Digital Security Framework. 
          All actions are logged on-chain.
        </p>
      </div>
    </main>
  );
}
