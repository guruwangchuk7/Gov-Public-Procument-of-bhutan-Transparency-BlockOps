'use client';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Users, 
  Building2, 
  ShieldCheck, 
  LogOut, 
  Menu, 
  X,
  Bell
} from 'lucide-react';

import { useRoleSession } from '@/hooks/useRoleSession';
import { useRouter } from 'next/navigation';

export default function DashboardShell({ children, role, navigation }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { ndi_identity, wallet_address, logoutRoleSession } = useRoleSession();

  const handleSignOut = () => {
    logoutRoleSession();
    router.push('/select-role');
  };

  const displayName = ndi_identity?.full_name || 'Verified User';
  const displayWallet = wallet_address ? `${wallet_address.slice(0, 6)}...${wallet_address.slice(-4)}` : 'No Wallet';

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-gray-200">
        <div className="h-20 flex items-center px-6 border-b border-gray-100">
          <Link href="/" className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded flex items-center justify-center text-white font-bold text-xs ${
              role === 'Admin' ? 'bg-slate-900' : 
              role === 'Supplier' ? 'bg-emerald-500' : 
              role === 'Auditor' ? 'bg-indigo-600' : 'bg-primary'
            }`}>B</div>
            <span className="font-bold text-gray-900 tracking-tight">BGPS Portal</span>
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  isActive 
                    ? 'bg-primary text-white shadow-lg shadow-primary/20' 
                    : 'text-gray-600 hover:bg-primary-50 hover:text-primary'
                }`}
              >
                <Icon size={18} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-100">
          <button 
            onClick={handleSignOut}
            className="flex items-center gap-3 px-4 py-3 w-full text-sm font-medium text-red-600 hover:bg-red-50 rounded-xl transition-colors"
          >
            <LogOut size={18} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Topbar */}
        <header className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-4 md:px-8">
          <button 
            className="lg:hidden p-2 text-gray-600"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <Menu size={24} />
          </button>

          <div className="flex-1 lg:flex-none">
            <h2 className="text-xl font-bold text-gray-900 hidden md:block">
              {navigation.find(n => n.href === pathname)?.name || 'Dashboard'}
            </h2>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden lg:flex flex-col items-end mr-2">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">On-Chain ID</span>
              <code className="text-[10px] bg-slate-50 px-2 py-0.5 rounded border border-slate-100 text-slate-500 font-mono">{displayWallet}</code>
            </div>
            
            <button className="p-2 text-gray-400 hover:text-primary transition-colors relative">
              <Bell size={20} />
              <div className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
            </button>
            
            <div className="h-8 w-px bg-gray-200 mx-1" />
            
            <div className="flex items-center gap-3 pl-2">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-black text-gray-900 leading-tight">{displayName}</p>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{role.replace('_', ' ')}</p>
              </div>
              <div className="w-10 h-10 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-black">
                {displayName.slice(0, 2).toUpperCase()}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-gray-900/50 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />
          <aside className="absolute top-0 left-0 bottom-0 w-72 bg-white flex flex-col animate-in slide-in-from-left duration-300">
            <div className="h-20 flex items-center justify-between px-6 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-primary rounded flex items-center justify-center text-white font-bold text-xs">B</div>
                <span className="font-bold text-gray-900 uppercase">BGPS Portal</span>
              </div>
              <button onClick={() => setIsMobileMenuOpen(false)}>
                <X size={24} className="text-gray-400" />
              </button>
            </div>
            <nav className="flex-1 p-4 space-y-2">
              {navigation.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                      isActive 
                        ? 'bg-primary text-white shadow-lg shadow-primary/20' 
                        : 'text-gray-600 hover:bg-primary-50 hover:text-primary'
                    }`}
                  >
                    <Icon size={18} />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
            <div className="p-4 border-t border-gray-100">
              <button 
                onClick={handleSignOut}
                className="flex items-center gap-3 px-4 py-3 w-full text-sm font-medium text-red-600 hover:bg-red-50 rounded-xl transition-colors"
              >
                <LogOut size={18} />
                Sign Out
              </button>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
