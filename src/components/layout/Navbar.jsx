import React from 'react';
import Link from 'next/link';

/**
 * Main navigation bar for the application.
 * @returns {React.JSX.Element}
 */
export const Navbar = () => {
  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-black/5 px-8 py-4 flex items-center justify-between transition-all duration-500">
      <div className="flex items-center gap-14">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="flex flex-col leading-tight">
            <span className="text-xl font-medium tracking-tighter text-primary group-hover:text-muted transition-all duration-500">
              GOVPRO
            </span>
            <span className="text-[9px] font-medium text-muted uppercase tracking-[0.25em] -mt-0.5">
              Kingdom of Bhutan
            </span>
          </div>
        </Link>
        
        <div className="hidden lg:flex items-center gap-12">
          {[
            { label: 'Transparency Portal', href: '/public-portal' },
            { label: 'Procurement Rules', href: '#' },
            { label: 'Agency Directory', href: '#' },
          ].map((item) => (
            <Link 
              key={item.label} 
              href={item.href} 
              className="relative text-[13px] font-medium text-muted hover:text-primary transition-all duration-300 py-1 group flex items-center gap-1.5"
            >
              {item.label}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary rounded-full transition-all duration-300 group-hover:w-full"></span>
            </Link>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-8">
        <div className="flex items-center gap-4">
          <Link href="/auth">
            <button className="text-[13px] font-medium text-muted hover:text-primary px-4 py-2 transition-colors">
              Sign In
            </button>
          </Link>
          <Link href="/auth">
            <button className="bg-primary text-white text-[13px] font-medium px-8 py-3 rounded-xl hover:bg-neutral-800 transition-all shadow-[0_10px_20px_-10px_rgba(0,0,0,0.3)] hover:shadow-[0_15px_25px_-10px_rgba(0,0,0,0.4)] hover:-translate-y-0.5 active:translate-y-0">
              Access Platform
            </button>
          </Link>
        </div>
      </div>
    </nav>
  );
};
