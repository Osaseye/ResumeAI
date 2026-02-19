import { Link, useParams } from 'react-router-dom';
import { DashboardLayout } from '@/layouts/DashboardLayout';

export const CoverLetterDetailsPage = () => {
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
                            <h1 className="text-2xl font-bold text-gray-900">Google PM Cover Letter</h1>
                            <p className="text-sm text-gray-500">Targeting: Product Manager @ Google</p>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <button className="px-4 py-2 border border-gray-200 rounded-lg text-gray-700 font-medium hover:bg-gray-50 flex items-center gap-2">
                             <span className="material-symbols-outlined text-sm">download</span>
                            Download PDF
                        </button>
                         <button className="px-4 py-2 bg-black text-white rounded-lg font-medium hover:bg-gray-800 flex items-center gap-2 shadow-lg shadow-gray-200">
                             <span className="material-symbols-outlined text-sm">edit</span>
                            Edit Letter
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-full overflow-hidden">
                    {/* Left: Preview */}
                     <div className="lg:col-span-2 bg-gray-100 rounded-2xl p-8 overflow-y-auto border border-gray-200 shadow-inner">
                        <div className="bg-white max-w-[800px] mx-auto min-h-[800px] shadow-sm p-16 font-serif">
                             <p className="mb-8">February 19, 2026</p>
                             
                             <p className="mb-2">Hiring Manager</p>
                             <p className="mb-2">Google</p>
                             <p className="mb-8">1600 Amphitheatre Parkway, Mountain View, CA</p>

                             <p className="mb-6">Dear Hiring Manager,</p>

                             <p className="mb-4 leading-relaxed">
                                I am writing to express my strong interest in the Product Manager position at Google. With over 5 years of experience leading cross-functional teams to build user-centric products in the fintech space, I am confident in my ability to contribute to Google's mission of organizing the world's information.
                             </p>

                             <p className="mb-4 leading-relaxed">
                                At TechCorp, I spearheaded the launch of a new mobile payment solution that was adopted by over 1 million users within the first year. This experience honed my ability to translate complex user needs into elegant product requirements, a skill I know is critical at Google.
                             </p>

                             <p className="mb-4 leading-relaxed">
                                I am particularly drawn to Google's commitment to innovation and accessibility. I believe my background in data-driven decision making and my passion for inclusive design would make me a valuable addition to your product team.
                             </p>

                             <p className="mb-8 leading-relaxed">
                                Thank you for considering my application. I look forward to the possibility of discussing how my skills and experiences align with the needs of your team.
                             </p>

                             <p className="mb-4">Sincerely,</p>
                             <p className="font-bold">John Doe</p>
                        </div>
                     </div>

                     {/* Right: Insights */}
                     <div className="lg:col-span-1 space-y-6">
                        <div className="bg-white rounded-xl shadow-soft p-6 border border-gray-100">
                            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <span className="material-symbols-outlined text-blue-600">psychology</span>
                                Tone Analysis
                            </h3>
                             <div className="space-y-4">
                                <div>
                                    <div className="flex justify-between text-xs font-semibold uppercase text-gray-500 mb-1">
                                        <span>Confidence</span>
                                        <span>High</span>
                                    </div>
                                    <div className="w-full bg-gray-100 rounded-full h-2">
                                        <div className="bg-blue-600 h-2 rounded-full" style={{ width: '85%' }}></div>
                                    </div>
                                </div>
                                <div>
                                    <div className="flex justify-between text-xs font-semibold uppercase text-gray-500 mb-1">
                                        <span>Empathy</span>
                                        <span>Medium</span>
                                    </div>
                                    <div className="w-full bg-gray-100 rounded-full h-2">
                                        <div className="bg-purple-500 h-2 rounded-full" style={{ width: '60%' }}></div>
                                    </div>
                                </div>
                             </div>
                             <div className="mt-6 p-4 bg-blue-50 rounded-lg text-sm text-blue-800">
                                <p className="font-bold mb-1">Suggestion:</p>
                                <p>Try to include more specific metrics in the second paragraph to quantify your impact even further.</p>
                             </div>
                        </div>

                         <div className="bg-white rounded-xl shadow-soft p-6 border border-gray-100">
                            <h3 className="font-bold text-gray-900 mb-3">Linked Job</h3>
                            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                                <div className="w-10 h-10 bg-white rounded-md flex items-center justify-center shadow-sm">
                                    <span className="font-bold text-gray-900">G</span>
                                </div>
                                <div>
                                    <p className="font-bold text-sm text-gray-900">Product Manager</p>
                                    <p className="text-xs text-gray-500">Google</p>
                                </div>
                                <span className="ml-auto text-green-600 material-symbols-outlined font-bold">check</span>
                            </div>
                        </div>
                     </div>
                </div>
             </div>
        </DashboardLayout>
    );
};
