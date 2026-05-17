'use client';
import { useState, useEffect } from 'react';
import { Activity, Clock, User, Filter, Search } from 'lucide-react';
import { format } from 'date-fns';

export default function ActivityLogsPage() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const res = await fetch('/api/admin/logs');
      const data = await res.json();
      setLogs(Array.isArray(data) ? data : []);
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
          <h1 className="text-2xl font-black text-gray-900">Activity Logs</h1>
          <p className="text-gray-500">Comprehensive audit trail of all system interactions.</p>
        </div>
      </div>

      <div className="card !p-0 overflow-hidden bg-white border-zinc-200 shadow-sm">
        {loading ? (
          <div className="p-20 text-center text-zinc-400">Loading system logs...</div>
        ) : (
          <table className="w-full text-left">
            <thead>
              <tr className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest bg-zinc-50/80 border-b border-zinc-100">
                <th className="px-6 py-4">Timestamp</th>
                <th className="px-6 py-4">Actor</th>
                <th className="px-6 py-4">Action</th>
                <th className="px-6 py-4">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-zinc-50/50 transition-colors">
                  <td className="px-6 py-4 text-xs text-zinc-500 font-mono">
                    {format(new Date(log.created_at), 'yyyy-MM-dd HH:mm:ss')}
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-1 bg-zinc-100 border border-zinc-200 rounded-md text-[10px] font-bold text-zinc-600 uppercase">
                      {log.actor_type.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-bold text-zinc-900">{log.action}</td>
                  <td className="px-6 py-4 text-xs text-zinc-500 italic">
                    {JSON.stringify(log.details)}
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
