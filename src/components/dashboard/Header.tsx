import { useNavigate } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';

export const Header = () => {
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2 pt-4 px-4 md:pt-8 md:px-8">
      <div className="w-full md:w-auto">
        {/* Mobile Header */}
        <div className="md:hidden flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
             <img src="/icon.png" alt="Logo" className="w-8 h-8 object-contain" />
             <span className="font-bold text-lg tracking-tight">Resume AI</span>
          </div>
          <button 
            onClick={() => navigate('/settings')}
            className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-gray-500 hover:text-gray-900 shadow-sm"
          >
            <span className="material-symbols-outlined">settings</span>
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative max-w-md w-full md:w-96">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="material-symbols-outlined text-gray-400 text-[20px]">search</span>
          </span>
          <input 
            className="block w-full pl-10 pr-3 py-2.5 border-none rounded-2xl bg-white text-sm placeholder-gray-400 focus:outline-none focus:ring-0 shadow-sm" 
            placeholder="Search resumes, jobs..." 
            type="text"
          />
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <span className="text-gray-300 text-xs border border-gray-200 rounded px-1.5 py-0.5">⌘ K</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4 hidden md:flex">
        {/* Notification Dropdown */}
        <div className="relative" ref={notificationRef}>
            <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-gray-500 hover:text-gray-700 shadow-sm transition"
            >
            <span className="material-symbols-outlined text-[20px] relative text-gray-600">
                notifications
                <span className="absolute top-0 right-0.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </span>
            </button>

            {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-gray-100 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="p-4 border-b border-gray-50 flex justify-between items-center">
                        <h3 className="font-bold text-gray-900">Notifications</h3>
                        <button className="text-xs text-indigo-600 font-medium hover:underline">Mark all read</button>
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                        {[
                            { title: "New Job Match", desc: "Senior React Dev at Google", time: "2m ago", icon: "work", color: "text-blue-500 bg-blue-50" },
                            { title: "Resume Score Improved", desc: "Your score went up by 5%", time: "1h ago", icon: "trending_up", color: "text-green-500 bg-green-50" },
                            { title: "Interview Reminder", desc: "Mock session in 30 mins", time: "2h ago", icon: "videocam", color: "text-purple-500 bg-purple-50" },
                        ].map((item, i) => (
                            <div key={i} className="p-4 hover:bg-gray-50 cursor-pointer flex gap-3 transition border-b border-gray-50 last:border-0">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${item.color}`}>
                                    <span className="material-symbols-outlined text-sm">{item.icon}</span>
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-gray-800">{item.title}</p>
                                    <p className="text-xs text-gray-500">{item.desc}</p>
                                    <p className="text-[10px] text-gray-400 mt-1">{item.time}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="p-2 border-t border-gray-50 bg-gray-50 text-center">
                        <button onClick={() => navigate('/settings')} className="text-xs font-medium text-gray-600 hover:text-gray-900">View Settings</button>
                    </div>
                </div>
            )}
        </div>

        {/* Profile Link */}
        <div 
            onClick={() => navigate('/settings')}
            className="flex items-center gap-3 pl-2 cursor-pointer group"
        >
          <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-blue-600 to-blue-400 flex items-center justify-center text-white font-bold text-sm shadow-md ring-2 ring-white group-hover:ring-blue-100 transition">
            C
          </div>
          <div className="hidden md:block">
            <p className="text-sm font-bold text-gray-900 group-hover:text-blue-600 transition">Chinedu Okeke</p>
            <p className="text-xs text-gray-500">chinedu.o@example.com</p>
          </div>
        </div>
      </div>
    </header>
  );
};
