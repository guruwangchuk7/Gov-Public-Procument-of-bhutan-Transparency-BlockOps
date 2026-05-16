'use client';
import { 
  LayoutDashboard, 
  FileText, 
  PlusSquare, 
  Trophy, 
  Settings 
} from 'lucide-react';
import DashboardShell from '@/components/layout/DashboardShell';

const agencyNavigation = [
  { name: 'Dashboard', href: '/agency/dashboard', icon: LayoutDashboard },
  { name: 'My Tenders', href: '/agency/tenders', icon: FileText },
  { name: 'Create Tender', href: '/agency/tenders/create', icon: PlusSquare },
  { name: 'Awards', href: '/agency/awards', icon: Trophy },
  { name: 'Profile', href: '/agency/profile', icon: Settings },
];

export default function AgencyLayout({ children }) {
  return (
    <DashboardShell role="Agency" navigation={agencyNavigation}>
      {children}
    </DashboardShell>
  );
}
