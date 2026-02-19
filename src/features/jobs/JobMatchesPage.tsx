import { DashboardLayout } from '@/layouts/DashboardLayout';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const JobMatchesPage = () => {
  const navigate = useNavigate();
  const [view, setView] = useState<'matches' | 'saved'>('matches');
  const [showPreferences, setShowPreferences] = useState(false);

  // Mock Data - Nigerian Context
  const jobs = [
    {
      id: 1,
      role: 'Senior Product Designer',
      company: 'Paystack',
      logo: 'p', 
      logoBg: 'bg-blue-600',
      location: 'Lagos, Nigeria (Hybrid)',
      salary: '₦800k - ₦1.2M',
      matchScore: 98,
      tags: ['Figma', 'Fintech', 'Design Systems'],
      posted: '2 days ago',
      isSaved: true
    },
    {
      id: 2,
      role: 'Frontend Engineer',
      company: 'Flutterwave',
      logo: 'F',
      logoBg: 'bg-orange-500', 
      location: 'Remote (Nigeria)',
      salary: '₦600k - ₦900k',
      matchScore: 94,
      tags: ['React', 'TypeScript', 'Tailwind'],
      posted: '5 hours ago',
      isSaved: false
    },
    {
      id: 3,
      role: 'UX Researcher',
      company: 'Moniepoint',
      logo: 'M',
      logoBg: 'bg-indigo-600',
      location: 'Lagos, Nigeria',
      salary: '₦500k - ₦750k',
      matchScore: 89,
      tags: ['User Testing', 'Data Analysis'],
      posted: '1 week ago',
      isSaved: false
    },
    {
      id: 4,
      role: 'Full Stack Developer',
      company: 'Kuda Bank',
      logo: 'K',
      logoBg: 'bg-purple-600',
      location: 'Lekki Phase 1, Lagos',
      salary: '₦1.2M - ₦1.5M',
      matchScore: 82,
      tags: ['Node.js', 'React Native', 'AWS'],
      posted: '3 days ago',
      isSaved: true
    },
    {
      id: 5,
      role: 'Backend Engineer',
      company: 'Andela',
      logo: 'A',
      logoBg: 'bg-green-600',
      location: 'Remote (Africa)',
      salary: '$2,000 - $3,500',
      matchScore: 78,
      tags: ['Python', 'Django', 'PostgreSQL'],
      posted: '1 day ago',
      isSaved: false
    }
  ];

  const displayedJobs = view === 'saved' ? jobs.filter(j => j.isSaved) : jobs;

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
        {displayedJobs.map((job) => (
          <div 
             key={job.id} 
             onClick={() => navigate(`/jobs/${job.id}`)}
             className="bg-white p-6 rounded-2xl shadow-soft hover:shadow-card transition-all border border-gray-100 flex flex-col md:flex-row gap-6 cursor-pointer group"
           >
            <div className="flex-shrink-0">
               <div className={`w-16 h-16 ${job.logoBg} text-white rounded-xl flex items-center justify-center text-2xl font-bold shadow-sm`}>
                 {job.logo}
               </div>
            </div>
            
            <div className="flex-1">
              <div className="flex flex-col md:flex-row md:items-start justify-between mb-2">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{job.role}</h3>
                  <p className="text-gray-600 font-medium">{job.company} • {job.location}</p>
                </div>
                <div className="mt-2 md:mt-0 flex flex-col items-start md:items-end">
                  <div className="flex items-center gap-1.5 bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm font-bold border border-green-100 mb-1">
                    <span className="material-symbols-outlined text-base">verified</span>
                    {job.matchScore}% Update
                  </div>
                  <span className="text-xs text-gray-400">{job.posted}</span>
                </div>
              </div>
              
              <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                 <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[18px]">payments</span>
                    {job.salary}
                 </span>
                 <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[18px]">schedule</span>
                    Full-time
                 </span>
              </div>

              <div className="flex flex-wrap gap-2">
                {job.tags.map(tag => (
                   <span key={tag} className="px-3 py-1 bg-gray-100 text-gray-600 rounded-md text-xs font-medium">
                     {tag}
                   </span>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-2 justify-center border-t md:border-t-0 md:border-l border-gray-100 pt-4 md:pt-0 md:pl-6 min-w-[180px]">
                <button 
                    onClick={(e) => { e.stopPropagation(); /* Apply Logic */ }}
                    className="bg-black text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-800 transition shadow-lg shadow-gray-200"
                >
                    Apply Now
                </button>
           
                <button 
                     onClick={(e) => { e.stopPropagation(); /* Navigate to mock interview with job context */ navigate('/mock-interview') }}
                     className="bg-purple-50 text-purple-700 border border-purple-100 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-purple-100 transition flex items-center justify-center gap-2"
                >
                    <span className="material-symbols-outlined text-[18px]">videocam</span>
                    Mock Interview
                </button>

                 <button 
                    onClick={(e) => { e.stopPropagation(); /* Save Logic */ }}
                    className={`border px-4 py-2 rounded-lg text-sm font-semibold transition flex items-center justify-center gap-2 ${job.isSaved ? 'bg-gray-100 text-gray-900 border-gray-300' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                >
                     <span className={`material-symbols-outlined text-[18px] ${job.isSaved ? 'filled' : ''}`}>bookmark</span>
                    {job.isSaved ? 'Saved' : 'Save Job'}
                </button>
            </div>

          </div>
        ))}
        
        {displayedJobs.length === 0 && (
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

