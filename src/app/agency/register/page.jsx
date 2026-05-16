import AgencyRegistrationForm from '@/components/agency/AgencyRegistrationForm';
import Link from 'next/link';
import { ArrowLeft, Landmark } from 'lucide-react';

export default function AgencyRegisterPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-20 px-6">
      <div className="max-w-7xl mx-auto space-y-12">
        <div className="flex items-center justify-between">
          <Link href="/select-role" className="btn btn-outline">
            <ArrowLeft size={16} /> Back to Roles
          </Link>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <h1 className="text-3xl font-black text-slate-900 tracking-tight">Agency Onboarding</h1>
              <p className="text-sm font-medium text-slate-500 italic">Official Procurement Registration</p>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center text-white shadow-lg">
              <Landmark size={28} />
            </div>
          </div>
        </div>

        <AgencyRegistrationForm />
      </div>
    </div>
  );
}
