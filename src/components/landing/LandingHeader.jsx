'use client';
import Link from 'next/link';
import { useState } from 'react';
import { Bell, ShieldCheck, ChevronDown } from 'lucide-react';
import PublicNotificationDropdown from './PublicNotificationDropdown';

export default function LandingHeader() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-primary-100">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-white">
            <ShieldCheck size={24} />
          </div>
          <span className="text-2xl font-bold tracking-tight text-gray-900">
            BGPS<span className="text-primary text-sm align-top ml-1">MVP</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
          <Link href="#features" className="hover:text-primary transition-colors">Features</Link>
          <Link href="#workflow" className="hover:text-primary transition-colors">Workflow</Link>
          <Link href="/transparency" className="hover:text-primary transition-colors">Transparency</Link>
          
          <div className="relative">
            <button 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2 px-4 py-2 bg-primary-50 text-primary rounded-full hover:bg-primary-100 transition-colors"
            >
              <Bell size={18} />
              <span>Public Notifications</span>
              <ChevronDown size={14} className={`transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>
            
            {isDropdownOpen && (
              <div className="absolute top-full right-0 mt-2 w-[400px] bg-white border border-primary-100 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2">
                <PublicNotificationDropdown />
              </div>
            )}
          </div>
        </nav>

        <Link href="/select-role" className="btn-primary">
          Select Role
        </Link>
      </div>
    </header>
  );
}
