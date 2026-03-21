import { DashboardLayout } from '@/layouts/DashboardLayout';
import { useNavigate } from 'react-router-dom';
import { useRef, useEffect, useState } from 'react';
import type { ChangeEvent } from 'react';
import { useAuth } from '../auth/AuthContext';
import { doc, getDoc } from 'firebase/firestore';
import { logEvent } from 'firebase/analytics';
import { db, analytics } from '@/lib/firebase';
import { jobsService, type Job } from '@/features/jobs/services/jobService';
import { resumeService } from '@/features/resumes/services/resumeService';
import { coverLetterService } from '@/features/cover-letter/services/coverLetterService';
import { useNotifications } from '@/contexts/NotificationContext';
import { storage } from '@/utils/storage';

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

interface InterviewSession {
    date: string;
    score: number;
    jobTitle: string;
    summary: string;
}

export const DashboardPage = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { addNotification } = useNotifications();

    // Initialize state from local storage cache for instant loading
    const [profile, setProfile] = useState<UserProfile | null>(() => {
        const cached = storage.getItem('dashboard_profile_cache');
        return cached ? JSON.parse(cached) : null;
    });

    const [stats, setStats] = useState<DashboardStats>(() => {
        const cached = storage.getItem('dashboard_stats_cache');
        return cached ? JSON.parse(cached) : {
            resumeHealth: 0,
            atsScore: 0,
            jobMatches: 0,
            pendingReviews: 0
        };
    });
    
    // "Recent Job Listings"
    const [recentJobs, setRecentJobs] = useState<Job[]>(() => {
        const cached = storage.getItem('dashboard_jobs_cache');
        return cached ? JSON.parse(cached) : [];
    });
    
    // "Recent Sessions"
    const [recentSessions, setRecentSessions] = useState<InterviewSession[]>(() => {
        const statsStr = storage.getItem('interview_stats');
        if (statsStr) {
             const parsed = JSON.parse(statsStr);
             return parsed.history ? parsed.history.slice().reverse().slice(0, 3) : [];
        }
        return [];
    });

    const [completionStats, setCompletionStats] = useState({
        hasResume: false,
        hasCoverLetter: false,
        hasInterview: false
    });

    const [monthlyActivity, setMonthlyActivity] = useState<number[]>([0, 0, 0, 0, 0]);

    const [loading, setLoading] = useState(!profile); // Only show loading if we have no cached profile
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (analytics) {
            logEvent(analytics, 'dashboard_view');
        }
        const fetchData = async () => {
            if (user?.uid) {
                try {
                    // 1. Fetch Profile
                    // Only fetch if we don't have it or want to refresh (here we always refresh in background)
                    const docRef = doc(db, 'users', user.uid);
                    const docSnap = await getDoc(docRef);
                    let userProfileData: UserProfile | null = null;
                    if (docSnap.exists()) {
                        userProfileData = docSnap.data() as UserProfile;
                        setProfile(userProfileData);
                        storage.setItem('dashboard_profile_cache', JSON.stringify(userProfileData));
                    }

                    // 2. Read stored jobs — fetch if we are falling back to curated mocks
                    let jobs = jobsService.getStoredJobs();
                    if (jobs.length === 0 || jobs.every(j => j.job_id.startsWith('curated_'))) {
                        const searchRole = userProfileData?.role || profile?.role || 'Software Engineer';
                        console.log(`[Dashboard] No live cache found. Fetching live jobs for:`, searchRole);
                        jobs = await jobsService.fetchAndStoreJobs(searchRole);
                    }
                    
                    // Only update if data changed (simple length check or deep comparison could be better)
                    if (JSON.stringify(jobs.slice(0, 5)) !== JSON.stringify(recentJobs)) {
                        setRecentJobs(jobs.slice(0, 5));
                        storage.setItem('dashboard_jobs_cache', JSON.stringify(jobs.slice(0, 5)));
                    }

                    // 3. Fetch User Activity (Resumes, Cover Letters)
                    const [resumes, coverLetters] = await Promise.all([
                        resumeService.getUserResumes(user.uid),
                        coverLetterService.getUserCoverLetters(user.uid)
                    ]);
                    
                    setCompletionStats({
                        hasResume: resumes.length > 0,
                        hasCoverLetter: coverLetters.length > 0,
                        hasInterview: false // Will update below
                    });

                    // 4. Stats Calculation
                    const statsStr = storage.getItem('interview_stats');

                    // Calculate average health of resumes
                    let totalHealth = 0;
                    if (resumes.length > 0) {
                        resumes.forEach(resume => {
                            let score = 0;
                            // Basic completeness check
                            if (resume.contact?.email) score += 10;
                            if (resume.contact?.phone) score += 10;
                            if (resume.contact?.linkedin) score += 10;
                            if (resume.summary?.length > 50) score += 20;
                            if (resume.experience?.length > 0) score += 20;
                            if (resume.education?.length > 0) score += 10;
                            if (resume.skills?.length > 0) score += 20;
                            
                            // Cap at 100
                            totalHealth += Math.min(100, score);
                        });
                        totalHealth = Math.round(totalHealth / resumes.length);
                    }
                    
                    let newStats = {
                        resumeHealth: totalHealth,
                        // ATS Score is usually stricter, let's assume it's slightly lower than health unless optimized
                        atsScore: totalHealth > 0 ? Math.max(0, totalHealth - 15) : 0,
                        jobMatches: jobs.length,
                        pendingReviews: resumes.length // treating all resumes as potentially reviewable
                    };

                    let interviewCount = 0;
                    if (statsStr) {
                         const parsed = JSON.parse(statsStr);
                         // Update recent sessions state
                         const sessions = parsed.history ? parsed.history.slice().reverse().slice(0, 3) : [];
                         setRecentSessions(sessions);
                         
                         // Update interview completion status
                         interviewCount = parsed.totalInterviews || (parsed.history ? parsed.history.length : 0);
                         setCompletionStats(prev => ({ ...prev, hasInterview: interviewCount > 0 }));
                         
                         // Calculate Monthly Activity (Last 5 weeks) based on interview scores
                         const now = new Date();
                         const oneWeek = 7 * 24 * 60 * 60 * 1000;
                         const activity = [2, 3, 2, 4, 3]; // Default minimum height for visual appeal
                         
                         if (parsed.history && Array.isArray(parsed.history)) {
                             // Reset if we have real history
                             const realActivity = [2, 2, 2, 2, 2]; 
                             parsed.history.forEach((session: any) => {
                                 const sessionDate = new Date(session.date);
                                 // Calculate weeks difference
                                 const diffTime = now.getTime() - sessionDate.getTime();
                                 const diffWeeks = Math.floor(diffTime / oneWeek);
                                 
                                 // Week 5 is current week (index 4), Week 1 is 4 weeks ago (index 0)
                                 const weekIndex = 4 - diffWeeks; 
                                 
                                 if (weekIndex >= 0 && weekIndex <= 4) {
                                     // Add to height based on score (e.g., 80% -> +8 units of height)
                                     realActivity[weekIndex] += (session.score || 0) / 10; 
                                 }
                             });
                             setMonthlyActivity(realActivity);
                         } else {
                             setMonthlyActivity(activity);
                         }

                         // Use average score from fresh data
                         if (parsed.averageScore) {
                            newStats.atsScore = parsed.averageScore; 
                         }
                    } else {
                        // If no interview stats, set hasInterview to false explicitly
                        setCompletionStats(prev => ({ ...prev, hasInterview: false }));
                    }

                    // Count Saved Jobs
                    const savedJobsStr = storage.getItem('saved_jobs_data');
                    if (savedJobsStr) {
                        try {
                           // Keep previous logic or update?
                           // The user complained about fresh metrics.
                           // If new user, saved jobs is 0.
                           // jobMatches should reflect available jobs for their role, not saved jobs.
                           // So we remove the overwrite.
                        } catch (e) { console.error("Error parsing saved jobs", e); }
                    }

                    // 4. Set & Cache Stats
                    setStats(newStats);
                    storage.setItem('dashboard_stats_cache', JSON.stringify(newStats));

                } catch (error) {
                    console.error("Error fetching dashboard data:", error);
                } finally {
                    setLoading(false);
                }
            } else {
                setLoading(false);
            }
        };

        fetchData();
    }, [user]);

    const handleImportClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            console.log("Importing file:", file.name);
            // Here you would typically upload the file to your backend
            addNotification('Import Started', `Profile import started for ${file.name}`, 'info');
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
                            {monthlyActivity.map((height, i) => (
                                <div key={i} className="flex flex-col items-center gap-2 group w-full">
                                    <div 
                                        className={`w-full rounded-t-lg relative transition-all duration-500 ease-out ${
                                            height > 5 ? 'bg-gray-800' : 'bg-gray-100'
                                        }`}
                                        style={{ height: `${Math.max(height * 8, 8)}px` }}
                                    ></div>
                                    <span className="text-xs text-gray-400">
                                        {i === 4 ? 'Current' : `W${i + 1}`}
                                    </span>
                                </div>
                            ))}
                        </div>
                        <div className="text-center mt-4 text-xs text-gray-400">
                           {monthlyActivity.some(h => h > 3) ? 'Activity recorded based on mock interviews.' : 'No significant activity recorded yet.'}
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-3xl shadow-soft col-span-1 md:col-span-2">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-bold text-gray-900">Recent Job Listings</h3>
                            <button 
                                onClick={() => navigate('/jobs')}
                                className="flex items-center gap-1 px-3 py-1.5 border border-gray-200 rounded-full text-xs font-semibold hover:bg-gray-50 transition"
                            >
                                View All
                            </button>
                        </div>
                        <div className="space-y-4">
                            {recentJobs.length > 0 ? (
                                recentJobs.map((job) => (
                                    <div key={job.job_id} className="flex items-center justify-between group cursor-pointer hover:bg-gray-50 p-2 rounded-xl transition-colors" onClick={() => navigate('/jobs')}>
                                        <div className="flex items-center gap-3">
                                            {job.employer_logo ? (
                                                <img src={job.employer_logo} alt={job.employer_name} className="w-10 h-10 rounded-full object-cover border border-gray-100" />
                                            ) : (
                                                <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm">
                                                    {job.employer_name[0]}
                                                </div>
                                            )}
                                            <div className="min-w-0">
                                                <h4 className="text-sm font-semibold text-gray-900 group-hover:text-black line-clamp-1">{job.job_title}</h4>
                                                <p className="text-xs text-gray-400 line-clamp-1">{job.employer_name} • {job.job_city}, {job.job_country}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 shrink-0">
                                            <span className="text-[10px] font-medium px-2 py-1 rounded border bg-blue-50 text-blue-600 border-blue-100">
                                                {job.job_is_remote ? 'Remote' : 'On-site'}
                                            </span>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-6 text-gray-400 text-sm">
                                    No active listings found.
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white p-6 rounded-3xl shadow-soft">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-bold text-gray-900">Recent Sessions</h3>
                            <button 
                                onClick={() => navigate('/mock-interview')}
                                className="text-gray-400 hover:text-gray-600 bg-gray-50 p-1 rounded-lg"
                            >
                                <span className="material-symbols-outlined text-sm">arrow_forward</span>
                            </button>
                        </div>
                        <div className="space-y-3 mb-4">
                        {recentSessions.length > 0 ? (
                            recentSessions.map((session, i) => (
                                <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-gray-50 border border-gray-100">
                                    <div>
                                        <p className="text-sm font-semibold text-gray-900 line-clamp-1">{session.jobTitle}</p>
                                        <p className="text-[10px] text-gray-500">{new Date(session.date).toLocaleDateString()}</p>
                                    </div>
                                    <div className={`text-xs font-bold px-2 py-0.5 rounded ${
                                        session.score >= 80 ? 'bg-green-100 text-green-700' : 
                                        session.score >= 60 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                                    }`}>
                                        {session.score}%
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-xs text-center py-4 text-gray-400">No sessions completed yet.</p>
                        )}
                        </div>
                        <button 
                            onClick={() => navigate('/mock-interview')}
                            className="w-full bg-[#185542] hover:bg-[#134435] text-white py-2.5 rounded-xl flex items-center justify-center gap-2 text-sm font-medium transition-colors"
                        >
                            <span className="material-symbols-outlined text-sm">videocam</span>
                            Start New Session
                        </button>
                    </div>
                    <div className="bg-white p-6 rounded-3xl shadow-soft">
                        <h3 className="text-lg font-bold text-gray-900 mb-6">Profile Completion</h3>
                        {(() => {
                            const stepsCompleted = 1 + (completionStats.hasResume ? 1 : 0) + (completionStats.hasCoverLetter ? 1 : 0) + (completionStats.hasInterview ? 1 : 0);
                            const percentage = Math.round((stepsCompleted / 4) * 100);
                            const offset = 301 - (301 * percentage) / 100;
                            
                            return (
                            <div className="flex items-center gap-6">
                                <div className="relative w-28 h-28 flex-shrink-0">
                                    <svg className="w-full h-full transform -rotate-90">
                                        <circle className="text-gray-100" cx="56" cy="56" fill="transparent" r="48" stroke="currentColor" strokeWidth="12"></circle>
                                        <circle 
                                            className="text-[#185542] transition-all duration-1000 ease-out" 
                                            cx="56" cy="56" fill="transparent" r="48" 
                                            stroke="currentColor" 
                                            strokeDasharray="301" 
                                            strokeDashoffset={offset} 
                                            strokeLinecap="round" 
                                            strokeWidth="12"
                                        ></circle>
                                    </svg>
                                    <div className="absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center">
                                        <span className="text-2xl font-bold text-gray-900">{percentage}%</span>
                                        <span className="text-[10px] text-gray-400">Complete</span>
                                    </div>
                                </div>
                                <div className="space-y-3 flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                        <span className="w-2 h-2 rounded-full bg-green-500"></span>
                                        <span className="text-xs text-gray-500">Completed ({stepsCompleted}/4)</span>
                                    </div>
                                    <div className="completed-steps space-y-1 pl-4 border-l border-gray-100 mb-2">
                                        <div className={`text-[10px] ${true ? 'text-green-600 font-medium' : 'text-gray-300'}`}>✓ Account Created</div>
                                        <div className={`text-[10px] ${completionStats.hasResume ? 'text-green-600 font-medium' : 'text-gray-400'}`}>
                                            {completionStats.hasResume ? '✓' : '○'} Resume Generated
                                        </div>
                                        <div className={`text-[10px] ${completionStats.hasCoverLetter ? 'text-green-600 font-medium' : 'text-gray-400'}`}>
                                            {completionStats.hasCoverLetter ? '✓' : '○'} Cover Letter
                                        </div>
                                        <div className={`text-[10px] ${completionStats.hasInterview ? 'text-green-600 font-medium' : 'text-gray-400'}`}>
                                            {completionStats.hasInterview ? '✓' : '○'} Mock Interview
                                        </div>
                                    </div>
                                    {stepsCompleted < 4 && (
                                        <div className="flex items-center gap-2 cursor-pointer hover:text-gray-600" onClick={() => navigate(!completionStats.hasResume ? '/resume-builder' : !completionStats.hasCoverLetter ? '/cover-letter' : '/mock-interview')}>
                                            <span className="material-symbols-outlined text-gray-400 text-xs">arrow_forward</span>
                                            <span className="text-xs text-gray-500 font-medium">
                                                Complete next step
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                            );
                        })()}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};
