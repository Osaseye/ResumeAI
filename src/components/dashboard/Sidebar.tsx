import { Link, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { jobsService } from '@/features/jobs/services/jobService';

export const Sidebar = () => {
    const location = useLocation();
    const [jobCount, setJobCount] = useState(0);

    // Fetch job count for the badge
    useEffect(() => {
        const fetchCount = async () => {
            try {
                const jobs = jobsService.getStoredJobs();
                setJobCount(jobs.length || 0); 
            } catch (e) {
                console.error("Failed to fetch sidebar job count", e);
            }
        };
        fetchCount();
    }, []);
    
    // Helper to determine if a link is active
    const isActive = (path: string) => location.pathname === path;

    return (
        <aside className="w-64 bg-white border-r border-gray-100 hidden md:flex flex-col h-full justify-between">
            <div>
                <Link to="/dashboard" className="p-8 flex items-center gap-3">
                    <img 
                        alt="Resume AI Logo" 
                        className="h-8 w-auto object-contain" 
                        src="/icon.png" 
                    />
                    <span className="font-bold text-lg text-gray-900 tracking-tight">Resume AI</span>
                </Link>
                <nav className="px-4 space-y-1">
                    <div className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 mt-2">Menu</div>
                    
                    <Link 
                        to="/dashboard" 
                        className={`flex items-center px-4 py-3 rounded-xl group transition-all ${
                            isActive('/dashboard') 
                            ? 'bg-white shadow-soft text-black' 
                            : 'text-gray-500 hover:bg-white hover:shadow-soft hover:text-gray-900'
                        }`}
                    >
                        <span className={`material-symbols-outlined mr-3 text-[22px] ${isActive('/dashboard') ? 'filled' : ''}`}>dashboard</span>
                        <span className="font-medium text-sm">Dashboard</span>
                    </Link>

                    <Link 
                        to="/my-resumes"
                        className={`flex items-center px-4 py-3 rounded-xl group transition-all ${
                            isActive('/my-resumes') || isActive('/resume-builder')
                            ? 'bg-white shadow-soft text-black' 
                            : 'text-gray-500 hover:bg-white hover:shadow-soft hover:text-gray-900'
                        }`}
                    >
                        <span className={`material-symbols-outlined mr-3 text-[22px] ${isActive('/my-resumes') ? 'filled' : ''}`}>description</span>
                        <span className="font-medium text-sm">My Resumes</span>
                    </Link>

                    <Link 
                        to="/ats-analyzer" 
                        className={`flex items-center px-4 py-3 rounded-xl group transition-all ${
                            isActive('/ats-analyzer') 
                            ? 'bg-white shadow-soft text-black' 
                            : 'text-gray-500 hover:bg-white hover:shadow-soft hover:text-gray-900'
                        }`}
                    >
                        <span className={`material-symbols-outlined mr-3 text-[22px] ${isActive('/ats-analyzer') ? 'filled' : ''}`}>analytics</span>
                        <span className="font-medium text-sm">ATS Analyzer</span>
                    </Link>

                    <Link 
                        to="/jobs" 
                        className={`flex items-center px-4 py-3 rounded-xl group transition-all ${
                            isActive('/jobs') 
                            ? 'bg-white shadow-soft text-black' 
                            : 'text-gray-500 hover:bg-white hover:shadow-soft hover:text-gray-900'
                        }`}
                    >
                        <span className={`material-symbols-outlined mr-3 text-[22px] ${isActive('/jobs') ? 'filled' : ''}`}>work</span>
                        <span className="font-medium text-sm">Job Matches</span>
                        {jobCount > 0 && (
                            <span className="ml-auto bg-blue-100 text-blue-600 py-0.5 px-2 rounded-md text-[10px] font-bold">
                                {jobCount > 99 ? '99+' : jobCount}
                            </span>
                        )}
                    </Link>

                    <Link 
                        to="/mock-interview" 
                        className={`flex items-center px-4 py-3 rounded-xl group transition-all ${
                            isActive('/mock-interview') 
                            ? 'bg-white shadow-soft text-black' 
                            : 'text-gray-500 hover:bg-white hover:shadow-soft hover:text-gray-900'
                        }`}
                    >
                        <span className={`material-symbols-outlined mr-3 text-[22px] ${isActive('/mock-interview') ? 'filled' : ''}`}>videocam</span>
                        <span className="font-medium text-sm">Mock Interview</span>
                    </Link>
                    
                    <div className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 mt-6">General</div>
                    
                    <Link 
                        to="/settings" 
                        className={`flex items-center px-4 py-3 rounded-xl group transition-all ${
                            isActive('/settings') 
                            ? 'bg-white shadow-soft text-black' 
                            : 'text-gray-500 hover:bg-white hover:shadow-soft hover:text-gray-900'
                        }`}
                    >
                        <span className={`material-symbols-outlined mr-3 text-[22px] ${isActive('/settings') ? 'filled' : ''}`}>settings</span>
                        <span className="font-medium text-sm">Settings</span>
                    </Link>

                    <Link 
                        to="/help" 
                        className={`flex items-center px-4 py-3 rounded-xl group transition-all ${
                            isActive('/help') 
                            ? 'bg-white shadow-soft text-black' 
                            : 'text-gray-500 hover:bg-white hover:shadow-soft hover:text-gray-900'
                        }`}
                    >
                        <span className={`material-symbols-outlined mr-3 text-[22px] ${isActive('/help') ? 'filled' : ''}`}>help</span>
                        <span className="font-medium text-sm">Help Center</span>
                    </Link>
                </nav>

            </div>

            <div className="p-4 mb-4">
                <div className="bg-gray-900 rounded-2xl p-5 relative overflow-hidden group cursor-pointer">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-gray-800 rounded-full mix-blend-overlay filter blur-xl opacity-50 -mr-6 -mt-6"></div>
                    <div className="absolute bottom-0 left-0 w-20 h-20 bg-gray-800 rounded-full mix-blend-overlay filter blur-xl opacity-50 -ml-6 -mb-6"></div>
                    <div className="relative z-10">
                        <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center mb-3">
                            <span className="material-symbols-outlined text-white text-sm">smartphone</span>
                        </div>
                        <h4 className="text-white font-semibold text-sm mb-1">Download App</h4>
                        <p className="text-gray-400 text-xs mb-3">Get easy career access</p>
                        <button className="w-full bg-white/10 hover:bg-white/20 text-white text-xs font-medium py-2 rounded-lg transition-colors">Download</button>
                    </div>
                </div>
            </div>
        </aside>
    );
};
