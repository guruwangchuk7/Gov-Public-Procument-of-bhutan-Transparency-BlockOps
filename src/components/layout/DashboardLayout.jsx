import React from 'react';
import Link from 'next/link';
import { Navbar } from './Navbar';

/**
 * Layout component for dashboard pages with a sidebar and navbar.
 * @param {Object} props
 * @param {React.ReactNode} props.children - Main content area
 * @param {Array<{label: string, href: string, icon: React.ReactNode}>} props.sidebarItems - Links for the sidebar
 * @param {string} props.userRole - Display name for the user's role
 * @returns {React.JSX.Element}
 */
export const DashboardLayout = ({ children, sidebarItems, userRole }) => {
  return (
    <div className="flex flex-col min-h-screen bg-neutral-50/50">
      <Navbar />
      
      <div className="flex flex-grow">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r border-black/5 hidden md:flex flex-col">
          <div className="p-8 border-b border-black/5 mb-6 bg-black/[0.01]">
            <p className="text-[10px] font-medium text-muted uppercase tracking-[0.2em] mb-2">OFFICIAL ACCESS</p>
            <p className="text-sm font-medium text-primary tracking-tight">{userRole}</p>
          </div>
          
          <nav className="flex-grow p-4 space-y-1">
            {sidebarItems.map((item) => (
              <Link 
                key={item.label} 
                href={item.href}
                className="flex items-center gap-3 px-4 py-3 rounded text-[13px] font-medium text-muted hover:bg-black/[0.03] hover:text-primary transition-all group"
              >
                <span className="group-hover:text-primary transition-colors">
                  {item.icon}
                </span>
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="p-6 mt-auto border-t border-black/5">
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded text-[13px] font-medium text-muted hover:bg-black/[0.03] hover:text-black transition-all">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Terminate Session
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-grow p-10 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};
