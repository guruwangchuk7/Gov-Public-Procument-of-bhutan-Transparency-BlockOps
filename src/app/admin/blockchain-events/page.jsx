'use client';
import { useState, useEffect } from 'react';
import { Globe, ShieldCheck, ExternalLink, Link as LinkIcon, CheckCircle2, Clock } from 'lucide-react';
import { format } from 'date-fns';

export default function BlockchainEventsPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await fetch('/api/admin/blockchain-events');
      const data = await res.json();
      setEvents(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Blockchain Events</h1>
          <p className="text-gray-500">Immutable ledger events recorded on Ethereum Sepolia.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-2xl">
          <p className="text-[10px] text-indigo-400 font-bold uppercase mb-1">Network</p>
          <p className="text-sm font-black text-indigo-600">Ethereum Sepolia</p>
        </div>
        <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl">
          <p className="text-[10px] text-emerald-400 font-bold uppercase mb-1">Sync Status</p>
          <p className="text-sm font-black text-emerald-600">Synced to Block #123456</p>
        </div>
        <div className="p-4 bg-gray-900 border border-gray-800 rounded-2xl">
          <p className="text-[10px] text-gray-500 font-bold uppercase mb-1">Contract Address</p>
          <code className="text-xs font-mono text-white truncate block">
            {process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || '0x...'}
          </code>
        </div>
      </div>

      <div className="card !p-0 overflow-hidden">
        {loading ? (
          <div className="p-20 text-center text-gray-400">Loading blockchain history...</div>
        ) : (
          <table className="w-full text-left">
            <thead>
              <tr className="text-[10px] font-black text-gray-400 uppercase tracking-widest bg-gray-50/50">
                <th className="px-6 py-4">Event Name</th>
                <th className="px-6 py-4">TX Hash</th>
                <th className="px-6 py-4">Block</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Proof</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {events.map((event) => (
                <tr key={event.id} className="hover:bg-zinc-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-indigo-500" />
                      <span className="text-sm font-bold text-zinc-900">{event.event_name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-xs text-zinc-500 font-mono">
                    {event.tx_hash ? `${event.tx_hash.slice(0, 16)}...` : 'Awaiting Signature'}
                  </td>
                  <td className="px-6 py-4 text-xs font-bold text-zinc-700">
                    #{event.block_number || 'Pending'}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-[10px] font-black uppercase ${
                      event.tx_status === 'confirmed' ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'
                    }`}>
                      {event.tx_status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    {event.tx_hash ? (
                      <a 
                        href={`https://sepolia.etherscan.io/tx/${event.tx_hash}`} 
                        target="_blank"
                        rel="noreferrer"
                        className="p-2 bg-zinc-100 rounded-lg text-indigo-600 hover:bg-indigo-50 transition-all inline-block shadow-sm"
                      >
                        <ExternalLink size={14} />
                      </a>
                    ) : (
                      <span className="p-2 bg-zinc-50 rounded-lg text-zinc-300 inline-block">
                        <ExternalLink size={14} />
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
