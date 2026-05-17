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
  Bell,
  Search,
  ChevronRight
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

  const displayName = ndi_identity?.fullName || ndi_identity?.full_name || 'Verified User';
  const displayWallet = wallet_address ? `${wallet_address.slice(0, 6)}...${wallet_address.slice(-4)}` : 'No Wallet';

  return (
    <div className="min-h-screen bg-[#F9F9F9] flex font-sans">
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-zinc-200">
        <div className="h-20 flex items-center px-8 border-b border-zinc-100">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex flex-wrap w-6 h-6 gap-0.5">
              <div className="w-[11px] h-[11px] bg-zinc-900 rounded-[2px]" />
              <div className="w-[11px] h-[11px] bg-zinc-300 rounded-[2px]" />
              <div className="w-[11px] h-[11px] bg-zinc-300 rounded-[2px]" />
              <div className="w-[11px] h-[11px] bg-zinc-900 rounded-[2px]" />
            </div>
            <span className="font-semibold text-zinc-900 tracking-tightest">BGPS</span>
          </Link>
        </div>

        <div className="flex-1 px-4 py-6 space-y-8 overflow-y-auto">
          <div>
            <p className="px-4 text-[11px] font-semibold text-zinc-400 uppercase tracking-wider mb-4">Menu</p>
            <nav className="space-y-1">
              {navigation.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center justify-between px-4 py-2 rounded-lg text-sm transition-all duration-200 ${
                      isActive 
                        ? 'bg-zinc-100 text-zinc-900 font-medium' 
                        : 'text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon size={18} className={isActive ? 'text-zinc-900' : 'text-zinc-400'} />
                      {item.name}
                    </div>
                    {isActive && <div className="w-1.5 h-1.5 rounded-full bg-zinc-900" />}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>

        <div className="p-4 border-t border-zinc-100">
          <div className="bg-zinc-50 rounded-xl p-4 mb-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-lg bg-white border border-zinc-200 flex items-center justify-center text-zinc-900 font-bold text-xs uppercase">
                {role[0]}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-zinc-900 truncate uppercase tracking-wider">{role.replace('_', ' ')}</p>
                <p className="text-[10px] text-zinc-400 font-medium truncate uppercase tracking-widest">Active Session</p>
              </div>
            </div>
            <button 
              onClick={handleSignOut}
              className="flex items-center justify-center gap-2 w-full py-2 bg-white border border-zinc-200 rounded-lg text-xs font-semibold text-zinc-600 hover:text-zinc-900 hover:border-zinc-300 transition-all"
            >
              <LogOut size={14} />
              Sign Out
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header className="h-20 bg-white border-b border-zinc-200 flex items-center justify-between px-8 z-20">
          <div className="flex items-center gap-4">
            <button 
              className="lg:hidden p-2 text-zinc-600"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu size={20} />
            </button>
            <div className="hidden md:flex items-center gap-2 text-sm text-zinc-400 font-medium">
              <span>Dashboard</span>
              <ChevronRight size={14} />
              <span className="text-zinc-900 font-semibold tracking-tight">
                {navigation.find(n => n.href === pathname)?.name || 'Overview'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden lg:flex items-center px-4 py-2 bg-zinc-50 border border-zinc-100 rounded-lg">
              <Search size={16} className="text-zinc-400 mr-3" />
              <input 
                type="text" 
                placeholder="Search..." 
                className="bg-transparent border-none text-sm text-zinc-900 placeholder:text-zinc-400 focus:ring-0 w-48 font-medium"
              />
            </div>

            <div className="h-6 w-px bg-zinc-200" />
            
            <div className="flex items-center gap-4">
              <div className="flex flex-col items-end">
                <p className="text-sm font-semibold text-zinc-900 leading-none mb-1">{displayName}</p>
                <code className="text-[10px] text-zinc-400 font-mono tracking-tight">{displayWallet}</code>
              </div>
              <div className="relative group">
                <div className="w-10 h-10 rounded-full bg-zinc-900 border-2 border-white shadow-sm flex items-center justify-center text-white font-bold text-sm tracking-tighter">
                  {displayName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-white" />
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-8 fade-in">
          <div className="max-w-[1280px] mx-auto">
            {children}
          </div>
        </main>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <div className="absolute inset-0 bg-zinc-900/40 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />
          <aside className="absolute top-0 left-0 bottom-0 w-72 bg-white flex flex-col shadow-2xl animate-in slide-in-from-left duration-300">
            <div className="h-20 flex items-center justify-between px-8 border-b border-zinc-100">
              <div className="flex items-center gap-3">
                <div className="flex flex-wrap w-6 h-6 gap-0.5">
                  <div className="w-[11px] h-[11px] bg-zinc-900 rounded-[2px]" />
                  <div className="w-[11px] h-[11px] bg-zinc-300 rounded-[2px]" />
                </div>
                <span className="font-semibold text-zinc-900 tracking-tightest">BGPS</span>
              </div>
              <button onClick={() => setIsMobileMenuOpen(false)}>
                <X size={20} className="text-zinc-400" />
              </button>
            </div>
            <nav className="flex-1 p-6 space-y-2">
              {navigation.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-all ${
                      isActive 
                        ? 'bg-zinc-100 text-zinc-900 font-semibold' 
                        : 'text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50'
                    }`}
                  >
                    <Icon size={18} />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
            <div className="p-6 border-t border-zinc-100">
              <button 
                onClick={handleSignOut}
                className="flex items-center gap-3 px-4 py-3 w-full text-sm font-semibold text-red-600 hover:bg-red-50 rounded-lg transition-colors"
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
