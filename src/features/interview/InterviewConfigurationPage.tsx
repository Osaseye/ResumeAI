import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { useAuth } from '@/features/auth/AuthContext';
import { resumeService } from '@/features/resumes/services/resumeService';
import { type Job } from '@/features/jobs/services/jobService';
import type { Resume } from '@/features/resumes/types';

export const InterviewConfigurationPage = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [selectedResumeId, setSelectedResumeId] = useState<string>('');
    const [selectedJobId, setSelectedJobId] = useState<string>('');
    const [resumes, setResumes] = useState<Resume[]>([]);
    const [savedJobs, setSavedJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState(true);
    const [focusArea, setFocusArea] = useState<string>('technical');
    const [difficulty, setDifficulty] = useState<string>('medium');

    useEffect(() => {
        const loadData = async () => {
             // 1. Fetch User Resumes
             if (user) {
                try {
                    const userResumes = await resumeService.getUserResumes(user.uid);
                    setResumes(userResumes);
                    if (userResumes.length > 0) setSelectedResumeId(userResumes[0].id!);
                } catch (error) {
                    console.error("Error loading resumes:", error);
                }
             }

             // 2. Fetch Saved Jobs
             // JobMatchesPage saves full job objects in 'saved_jobs_data'
             const savedJobsData = localStorage.getItem('saved_jobs_data');
             
             if (savedJobsData) {
                 try {
                     const parsedJobs: Job[] = JSON.parse(savedJobsData);
                     setSavedJobs(parsedJobs);
                     if (parsedJobs.length > 0) setSelectedJobId(parsedJobs[0].job_id);
                 } catch (error) {
                     console.error("Error parsing saved jobs:", error);
                 }
             }
             
             setLoading(false);
        };
        loadData();
    }, [user]);

    const formatResumeForAI = (resume: Resume): string => {
        // Basic formatting of resume sections into a text blob for AI
        const experience = resume.experience?.map(exp => 
            `${exp.role} at ${exp.company} (${exp.startDate} - ${exp.endDate}): ${exp.description}`
        ).join('\n') || '';
        
        const education = resume.education?.map(edu => 
            `${edu.degree} in ${edu.field} from ${edu.school}`
        ).join('\n') || '';

        const skills = resume.skills?.map(s => s.name).join(', ') || '';

        return `
        Name: ${resume.contact?.fullName || 'Candidate'}
        Summary: ${resume.summary || ''}
        
        Experience:
        ${experience}
        
        Education:
        ${education}
        
        Skills:
        ${skills}
        `;
    };

    const handleStart = () => {
        if (!selectedResumeId || !selectedJobId) return;
        
        const selectedResume = resumes.find(r => r.id === selectedResumeId);
        const selectedJob = savedJobs.find(j => j.job_id === selectedJobId);

        if (!selectedResume || !selectedJob) return;

        const resumeText = formatResumeForAI(selectedResume);
        const jobDescription = `
        Title: ${selectedJob.job_title}
        Company: ${selectedJob.employer_name}
        Description: ${selectedJob.job_description}
        `;

        navigate('/mock-interview/session', { 
            state: { 
                resumeText, 
                jobDescription,
                focusArea,
                difficulty,
                jobTitle: selectedJob.job_title
            } 
        });
    };

    return (
        <DashboardLayout>
            <div className="max-w-4xl mx-auto">
                <div className="mb-8">
                    <button 
                        onClick={() => navigate('/mock-interview')}
                        className="text-gray-500 hover:text-gray-900 flex items-center gap-2 mb-4 text-sm font-medium transition"
                    >
                        <span className="material-symbols-outlined text-sm">arrow_back</span>
                        Back to Interview Dashboard
                    </button>
                    <h1 className="text-3xl font-bold text-gray-900">Configure Session</h1>
                    <p className="text-gray-500 mt-2">Customize your interview context for the most realistic experience.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Left Column: Context Selection */}
                    <div className="space-y-6">
                        <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <span className="material-symbols-outlined text-blue-600">description</span>
                                Select Resume
                            </h2>
                            {loading ? (
                                <div className="text-center py-4">
                                     <span className="material-symbols-outlined animate-spin text-gray-400">progress_activity</span>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {resumes.length === 0 ? (
                                        <div className="text-center py-6 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                                            <p className="text-sm text-gray-500 mb-2">No resumes found</p>
                                            <button 
                                                onClick={() => navigate('/resume-builder')}
                                                className="text-blue-600 font-medium text-xs hover:underline"
                                            >
                                                Create a resume first
                                            </button>
                                        </div>
                                    ) : (
                                        resumes.map((resume) => (
                                        <div 
                                            key={resume.id}
                                            onClick={() => setSelectedResumeId(resume.id!)}
                                            className={`p-4 rounded-xl border cursor-pointer transition-all ${
                                                selectedResumeId === resume.id 
                                                    ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-500' 
                                                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                                            }`}
                                        >
                                            <div className="flex justify-between items-center">
                                                <span className="font-medium text-gray-900">{resume.title || 'Untitled Resume'}</span>
                                                {selectedResumeId === resume.id && (
                                                    <span className="material-symbols-outlined text-blue-600">check_circle</span>
                                                )}
                                            </div>
                                            <p className="text-xs text-gray-400 mt-1">Updated {new Date(resume.updatedAt!).toLocaleDateString()}</p>
                                        </div>
                                    ))
                                    )}
                                </div>
                            )}
                        </section>

                        <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <span className="material-symbols-outlined text-purple-600">work</span>
                                Target Job
                            </h2>
                            {loading ? (
                                <div className="text-center py-4">
                                     <span className="material-symbols-outlined animate-spin text-gray-400">progress_activity</span>
                                </div>
                            ) : (
                            <div className="space-y-3">
                                {savedJobs.length === 0 ? (
                                    <div className="text-center py-6 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                                         <p className="text-sm text-gray-500 mb-2">No jobs saved</p>
                                         <button 
                                            onClick={() => navigate('/jobs')}
                                            className="text-purple-600 font-medium text-xs hover:underline"
                                         >
                                            Find jobs to practice for
                                         </button>
                                    </div>
                                ) : ( savedJobs.map((job) => (
                                    <div 
                                        key={job.job_id}
                                        onClick={() => setSelectedJobId(job.job_id)}
                                        className={`p-4 rounded-xl border cursor-pointer transition-all ${
                                            selectedJobId === job.job_id 
                                                ? 'border-purple-500 bg-purple-50 ring-1 ring-purple-500' 
                                                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                                        }`}
                                    >
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <span className="font-medium text-gray-900 block line-clamp-1">{job.job_title}</span>
                                                <span className="text-sm text-gray-500">{job.employer_name}</span>
                                            </div>
                                            {selectedJobId === job.job_id && (
                                                <span className="material-symbols-outlined text-purple-600">check_circle</span>
                                            )}
                                        </div>
                                        <p className="text-xs text-gray-400 mt-2 flex items-center gap-1">
                                            <span className="material-symbols-outlined text-[10px]">location_on</span>
                                            {job.job_country}
                                        </p>
                                    </div>
                                )))}
                            </div>
                            )}
                        </section>
                    </div>

                    {/* Right Column: Settings */}
                    <div className="space-y-6">
                        <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                            <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                                <span className="material-symbols-outlined text-gray-700">tune</span>
                                Parameters
                            </h2>
                            
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-3">Focus Area</label>
                                    <div className="grid grid-cols-2 gap-3">
                                        {['behavioral', 'technical', 'mixed', 'system-design'].map((type) => (
                                            <button
                                                key={type}
                                                onClick={() => setFocusArea(type)}
                                                className={`py-2 px-4 rounded-lg text-sm font-medium capitalize transition-colors ${
                                                    focusArea === type 
                                                        ? 'bg-gray-900 text-white' 
                                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                                }`}
                                            >
                                                {type.replace('-', ' ')}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-3">Difficulty Level</label>
                                    <div className="flex bg-gray-100 p-1 rounded-xl">
                                        {['easy', 'medium', 'hard'].map((level) => (
                                            <button
                                                key={level}
                                                onClick={() => setDifficulty(level)}
                                                className={`flex-1 py-2 text-sm font-medium rounded-lg capitalize transition-all ${
                                                    difficulty === level 
                                                        ? 'bg-white text-gray-900 shadow-sm' 
                                                        : 'text-gray-500 hover:text-gray-700'
                                                }`}
                                            >
                                                {level}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </section>

                        <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-3xl p-6 text-white text-center">
                            <h3 className="text-xl font-bold mb-2">Ready to Start?</h3>
                            <p className="text-indigo-100 mb-6 text-sm">
                                The session will last approximately 15 minutes. Ensure you are in a quiet environment.
                            </p>
                            <button
                                onClick={handleStart}
                                disabled={!selectedResumeId || !selectedJobId}
                                className={`w-full py-4 rounded-xl font-bold text-lg shadow-lg transition-all flex items-center justify-center gap-2 ${
                                    (!selectedResumeId || !selectedJobId)
                                        ? 'bg-white/20 text-white/50 cursor-not-allowed'
                                        : 'bg-white text-indigo-600 hover:bg-indigo-50 hover:shadow-xl hover:scale-[1.02]'
                                }`}
                            >
                                <span className="material-symbols-outlined">mic</span>
                                Start Interview
                            </button>
                            {(!selectedResumeId || !selectedJobId) && (
                                <p className="text-xs text-red-200 mt-3 font-medium">Please select both a resume and a job to continue</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};
