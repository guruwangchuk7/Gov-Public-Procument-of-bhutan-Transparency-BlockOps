import AuditorActivationForm from '@/components/auditor/AuditorActivationForm';
import { Landmark } from 'lucide-react';

export default function AuditorInvitationPage({ params }) {
  const { token } = params;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6">
      <div className="mb-12 text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-slate-900 flex items-center justify-center text-white mx-auto shadow-2xl">
          <Landmark size={32} />
        </div>
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">BGPS Auditor Portal</h1>
          <p className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.3em] mt-1">Verification Service</p>
        </div>
      </div>

      <AuditorActivationForm token={token} />
    </div>
  );
}
