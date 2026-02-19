import { DashboardLayout } from '@/layouts/DashboardLayout';
import { useNavigate } from 'react-router-dom';
import { useRef } from 'react';
import type { ChangeEvent } from 'react';

export const DashboardPage = () => {
    const navigate = useNavigate();
    const fileInputRef = useRef<HTMLInputElement>(null);

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
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Dashboard</h1>
                    <p className="text-gray-500 mt-2">Manage your career growth, resume, and applications.</p>
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
                        <h3 className="text-4xl font-bold text-white mb-6">85%</h3>
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
                        <h3 className="text-4xl font-bold text-gray-900 mb-6">72</h3>
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
                        <h3 className="text-4xl font-bold text-gray-900 mb-6">12</h3>
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
                        <h3 className="text-4xl font-bold text-gray-900 mb-6">2</h3>
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
                                <div className="w-full bg-gray-100 rounded-t-lg h-16 relative overflow-hidden group-hover:bg-blue-50 transition-colors">
                                    <div className="absolute bottom-0 left-0 right-0 h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNCIgaGVpZ2h0PSI0IiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxjaXJjbGUgY3g9IjIiIGN5PSIyIiByPSIxIiBmaWxsPSIjRTVFN0VCIi8+PC9zdmc+')] opacity-50"></div>
                                </div>
                                <span className="text-xs text-gray-400">W1</span>
                            </div>
                            <div className="flex flex-col items-center gap-2 group w-full">
                                <div className="w-full bg-blue-600 rounded-t-lg h-24 relative shadow-lg shadow-blue-500/20 group-hover:bg-blue-700 transition-colors">
                                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-[10px] py-0.5 px-1.5 rounded opacity-0 group-hover:opacity-100 transition-opacity">74%</div>
                                </div>
                                <span className="text-xs text-gray-500 font-medium">W2</span>
                            </div>
                            <div className="flex flex-col items-center gap-2 group w-full">
                                <div className="w-full bg-blue-400/80 rounded-t-lg h-20 relative hover:bg-blue-500 transition-colors"></div>
                                <span className="text-xs text-gray-400">W3</span>
                            </div>
                            <div className="flex flex-col items-center gap-2 group w-full">
                                <div className="w-full bg-gray-800 rounded-t-lg h-28 relative hover:bg-gray-700 transition-colors"></div>
                                <span className="text-xs text-gray-400">W4</span>
                            </div>
                            <div className="flex flex-col items-center gap-2 group w-full">
                                <div className="w-full bg-gray-100 rounded-t-lg h-14 relative group-hover:bg-blue-50 transition-colors">
                                    <div className="absolute bottom-0 left-0 right-0 h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNCIgaGVpZ2h0PSI0IiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxjaXJjbGUgY3g9IjIiIGN5PSIyIiByPSIxIiBmaWxsPSIjRTVFN0VCIi8+PC9zdmc+')] opacity-50"></div>
                                </div>
                                <span className="text-xs text-gray-400">W5</span>
                            </div>
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
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm">P</div>
                                    <div>
                                        <h4 className="text-sm font-semibold text-gray-900">Paystack</h4>
                                        <p className="text-xs text-gray-400">Senior Product Designer</p>
                                    </div>
                                </div>
                                <span className="text-[10px] font-medium px-2 py-1 bg-green-50 text-green-600 rounded border border-green-100">In Progress</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-sm">I</div>
                                    <div>
                                        <h4 className="text-sm font-semibold text-gray-900">Interswitch</h4>
                                        <p className="text-xs text-gray-400">Frontend Engineer</p>
                                    </div>
                                </div>
                                <span className="text-[10px] font-medium px-2 py-1 bg-yellow-50 text-yellow-600 rounded border border-yellow-100">Interviewing</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-teal-50 text-teal-600 flex items-center justify-center font-bold text-sm">F</div>
                                    <div>
                                        <h4 className="text-sm font-semibold text-gray-900">Flutterwave</h4>
                                        <p className="text-xs text-gray-400">Data Analyst</p>
                                    </div>
                                </div>
                                <span className="text-[10px] font-medium px-2 py-1 bg-red-50 text-red-600 rounded border border-red-100">Pending</span>
                            </div>
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
                            <h4 className="font-semibold text-gray-800 mb-1">Mock Interview</h4>
                            <p className="text-xs text-gray-400 mb-3">Today: 04:00 pm - 04:30 pm</p>
                            <button 
                                onClick={() => navigate('/mock-interview')}
                                className="w-full bg-[#185542] hover:bg-[#134435] text-white py-2.5 rounded-xl flex items-center justify-center gap-2 text-sm font-medium transition-colors"
                            >
                                <span className="material-symbols-outlined text-sm">videocam</span>
                                Start Session
                            </button>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-3xl shadow-soft">
                        <h3 className="text-lg font-bold text-gray-900 mb-6">Profile Completion</h3>
                        <div className="flex items-center gap-6">
                            <div className="relative w-28 h-28">
                                <svg className="w-full h-full transform -rotate-90">
                                    <circle className="text-gray-100" cx="56" cy="56" fill="transparent" r="48" stroke="currentColor" strokeWidth="12"></circle>
                                    <circle className="text-[#185542]" cx="56" cy="56" fill="transparent" r="48" stroke="currentColor" strokeDasharray="300" strokeDashoffset="45" strokeLinecap="round" strokeWidth="12"></circle>
                                </svg>
                                <div className="absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center">
                                    <span className="text-2xl font-bold text-gray-900">85%</span>
                                    <span className="text-[10px] text-gray-400">Complete</span>
                                </div>
                            </div>
                            <div className="space-y-3 flex-1">
                                <div className="flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-[#185542]"></span>
                                    <span className="text-xs text-gray-500">Completed</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-gray-200"></span>
                                    <span className="text-xs text-gray-500">Remaining</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="material-symbols-outlined text-gray-300 text-xs">edit_note</span>
                                    <span className="text-xs text-gray-400">Pending items</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};
