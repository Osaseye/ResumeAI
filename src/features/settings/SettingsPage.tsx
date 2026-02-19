import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@/layouts/DashboardLayout';

const SETTINGS_MENU = [
    { title: 'Account', desc: 'Profile details & password', icon: 'person', path: '/settings/account' },
    { title: 'Notifications', desc: 'Email & push preferences', icon: 'notifications', path: '/settings/notifications' },
    { title: 'Billing', desc: 'Plan & payment history', icon: 'credit_card', path: '/settings/billing' },
    { title: 'Help Center', desc: 'FAQs & support', icon: 'help', path: '/help' },
];

export const SettingsPage = () => {
  const navigate = useNavigate();

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Settings</h1>
        <p className="text-gray-500 mb-8">Manage your account and preferences.</p>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden divide-y divide-gray-100 mb-8">
            {SETTINGS_MENU.map((item) => (
                <button 
                    key={item.title}
                    onClick={() => navigate(item.path)}
                    className={`w-full flex items-center justify-between p-6 hover:bg-gray-50 transition text-left group ${
                        item.title === 'Help Center' ? 'md:hidden' : ''
                    }`}
                >
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition">
                            <span className="material-symbols-outlined">{item.icon}</span>
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-900">{item.title}</h3>
                            <p className="text-sm text-gray-500">{item.desc}</p>
                        </div>
                    </div>
                </button>
            ))}
        </div>

        <div>
             <button className="w-full p-4 text-red-600 font-medium bg-red-50 hover:bg-red-100 rounded-xl transition flex items-center justify-center gap-2">
                <span className="material-symbols-outlined">logout</span>
                Sign Out
            </button>
            <p className="text-center text-xs text-gray-400 mt-4">Version 1.2.0 • Build 2481</p>
        </div>
      </div>
    </DashboardLayout>
  );
};
