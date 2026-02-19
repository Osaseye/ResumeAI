import { DashboardLayout } from '@/layouts/DashboardLayout';
import { useParams, Link } from 'react-router-dom';

export const ResumeDetailsPage = () => {
    // const { id } = useParams();
    useParams();

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
                            <h1 className="text-2xl font-bold text-gray-900">Software Engineer Resume</h1>
                            <p className="text-sm text-gray-500">Last edited 2 days ago</p>
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
                             {/* Mock Resume Content */}
                             <div className="text-center border-b border-gray-200 pb-8 mb-8">
                                <h1 className="text-3xl font-bold text-gray-900 mb-2">John Doe</h1>
                                <p className="text-gray-600">Software Engineer | React Specialist</p>
                                <div className="flex justify-center gap-4 text-sm text-gray-500 mt-4">
                                    <span>lagos, Nigeria</span>
                                    <span>•</span>
                                    <span>john@example.com</span>
                                    <span>•</span>
                                    <span>linkedin.com/in/johndoe</span>
                                </div>
                             </div>

                             <div className="mb-8">
                                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider border-b border-gray-200 pb-2 mb-4">Professional Summary</h3>
                                <p className="text-sm text-gray-700 leading-relaxed">
                                    Experienced Frontend Developer with 5+ years of expertise in building scalable web applications using React and TypeScript. Proven track record of improving site performance by 40% and leading cross-functional teams in agile environments.
                                </p>
                             </div>

                             <div className="mb-8">
                                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider border-b border-gray-200 pb-2 mb-4">Work Experience</h3>
                                <div className="mb-6">
                                    <div className="flex justify-between mb-1">
                                        <h4 className="font-bold text-gray-900">Senior Frontend Engineer</h4>
                                        <span className="text-sm text-gray-500">Jan 2021 - Present</span>
                                    </div>
                                    <p className="text-sm text-gray-700 font-medium mb-2">TechCorp Nigeria, Lagos</p>
                                    <ul className="list-disc list-outside ml-4 space-y-1 text-sm text-gray-700">
                                        <li>Architected and launched the company's main payment dashboard serving 50k+ users.</li>
                                        <li>Reduced initial load time by 40% through code splitting and lazy loading strategies.</li>
                                        <li>Mentored 3 junior developers and established code quality standards.</li>
                                    </ul>
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
                                            <p className="text-sm font-bold text-green-800">Strong Impact Verbs</p>
                                            <p className="text-xs text-green-700 mt-1">Great job using "Architected", "Launched", "Mentored". Profiles with strong action verbs get 2x more interviews.</p>
                                        </div>
                                    </div>
                                </div>
                                 <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                                    <div className="flex items-start gap-3">
                                        <span className="material-symbols-outlined text-blue-600 text-sm mt-1">info</span>
                                        <div>
                                            <p className="text-sm font-bold text-blue-800">Formatting Check</p>
                                            <p className="text-xs text-blue-700 mt-1">Your bullet points are concise and easy to scan. This is optimal for ATS parsers.</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100">
                                    <div className="flex items-start gap-3">
                                        <span className="material-symbols-outlined text-yellow-600 text-sm mt-1">warning</span>
                                        <div>
                                            <p className="text-sm font-bold text-yellow-800">Missing Key Skill</p>
                                            <p className="text-xs text-yellow-700 mt-1">Based on your "Software Engineer" title, job market trends show <strong>Next.js</strong> is high demand.</p>
                                        </div>
                                    </div>
                                    <button className="mt-3 text-xs font-semibold text-yellow-800 hover:underline">Auto-Add to Skills</button>
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
                                <div className="p-3 border border-gray-100 rounded-lg hover:bg-gray-50 cursor-pointer transition">
                                    <div className="flex justify-between items-start mb-1">
                                        <h4 className="font-bold text-sm text-gray-900">Frontend Engineer</h4>
                                        <span className="text-green-600 text-xs font-bold">98% Match</span>
                                    </div>
                                    <p className="text-xs text-gray-500">Paystack • Lagos</p>
                                    <p className="text-[10px] text-gray-400 mt-1">Matches your "React" and "TypeScript" skills.</p>
                                </div>
                                <div className="p-3 border border-gray-100 rounded-lg hover:bg-gray-50 cursor-pointer transition">
                                    <div className="flex justify-between items-start mb-1">
                                        <h4 className="font-bold text-sm text-gray-900">React Developer</h4>
                                        <span className="text-green-600 text-xs font-bold">92% Match</span>
                                    </div>
                                    <p className="text-xs text-gray-500">Cowrywise • Remote</p>
                                    <p className="text-[10px] text-gray-400 mt-1">Your experience level aligns with this role.</p>
                                </div>
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
