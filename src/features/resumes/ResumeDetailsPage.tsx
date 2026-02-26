import { DashboardLayout } from '@/layouts/DashboardLayout';
import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { resumeService } from './services/resumeService';
import { jobsService } from '@/features/jobs/services/jobService';
import type { Job } from '@/features/jobs/services/jobService';
import type { Resume } from './types';
import { toast } from 'sonner';
import { ResumePreview } from './components/ResumePreview';

export const ResumeDetailsPage = () => {
    const { id } = useParams();
    const [resume, setResume] = useState<Resume | null>(null);
    const [recommendedJobs, setRecommendedJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState(true);
    const [isUpdatingTemplate, setIsUpdatingTemplate] = useState(false);

    const handleTemplateChange = async (newTemplate: Resume['template']) => {
        if (!resume || isUpdatingTemplate) return;
        
        // Optimistic update
        const previousTemplate = resume.template;
        setResume(prev => prev ? { ...prev, template: newTemplate } : null);
        setIsUpdatingTemplate(true);

        try {
            await resumeService.updateResume(resume.id, { template: newTemplate });
            toast.success("Template updated successfully");
        } catch (error) {
            console.error("Failed to update template:", error);
            toast.error("Failed to update template");
            // Revert on failure
             setResume(prev => prev ? { ...prev, template: previousTemplate } : null);
        } finally {
            setIsUpdatingTemplate(false);
        }
    };

    useEffect(() => {
        const fetchResume = async () => {
            if (!id) return;
            try {
                const data = await resumeService.getResumeById(id);
                if (data) {
                    setResume(data);
                    
                    // Fetch jobs from dashboard cache or general pool to avoid new API calls
                    // Use the same logic as Dashboard/JobMatches to maximize cache hit
                    let jobs: Job[] = [];
                    const dashboardJobs = localStorage.getItem('dashboard_jobs_cache');
                    
                    if (dashboardJobs) {
                        try {
                            jobs = JSON.parse(dashboardJobs);
                        } catch (e) {
                            console.error("Error parsing dashboard jobs", e);
                        }
                    }

                    // If no dashboard jobs, try to use the resume title but check cache first via service
                    // Note: ensure we don't trigger new API calls if possible, relying on service cache
                    if (jobs.length === 0) {
                         const query = data.title || "Software Engineer";
                         const location = data.contact?.location || "Nigeria";
                         // This might hit API if not cached, but it's the fallback
                         jobs = await jobsService.searchJobs(query, location);
                    }
                    
                    // Filter/Sort by "best fit" (simple client-side logic)
                    // We want the one that fits the resume best.
                    // Simple text matching of resume title/skills vs job title/description
                    if (jobs.length > 0) {
                        const scoredJobs = jobs.map(job => {
                            let score = 0;
                            const jobContent = `${job.job_title} ${job.job_description}`.toLowerCase();
                            
                            // Title match importance
                            if (data.title && jobContent.includes(data.title.toLowerCase())) {
                                score += 50;
                            }
                            
                            // Skills match
                            if (data.skills && Array.isArray(data.skills)) {
                                data.skills.forEach((skill: any) => {
                                    // Handle both object (Skill interface) and string (legacy/simple) cases
                                    const skillName = typeof skill === 'string' ? skill : skill.name;
                                    if (skillName && jobContent.includes(skillName.toLowerCase())) {
                                        score += 10;
                                    }
                                });
                            }
                            
                            return { ...job, match_score: Math.min(score, 100) || job.match_score };
                        });
                        
                        // Sort by score descending
                        scoredJobs.sort((a, b) => (b.match_score || 0) - (a.match_score || 0));
                        setRecommendedJobs(scoredJobs.slice(0, 3));
                    } else {
                        setRecommendedJobs([]);
                    }
                } else {
                    toast.error("Resume not found");
                }
            } catch (error) {
                console.error("Error fetching resume:", error);
                toast.error("Failed to load resume details");
            } finally {
                setLoading(false);
            }
        };
        fetchResume();
    }, [id]);

    if (loading) {
        return (
            <DashboardLayout>
                <div className="flex items-center justify-center h-full">
                    <p className="text-gray-500">Loading resume...</p>
                </div>
            </DashboardLayout>
        );
    }

    if (!resume) {
        return (
            <DashboardLayout>
                <div className="flex flex-col items-center justify-center h-full">
                    <p className="text-gray-500 mb-4">Resume not found.</p>
                    <Link to="/my-resumes" className="text-blue-600 hover:underline">Back to My Resumes</Link>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="flex flex-col lg:h-[calc(100vh-100px)]">
                {/* Header */}
                <div className="flex flex-col xl:flex-row xl:items-center justify-between mb-6 gap-4">
                    <div className="flex items-start md:items-center gap-4">
                        <Link to="/my-resumes" className="p-2 hover:bg-gray-100 rounded-full transition-colors flex-shrink-0">
                            <span className="material-symbols-outlined text-gray-500">arrow_back</span>
                        </Link>
                        <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
                            <div>
                                <h1 className="text-xl md:text-2xl font-bold text-gray-900 line-clamp-1">{resume.title}</h1>
                                <p className="text-sm text-gray-500">Last edited {new Date(resume.updatedAt).toLocaleDateString()}</p>
                            </div>
                            <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold border border-green-200 w-fit">
                                ATS Score: 85
                            </span>
                        </div>
                    </div>
                    
                    <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
                        <select 
                            value={resume.template || 'professional'} 
                            onChange={(e) => handleTemplateChange(e.target.value as any)}
                            disabled={isUpdatingTemplate}
                            className="w-full md:w-auto px-3 py-2 border border-blue-500 rounded-lg text-blue-800 font-medium bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer hover:bg-blue-100 transition-colors"
                        >
                            <option value="professional">Professional</option>
                            <option value="modern">Modern</option>
                            <option value="creative">Creative</option>
                            <option value="simple">Simple</option>
                            <option value="tech">Tech</option>
                        </select>
                        <div className="flex gap-3">
                            <button className="flex-1 md:flex-none justify-center px-4 py-2 border border-gray-200 rounded-lg text-gray-700 font-medium hover:bg-gray-50 flex items-center gap-2 text-sm whitespace-nowrap">
                                <span className="material-symbols-outlined text-sm">download</span>
                                Download PDF
                            </button>
                            <button className="flex-1 md:flex-none justify-center px-4 py-2 bg-black text-white rounded-lg font-medium hover:bg-gray-800 flex items-center gap-2 shadow-lg shadow-gray-200 text-sm whitespace-nowrap">
                                <span className="material-symbols-outlined text-sm">edit</span>
                                Edit
                            </button>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-full lg:overflow-hidden">
                    {/* Left: Resume Preview (Scrollable) */}
                    <div className="lg:col-span-2 bg-gray-100 rounded-2xl p-4 md:p-8 overflow-y-auto border border-gray-200 shadow-inner min-h-[500px]">
                         <div className="flex justify-center w-full">
                            <div className="transform scale-[0.4] sm:scale-[0.5] md:scale-[0.65] lg:scale-[0.7] xl:scale-[0.8] origin-top">
                                <ResumePreview data={resume} template={resume.template || 'professional'} />
                            </div>
                        </div>
                    </div>
                    {/* Right: Insights & Jobs (Scrollable) */}
                    <div className="lg:col-span-1 space-y-6 lg:overflow-y-auto pr-2 pb-10 lg:pb-0">
                        {/* AI Insights Card */}
                        <div className="bg-white rounded-xl shadow-soft p-6 border border-gray-100">
                            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <span className="material-symbols-outlined text-purple-600">auto_awesome</span>
                                AI Analysis & Insights
                            </h3>
                            <div className="space-y-4">
                                <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                                    <div className="flex items-start gap-3">
                                        <span className="material-symbols-outlined text-green-600 text-sm mt-1">check_circle</span>
                                        <div>
                                            <p className="text-sm font-bold text-green-800">Resume Optimized</p>
                                            <p className="text-xs text-green-700 mt-1">Your content has been polished by AI for better impact and readability.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Target Jobs Card */}
                        <div className="bg-white rounded-xl shadow-soft p-6 border border-gray-100">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="font-bold text-gray-900">Recommended Jobs</h3>
                                <div className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full font-bold">Top Matches</div>
                            </div>
                            <div className="space-y-3">
                                {recommendedJobs.length === 0 ? (
                                    <p className="text-xs text-gray-500 text-center py-4">No matching jobs found yet.</p>
                                ) : (
                                    recommendedJobs.map((job) => (
                                        <Link to={`/jobs/${job.job_id}`} key={job.job_id} className="block p-3 border border-gray-100 rounded-lg hover:bg-gray-50 cursor-pointer transition">
                                            <div className="flex justify-between items-start mb-1">
                                                <h4 className="font-bold text-sm text-gray-900 line-clamp-1">{job.job_title}</h4>
                                                <span className="text-green-600 text-xs font-bold">{job.match_score || Math.floor(Math.random() * 20 + 80)}% Match</span>
                                            </div>
                                            <p className="text-xs text-gray-500 truncate">{job.employer_name} • {job.job_city || 'Remote'}</p>
                                            <p className="text-[10px] text-gray-400 mt-1 line-clamp-1">
                                                {job.job_description.substring(0, 60)}...
                                            </p>
                                        </Link>
                                    ))
                                )}
                                <Link to="/jobs" className="block text-center text-xs font-semibold text-blue-600 hover:text-blue-700 mt-2">
                                    View All Matches
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};
