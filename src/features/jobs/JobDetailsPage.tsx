import { DashboardLayout } from '@/layouts/DashboardLayout';
import { useParams, Link, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { jobsService } from './services/jobService';
import type { Job } from './services/jobService';
import { toast } from 'sonner';

export const JobDetailsPage = () => {
    const { id } = useParams();
    const location = useLocation();
    const [job, setJob] = useState<Job | null>(location.state?.job || null);
    const [loading, setLoading] = useState(!location.state?.job);

    useEffect(() => {
        if (!job && id) {
            const fetchJob = async () => {
                setLoading(true);
                try {
                    const data = await jobsService.getJobDetails(id);
                    setJob(data);
                } catch (error) {
                    console.error(error);
                    toast.error("Failed to load job details.");
                } finally {
                    setLoading(false);
                }
            };
            fetchJob();
        }
    }, [id, job]);

    if (loading) {
         return (
            <DashboardLayout>
                <div className="flex justify-center items-center h-96">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
                </div>
            </DashboardLayout>
        );
    }
    
    if (!job) {
        return (
             <DashboardLayout>
                <div className="flex flex-col justify-center items-center h-96">
                    <h2 className="text-2xl font-bold text-gray-900">Job Not Found</h2>
                    <p className="text-gray-500 mb-4">This job may have expired or been removed.</p>
                    <Link to="/jobs" className="text-blue-600 hover:underline">Back to Jobs</Link>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="max-w-4xl mx-auto">
                <Link to="/jobs" className="inline-flex items-center text-gray-500 hover:text-gray-900 mb-6 transition-colors">
                    <span className="material-symbols-outlined text-sm mr-2">arrow_back</span>
                    Back to Jobs
                </Link>

                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-8 border-b border-gray-100">
                        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                            <div className="flex gap-6">
                                <div className="w-20 h-20 bg-white border border-gray-100 rounded-2xl flex items-center justify-center p-2 shadow-sm">
                                    {job.employer_logo ? (
                                        <img src={job.employer_logo} alt={job.employer_name} className="w-full h-full object-contain" />
                                    ) : (
                                        <span className="text-3xl font-bold text-gray-600">{job.employer_name.charAt(0)}</span>
                                    )}
                                </div>
                                <div>
                                    <h1 className="text-3xl font-bold text-gray-900 mb-2">{job.job_title}</h1>
                                    <div className="flex flex-wrap items-center gap-4 text-gray-600">
                                        <span className="flex items-center gap-1.5 font-medium">
                                            <span className="material-symbols-outlined text-[20px]">apartment</span>
                                            {job.employer_name}
                                        </span>
                                        <span className="flex items-center gap-1.5 font-medium">
                                            <span className="material-symbols-outlined text-[20px]">location_on</span>
                                            {job.job_city}, {job.job_country}
                                        </span>
                                        <span className="flex items-center gap-1.5 font-medium">
                                            <span className="material-symbols-outlined text-[20px]">schedule</span>
                                            Posted {Math.floor((Date.now() - job.job_posted_at_timestamp) / (1000 * 60 * 60 * 24))} days ago
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col gap-3 min-w-[200px]">
                                <button 
                                    onClick={() => job.job_apply_link && window.open(job.job_apply_link, '_blank')}
                                    className="w-full bg-black text-white px-6 py-3 rounded-xl font-bold hover:bg-gray-800 transition shadow-lg flex items-center justify-center gap-2"
                                >
                                    <span>Apply Now</span>
                                    <span className="material-symbols-outlined text-sm">open_in_new</span>
                                </button>
                                <Link to="/mock-interview" className="w-full bg-blue-50 text-blue-700 px-6 py-3 rounded-xl font-bold hover:bg-blue-100 transition flex items-center justify-center gap-2">
                                    <span className="material-symbols-outlined text-[20px]">videocam</span>
                                    Practice Interview
                                </Link>
                            </div>
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-3 divide-y lg:divide-y-0 lg:divide-x divide-gray-100">
                        <div className="lg:col-span-2 p-8 space-y-8">
                            <section>
                                <h3 className="text-lg font-bold text-gray-900 mb-4">About the Role</h3>
                                <div className="prose prose-gray max-w-none text-gray-600 whitespace-pre-line">
                                    {job.job_description}
                                </div>
                            </section>
                        </div>
                        
                        <div className="lg:col-span-1 p-8 bg-gray-50/50 space-y-8">
                            <div>
                                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">Job Overview</h3>
                                <div className="space-y-4">
                                    <div>
                                        <p className="text-xs text-gray-500 mb-1">Salary Range</p>
                                        <p className="font-bold text-gray-900">
                                            {job.job_min_salary ? 
                                                `${job.job_salary_currency} ${job.job_min_salary.toLocaleString()} - ${job.job_max_salary?.toLocaleString()}` 
                                                : 'Not disclosed'}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 mb-1">Job Type</p>
                                        <div className="flex flex-wrap gap-2">
                                             <span className="px-3 py-1 bg-white border border-gray-200 rounded-lg text-xs font-semibold text-gray-700">Full-time</span>
                                             {job.job_is_remote && <span className="px-3 py-1 bg-white border border-gray-200 rounded-lg text-xs font-semibold text-gray-700">Remote</span>}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};
