'use client';
import { 
  LayoutDashboard, 
  Search, 
  ShieldCheck, 
  History, 
  Settings 
} from 'lucide-react';
import DashboardShell from '@/components/layout/DashboardShell';

const auditorNavigation = [
  { name: 'Dashboard', href: '/auditor/dashboard', icon: LayoutDashboard },
  { name: 'Audit Search', href: '/auditor/search', icon: Search },
  { name: 'Compliance Reports', href: '/auditor/reports', icon: ShieldCheck },
  { name: 'System Logs', href: '/auditor/logs', icon: History },
  { name: 'Profile', href: '/auditor/profile', icon: Settings },
];

export default function AuditorLayout({ children }) {
  return (
    <DashboardShell role="Auditor" navigation={auditorNavigation}>
      {children}
    </DashboardShell>
  );
}
