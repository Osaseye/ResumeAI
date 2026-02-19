import { useState } from 'react';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { toast } from 'sonner';

const FAQS = [
    {
        question: "How do I export my resume to PDF?",
        answer: "To export your resume, go to the 'My Resumes' page, select the resume you want to export, and click the 'Download' button. You can choose PDF or Word format."
    },
    {
        question: "Can I import my LinkedIn profile?",
        answer: "Yes! Currently you can import your profile by downloading your LinkedIn profile as a PDF and using our 'Import Profile' feature on the dashboard."
    },
    {
        question: "How does the ATS analyzer work?",
        answer: "Our ATS analyzer scans your resume against job descriptions using advanced algorithms to identify missing keywords and formatting issues that might block your application."
    },
    {
        question: "Is my data private and secure?",
        answer: "Absolutely. We use industry-standard encryption to protect your data. We do not share your personal information with third parties without your consent."
    }
];

export const HelpCenterPage = () => {
    const [openIndex, setOpenIndex] = useState<number | null>(null);
    const [isContactOpen, setIsContactOpen] = useState(false);

    const toggleFaq = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    const handleContactSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsContactOpen(false);
        toast.success("Support ticket created successfully. We'll be in touch!");
    };

    return (
        <DashboardLayout>
            {/* Contact Support Modal */}
            {isContactOpen && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl animate-in fade-in zoom-in duration-200">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold text-gray-900">Contact Support</h3>
                            <button onClick={() => setIsContactOpen(false)} className="text-gray-400 hover:text-gray-600">
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>
                        <form onSubmit={handleContactSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                                <select className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black outline-none">
                                    <option>General Inquiry</option>
                                    <option>Technical Issue</option>
                                    <option>Billing Question</option>
                                    <option>Feature Request</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                                <textarea 
                                    rows={4} 
                                    className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black outline-none"
                                    placeholder="Describe your issue..."
                                    required
                                ></textarea>
                            </div>
                            <div className="flex justify-end gap-3 pt-2">
                                <button 
                                    type="button"
                                    onClick={() => setIsContactOpen(false)}
                                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium"
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit"
                                    className="px-4 py-2 bg-black text-white rounded-lg font-medium hover:bg-gray-800"
                                >
                                    Send Message
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className="text-center py-12">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">How can we help you?</h1>
                <div className="max-w-2xl mx-auto relative">
                    <span className="absolute left-4 top-3.5 text-gray-400 material-symbols-outlined">search</span>
                    <input 
                        type="text" 
                        placeholder="Search for articles..." 
                        className="w-full pl-12 pr-4 py-3 rounded-full border border-gray-300 focus:ring-2 focus:ring-black focus:border-transparent shadow-sm"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition text-center">
                    <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="material-symbols-outlined">rocket_launch</span>
                    </div>
                    <h3 className="font-bold text-gray-900 mb-2">Getting Started</h3>
                    <p className="text-sm text-gray-500 mb-4">Learn basics of Resume AI and setting up your account.</p>
                    <a href="#" className="text-sm font-semibold text-blue-600 hover:underline">View Articles</a>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition text-center">
                    <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="material-symbols-outlined">edit_document</span>
                    </div>
                    <h3 className="font-bold text-gray-900 mb-2">Resume Building</h3>
                    <p className="text-sm text-gray-500 mb-4">Tips for using the editor and improving your score.</p>
                     <a href="#" className="text-sm font-semibold text-purple-600 hover:underline">View Articles</a>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition text-center">
                    <div className="w-12 h-12 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="material-symbols-outlined">payments</span>
                    </div>
                    <h3 className="font-bold text-gray-900 mb-2">Billing & Account</h3>
                    <p className="text-sm text-gray-500 mb-4">Manage your subscription and payment methods.</p>
                     <a href="#" className="text-sm font-semibold text-green-600 hover:underline">View Articles</a>
                </div>
            </div>

            <div className="bg-gray-50 rounded-2xl p-8 mb-8 max-w-4xl mx-auto">
                <h2 className="text-xl font-bold text-gray-900 mb-6 text-center">Frequently Asked Questions</h2>
                <div className="space-y-4">
                    {FAQS.map((item, i) => (
                        <div key={i} className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                            <button 
                                onClick={() => toggleFaq(i)}
                                className="w-full flex justify-between items-center p-4 hover:bg-gray-50 transition cursor-pointer text-left"
                            >
                                <span className="font-medium text-gray-800">{item.question}</span>
                                <span className="material-symbols-outlined text-gray-400 transition-transform duration-200" style={{ transform: openIndex === i ? 'rotate(180deg)' : 'rotate(0deg)' }}>expand_more</span>
                            </button>
                            {openIndex === i && (
                                <div className="p-4 pt-0 text-sm text-gray-600 bg-gray-50 border-t border-gray-100">
                                    {item.answer}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            <div className="text-center pb-8">
                 <p className="text-gray-500 mb-4">Can't find what you're looking for?</p>
                 <button 
                    onClick={() => setIsContactOpen(true)}
                    className="bg-black text-white px-6 py-2.5 rounded-full font-medium hover:bg-gray-800 transition"
                >
                    Contact Support
                </button>
            </div>
        </DashboardLayout>
    );
};
