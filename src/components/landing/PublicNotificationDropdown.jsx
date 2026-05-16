'use client';
import { useState, useEffect } from 'react';
import { Bell, Globe, FileText, Trophy, Clock } from 'lucide-react';
import { format } from 'date-fns';

export default function PublicNotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await fetch('/api/public/notifications');
      const data = await res.json();
      setNotifications(data);
    } catch (err) {
      console.error(err);
    }
  };

  const getIcon = (action) => {
    if (action.includes('Register')) return Clock;
    if (action.includes('Tender')) return FileText;
    if (action.includes('Award') || action.includes('Winner')) return Trophy;
    return Bell;
  };

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="p-2.5 bg-gray-50 rounded-xl text-gray-400 hover:text-primary transition-all relative group"
      >
        <Bell size={20} className="group-hover:rotate-12 transition-transform" />
        {notifications.length > 0 && (
          <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-primary rounded-full border-2 border-white" />
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-3 w-96 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          <div className="p-4 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
            <h4 className="font-black text-gray-900 text-sm">Blockchain Activity Feed</h4>
            <span className="text-[10px] font-bold text-primary uppercase tracking-widest bg-primary/10 px-2 py-0.5 rounded-full">Live</span>
          </div>

          <div className="max-h-[400px] overflow-y-auto">
            {notifications.length > 0 ? (
              notifications.map((note) => {
                const Icon = getIcon(note.action);
                return (
                  <div key={note.id} className="p-4 border-b border-gray-50 hover:bg-gray-50 transition-colors flex gap-4 group">
                    <div className="w-10 h-10 rounded-full bg-white shadow-sm border border-gray-100 flex items-center justify-center text-gray-400 group-hover:text-primary transition-colors">
                      <Icon size={18} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-bold text-gray-900 group-hover:text-primary transition-colors leading-tight mb-1">
                        {note.action}
                      </p>
                      <p className="text-xs text-gray-500 line-clamp-1">{note.details?.title || note.details?.agencyName || 'Procurement action recorded'}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-[10px] text-gray-400 font-medium">
                          {format(new Date(note.created_at), 'hh:mm a')}
                        </span>
                        <div className="w-1 h-1 bg-gray-200 rounded-full" />
                        <span className="text-[10px] text-indigo-500 font-bold uppercase flex items-center gap-1">
                          <Globe size={10} /> Verified
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="p-10 text-center">
                <p className="text-gray-400 text-sm font-medium">No recent activity found.</p>
              </div>
            )}
          </div>

          <Link 
            href="/transparency" 
            className="block p-3 text-center bg-gray-50 text-xs font-bold text-primary hover:bg-primary hover:text-white transition-all"
            onClick={() => setIsOpen(false)}
          >
            Open Transparency Portal
          </Link>
        </div>
      )}
    </div>
  );
}
