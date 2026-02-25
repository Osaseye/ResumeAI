import { Link, useParams } from 'react-router-dom';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { useEffect, useState } from 'react';
import { coverLetterService } from './services/coverLetterService';
import type { CoverLetter } from './types';
import { toast } from 'sonner';

export const CoverLetterDetailsPage = () => {
    const { id } = useParams<{ id: string }>();
    const [letter, setLetter] = useState<CoverLetter | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLetter = async () => {
            if (!id) return;
            try {
                const data = await coverLetterService.getCoverLetterById(id);
                if (data) {
                    setLetter(data);
                } else {
                    toast.error("Cover letter not found");
                }
            } catch (error) {
                console.error("Error fetching cover letter:", error);
                toast.error("Failed to load cover letter");
            } finally {
                setLoading(false);
            }
        };

        fetchLetter();
    }, [id]);

    if (loading) {
        return (
            <DashboardLayout>
                <div className="flex justify-center items-center h-full">
                    <p className="text-gray-500">Loading...</p>
                </div>
            </DashboardLayout>
        );
    }

    if (!letter) {
        return (
            <DashboardLayout>
                <div className="flex flex-col items-center justify-center h-full">
                    <p className="text-gray-500 mb-4">Cover letter not found.</p>
                    <Link to="/my-resumes" className="text-black underline">Back to My Documents</Link>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
             <div className="flex flex-col h-full overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between mb-6 shrink-0">
                    <div className="flex items-center gap-4">
                        <Link to="/my-resumes?tab=cover-letters" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                            <span className="material-symbols-outlined text-gray-500">arrow_back</span>
                        </Link>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">{letter.title || 'Untitled Cover Letter'}</h1>
                            <p className="text-sm text-gray-500">Targeting: {letter.jobTitle} @ {letter.company}</p>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <button 
                            onClick={() => window.print()}
                            className="px-4 py-2 border border-gray-200 rounded-lg text-gray-700 font-medium hover:bg-gray-50 flex items-center gap-2"
                        >
                             <span className="material-symbols-outlined text-sm">print</span>
                            Print / PDF
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-full overflow-hidden">
                    {/* Left: Preview */}
                     <div className="lg:col-span-2 bg-gray-100 rounded-2xl p-8 overflow-y-auto border border-gray-200 shadow-inner h-full print-content">
                        <div className="bg-white max-w-[800px] mx-auto min-h-[800px] shadow-sm p-16 font-serif">
                             <p className="mb-8">{new Date(letter.createdAt).toLocaleDateString()}</p>
                             
                             <p className="mb-2">{letter.recipientName || 'Hiring Manager'}</p>
                             {letter.recipientRole && <p className="mb-2">{letter.recipientRole}</p>}
                             <p className="mb-2">{letter.company}</p>
                             
                             <p className="mb-6 mt-8">Dear {letter.recipientName || 'Hiring Manager'},</p>

                             <p className="mb-4 leading-relaxed whitespace-pre-wrap">{letter.content.intro}</p>

                             <p className="mb-4 leading-relaxed whitespace-pre-wrap">{letter.content.body}</p>

                             <p className="mb-4 leading-relaxed whitespace-pre-wrap">{letter.content.conclusion}</p>

                             <p className="mt-8 mb-4">Sincerely,</p>
                             <p className="font-bold">Your Name</p>
                        </div>
                     </div>

                     {/* Right: Insights */}
                     <div className="lg:col-span-1 space-y-6 overflow-y-auto h-full pb-8 hide-on-print">
                        <div className="bg-white rounded-xl shadow-soft p-6 border border-gray-100">
                            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <span className="material-symbols-outlined text-purple-600">auto_awesome</span>
                                AI Analysis
                            </h3>
                             <p className="text-sm text-gray-600 mb-4">
                                 This cover letter is tailored for the <strong>{letter.jobTitle}</strong> role at <strong>{letter.company}</strong>.
                             </p>
                        </div>

                         <div className="bg-white rounded-xl shadow-soft p-6 border border-gray-100">
                            <h3 className="font-bold text-gray-900 mb-3">Linked Job</h3>
                            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                                <div className="w-10 h-10 bg-white rounded-md flex items-center justify-center shadow-sm text-gray-900 font-bold border border-gray-100">
                                    {letter.company.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <p className="font-bold text-sm text-gray-900">{letter.jobTitle}</p>
                                    <p className="text-xs text-gray-500">{letter.company}</p>
                                </div>
                            </div>
                        </div>
                     </div>
                </div>
             </div>
             <style>{`
                @media print {
                    @page { margin: 0; }
                    body * { visibility: hidden; }
                    .print-content, .print-content * { visibility: visible; }
                    .print-content { 
                        position: absolute; 
                        left: 0; 
                        top: 0; 
                        width: 100%; 
                        max-width: 100%;
                        height: auto; 
                        margin: 0; 
                        padding: 2cm; 
                        background: white;
                        border: none;
                        overflow: visible;
                    }
                    .hide-on-print { display: none; }
                }
             `}</style>
        </DashboardLayout>
    );
};
