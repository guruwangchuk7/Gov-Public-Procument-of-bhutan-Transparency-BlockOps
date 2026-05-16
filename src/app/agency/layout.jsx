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

import RoleGuard from '@/components/layout/RoleGuard';

export default function AgencyLayout({ children }) {
  return (
    <RoleGuard requiredRole="Procuring_Agency" requireApproved={true}>
      <DashboardShell role="Agency" navigation={agencyNavigation}>
        {children}
      </DashboardShell>
    </RoleGuard>
  );
}
