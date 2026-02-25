import { DashboardLayout } from '@/layouts/DashboardLayout';
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/features/auth/AuthContext';
import { toast } from 'sonner';
import { coverLetterService } from './services/coverLetterService';
import { vertexService } from '@/features/ai/services/vertexService';
import type { CoverLetterFormData } from './types';

const steps = ['Job Details', 'Recipient', 'Intro', 'Body', 'Conclusion', 'Review'];

export const CoverLetterBuilderPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useAuth();
    const [currentStep, setCurrentStep] = useState(0);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSaving, setIsSaving] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    
    // Form Data State
    const [formData, setFormData] = useState<CoverLetterFormData>(() => {
        if (location.state?.parsedData) {
            const data = location.state.parsedData;
            toast.success("Cover letter content imported!");
            return {
                title: data.title || 'Imported Cover Letter',
                jobTitle: data.jobTitle || 'Target Role',
                company: data.company || 'Target Company',
                jobDescription: data.jobDescription || '',
                recipientName: data.recipientName || '',
                recipientRole: data.recipientRole || '',
                content: {
                    intro: data.content?.intro || '',
                    body: data.content?.body || '',
                    conclusion: data.content?.conclusion || ''
                }
            };
        }
        return {
            title: 'Untitled Cover Letter',
            jobTitle: '',
            company: '',
            jobDescription: '',
            recipientName: '',
            recipientRole: '',
            content: {
                intro: '',
                body: '',
                conclusion: ''
            }
        };
    });

    const handleChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
         if (errors[field]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[field];
                return newErrors;
            });
        }
    };
    
    const updateContent = (section: 'intro' | 'body' | 'conclusion', value: string) => {
        setFormData(prev => ({
            ...prev,
            content: { ...prev.content, [section]: value }
        }));
    };

    const generateAIContent = async () => {
        if (!formData.jobTitle || !formData.company) {
            toast.error("Please fill in Job Title and Company first.");
            return;
        }
        
        setIsGenerating(true);
        toast.info("Generating cover letter draft...");
        
        try {
            const generated = await vertexService.generateCoverLetter(
                formData.jobTitle, 
                formData.company, 
                formData.jobDescription || "No description provided."
            );
            
            setFormData(prev => ({
                ...prev,
                content: {
                    intro: generated.intro,
                    body: generated.body,
                    conclusion: generated.conclusion
                }
            }));
            
            toast.success("Draft generated! Review and edit as needed.");
            // Advance to the Intro step if we are on Job Details (0) or Recipient (1)
            if (currentStep < 2) setCurrentStep(2);
            
        } catch (error) {
            console.error(error);
            toast.error("Failed to generate content. Please try again.");
        } finally {
            setIsGenerating(false);
        }
    };

    const handleSave = async () => {
        if (!user) {
            toast.error("You must be logged in to save.");
            return;
        }
        setIsSaving(true);
        try {
            await coverLetterService.createCoverLetter(user.uid, formData);
            toast.success("Cover letter saved successfully!");
            navigate('/my-resumes?tab=cover-letters'); // Navigate to the cover letters tab
        } catch (error) {
            console.error(error);
            toast.error("Failed to save cover letter.");
        } finally {
            setIsSaving(false);
        }
    };

    // Validation Logic
    const validateStep = (stepIndex: number) => {
        const newErrors: Record<string, string> = {};
        let isValid = true;

        if (stepIndex === 0) { // Job Details
            if (!formData.jobTitle.trim()) newErrors.jobTitle = 'Target job title is required';
            if (!formData.company.trim()) newErrors.company = 'Company name is required';
        }
        
        if (stepIndex === 2) { // Intro
            if (!formData.content.intro.trim()) newErrors.intro = 'Introduction paragraph is required';
        }

        if (stepIndex === 3) { // Body
             if (!formData.content.body.trim()) newErrors.body = 'Body content is required';
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            isValid = false;
        }

        return isValid;
    };

    const handleNext = () => {
        if (validateStep(currentStep)) {
            if (currentStep < steps.length - 1) {
                setCurrentStep(currentStep + 1);
            }
        }
    };

    const handleBack = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    return (
        <DashboardLayout>
             <div className="max-w-4xl mx-auto h-full flex flex-col">
                {/* Header with Back Button */}
                <div className="mb-8 pt-8 relative">
                    <button 
                        onClick={() => navigate('/my-resumes')}
                        className="absolute left-0 top-8 flex items-center text-gray-500 hover:text-gray-900 transition-colors"
                    >
                        <span className="material-symbols-outlined mr-1">arrow_back</span>
                        Back
                    </button>
                    <div className="text-center">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Craft a Persuasive Cover Letter</h1>
                        <p className="text-gray-500">Tailor your story to the job you want.</p>
                    </div>
                </div>

                <div className="flex-1 bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden flex flex-col md:flex-row mb-12">
                    {/* Stepper / Sidebar */}
                    <div className="w-full md:w-64 bg-gray-50 border-r border-gray-200 p-6 flex flex-col">
                        <div className="space-y-1">
                            {steps.map((step, index) => (
                                <div 
                                    key={step} 
                                    onClick={() => {
                                         if (index < currentStep || (index === currentStep + 1 && validateStep(currentStep))) {
                                            setCurrentStep(index);
                                        }
                                    }}
                                    className={`flex items-center p-2 rounded-lg cursor-pointer ${
                                        index === currentStep 
                                        ? 'bg-white shadow-sm border border-gray-200' 
                                        : 'text-gray-500 hover:bg-gray-100'
                                    }`}
                                >
                                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium mr-3 ${
                                        index === currentStep ? 'bg-black text-white' : 'bg-gray-200 text-gray-600'
                                    }`}>
                                        {index + 1}
                                    </div>
                                    <span className={`text-sm font-medium ${index === currentStep ? 'text-gray-900' : ''}`}>{step}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Form Area */}
                    <div className="flex-1 p-8 overflow-y-auto max-h-[600px]">
                        <div className="mb-6 flex justify-between items-center">
                            <h2 className="text-xl font-bold text-gray-900">{steps[currentStep]}</h2>
                            <span className="text-sm text-gray-400">Step {currentStep + 1} of {steps.length}</span>
                        </div>

                         {currentStep === 0 && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Job Title <span className="text-red-500">*</span></label>
                                <input 
                                    type="text" 
                                    value={formData.jobTitle}
                                    onChange={(e) => handleChange('jobTitle', e.target.value)}
                                    className={`w-full px-4 py-2 border rounded-lg focus:ring-black focus:border-black ${errors.jobTitle ? 'border-red-500' : 'border-gray-300'}`}
                                    placeholder="e.g. Product Manager" 
                                />
                                {errors.jobTitle && <p className="text-red-500 text-xs mt-1">{errors.jobTitle}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Company Name <span className="text-red-500">*</span></label>
                                <input 
                                    type="text" 
                                    value={formData.company}
                                    onChange={(e) => handleChange('company', e.target.value)}
                                    className={`w-full px-4 py-2 border rounded-lg focus:ring-black focus:border-black ${errors.company ? 'border-red-500' : 'border-gray-300'}`}
                                    placeholder="e.g. Acme Corp" 
                                />
                                {errors.company && <p className="text-red-500 text-xs mt-1">{errors.company}</p>}
                            </div>
                           
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Job Description (Paste)</label>
                                <textarea 
                                    rows={6} 
                                    value={formData.jobDescription}
                                    onChange={(e) => handleChange('jobDescription', e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-black focus:border-black" 
                                    placeholder="Paste the full job description here..."
                                ></textarea>
                                <div className="mt-2 flex justify-between items-center">
                                     <p className="text-xs text-gray-500">Our AI will analyze this to generate a tailored letter.</p>
                                     <button 
                                        onClick={generateAIContent}
                                        disabled={isGenerating || !formData.jobTitle || !formData.company}
                                        className="text-xs flex items-center gap-1 bg-purple-50 text-purple-700 px-3 py-1.5 rounded-full font-medium hover:bg-purple-100 disabled:opacity-50 disabled:cursor-not-allowed"
                                     >
                                         <span className="material-symbols-outlined text-[14px]">auto_awesome</span>
                                         {isGenerating ? 'Analyzing...' : 'Auto-Generate Now'}
                                     </button>
                                </div>
                            </div>
                        </div>
                        )}

                        {currentStep === 1 && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Hiring Manager Name</label>
                                    <input 
                                        type="text" 
                                        value={formData.recipientName}
                                        onChange={(e) => handleChange('recipientName', e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-black focus:border-black" 
                                        placeholder="Jane Smith (or leave blank for 'Hiring Manager')" 
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Recipient Role/Title</label>
                                    <input 
                                        type="text" 
                                        value={formData.recipientRole}
                                        onChange={(e) => handleChange('recipientRole', e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-black focus:border-black" 
                                        placeholder="Head of Talent" 
                                    />
                                </div>
                            </div>
                        )}
                        
                        {currentStep === 2 && (
                             <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Opening Paragraph <span className="text-red-500">*</span></label>
                                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 mb-3 text-sm text-gray-600 italic">
                                    Tip: State why you are writing, name the position, and mention where you found the job listing.
                                </div>
                                <textarea 
                                    rows={8} 
                                    value={formData.content.intro}
                                    onChange={(e) => updateContent('intro', e.target.value)}
                                    className={`w-full px-4 py-2 border rounded-lg focus:ring-black focus:border-black ${errors.intro ? 'border-red-500' : 'border-gray-300'}`}
                                    placeholder="Dear Hiring Manager, I am writing to express my enthusiasm for..."
                                ></textarea>
                                {errors.intro && <p className="text-red-500 text-xs mt-1">{errors.intro}</p>}
                            </div>
                        )}

                        {currentStep === 3 && (
                             <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Body Paragraphs <span className="text-red-500">*</span></label>
                                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 mb-3 text-sm text-gray-600 italic">
                                    Tip: Connect your past achievements to the requirements of this new role.
                                </div>
                                <textarea 
                                    rows={10} 
                                    value={formData.content.body}
                                    onChange={(e) => updateContent('body', e.target.value)}
                                    className={`w-full px-4 py-2 border rounded-lg focus:ring-black focus:border-black ${errors.body ? 'border-red-500' : 'border-gray-300'}`}
                                    placeholder="In my previous role at..."
                                ></textarea>
                                {errors.body && <p className="text-red-500 text-xs mt-1">{errors.body}</p>}
                            </div>
                        )}

                        {currentStep === 4 && (
                             <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Conclusion</label>
                                <textarea 
                                    rows={6} 
                                    value={formData.content.conclusion}
                                    onChange={(e) => updateContent('conclusion', e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-black focus:border-black"
                                    placeholder="Thank you for your time and consideration. I look forward to..."
                                ></textarea>
                            </div>
                        )}

                        {currentStep === 5 && (
                             <div className="text-center py-12 animate-in fade-in slide-in-from-right-4 duration-300">
                                <h3 className="text-xl font-bold text-gray-900 mb-4">You're almost done!</h3>
                                <div className="bg-gray-50 p-6 rounded-lg text-left border border-gray-200 mb-6 font-serif text-sm leading-relaxed max-h-60 overflow-y-auto">
                                    <p className="mb-4">Dear {formData.recipientName || 'Hiring Manager'},</p>
                                    <p className="mb-4">{formData.content.intro}</p>
                                    <p className="mb-4 whitespace-pre-line">{formData.content.body}</p>
                                    <p className="mb-4">{formData.content.conclusion}</p>
                                    <p>Sincerely,<br/>Your Name</p>
                                </div>
                                <div className="flex justify-center gap-4">
                                    <button 
                                        onClick={handleSave}
                                        disabled={isSaving}
                                        className="px-6 py-3 bg-black text-white rounded-lg font-medium hover:bg-gray-800 shadow-lg shadow-gray-200 flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                                    >
                                        <span className="material-symbols-outlined">save</span>
                                        {isSaving ? 'Saving...' : 'Save & Finish'}
                                    </button>
                                </div>
                            </div>
                        )}

                        <div className="mt-10 flex justify-end gap-3 pt-6 border-t border-gray-100">
                             {currentStep > 0 && currentStep < steps.length - 1 && (
                                <button 
                                    onClick={handleBack}
                                    className="px-6 py-2 border border-gray-300 rounded-full text-gray-700 font-medium hover:bg-gray-50 transition"
                                >
                                    Back
                                </button>
                            )}
                            {currentStep < steps.length - 1 && (
                             <button 
                                onClick={handleNext}
                                className="px-6 py-2 bg-black text-white rounded-full font-medium hover:bg-gray-800 transition shadow-lg shadow-gray-400/20"
                             >
                                 Next: {steps[currentStep + 1]}
                             </button>
                            )}
                         </div>
                    </div>
                </div>
             </div>
        </DashboardLayout>
    )
}

