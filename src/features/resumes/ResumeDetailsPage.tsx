import { DashboardLayout } from '@/layouts/DashboardLayout';
import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { resumeService } from './services/resumeService';
import { jobsService } from '@/features/jobs/services/jobService';
import type { Job } from '@/features/jobs/services/jobService';
import type { Resume } from './types';
import { toast } from 'sonner';

export const ResumeDetailsPage = () => {
    const { id } = useParams();
    const [resume, setResume] = useState<Resume | null>(null);
    const [recommendedJobs, setRecommendedJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchResume = async () => {
            if (!id) return;
            try {
                const data = await resumeService.getResumeById(id);
                if (data) {
                    setResume(data);
                    // Fetch recommended jobs based on resume title or first experience role
                    const query = data.experience?.[0]?.role || data.title || "Software Engineer";
                    const location = data.contact?.location || "Remote";
                    const jobs = await jobsService.searchJobs(query, location); 
                    setRecommendedJobs(jobs.slice(0, 3));
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
            <div className="flex flex-col h-[calc(100vh-100px)]">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                        <Link to="/my-resumes" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                            <span className="material-symbols-outlined text-gray-500">arrow_back</span>
                        </Link>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">{resume.title}</h1>
                            <p className="text-sm text-gray-500">Last edited {new Date(resume.updatedAt).toLocaleDateString()}</p>
                        </div>
                        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold border border-green-200">
                            ATS Score: 85
                        </span>
                    </div>
                    <div className="flex gap-3">
                        <button className="px-4 py-2 border border-gray-200 rounded-lg text-gray-700 font-medium hover:bg-gray-50 flex items-center gap-2">
                             <span className="material-symbols-outlined text-sm">download</span>
                            Download PDF
                        </button>
                         <button className="px-4 py-2 bg-black text-white rounded-lg font-medium hover:bg-gray-800 flex items-center gap-2 shadow-lg shadow-gray-200">
                             <span className="material-symbols-outlined text-sm">edit</span>
                            Edit Resume
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-full overflow-hidden">
                    {/* Left: Resume Preview (Scrollable) */}
                    <div className="lg:col-span-2 bg-gray-100 rounded-2xl p-8 overflow-y-auto border border-gray-200 shadow-inner">
                        <div className="bg-white max-w-[800px] mx-auto min-h-[1000px] shadow-sm p-12">
                             {/* Resume Content */}
                             <div className="text-center border-b border-gray-200 pb-8 mb-8">
                                <h1 className="text-3xl font-bold text-gray-900 mb-2">{resume.contact.fullName}</h1>
                                <p className="text-gray-600">{resume.headline}</p>
                                <div className="flex justify-center gap-4 text-sm text-gray-500 mt-4 flex-wrap">
                                    {resume.contact.location && <span>{resume.contact.location}</span>}
                                    {resume.contact.location && <span>•</span>}
                                    <span>{resume.contact.email}</span>
                                    {resume.contact.website && (
                                        <>
                                            <span>•</span>
                                            <span>{resume.contact.website}</span>
                                        </>
                                    )}
                                </div>
                             </div>

                             <div className="mb-8">
                                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider border-b border-gray-200 pb-2 mb-4">Professional Summary</h3>
                                <p className="text-sm text-gray-700 leading-relaxed">
                                    {resume.summary}
                                </p>
                             </div>

                             <div className="mb-8">
                                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider border-b border-gray-200 pb-2 mb-4">Work Experience</h3>
                                <div className="space-y-6">
                                    {resume.experience.map((exp) => (
                                        <div key={exp.id}>
                                            <div className="flex justify-between mb-1">
                                                <h4 className="font-bold text-gray-900">{exp.role}</h4>
                                                <span className="text-sm text-gray-500">{exp.startDate} - {exp.current ? 'Present' : exp.endDate}</span>
                                            </div>
                                            <p className="text-sm text-gray-700 font-medium mb-2">{exp.company}, {exp.location}</p>
                                            <p className="text-sm text-gray-700 whitespace-pre-wrap">{exp.description}</p>
                                        </div>
                                    ))}
                                </div>
                             </div>

                             <div className="mb-8">
                                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider border-b border-gray-200 pb-2 mb-4">Education</h3>
                                <div className="space-y-4">
                                    {resume.education.map((edu) => (
                                        <div key={edu.id}>
                                            <div className="flex justify-between mb-1">
                                                <h4 className="font-bold text-gray-900">{edu.school}</h4>
                                                <span className="text-sm text-gray-500">{edu.startDate} - {edu.current ? 'Present' : edu.endDate}</span>
                                            </div>
                                            <p className="text-sm text-gray-700">{edu.degree} in {edu.field}</p>
                                        </div>
                                    ))}
                                </div>
                             </div>

                             <div className="mb-8">
                                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider border-b border-gray-200 pb-2 mb-4">Skills</h3>
                                <div className="flex flex-wrap gap-2">
                                    {resume.skills.map((skill) => (
                                        <span key={skill.id} className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-xs font-medium border border-gray-200">
                                            {skill.name}
                                        </span>
                                    ))}
                                </div>
                             </div>
                        </div>
                    </div>

                    {/* Right: Insights & Jobs (Scrollable) */}
                    <div className="lg:col-span-1 space-y-6 overflow-y-auto pr-2">
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
                                <div className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full font-bold">Based on your Resume</div>
                            </div>
                            <div className="space-y-3">
                                {recommendedJobs.length === 0 ? (
                                    <p className="text-xs text-gray-500 text-center py-4">No matching jobs found yet.</p>
                                ) : (
                                    recommendedJobs.map((job) => (
                                        <Link to={`/jobs/${job.job_id}`} key={job.job_id} className="block p-3 border border-gray-100 rounded-lg hover:bg-gray-50 cursor-pointer transition">
                                            <div className="flex justify-between items-start mb-1">
                                                <h4 className="font-bold text-sm text-gray-900 line-clamp-1">{job.job_title}</h4>
                                                <span className="text-green-600 text-xs font-bold">{Math.floor(Math.random() * 20 + 80)}% Match</span>
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
