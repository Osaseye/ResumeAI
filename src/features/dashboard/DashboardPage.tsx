import { DashboardLayout } from '@/layouts/DashboardLayout';
import { useNavigate } from 'react-router-dom';
import { useRef, useEffect, useState } from 'react';
import type { ChangeEvent } from 'react';
import { useAuth } from '../auth/AuthContext';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface UserProfile {
  displayName: string;
  role: string;
  experienceLevel: string;
  goals: string[];
}

interface DashboardStats {
  resumeHealth: number;
  atsScore: number;
  jobMatches: number;
  pendingReviews: number;
}

interface Application {
  id: string;
  company: string;
  role: string;
  status: 'Applied' | 'Interviewing' | 'Offer' | 'Rejected';
  date: string;
  logo: string;
}

export const DashboardPage = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [stats, setStats] = useState<DashboardStats>({
        resumeHealth: 0,
        atsScore: 0,
        jobMatches: 0,
        pendingReviews: 0
    });
    const [applications, setApplications] = useState<Application[]>([]);
    const [loading, setLoading] = useState(true);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const fetchProfile = async () => {
            if (user?.uid) {
                try {
                    const docRef = doc(db, 'users', user.uid);
                    const docSnap = await getDoc(docRef);
                    if (docSnap.exists()) {
                        const data = docSnap.data() as UserProfile;
                        setProfile(data);
                        
                        // Default stats - will be replaced with real backend data later
                        setStats({
                            resumeHealth: 0,
                            atsScore: 0,
                            jobMatches: 0,
                            pendingReviews: 0
                        });

                        // Default empty applications
                        setApplications([]);
                    }
                } catch (error) {
                    console.error("Error fetching profile:", error);
                } finally {
                    setLoading(false);
                }
            } else {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [user]);

    const handleImportClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            console.log("Importing file:", file.name);
            // Here you would typically upload the file to your backend
            alert(`Profile import started for ${file.name}`);
        }
    };

    return (
        <DashboardLayout>
            <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept=".json,.pdf,.docx" // Assuming profile could be a resume or data export
                onChange={handleFileChange}
            />
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
                        {loading ? 'Welcome back' : `Welcome back, ${profile?.displayName?.split(' ')[0] || 'User'}`}
                    </h1>
                    <p className="text-gray-500 mt-2">
                        {profile?.role ? `Target Role: ${profile.role}` : 'Manage your career growth, resume, and applications.'}
                    </p>
                </div>
                <div className="flex gap-3">
                    <button 
                        onClick={handleImportClick}
                        className="flex items-center justify-center px-5 py-2.5 bg-white border border-gray-200 rounded-full text-gray-700 hover:bg-gray-50 transition text-sm font-semibold shadow-sm"
                    >
                        Import Profile
                    </button>
                    <button 
                        onClick={() => navigate('/resume-builder')}
                        className="flex items-center justify-center px-5 py-2.5 bg-gray-900 hover:bg-gray-800 text-white rounded-full transition text-sm font-semibold shadow-lg shadow-gray-500/20"
                    >
                        <span className="material-symbols-outlined text-sm mr-2 font-bold">add</span>
                        Add Resume
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-gray-900 p-6 rounded-3xl shadow-soft relative overflow-hidden group">
                    <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                        <span className="material-symbols-outlined text-white text-xs rotate-45">arrow_upward</span>
                    </div>
                    <div className="relative z-10">
                        <p className="text-gray-400 text-sm font-medium mb-1">Resume Health</p>
                        <h3 className="text-4xl font-bold text-white mb-6">{stats?.resumeHealth || 0}%</h3>
                        <div className="flex items-center gap-2">
                            <span className="bg-green-500/20 text-green-400 text-xs font-semibold px-2 py-0.5 rounded">+5%</span>
                            <span className="text-gray-400 text-xs">Increased from last week</span>
                        </div>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-3xl shadow-soft relative group hover:shadow-md transition-shadow">
                    <div className="absolute top-4 right-4 w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center">
                        <span className="material-symbols-outlined text-gray-400 text-xs -rotate-45">arrow_upward</span>
                    </div>
                    <div className="relative z-10">
                        <p className="text-gray-500 text-sm font-medium mb-1">ATS Average Score</p>
                        <h3 className="text-4xl font-bold text-gray-900 mb-6">{stats.atsScore}</h3>
                        <div className="flex items-center gap-2">
                            <span className="bg-gray-100 text-gray-600 text-xs font-semibold px-2 py-0.5 rounded flex items-center gap-1">
                                <span className="material-symbols-outlined text-[10px]">trending_up</span> 2
                            </span>
                            <span className="text-gray-400 text-xs">Points up from last month</span>
                        </div>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-3xl shadow-soft relative group hover:shadow-md transition-shadow">
                    <div className="absolute top-4 right-4 w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center">
                        <span className="material-symbols-outlined text-gray-400 text-xs -rotate-45">arrow_upward</span>
                    </div>
                    <div className="relative z-10">
                        <p className="text-gray-500 text-sm font-medium mb-1">Active Job Matches</p>
                        <h3 className="text-4xl font-bold text-gray-900 mb-6">{stats.jobMatches}</h3>
                        <div className="flex items-center gap-2">
                            <span className="bg-gray-100 text-gray-600 text-xs font-semibold px-2 py-0.5 rounded flex items-center gap-1">
                                <span className="material-symbols-outlined text-[10px]">add</span> 3
                            </span>
                            <span className="text-gray-400 text-xs">New jobs this week</span>
                        </div>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-3xl shadow-soft relative group hover:shadow-md transition-shadow">
                    <div className="absolute top-4 right-4 w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center">
                        <span className="material-symbols-outlined text-gray-400 text-xs -rotate-45">arrow_upward</span>
                    </div>
                    <div className="relative z-10">
                        <p className="text-gray-500 text-sm font-medium mb-1">Pending Review</p>
                        <h3 className="text-4xl font-bold text-gray-900 mb-6">{stats.pendingReviews}</h3>
                        <div className="flex items-center gap-2">
                            <span className="text-gray-400 text-xs">Resumes to optimize</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white p-6 rounded-3xl shadow-soft col-span-1 md:col-span-2">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-bold text-gray-900">Monthly Progress</h3>
                            <span className="text-xs bg-gray-100 px-2 py-1 rounded-md text-gray-500 font-medium">Last 30 days</span>
                        </div>
                        <div className="flex items-end justify-between h-32 px-2 gap-2 md:gap-4">
                            <div className="flex flex-col items-center gap-2 group w-full">
                                <div className="w-full bg-gray-100 rounded-t-lg h-16 relative overflow-hidden transition-colors"></div>
                                <span className="text-xs text-gray-400">W1</span>
                            </div>
                            <div className="flex flex-col items-center gap-2 group w-full">
                                <div className="w-full bg-gray-100 rounded-t-lg h-24 relative shadow-none transition-colors"></div>
                                <span className="text-xs text-gray-400 font-medium">W2</span>
                            </div>
                            <div className="flex flex-col items-center gap-2 group w-full">
                                <div className="w-full bg-gray-100 rounded-t-lg h-20 relative transition-colors"></div>
                                <span className="text-xs text-gray-400">W3</span>
                            </div>
                            <div className="flex flex-col items-center gap-2 group w-full">
                                <div className="w-full bg-gray-100 rounded-t-lg h-28 relative transition-colors"></div>
                                <span className="text-xs text-gray-400">W4</span>
                            </div>
                            <div className="flex flex-col items-center gap-2 group w-full">
                                <div className="w-full bg-gray-100 rounded-t-lg h-14 relative transition-colors"></div>
                                <span className="text-xs text-gray-400">W5</span>
                            </div>
                        </div>
                        <div className="text-center mt-4 text-xs text-gray-400">
                           No activity recorded yet.
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-3xl shadow-soft col-span-1 md:col-span-2">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-bold text-gray-900">Recent Applications</h3>
                            <button className="flex items-center gap-1 px-3 py-1.5 border border-gray-200 rounded-full text-xs font-semibold hover:bg-gray-50 transition">
                                <span className="material-symbols-outlined text-sm">add</span> Add Job
                            </button>
                        </div>
                        <div className="space-y-4">
                            {applications.length > 0 ? (
                                applications.map((app) => (
                                    <div key={app.id} className="flex items-center justify-between group cursor-pointer hover:bg-gray-50 p-2 rounded-xl transition-colors">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm">
                                                {app.logo}
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-semibold text-gray-900 group-hover:text-black">{app.company}</h4>
                                                <p className="text-xs text-gray-400">{app.role}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className={`text-[10px] font-medium px-2 py-1 rounded border ${
                                                app.status === 'Applied' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                                                app.status === 'Interviewing' ? 'bg-yellow-50 text-yellow-600 border-yellow-100' :
                                                app.status === 'Offer' ? 'bg-green-50 text-green-600 border-green-100' :
                                                'bg-gray-50 text-gray-600 border-gray-100'
                                            }`}>
                                                {app.status}
                                            </span>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-6 text-gray-400 text-sm">
                                    No applications yet. Start tracking your jobs!
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white p-6 rounded-3xl shadow-soft">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-bold text-gray-900">Reminders</h3>
                            <button className="text-gray-400 hover:text-gray-600 bg-gray-50 p-1 rounded-lg">
                                <span className="material-symbols-outlined text-sm">add</span>
                            </button>
                        </div>
                        <div>
                        <p className="text-xs text-gray-400 mb-3">No upcoming sessions</p>
                        <button 
                            onClick={() => navigate('/mock-interview')}
                            className="w-full bg-[#185542] hover:bg-[#134435] text-white py-2.5 rounded-xl flex items-center justify-center gap-2 text-sm font-medium transition-colors"
                        >
                            <span className="material-symbols-outlined text-sm">videocam</span>
                            Schedule Session
                        </button>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-3xl shadow-soft">
                        <h3 className="text-lg font-bold text-gray-900 mb-6">Profile Completion</h3>
                        <div className="flex items-center gap-6">
                            <div className="relative w-28 h-28">
                                <svg className="w-full h-full transform -rotate-90">
                                    <circle className="text-gray-100" cx="56" cy="56" fill="transparent" r="48" stroke="currentColor" strokeWidth="12"></circle>
                                    <circle className="text-[#185542]" cx="56" cy="56" fill="transparent" r="48" stroke="currentColor" strokeDasharray="301" strokeDashoffset="301" strokeLinecap="round" strokeWidth="12"></circle>
                                </svg>
                                <div className="absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center">
                                    <span className="text-2xl font-bold text-gray-900">0%</span>
                                    <span className="text-[10px] text-gray-400">Complete</span>
                                </div>
                            </div>
                            <div className="space-y-3 flex-1">
                                <div className="flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-gray-200"></span>
                                    <span className="text-xs text-gray-500">Completed (0)</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-gray-200"></span>
                                    <span className="text-xs text-gray-500">Remaining (4)</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="material-symbols-outlined text-gray-300 text-xs">edit_note</span>
                                    <span className="text-xs text-gray-400">Complete profile</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};
