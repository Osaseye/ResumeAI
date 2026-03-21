import { DashboardLayout } from '@/layouts/DashboardLayout';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jobsService } from '@/features/jobs/services/jobService';
import type { Job } from '@/features/jobs/services/jobService';
import { toast } from 'sonner';
import { useAuth } from '@/features/auth/AuthContext';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { storage } from '@/utils/storage';

interface UserProfile {
  role: string;
}

export const JobMatchesPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [view, setView] = useState<'matches' | 'saved'>('matches');
  const [showPreferences, setShowPreferences] = useState(false);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [savedJobs, setSavedJobs] = useState<Job[]>(() => {
      const saved = storage.getItem('saved_jobs_data');
      return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    const fetchJobs = async () => {
        setLoading(true);
        try {
            let role = "Software Engineer";
            if (user?.uid) {
                const docRef = doc(db, 'users', user.uid);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    const data = docSnap.data() as UserProfile;
                    if (data.role) {
                        role = data.role;
                    }
                }
            }
            
            // Read from the primary jobs cache (populated at onboarding)
            const stored = jobsService.getStoredJobs();
            if (stored.length > 0) {
                setJobs(stored);
            } else {
                // Fallback: attempt a search (will use cache or daily limit)
                const data = await jobsService.searchJobs(role, 'Nigeria');
                setJobs(data);
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to load jobs");
        } finally {
            setLoading(false);
        }
    };
    fetchJobs();
  }, [user]);
  
  const handleSaveJob = (job: Job) => {
      setSavedJobs(prev => {
          const isAlreadySaved = prev.some(j => j.job_id === job.job_id);
          let newSaved;
          
          if (isAlreadySaved) {
              newSaved = prev.filter(j => j.job_id !== job.job_id);
              toast.info("Job removed from saved list");
          } else {
              newSaved = [...prev, job];
              toast.success("Job saved to your list");
          }
          
          storage.setItem('saved_jobs_data', JSON.stringify(newSaved));
          return newSaved;
      });
  };

  const displayedJobs = view === 'saved' ? savedJobs : jobs;

  const isJobSaved = (jobId: string) => savedJobs.some(j => j.job_id === jobId);

  const handleAnalyze = (job: Job) => {
      navigate('/ats-analyzer', { 
        state: { 
            jobDescription: job.job_description 
        } 
      });
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
            {view === 'matches' ? 'Job Matches' : 'Saved Jobs'}
          </h1>
          <p className="text-gray-500 mt-2">
            {view === 'matches' 
              ? 'AI-curated opportunities in the Nigerian tech ecosystem.' 
              : 'Your shortlisted opportunities.'}
          </p>
        </div>
        <div className="flex gap-3">
             <button 
                onClick={() => setView('saved')}
                className={`flex items-center justify-center px-4 py-2 rounded-lg text-sm font-medium shadow-sm transition-all ${view === 'saved' ? 'bg-gray-900 text-white' : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'}`}
             >
                <span className={`material-symbols-outlined text-sm mr-2 ${view === 'saved' ? 'filled' : ''}`}>bookmark</span>
                Saved Jobs
            </button>
             <button 
                onClick={() => setView('matches')}
                className={`flex items-center justify-center px-4 py-2 rounded-lg text-sm font-medium shadow-sm transition-all ${view === 'matches' ? 'bg-gray-900 text-white' : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'}`}
             >
                <span className="material-symbols-outlined text-sm mr-2">work</span>
                Matches
            </button>
             <button 
                onClick={() => setShowPreferences(!showPreferences)}
                className={`flex items-center justify-center px-4 py-2 border rounded-lg text-sm font-medium shadow-sm transition-all ${showPreferences ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'}`}
            >
                <span className="material-symbols-outlined text-sm mr-2">tune</span>
                Preferences
            </button>
        </div>
      </div>

      {showPreferences && (
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-6 animate-in fade-in slide-in-from-top-2">
              <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold text-gray-900">Adjustment Filters</h3>
                  <button onClick={() => setShowPreferences(false)} className="text-gray-400 hover:text-gray-600 text-sm">Close</button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Location</label>
                    <select className="w-full p-2 border border-gray-200 rounded-lg text-sm focus:ring-black focus:border-black">
                        <option>Anywhere in Nigeria</option>
                        <option>Lagos Only</option>
                        <option>Abuja Only</option>
                        <option>Remote Only</option>
                    </select>
                </div>
                <div>
                     <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Min Salary</label>
                    <select className="w-full p-2 border border-gray-200 rounded-lg text-sm focus:ring-black focus:border-black">
                        <option>Any Salary</option>
                        <option>₦200k / mo</option>
                        <option>₦500k / mo</option>
                        <option>₦1M / mo</option>
                    </select>
                </div>
                <div>
                     <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Job Type</label>
                    <div className="flex gap-2">
                         <label className="inline-flex items-center">
                            <input type="checkbox" className="rounded text-black focus:ring-black" defaultChecked />
                            <span className="ml-2 text-sm text-gray-700">Full-time</span>
                         </label>
                          <label className="inline-flex items-center">
                            <input type="checkbox" className="rounded text-black focus:ring-black" defaultChecked />
                            <span className="ml-2 text-sm text-gray-700">Contract</span>
                         </label>
                    </div>
                </div>
                <div className="flex items-end">
                    <button className="w-full bg-black text-white py-2 rounded-lg text-sm font-semibold hover:bg-gray-800">Apply Filters</button>
                </div>
              </div>
          </div>
      )}

      <div className="space-y-4">
        {loading ? (
             <div className="flex flex-col items-center justify-center py-20">
                <div className="w-10 h-10 border-4 border-gray-200 border-t-black rounded-full animate-spin mb-4"></div>
                <p className="text-gray-500">Searching specifically for you based on profile...</p>
             </div>
        ) : displayedJobs.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl border border-gray-100 shadow-sm">
                <span className="material-symbols-outlined text-4xl text-gray-300 mb-4">work_off</span>
                <h3 className="text-lg font-medium text-gray-900">No jobs found</h3>
                <p className="text-gray-500 max-w-sm mx-auto mt-2">
                    {view === 'matches' 
                        ? "Check back later for new opportunities tailored to your profile." 
                        : "You haven't saved any jobs yet."}
                </p>
            </div>
        ) : (
            displayedJobs.map((job) => (
          <div 
             key={job.job_id}  
             onClick={() => navigate(`/jobs/${job.job_id}`, { state: { job } })} 
             className="bg-white p-6 rounded-2xl shadow-soft hover:shadow-card transition-all border border-gray-100 flex flex-col md:flex-row gap-6 cursor-pointer group"
           >
            <div className="flex-shrink-0">
               <div className={`w-16 h-16 bg-white border border-gray-100 rounded-xl flex items-center justify-center p-2 shadow-sm`}>
                 {job.employer_logo ? (
                    <img src={job.employer_logo} alt={job.employer_name} className="w-full h-full object-contain" />
                 ) : (
                    <span className="text-xl font-bold text-gray-400">{job.employer_name.substring(0, 2).toUpperCase()}</span>
                 )}
               </div>
            </div>
            
            <div className="flex-1">
              <div className="flex flex-col md:flex-row md:items-start justify-between mb-2">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{job.job_title}</h3>
                  <p className="text-gray-600 font-medium">{job.employer_name} • {[job.job_city, job.job_country].filter(Boolean).join(', ')} {job.job_is_remote && '(Remote)'}</p>
                </div>
                <div className="mt-2 md:mt-0 flex flex-col items-start md:items-end">
                  {job.match_score && (
                    <div className="flex items-center gap-1.5 bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm font-bold border border-green-100 mb-1">
                        <span className="material-symbols-outlined text-base">verified</span>
                        {job.match_score}% Match
                    </div>
                  )}
                  <span className="text-xs text-gray-400">Posted {Math.floor((Date.now() - job.job_posted_at_timestamp) / (1000 * 60 * 60 * 24))} days ago</span>
                </div>
              </div>
              
              <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                 {job.job_min_salary && (
                     <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-[18px]">payments</span>
                        {job.job_salary_currency} {job.job_min_salary.toLocaleString()} - {job.job_max_salary?.toLocaleString()}
                     </span>
                 )}
                 <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[18px]">schedule</span>
                    Full-time
                 </span>
              </div>

              <div className="flex flex-wrap gap-2">
                {/* Mock tags for now */}
                {["Full-time", "Engineering", "Tech"].map(tag => (
                   <span key={tag} className="px-3 py-1 bg-gray-100 text-gray-600 rounded-md text-xs font-medium">
                     {tag}
                   </span>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-2 justify-center border-t md:border-t-0 md:border-l border-gray-100 pt-4 md:pt-0 md:pl-6 min-w-[180px]">
                <button 
                     onClick={(e) => { e.stopPropagation(); handleAnalyze(job); }}
                     className="bg-black text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-800 transition shadow-lg shadow-gray-200 flex items-center justify-center gap-2"
                >
                    <span className="material-symbols-outlined text-[18px]">analytics</span>
                    Analyze for Fit
                </button>
           
                <button 
                     onClick={(e) => { 
                         e.stopPropagation(); 
                         if (job.job_apply_link) window.open(job.job_apply_link, '_blank');
                     }}
                     className="bg-blue-50 text-blue-700 border border-blue-100 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-100 transition flex items-center justify-center gap-2"
                >
                    <span className="material-symbols-outlined text-[18px]">open_in_new</span>
                    Apply Now
                </button>

                 <button 
                    onClick={(e) => { e.stopPropagation(); handleSaveJob(job); }}
                    className={`border px-4 py-2 rounded-lg text-sm font-semibold transition flex items-center justify-center gap-2 ${isJobSaved(job.job_id) ? 'bg-gray-100 text-gray-900 border-gray-300' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                >
                     <span className={`material-symbols-outlined text-[18px] ${isJobSaved(job.job_id) ? 'filled' : ''}`}>bookmark</span>
                    {isJobSaved(job.job_id) ? 'Saved' : 'Save Job'}
                </button>
            </div>

          </div>
        )))}
        
        {false && displayedJobs.length === 0 && (
             <div className="text-center py-12 bg-white rounded-2xl border border-gray-100 border-dashed">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="material-symbols-outlined text-gray-400 text-3xl">bookmark_off</span>
                </div>
                <h3 className="text-lg font-bold text-gray-900">No saved jobs yet</h3>
                <p className="text-gray-500 mt-1">Jobs you bookmark will appear here.</p>
                <button onClick={() => setView('matches')} className="mt-4 text-blue-600 font-semibold hover:underline">Browse Matches</button>
            </div>
        )}
      </div>
    </DashboardLayout>
  );
};


