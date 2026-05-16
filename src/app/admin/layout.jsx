'use client';
import { 
  LayoutDashboard, 
  Building2, 
  UserCheck, 
  ShieldCheck, 
  History, 
  Globe 
} from 'lucide-react';
import DashboardShell from '@/components/layout/DashboardShell';

const adminNavigation = [
  { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  { name: 'Agency Approvals', href: '/admin/agency-registrations', icon: Building2 },
  { name: 'Supplier Approvals', href: '/admin/supplier-registrations', icon: UserCheck },
  { name: 'Auditors', href: '/admin/auditors', icon: ShieldCheck },
  { name: 'Blockchain Events', href: '/admin/blockchain-events', icon: Globe },
  { name: 'Activity Logs', href: '/admin/activity-logs', icon: History },
];

import RoleGuard from '@/components/layout/RoleGuard';

export default function AdminLayout({ children }) {
  return (
    <RoleGuard requiredRole="Admin">
      <DashboardShell role="Admin" navigation={adminNavigation}>
        {children}
      </DashboardShell>
    </RoleGuard>
  );
}
