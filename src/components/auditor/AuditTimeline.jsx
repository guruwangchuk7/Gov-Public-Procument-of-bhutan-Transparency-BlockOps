'use client';
import { 
  ShieldCheck, 
  Building2, 
  UserCheck, 
  FilePlus, 
  Globe, 
  Trophy, 
  Mail,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { format } from 'date-fns';

export default function AuditTimeline({ events }) {
  const getIcon = (eventName) => {
    switch (eventName) {
      case 'AgencyWalletAuthorized': return Building2;
      case 'SupplierWalletAuthorized': return UserCheck;
      case 'TenderCreated': return FilePlus;
      case 'BidSubmitted': return Globe;
      case 'WinnerSelected': return Trophy;
      default: return ShieldCheck;
    }
  };

  return (
    <div className="space-y-8">
      {events.map((event, i) => {
        const Icon = getIcon(event.event_name);
        return (
          <div key={event.id} className="relative pl-10 group">
            {/* Timeline Line */}
            {i !== events.length - 1 && (
              <div className="absolute left-[19px] top-10 bottom-[-32px] w-0.5 bg-gray-100 group-hover:bg-primary-100 transition-colors" />
            )}
            
            {/* Timeline Icon */}
            <div className={`absolute left-0 top-0 w-10 h-10 rounded-full flex items-center justify-center border-4 border-white shadow-sm transition-all group-hover:scale-110 z-10 ${
              event.tx_status === 'confirmed' ? 'bg-emerald-500 text-white' : 'bg-amber-400 text-white'
            }`}>
              <Icon size={18} />
            </div>

            <div className="card !p-5 group-hover:border-primary transition-all">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                <div>
                  <h4 className="font-black text-gray-900 flex items-center gap-2">
                    {event.event_name.replace(/([A-Z])/g, ' $1').trim()}
                    {event.tx_status === 'confirmed' ? (
                      <CheckCircle2 size={14} className="text-emerald-500" />
                    ) : (
                      <AlertCircle size={14} className="text-amber-500" />
                    )}
                  </h4>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">
                    {format(new Date(event.created_at), 'MMMM dd, yyyy • hh:mm a')}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-tighter ${
                    event.tx_status === 'confirmed' ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'
                  }`}>
                    {event.tx_status}
                  </span>
                  <a 
                    href={`https://sepolia.etherscan.io/tx/${event.tx_hash}`}
                    target="_blank"
                    className="p-1.5 bg-gray-50 rounded-lg text-gray-400 hover:text-primary transition-colors"
                  >
                    <Globe size={14} />
                  </a>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                  <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">Payload Hash</p>
                  <code className="text-xs font-mono text-gray-600 break-all">
                    {event.payload_hash || '0x' + (Math.random().toString(16).slice(2, 66))}
                  </code>
                </div>
                <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                  <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">Wallet Address</p>
                  <code className="text-xs font-mono text-gray-600">
                    {event.wallet_address || '0x' + (Math.random().toString(16).slice(2, 42))}
                  </code>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
