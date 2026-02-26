import { DashboardLayout } from '@/layouts/DashboardLayout';
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'sonner';
import { useAuth } from '@/features/auth/AuthContext';
import { resumeService } from '../resumes/services/resumeService';
import { vertexService } from '@/features/ai/services/vertexService';
import type { ResumeFormData, Experience, Education } from '../resumes/types';
import { ResumePreview } from '../resumes/components/ResumePreview';

const steps = ['Personal Info', 'Experience', 'Education', 'Skills', 'Summary', 'Template', 'Finalize'];

export const ResumeBuilderPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useAuth();
    const [currentStep, setCurrentStep] = useState(0);
    const [isSaving, setIsSaving] = useState(false);
    const [selectedTemplate, setSelectedTemplate] = useState<'professional' | 'modern' | 'creative' | 'simple' | 'tech'>('professional');

    // Initial State matching ResumeFormData
    const [formData, setFormData] = useState<ResumeFormData>(() => {
        if (location.state?.parsedData) {
            const data = location.state.parsedData;
            return {
                title: data.title || 'Imported Resume',
                headline: data.headline || '',
                contact: {
                    fullName: data.contact?.fullName || '',
                    email: data.contact?.email || '',
                    phone: data.contact?.phone || '',
                    location: data.contact?.location || '',
                    linkedin: data.contact?.linkedin || '',
                    website: data.contact?.website || ''
                },
                summary: data.summary || '',
                experience: data.experience || [],
                education: data.education || [],
                skills: data.skills || [],
                projects: data.projects || []
            };
        }
        return {
            title: 'Untitled Resume',
            headline: '',
            contact: {
                fullName: '',
                email: '',
                phone: '',
                location: '',
                linkedin: '',
                website: ''
            },
            summary: '',
            experience: [],
            education: [],
            skills: [],
            projects: []
        };
    });

    const updateContact = (field: keyof typeof formData.contact, value: string) => {
        setFormData(prev => ({
            ...prev,
            contact: { ...prev.contact, [field]: value }
        }));
    };


    // Validation Logic
    const validateStep = (stepIndex: number) => {
        let isValid = true;
        
        switch(stepIndex) {
            case 0: // Personal Info
                if (!formData.contact.fullName.trim()) {
                    toast.error("Full Name is required");
                    isValid = false;
                } else if (!formData.contact.email.trim()) {
                    toast.error("Email is required");
                    isValid = false;
                } else if (!formData.title.trim()) {
                    toast.error("Resume Title is required");
                    isValid = false;
                }
                break;
            
            case 1: // Experience
                if (formData.experience.length === 0) {
                    toast.warning("Adding at least one work experience is recommended");
                    // We allow proceeding but with a warning? Or enforce it? 
                    // User asked for validation because they get a blank resume. Let's be strict for now or at least check empty fields in entries.
                }
                // Check if any added experience has empty required fields
                const invalidExp = formData.experience.some(exp => !exp.company.trim() || !exp.role.trim());
                if (invalidExp) {
                    toast.error("Please fill in Company and Role for all experience entries");
                    isValid = false;
                }
                break;

            case 2: // Education
                const invalidEdu = formData.education.some(edu => !edu.school.trim() || !edu.degree.trim());
                if (invalidEdu) {
                    toast.error("Please fill in School and Degree for all education entries");
                    isValid = false;
                }
                break;

            case 3: // Skills
                if (formData.skills.length === 0) {
                    toast.error("Please add at least one skill");
                    isValid = false;
                }
                break;

            case 4: // Summary
                if (!formData.summary.trim()) {
                    toast.error("Professional Summary is required");
                    isValid = false;
                } else if (formData.summary.trim().length < 50) {
                    toast.error("Summary should be at least 50 characters long");
                    isValid = false;
                }
                break;
        }
        return isValid;
    };

    const handleSave = async () => {
        if (!user) {
            toast.error("You must be logged in to save.");
            return;
        }
        setIsSaving(true);
        try {
            toast("AI is polishing your resume...");
            
            // Attempt Requirement: "Create the resume using the information filled"
            let finalData = formData;
            try {
                const enhancedData = await vertexService.enhanceResume(formData);
                // Merge enhanced data safely
                finalData = { ...formData, ...enhancedData };
            } catch (aiError) {
                console.error("AI Generation failed, falling back to original:", aiError);
                toast.warning("AI enhancement unavailable. Saving original content.");
            }

            // Ensure the selected template is included in the saved data
            const dataToSave = {
                ...finalData,
                template: selectedTemplate
            };

            await resumeService.createResume(user.uid, dataToSave);
            toast.success("Resume created successfully!");
            
            // Navigate to the new resume details (when available)
            // For now, let's keep it pointing to /my-resumes so the user doesn't hit a 404
            navigate('/my-resumes');
            
        } catch (error: any) {
            console.error(error);
            toast.error("Failed to save resume: " + error.message);
        } finally {
            setIsSaving(false);
        }
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

    // Experience Helpers
    const addExperience = () => {
        setFormData(prev => ({
            ...prev,
            experience: [
                ...prev.experience,
                { 
                    id: Date.now().toString(), 
                    role: '', 
                    company: '', 
                    startDate: '', 
                    endDate: '', 
                    current: false,
                    location: '', 
                    description: '' 
                }
            ]
        }));
    };

    const updateExperience = (id: string, field: keyof Experience, value: any) => {
        setFormData(prev => ({
            ...prev,
            experience: prev.experience.map(exp => exp.id === id ? { ...exp, [field]: value } : exp)
        }));
    };
    
    const removeExperience = (id: string) => {
        setFormData(prev => ({
            ...prev,
            experience: prev.experience.filter(exp => exp.id !== id)
        }));
    };

     // Education Helpers
     const addEducation = () => {
        setFormData(prev => ({
            ...prev,
            education: [
                ...prev.education,
                { 
                    id: Date.now().toString(), 
                    school: '', 
                    degree: '', 
                    field: '', 
                    location: '', 
                    startDate: '', 
                    endDate: '', 
                    current: false 
                }
            ]
        }));
    };

    const updateEducation = (id: string, field: keyof Education, value: any) => {
        setFormData(prev => ({
            ...prev,
            education: prev.education.map(edu => edu.id === id ? { ...edu, [field]: value } : edu)
        }));
    };

    const removeEducation = (id: string) => {
        setFormData(prev => ({
            ...prev,
            education: prev.education.filter(edu => edu.id !== id)
        }));
    };

    const addSkill = (skillName: string) => {
        if (!skillName.trim()) return;
        setFormData(prev => ({
            ...prev,
            skills: [
                ...prev.skills,
                { id: Date.now().toString(), name: skillName, level: 'Intermediate' }
            ]
        }));
    };

    const removeSkill = (id: string) => {
        setFormData(prev => ({
            ...prev,
            skills: prev.skills.filter(skill => skill.id !== id)
        }));
    };

    return (
        <DashboardLayout>
             <div className="max-w-4xl mx-auto min-h-screen flex flex-col pb-20">
                {/* Header with Back Button */}
                <div className="mb-6 pt-6 relative px-4 md:px-0">
                    <button 
                        onClick={() => navigate('/my-resumes')}
                        className="mb-4 md:mb-0 md:absolute md:left-0 md:top-8 flex items-center text-gray-500 hover:text-gray-900 transition-colors"
                    >
                        <span className="material-symbols-outlined mr-1">arrow_back</span>
                        Back <span className="hidden md:inline">to Resumes</span>
                    </button>
                    <div className="text-center">
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Build Your Resume</h1>
                        <p className="text-sm md:text-base text-gray-500">Let's start by gathering your basic information.</p>
                    </div>
                </div>

                <div className="flex-1 bg-white md:rounded-2xl shadow-sm md:border border-gray-200 overflow-hidden flex flex-col md:flex-row mb-12">
                    {/* Stepper / Sidebar */}
                    <div className="w-full md:w-64 bg-gray-50 border-b md:border-b-0 md:border-r border-gray-200 p-4 md:p-6 flex flex-col">
                        <div className="flex flex-row md:flex-col overflow-x-auto space-x-4 md:space-x-0 md:space-y-1 pb-2 md:pb-0 no-scrollbar">
                            {steps.map((step, index) => (
                                <div 
                                    key={step} 
                                    onClick={() => {
                                        // Only allow jumping to previous steps or the next available step if valid
                                        if (index < currentStep || (index === currentStep + 1 && validateStep(currentStep))) {
                                            setCurrentStep(index);
                                        }
                                    }}
                                    className={`flex items-center flex-shrink-0 p-2 rounded-lg cursor-pointer transition-colors ${
                                        index === currentStep 
                                        ? 'bg-white shadow-sm border border-gray-200' 
                                        : 'text-gray-500 hover:bg-gray-100'
                                    }`}
                                >
                                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium mr-2 md:mr-3 ${
                                        index === currentStep ? 'bg-black text-white' : 'bg-gray-200 text-gray-600'
                                    }`}>
                                        {index + 1}
                                    </div>
                                    <span className={`text-sm font-medium whitespace-nowrap ${index === currentStep ? 'text-gray-900' : ''}`}>{step}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Form Area */}
                    <div className="flex-1 p-4 md:p-8 overflow-y-auto md:max-h-[600px] h-full">
                        <div className="mb-6 flex justify-between items-center">
                            <h2 className="text-xl font-bold text-gray-900">{steps[currentStep]}</h2>
                            <span className="text-sm text-gray-400 hidden md:inline">Step {currentStep + 1} of {steps.length}</span>
                            <span className="text-xs text-gray-400 md:hidden">{currentStep + 1}/{steps.length}</span>
                        </div>
                        
                        {/* Step 0: Personal Info */}
                        {currentStep === 0 && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 animate-in fade-in slide-in-from-right-4 duration-300">
                             <div className="col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Resume Title <span className="text-red-500">*</span></label>
                                <input 
                                    type="text" 
                                    value={formData.title}
                                    onChange={(e) => setFormData(prev => ({...prev, title: e.target.value}))}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-black focus:border-black"
                                    placeholder="e.g. Senior Frontend Resume" 
                                />
                            </div>
                            
                            <div className="col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name <span className="text-red-500">*</span></label>
                                <input 
                                    type="text" 
                                    value={formData.contact.fullName}
                                    onChange={(e) => updateContact('fullName', e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-black focus:border-black"
                                    placeholder="John Doe" 
                                />
                            </div>
                            
                            <div className="col-span-1">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email <span className="text-red-500">*</span></label>
                                <input 
                                    type="email" 
                                    value={formData.contact.email}
                                    onChange={(e) => updateContact('email', e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-black focus:border-black"
                                    placeholder="john@example.com" 
                                />
                            </div>
                            
                            <div className="col-span-1">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                                <input 
                                    type="tel" 
                                    value={formData.contact.phone}
                                    onChange={(e) => updateContact('phone', e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-black focus:border-black" 
                                    placeholder="+1 (555) 000-0000" 
                                />
                            </div>
                            
                             <div className="col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Professional Headline</label>
                                <input 
                                    type="text" 
                                    value={formData.headline}
                                    onChange={(e) => setFormData(prev => ({...prev, headline: e.target.value}))}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-black focus:border-black" 
                                    placeholder="Senior Software Engineer" 
                                />
                            </div>

                            <div className="col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                                <input 
                                    type="text" 
                                    value={formData.contact.location}
                                    onChange={(e) => updateContact('location', e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-black focus:border-black" 
                                    placeholder="City, Country" 
                                />
                            </div>
                            
                             <div className="col-span-1">
                                <label className="block text-sm font-medium text-gray-700 mb-1">LinkedIn URL</label>
                                <input 
                                    type="url" 
                                    value={formData.contact.linkedin}
                                    onChange={(e) => updateContact('linkedin', e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-black focus:border-black" 
                                    placeholder="linkedin.com/in/johndoe" 
                                />
                            </div>
                             <div className="col-span-1">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Website / Portfolio</label>
                                <input 
                                    type="url" 
                                    value={formData.contact.website}
                                    onChange={(e) => updateContact('website', e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-black focus:border-black" 
                                    placeholder="johndoe.com" 
                                />
                            </div>
                        </div>
                        )}

                        {/* Step 1: Experience */}
                        {currentStep === 1 && (
                            <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                                {formData.experience.length === 0 ? (
                                    <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-xl mb-6">
                                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <span className="material-symbols-outlined text-gray-400 text-3xl">work_history</span>
                                        </div>
                                        <h3 className="text-lg font-bold text-gray-900 mb-2">Work Experience</h3>
                                        <p className="text-gray-500 mb-6 px-12">List your past roles to demonstrate your expertise. Start with your most recent position.</p>
                                    </div>
                                ) : (
                                    <div className="space-y-6 mb-8">
                                        {formData.experience.map((exp) => (
                                            <div key={exp.id} className="p-4 border border-gray-200 rounded-xl bg-gray-50 hover:bg-white transition-colors relative group">
                                                 <button 
                                                    onClick={() => removeExperience(exp.id)}
                                                    className="absolute top-2 right-2 p-2 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                                    title="Remove"
                                                >
                                                    <span className="material-symbols-outlined text-[18px]">delete</span>
                                                </button>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div>
                                                        <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Job Title</label>
                                                        <input 
                                                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm" 
                                                            placeholder="Senior Software Engineer"
                                                            value={exp.role}
                                                            onChange={(e) => updateExperience(exp.id, 'role', e.target.value)}
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Company</label>
                                                        <input 
                                                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm" 
                                                            placeholder="Acme Corp"
                                                            value={exp.company}
                                                            onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
                                                        />
                                                    </div>
                                                    
                                                     <div>
                                                        <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Location</label>
                                                        <input 
                                                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm" 
                                                            placeholder="New York, NY"
                                                            value={exp.location}
                                                            onChange={(e) => updateExperience(exp.id, 'location', e.target.value)}
                                                        />
                                                    </div>

                                                    <div>
                                                        <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Start Date</label>
                                                        <input 
                                                            type="month"
                                                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm" 
                                                            value={exp.startDate}
                                                            onChange={(e) => updateExperience(exp.id, 'startDate', e.target.value)}
                                                        />
                                                    </div>

                                                     <div>
                                                        <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">End Date</label>
                                                        <input 
                                                            type="month"
                                                            disabled={exp.current}
                                                            className={`w-full px-3 py-2 border border-gray-300 rounded-md text-sm ${exp.current ? 'bg-gray-100 text-gray-400' : ''}`}
                                                            value={exp.endDate}
                                                            onChange={(e) => updateExperience(exp.id, 'endDate', e.target.value)}
                                                        />
                                                    </div>
                                                    
                                                    <div className="md:col-span-2 flex items-center">
                                                        <input 
                                                            type="checkbox"
                                                            id={`current-${exp.id}`}
                                                            className="h-4 w-4 text-black border-gray-300 rounded focus:ring-black"
                                                            checked={exp.current}
                                                            onChange={(e) => updateExperience(exp.id, 'current', e.target.checked)}
                                                        />
                                                        <label htmlFor={`current-${exp.id}`} className="ml-2 text-sm text-gray-700">I currently work here</label>
                                                    </div>
                                                    <div className="col-span-2">
                                                        <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Description</label>
                                                        <textarea 
                                                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm" 
                                                            rows={3} 
                                                            placeholder="Did X using Y to achieve Z..."
                                                            value={exp.description}
                                                            onChange={(e) => updateExperience(exp.id, 'description', e.target.value)}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                                <button 
                                    onClick={addExperience}
                                    className="w-full py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-600 font-medium hover:border-black hover:text-black transition flex items-center justify-center gap-2"
                                >
                                    <span className="material-symbols-outlined">add</span>
                                    Add Position
                                </button>
                            </div>
                        )}
                        
                         {/* Step 2: Education */}
                         {currentStep === 2 && (
                             <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                                {formData.education.length === 0 ? (
                                    <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-xl mb-6">
                                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <span className="material-symbols-outlined text-gray-400 text-3xl">school</span>
                                        </div>
                                        <h3 className="text-lg font-bold text-gray-900 mb-2">Education</h3>
                                        <p className="text-gray-500 mb-6 px-12">Add your educational background, certifications, and relevant training.</p>
                                    </div>
                                ) : (
                                    <div className="space-y-6 mb-8">
                                        {formData.education.map((edu) => (
                                            <div key={edu.id} className="p-4 border border-gray-200 rounded-xl bg-gray-50 hover:bg-white transition-colors relative group">
                                                 <button 
                                                    onClick={() => removeEducation(edu.id)}
                                                    className="absolute top-2 right-2 p-2 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                                    title="Remove"
                                                >
                                                    <span className="material-symbols-outlined text-[18px]">delete</span>
                                                </button>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div>
                                                        <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">School / University</label>
                                                        <input 
                                                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm" 
                                                            placeholder="Mylestone University"
                                                            value={edu.school}
                                                            onChange={(e) => updateEducation(edu.id, 'school', e.target.value)}
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Degree</label>
                                                        <input 
                                                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm" 
                                                            placeholder="Bachelor of Science"
                                                            value={edu.degree}
                                                            onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)}
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Field of Study</label>
                                                        <input 
                                                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm" 
                                                            placeholder="Computer Science"
                                                            value={edu.field}
                                                            onChange={(e) => updateEducation(edu.id, 'field', e.target.value)}
                                                        />
                                                    </div>
                                                     <div>
                                                        <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Location</label>
                                                        <input 
                                                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm" 
                                                            placeholder="Boston, MA"
                                                            value={edu.location}
                                                            onChange={(e) => updateEducation(edu.id, 'location', e.target.value)}
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Start Date</label>
                                                        <input 
                                                            type="month"
                                                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm" 
                                                            value={edu.startDate}
                                                            onChange={(e) => updateEducation(edu.id, 'startDate', e.target.value)}
                                                        />
                                                    </div>
                                                     <div>
                                                        <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">End Date</label>
                                                        <input 
                                                            type="month"
                                                            disabled={edu.current}
                                                            className={`w-full px-3 py-2 border border-gray-300 rounded-md text-sm ${edu.current ? 'bg-gray-100 text-gray-400' : ''}`}
                                                            value={edu.endDate}
                                                            onChange={(e) => updateEducation(edu.id, 'endDate', e.target.value)}
                                                        />
                                                    </div>
                                                    
                                                    <div className="md:col-span-2 flex items-center">
                                                        <input 
                                                            type="checkbox"
                                                            id={`current-edu-${edu.id}`}
                                                            className="h-4 w-4 text-black border-gray-300 rounded focus:ring-black"
                                                            checked={edu.current}
                                                            onChange={(e) => updateEducation(edu.id, 'current', e.target.checked)}
                                                        />
                                                        <label htmlFor={`current-edu-${edu.id}`} className="ml-2 text-sm text-gray-700">I currently study here</label>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                                <button 
                                    onClick={addEducation}
                                    className="w-full py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-600 font-medium hover:border-black hover:text-black transition flex items-center justify-center gap-2"
                                >
                                    <span className="material-symbols-outlined">add</span>
                                    Add Education
                                </button>
                            </div>
                         )}

                        {/* Step 3: Skills */}
                        {currentStep === 3 && (
                            <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                                <div className="space-y-6">
                                     <div className="text-center border-2 border-dashed border-gray-200 rounded-xl py-8 mb-6">
                                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <span className="material-symbols-outlined text-gray-400 text-3xl">psychology</span>
                                        </div>
                                        <h3 className="text-lg font-bold text-gray-900 mb-2">Key Skills</h3>
                                        <p className="text-gray-500 px-12">Highlight your technical and soft skills.</p>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Add a Skill</label>
                                        <div className="flex gap-2">
                                            <input 
                                                type="text"
                                                id="skillInput"
                                                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-black focus:border-black" 
                                                placeholder="e.g. React, Project Management"
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter') {
                                                        e.preventDefault();
                                                        const val = e.currentTarget.value;
                                                        if(val) {
                                                            addSkill(val);
                                                            e.currentTarget.value = '';
                                                        }
                                                    }
                                                }}
                                            />
                                            <button 
                                                onClick={() => {
                                                    const input = document.getElementById('skillInput') as HTMLInputElement;
                                                    if (input && input.value) {
                                                        addSkill(input.value);
                                                        input.value = '';
                                                    }
                                                }}
                                                className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition"
                                            >
                                                Add
                                            </button>
                                        </div>
                                    </div>

                                    <div>
                                        <h4 className="text-sm font-medium text-gray-700 mb-3">Your Skills</h4>
                                        {formData.skills.length === 0 ? (
                                            <p className="text-gray-400 text-sm italic">No skills added yet.</p>
                                        ) : (
                                            <div className="flex flex-wrap gap-2">
                                                {formData.skills.map(skill => (
                                                    <div key={skill.id} className="bg-gray-100 text-gray-800 px-3 py-1.5 rounded-full text-sm font-medium flex items-center gap-2 group border border-gray-200">
                                                        {skill.name}
                                                        <button 
                                                            onClick={() => removeSkill(skill.id)}
                                                            className="text-gray-400 hover:text-red-500 transition-colors"
                                                        >
                                                            <span className="material-symbols-outlined text-[16px]">close</span>
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    <div className="pt-4 border-t border-gray-100">
                                        <h4 className="text-xs font-semibold text-gray-500 uppercase mb-3">Suggested Skills</h4>
                                        <div className="flex gap-2 flex-wrap">
                                            {['Communication', 'Leadership', 'Problem Solving', 'Teamwork', 'Agile'].map(skill => (
                                                <button 
                                                    key={skill} 
                                                    onClick={() => addSkill(skill)} 
                                                    className="text-xs bg-white hover:bg-gray-50 text-gray-600 px-3 py-1 rounded-full border border-gray-200 transition dashed"
                                                >
                                                    + {skill}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                         )}

                         {/* Step 4: Summary */}
                         {currentStep === 4 && (
                            <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Professional Summary</label>
                                    <textarea 
                                        rows={8} 
                                        value={formData.summary}
                                        onChange={(e) => setFormData(prev => ({...prev, summary: e.target.value}))}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-black focus:border-black" 
                                        placeholder="Write 2-4 sentences summarizing your experience and top achievements..."
                                    ></textarea>
                                    <button className="mt-4 flex items-center gap-2 text-sm font-semibold text-purple-700 hover:text-purple-800">
                                        <span className="material-symbols-outlined text-[18px]">auto_awesome</span>
                                        Auto-Generate with AI
                                    </button>
                                </div>
                            </div>
                         )}
                         
                         {/* Step 5: Template Selection */}
                         {currentStep === 5 && (
                            <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                                <h2 className="text-xl font-bold text-gray-900 mb-6">Choose a Template</h2>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
                                    {(['professional', 'modern', 'creative', 'simple', 'tech'] as const).map((t) => (
                                        <button
                                            key={t}
                                            onClick={() => setSelectedTemplate(t)}
                                            className={`p-4 border-2 rounded-xl text-left transition-all hover:border-black ${selectedTemplate === t ? 'border-black bg-gray-50 ring-1 ring-black' : 'border-gray-200'}`}
                                        >
                                            <div className="h-20 bg-white border border-gray-100 mb-3 shadow-sm flex items-center justify-center overflow-hidden relative">
                                                {/* Mini preview abstract representation */}
                                                <div className="w-full h-full p-2 opacity-50 space-y-1 transform scale-75 origin-top">
                                                     <div className="h-2 bg-gray-800 w-1/3 mb-2 rounded-sm"></div>
                                                     <div className="h-1 bg-gray-300 w-full rounded-sm"></div>
                                                     <div className="h-1 bg-gray-300 w-full rounded-sm"></div>
                                                     <div className="h-1 bg-gray-300 w-2/3 rounded-sm"></div>
                                                </div>
                                                {selectedTemplate === t && (
                                                    <div className="absolute inset-0 flex items-center justify-center bg-black/5">
                                                        <span className="material-symbols-outlined text-black font-bold">check</span>
                                                    </div>
                                                )}
                                            </div>
                                            <span className="capitalize font-semibold text-gray-900 block">{t}</span>
                                        </button>
                                    ))}
                                </div>
                                
                                <div className="border border-gray-200 rounded-lg overflow-hidden bg-gray-50 p-4">
                                     <h3 className="text-sm font-medium text-gray-500 mb-2 uppercase tracking-wider">Live Preview</h3>
                                     <div className="w-full flex justify-center overflow-hidden">
                                        <div className="transform scale-[0.4] sm:scale-[0.5] md:scale-[0.6] origin-top h-[500px] md:h-[600px] overflow-y-auto border border-gray-300 shadow-lg bg-white">
                                            <ResumePreview data={formData} template={selectedTemplate} />
                                        </div>
                                     </div>
                                </div>
                            </div>
                         )}

                         {/* Step 6: Finalize */}
                         {currentStep === 6 && (
                             <div className="text-center py-12 animate-in fade-in slide-in-from-right-4 duration-300">
                                 <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <span className="material-symbols-outlined text-green-600 text-4xl">check_circle</span>
                                </div>
                                <h2 className="text-2xl font-bold text-gray-900 mb-2">Resume Ready!</h2>
                                <p className="text-gray-500 mb-8 max-w-md mx-auto">
                                    Your <strong>{selectedTemplate}</strong> style resume includes {formData.experience.length} positions and {formData.education.length} education entries.
                                </p>
                                
                                <div className="flex justify-center gap-4">
                                     <button 
                                        onClick={handleSave}
                                        disabled={isSaving}
                                        className="px-6 py-3 bg-black text-white rounded-lg font-medium hover:bg-gray-800 shadow-lg shadow-gray-200 flex items-center gap-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
                                     >
                                        <span className="material-symbols-outlined">save</span>
                                        {isSaving ? 'Saving...' : 'Save to Dashboard'}
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

