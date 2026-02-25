import { useNavigate } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/features/auth/AuthContext';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useNotifications } from '@/contexts/NotificationContext';
import { formatDistanceToNow } from 'date-fns';

interface UserProfile {
  displayName: string;
}

export const Header = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { notifications, unreadCount, markAsRead, markAllAsRead, clearNotifications } = useNotifications();
  
  // Initialize from cache to prevent flickering
  const [profile, setProfile] = useState<UserProfile | null>(() => {
      const cached = localStorage.getItem('user_profile_cache');
      return cached ? JSON.parse(cached) : null;
  });
  
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchProfile = async () => {
        if (user?.uid) {
            try {
                // First check if we have data from DashboardPage's cache which might be fresher
                const dashboardCache = localStorage.getItem('dashboard_profile_cache');
                if (dashboardCache) {
                    const parsed = JSON.parse(dashboardCache);
                    if (parsed.displayName) {
                        setProfile(prev => ({ ...prev, ...parsed }));
                    }
                }

                const docRef = doc(db, 'users', user.uid);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    const data = docSnap.data() as UserProfile;
                    setProfile(data);
                    // Cache it
                    localStorage.setItem('user_profile_cache', JSON.stringify(data));
                }
            } catch (error) {
                console.error("Error fetching profile:", error);
            }
        }
    };

    fetchProfile();
  }, [user]);

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

      <div className="hidden md:flex items-center gap-4">
        {/* Notification Dropdown */}
        <div className="relative" ref={notificationRef}>
            <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative w-10 h-10 rounded-full bg-white flex items-center justify-center text-gray-500 hover:text-gray-700 shadow-sm transition"
            >
            <span className="material-symbols-outlined text-[20px] relative text-gray-600">
                notifications
            </span>
            {unreadCount > 0 && (
                <span className="absolute top-2 right-2 w-2.5 h-2.5 rounded-full bg-red-500 border border-white"></span>
            )}
            </button>

            {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-gray-100 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="p-4 border-b border-gray-50 flex justify-between items-center">
                        <h3 className="font-bold text-gray-900">Notifications</h3>
                        {unreadCount > 0 && (
                            <button 
                                onClick={() => markAllAsRead()}
                                className="text-xs text-indigo-600 font-medium hover:underline"
                            >
                                Mark all read
                            </button>
                        )}
                        {notifications.length > 0 && unreadCount === 0 && (
                             <button 
                                onClick={() => clearNotifications()}
                                className="text-xs text-gray-400 font-medium hover:text-red-500"
                            >
                                Clear all
                            </button>
                        )}
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                        {notifications.length > 0 ? (
                            notifications.map((notification) => (
                                <div 
                                    key={notification.id} 
                                    onClick={() => {
                                        markAsRead(notification.id);
                                        if (notification.link) navigate(notification.link);
                                    }}
                                    className={`p-4 border-b border-gray-50 hover:bg-gray-50 cursor-pointer transition ${!notification.read ? 'bg-blue-50/50' : ''}`}
                                >
                                    <div className="flex gap-3">
                                        <div className={`mt-1 w-2 h-2 rounded-full flex-shrink-0 ${
                                            notification.type === 'success' ? 'bg-green-500' :
                                            notification.type === 'error' ? 'bg-red-500' :
                                            notification.type === 'warning' ? 'bg-yellow-500' :
                                            'bg-blue-500'
                                        }`}></div>
                                        <div className="flex-1">
                                            <p className={`text-sm ${!notification.read ? 'font-semibold text-gray-900' : 'text-gray-600'}`}>{notification.title}</p>
                                            <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{notification.message}</p>
                                            <p className="text-[10px] text-gray-400 mt-2">
                                                {formatDistanceToNow(new Date(notification.timestamp), { addSuffix: true })}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="p-8 text-center text-gray-500 text-sm">
                                No new notifications
                            </div>
                        )}
                    </div>
                    <div className="p-2 border-t border-gray-50 bg-gray-50 text-center">
                        <button onClick={() => { 
                            setShowNotifications(false);
                            navigate('/settings/notifications'); 
                        }} className="text-xs font-medium text-gray-600 hover:text-gray-900">View Settings</button>
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
            {(profile?.displayName || user?.displayName || user?.email || 'U')[0].toUpperCase()}
          </div>
          <div className="hidden md:block">
            <p className="text-sm font-bold text-gray-900 group-hover:text-blue-600 transition">{profile?.displayName || user?.displayName || 'User'}</p>
            <p className="text-xs text-gray-500">{user?.email || ''}</p>
          </div>
        </div>
      </div>
    </header>
  );
};
