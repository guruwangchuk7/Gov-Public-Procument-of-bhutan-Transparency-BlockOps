import React from 'react';
import Link from 'next/link';

/**
 * Premium Footer component for the Bhutan Procurement Transparency Platform.
 * Features monochromatic design, institutional branding, and site navigation.
 * @returns {React.JSX.Element}
 */
export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-black/5 pt-20 pb-10 px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
          {/* Brand Section */}
          <div className="space-y-6">
            <Link href="/" className="flex items-center gap-3 group inline-block">
              <div className="flex flex-col leading-tight">
                <span className="text-xl font-bold tracking-tighter text-primary">
                  GOVPRO
                </span>
                <span className="text-[9px] font-medium text-muted uppercase tracking-[0.25em] -mt-0.5">
                  Kingdom of Bhutan
                </span>
              </div>
            </Link>
            <p className="text-sm text-muted leading-relaxed font-medium max-w-xs">
              Ensuring transparency, accountability, and public trust in government procurement 
              through blockchain-verified audit trails and NDI-verified identity.
            </p>
          </div>

          {/* Platform Links */}
          <div>
            <h4 className="text-xs font-bold text-primary uppercase tracking-[0.2em] mb-6">Platform</h4>
            <ul className="space-y-4">
              <li><Link href="/public-portal" className="text-sm text-muted hover:text-primary transition-colors font-medium">Transparency Portal</Link></li>
              <li><Link href="/dashboard/agency" className="text-sm text-muted hover:text-primary transition-colors font-medium">Procuring Agencies</Link></li>
              <li><Link href="/dashboard/bidder" className="text-sm text-muted hover:text-primary transition-colors font-medium">Vendor Dashboard</Link></li>
              <li><Link href="/dashboard/auditor" className="text-sm text-muted hover:text-primary transition-colors font-medium">Auditor Access</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-xs font-bold text-primary uppercase tracking-[0.2em] mb-6">Resources</h4>
            <ul className="space-y-4">
              <li><Link href="#" className="text-sm text-muted hover:text-primary transition-colors font-medium">Procurement Rules</Link></li>
              <li><Link href="#" className="text-sm text-muted hover:text-primary transition-colors font-medium">Standard Bidding Docs</Link></li>
              <li><Link href="#" className="text-sm text-muted hover:text-primary transition-colors font-medium">NDI Integration Guide</Link></li>
              <li><Link href="#" className="text-sm text-muted hover:text-primary transition-colors font-medium">Blockchain Audit FAQ</Link></li>
            </ul>
          </div>

          {/* Institutional */}
          <div>
            <h4 className="text-xs font-bold text-primary uppercase tracking-[0.2em] mb-6">Institutional</h4>
            <ul className="space-y-4">
              <li><Link href="#" className="text-sm text-muted hover:text-primary transition-colors font-medium">Ministry of Finance</Link></li>
              <li><Link href="#" className="text-sm text-muted hover:text-primary transition-colors font-medium">GovTech Bhutan</Link></li>
              <li><Link href="#" className="text-sm text-muted hover:text-primary transition-colors font-medium">Anti-Corruption Commission</Link></li>
              <li><Link href="#" className="text-sm text-muted hover:text-primary transition-colors font-medium">Contact Support</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-10 border-t border-black/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-6">
            <p className="text-[11px] font-bold text-muted uppercase tracking-widest">
              © {currentYear} GOVPRO BHUTAN. ALL RIGHTS RESERVED.
            </p>
          </div>
          
          <div className="flex items-center gap-8">
            <Link href="#" className="text-[11px] font-bold text-muted hover:text-primary uppercase tracking-widest transition-colors">Privacy Policy</Link>
            <Link href="#" className="text-[11px] font-bold text-muted hover:text-primary uppercase tracking-widest transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
