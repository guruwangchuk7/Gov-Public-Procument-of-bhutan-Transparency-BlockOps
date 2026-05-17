'use client';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Search, Send, Trophy, Settings } from 'lucide-react';
import DashboardShell from '@/components/layout/DashboardShell';
import RoleGuard from '@/components/layout/RoleGuard';

const supplierNavigation = [
  { name: 'Dashboard', href: '/supplier/dashboard', icon: LayoutDashboard },
  { name: 'Open Tenders', href: '/supplier/tenders', icon: Search },
  { name: 'My Bids', href: '/supplier/bids', icon: Send },
  { name: 'Awards', href: '/supplier/awards', icon: Trophy },
  { name: 'Settings', href: '/supplier/settings', icon: Settings },
];

export default function SupplierLayout({ children }) {
  const pathname = usePathname();
  const isAuthPage = pathname === '/supplier/login' || pathname === '/supplier/register';

  if (isAuthPage) {
    return <>{children}</>;
  }

  return (
    <RoleGuard requiredRole="Supplier_Bidder" requireApproved={true}>
      <DashboardShell role="Supplier" navigation={supplierNavigation}>
        {children}
      </DashboardShell>
    </RoleGuard>
  );
}
