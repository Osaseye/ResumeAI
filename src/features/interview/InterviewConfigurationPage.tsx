import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@/layouts/DashboardLayout';

const MOCK_RESUMES = [
    { id: '1', title: 'Software Engineer Resume', date: '2 days ago' },
    { id: '2', title: 'Product Manager Resume', date: '1 week ago' },
];

const MOCK_JOBS = [
    { id: '1', title: 'Senior Frontend Developer', company: 'Paystack', location: 'Lagos (Hybrid)' },
    { id: '2', title: 'Backend Engineer', company: 'Flutterwave', location: 'Remote (Nigeria)' },
    { id: '3', title: 'Product Designer', company: 'Kuda Bank', location: 'Lagos' },
];

export const InterviewConfigurationPage = () => {
    const navigate = useNavigate();
    const [selectedResume, setSelectedResume] = useState<string>('');
    const [selectedJob, setSelectedJob] = useState<string>('');
    const [focusArea, setFocusArea] = useState<string>('technical');
    const [difficulty, setDifficulty] = useState<string>('medium');

    const handleStart = () => {
        if (!selectedResume || !selectedJob) return;
        // In a real app, we'd pass these IDs to the session
        navigate('/mock-interview/session', { 
            state: { 
                resumeId: selectedResume, 
                jobId: selectedJob,
                focusArea,
                difficulty
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
                            <div className="space-y-3">
                                {MOCK_RESUMES.map((resume) => (
                                    <div 
                                        key={resume.id}
                                        onClick={() => setSelectedResume(resume.id)}
                                        className={`p-4 rounded-xl border cursor-pointer transition-all ${
                                            selectedResume === resume.id 
                                                ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-500' 
                                                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                                        }`}
                                    >
                                        <div className="flex justify-between items-center">
                                            <span className="font-medium text-gray-900">{resume.title}</span>
                                            {selectedResume === resume.id && (
                                                <span className="material-symbols-outlined text-blue-600">check_circle</span>
                                            )}
                                        </div>
                                        <p className="text-xs text-gray-400 mt-1">Edited {resume.date}</p>
                                    </div>
                                ))}
                                <button className="w-full py-3 border border-dashed border-gray-300 rounded-xl text-gray-500 hover:bg-gray-50 hover:border-gray-400 transition text-sm font-medium flex items-center justify-center gap-2">
                                    <span className="material-symbols-outlined text-sm">add</span>
                                    Upload New Resume
                                </button>
                            </div>
                        </section>

                        <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <span className="material-symbols-outlined text-purple-600">work</span>
                                Target Job
                            </h2>
                            <div className="space-y-3">
                                {MOCK_JOBS.map((job) => (
                                    <div 
                                        key={job.id}
                                        onClick={() => setSelectedJob(job.id)}
                                        className={`p-4 rounded-xl border cursor-pointer transition-all ${
                                            selectedJob === job.id 
                                                ? 'border-purple-500 bg-purple-50 ring-1 ring-purple-500' 
                                                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                                        }`}
                                    >
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <span className="font-medium text-gray-900 block">{job.title}</span>
                                                <span className="text-sm text-gray-500">{job.company}</span>
                                            </div>
                                            {selectedJob === job.id && (
                                                <span className="material-symbols-outlined text-purple-600">check_circle</span>
                                            )}
                                        </div>
                                        <p className="text-xs text-gray-400 mt-2 flex items-center gap-1">
                                            <span className="material-symbols-outlined text-[10px]">location_on</span>
                                            {job.location}
                                        </p>
                                    </div>
                                ))}
                            </div>
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
                                disabled={!selectedResume || !selectedJob}
                                className={`w-full py-4 rounded-xl font-bold text-lg shadow-lg transition-all flex items-center justify-center gap-2 ${
                                    (!selectedResume || !selectedJob)
                                        ? 'bg-white/20 text-white/50 cursor-not-allowed'
                                        : 'bg-white text-indigo-600 hover:bg-indigo-50 hover:shadow-xl hover:scale-[1.02]'
                                }`}
                            >
                                <span className="material-symbols-outlined">mic</span>
                                Start Interview
                            </button>
                            {(!selectedResume || !selectedJob) && (
                                <p className="text-xs text-red-200 mt-3 font-medium">Please select both a resume and a job to continue</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};
