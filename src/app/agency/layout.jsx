'use client';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, FileText, PlusSquare, Trophy, Settings } from 'lucide-react';
import DashboardShell from '@/components/layout/DashboardShell';
import RoleGuard from '@/components/layout/RoleGuard';

const agencyNavigation = [
  { name: 'Dashboard', href: '/agency/dashboard', icon: LayoutDashboard },
  { name: 'My Tenders', href: '/agency/tenders', icon: FileText },
  { name: 'Create Tender', href: '/agency/tenders/create', icon: PlusSquare },
  { name: 'Awards', href: '/agency/awards', icon: Trophy },
  { name: 'Profile', href: '/agency/profile', icon: Settings },
];

export default function AgencyLayout({ children }) {
  const pathname = usePathname();
  const isAuthPage = pathname === '/agency/login' || pathname === '/agency/register';

  if (isAuthPage) {
    return <>{children}</>;
  }

  return (
    <RoleGuard requiredRole="Procuring_Agency" requireApproved={true}>
      <DashboardShell role="Agency" navigation={agencyNavigation}>
        {children}
      </DashboardShell>
    </RoleGuard>
  );
}
