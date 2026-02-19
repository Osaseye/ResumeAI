import { useNavigate, useLocation } from 'react-router-dom';

const NAV_ITEMS = [
    { label: 'Dashboard', icon: 'dashboard', path: '/dashboard' },
    { label: 'Resumes', icon: 'description', path: '/my-resumes' },
    { label: 'ATS Analysis', icon: 'analytics', path: '/ats-analyzer' },
    { label: 'Jobs', icon: 'work', path: '/jobs' },
    { label: 'Interview', icon: 'mic', path: '/mock-interview' },
];

export const MobileNavBar = () => {
    const navigate = useNavigate();
    const location = useLocation();

    return (
        <div className="md:hidden fixed bottom-6 left-4 right-4 bg-white/70 backdrop-blur-2xl rounded-2xl shadow-xl z-50 flex items-center justify-around px-2 py-3 border border-white/20">
            {NAV_ITEMS.map((item) => {
                const isActive = location.pathname === item.path || location.pathname.startsWith(`${item.path}/`);
                return (
                    <button
                        key={item.path}
                        onClick={() => navigate(item.path)}
                        className={`flex flex-col items-center justify-center p-1 rounded-xl transition-all duration-300 relative group ${
                            isActive ? 'text-black' : 'text-gray-400 hover:text-gray-600'
                        }`}
                    >
                        <span 
                            className={`material-symbols-outlined text-2xl mb-0.5 transition-transform ${
                                isActive ? 'font-semibold' : ''
                            }`}
                             style={isActive ? { fontVariationSettings: "'FILL' 1" } : {}}
                        >
                            {item.icon}
                        </span>
                        <span className="text-[10px] font-medium tracking-tight leading-none">{item.label}</span>
                    </button>
                );
            })}
        </div>
    );
};
