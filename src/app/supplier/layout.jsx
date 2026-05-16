'use client';
import { 
  LayoutDashboard, 
  Search, 
  Send, 
  Trophy, 
  Settings 
} from 'lucide-react';
import DashboardShell from '@/components/layout/DashboardShell';

const supplierNavigation = [
  { name: 'Dashboard', href: '/supplier/dashboard', icon: LayoutDashboard },
  { name: 'Open Tenders', href: '/supplier/tenders', icon: Search },
  { name: 'My Bids', href: '/supplier/bids', icon: Send },
  { name: 'Awards', href: '/supplier/awards', icon: Trophy },
  { name: 'Settings', href: '/supplier/settings', icon: Settings },
];

export default function SupplierLayout({ children }) {
  return (
    <DashboardShell role="Supplier" navigation={supplierNavigation}>
      {children}
    </DashboardShell>
  );
}
