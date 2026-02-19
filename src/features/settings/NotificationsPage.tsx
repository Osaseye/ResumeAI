import { useState } from 'react';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { toast } from 'sonner';

type NotificationCategory = 'email' | 'push';
type NotificationType = string;

export const NotificationsPage = () => {
  const [notifications, setNotifications] = useState({
    email: {
      news: true,
      productUpdates: true,
      security: true
    } as Record<string, boolean>,
    push: {
      newMessages: true,
      mentions: false,
      reminders: true
    } as Record<string, boolean>
  });

  const handleToggle = (category: NotificationCategory, type: NotificationType) => {
    setNotifications(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [type]: !prev[category][type]
      }
    }));
  };

  const handleSave = () => {
    toast.success('Notification preferences updated');
  };

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Notifications</h1>
        <p className="text-gray-500 mb-8">Choose what updates you want to receive.</p>

        <div className="space-y-8">
          {/* Email Notifications */}
          <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <span className="material-symbols-outlined text-gray-400">mail</span>
              Email Notifications
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                <div>
                  <h3 className="font-medium text-gray-900">Weekly Digest</h3>
                  <p className="text-sm text-gray-500">Summary of your account activity.</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={notifications.email.news}
                    onChange={() => handleToggle('email', 'news')}
                    className="sr-only peer" 
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                </label>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                <div>
                  <h3 className="font-medium text-gray-900">Product Updates</h3>
                  <p className="text-sm text-gray-500">New features and improvements.</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={notifications.email.productUpdates}
                    onChange={() => handleToggle('email', 'productUpdates')}
                    className="sr-only peer" 
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                </label>
              </div>
            </div>
          </section>

          {/* Push Notifications */}
          <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <span className="material-symbols-outlined text-gray-400">notifications</span>
              Desktop Alerts
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                <div>
                  <h3 className="font-medium text-gray-900">Application Status</h3>
                  <p className="text-sm text-gray-500">When potential employers view your resume.</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={notifications.push.newMessages}
                    onChange={() => handleToggle('push', 'newMessages')}
                    className="sr-only peer" 
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                </label>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                <div>
                  <h3 className="font-medium text-gray-900">Mentions & Messages</h3>
                  <p className="text-sm text-gray-500">When someone messages you directly.</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={notifications.push.mentions}
                    onChange={() => handleToggle('push', 'mentions')}
                    className="sr-only peer" 
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                </label>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                <div>
                  <h3 className="font-medium text-gray-900">Interview Reminders</h3>
                  <p className="text-sm text-gray-500">Alerts before scheduled mock sessions.</p>
                </div>
                 <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={notifications.push.reminders}
                    onChange={() => handleToggle('push', 'reminders')}
                    className="sr-only peer" 
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                </label>
              </div>
            </div>
          </section>

          <div className="flex justify-end">
             <button 
                onClick={handleSave}
                className="bg-black text-white px-6 py-3 rounded-lg font-bold hover:bg-gray-800 transition shadow-lg"
              >
                Save Preferences
              </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};
