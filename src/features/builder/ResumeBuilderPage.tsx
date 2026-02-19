import { DashboardLayout } from '@/layouts/DashboardLayout';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const steps = ['Personal Info', 'Experience', 'Education', 'Skills', 'Summary', 'Finalize'];

interface Experience {
    id: number;
    title: string;
    company: string;
    startDate: string;
    endDate: string;
    description: string;
}

interface Education {
    id: number;
    degree: string;
    school: string;
    year: string;
}

export const ResumeBuilderPage = () => {
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(0);
    const [errors, setErrors] = useState<Record<string, string>>({});

    // State for all form fields
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        headline: '',
        city: '',
        country: '',
        linkedin: '',
        portfolio: '',
        experience: [] as Experience[],
        education: [] as Education[],
        skills: '',
        summary: ''
    });

    const handleChange = (field: string, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        // Clear error when user types
        if (errors[field]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[field];
                return newErrors;
            });
        }
    };

    // Validation Logic
    const validateStep = (stepIndex: number) => {
        const newErrors: Record<string, string> = {};
        let isValid = true;

        if (stepIndex === 0) { // Personal Info
            if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
            if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
            if (!formData.headline.trim()) newErrors.headline = 'Professional headline is required';
            if (!formData.email.trim()) {
                newErrors.email = 'Email is required';
            } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
                newErrors.email = 'Email is invalid';
            }
        }
        
        if (stepIndex === 1) { // Experience
            if (formData.experience.length === 0) {
               // Optional: Require at least one job? Let's say yes for a "Professional" resume
               // isValid = false;
               // alert("Please add at least one work experience."); 
               // For now, let's allow empty if they are a student, but if they started adding one, check fields?
               // Simplified: No validation on the list itself, but validation inside the "Add" modal would happen there.
            }
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

    // Experience Helpers
    const addExperience = () => {
        setFormData(prev => ({
            ...prev,
            experience: [
                ...prev.experience,
                { id: Date.now(), title: '', company: '', startDate: '', endDate: '', description: '' }
            ]
        }));
    };

    const updateExperience = (id: number, field: keyof Experience, value: string) => {
        setFormData(prev => ({
            ...prev,
            experience: prev.experience.map(exp => exp.id === id ? { ...exp, [field]: value } : exp)
        }));
    };
    
    const removeExperience = (id: number) => {
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
                { id: Date.now(), degree: '', school: '', year: '' }
            ]
        }));
    };

    const updateEducation = (id: number, field: keyof Education, value: string) => {
        setFormData(prev => ({
            ...prev,
            education: prev.education.map(edu => edu.id === id ? { ...edu, [field]: value } : edu)
        }));
    };

    const removeEducation = (id: number) => {
        setFormData(prev => ({
            ...prev,
            education: prev.education.filter(edu => edu.id !== id)
        }));
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
                        Back to Resumes
                    </button>
                    <div className="text-center">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Build Your Professional Resume</h1>
                        <p className="text-gray-500">Let's start by gathering your basic information.</p>
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
                                        // Only allow jumping to previous steps or the next available step if valid
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
                        
                        {/* Step 0: Personal Info */}
                        {currentStep === 0 && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-right-4 duration-300">
                            <div className="col-span-1">
                                <label className="block text-sm font-medium text-gray-700 mb-1">First Name <span className="text-red-500">*</span></label>
                                <input 
                                    type="text" 
                                    value={formData.firstName}
                                    onChange={(e) => handleChange('firstName', e.target.value)}
                                    className={`w-full px-4 py-2 border rounded-lg focus:ring-black focus:border-black ${errors.firstName ? 'border-red-500' : 'border-gray-300'}`} 
                                    placeholder="John" 
                                />
                                {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
                            </div>
                            <div className="col-span-1">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Last Name <span className="text-red-500">*</span></label>
                                <input 
                                    type="text" 
                                    value={formData.lastName}
                                    onChange={(e) => handleChange('lastName', e.target.value)}
                                    className={`w-full px-4 py-2 border rounded-lg focus:ring-black focus:border-black ${errors.lastName ? 'border-red-500' : 'border-gray-300'}`}
                                    placeholder="Doe" 
                                />
                                {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
                            </div>
                            <div className="col-span-1">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email <span className="text-red-500">*</span></label>
                                <input 
                                    type="email" 
                                    value={formData.email}
                                    onChange={(e) => handleChange('email', e.target.value)}
                                    className={`w-full px-4 py-2 border rounded-lg focus:ring-black focus:border-black ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                                    placeholder="john@example.com" 
                                />
                                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                            </div>
                            <div className="col-span-1">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                                <input 
                                    type="tel" 
                                    value={formData.phone}
                                    onChange={(e) => handleChange('phone', e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-black focus:border-black" 
                                    placeholder="+1 (555) 000-0000" 
                                />
                            </div>
                            <div className="col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Professional Headline <span className="text-red-500">*</span></label>
                                <input 
                                    type="text" 
                                    value={formData.headline}
                                    onChange={(e) => handleChange('headline', e.target.value)}
                                    className={`w-full px-4 py-2 border rounded-lg focus:ring-black focus:border-black ${errors.headline ? 'border-red-500' : 'border-gray-300'}`}
                                    placeholder="Senior Product Designer | React Developer" 
                                />
                                {errors.headline && <p className="text-red-500 text-xs mt-1">{errors.headline}</p>}
                                <p className="text-xs text-gray-500 mt-1">A short summary of your professional identity.</p>
                            </div>
                            <div className="col-span-1">
                                <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                                <input 
                                    type="text" 
                                    value={formData.city}
                                    onChange={(e) => handleChange('city', e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-black focus:border-black" 
                                    placeholder="San Francisco" 
                                />
                            </div>
                            <div className="col-span-1">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                                <input 
                                     type="text" 
                                     value={formData.country}
                                     onChange={(e) => handleChange('country', e.target.value)}
                                     className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-black focus:border-black" 
                                     placeholder="USA" 
                                />
                            </div>
                             <div className="col-span-1">
                                <label className="block text-sm font-medium text-gray-700 mb-1">LinkedIn URL</label>
                                <input 
                                    type="url" 
                                    value={formData.linkedin}
                                    onChange={(e) => handleChange('linkedin', e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-black focus:border-black" 
                                    placeholder="linkedin.com/in/johndoe" 
                                />
                            </div>
                            <div className="col-span-1">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Portfolio URL</label>
                                <input 
                                    type="url" 
                                    value={formData.portfolio}
                                    onChange={(e) => handleChange('portfolio', e.target.value)}
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
                                                            value={exp.title}
                                                            onChange={(e) => updateExperience(exp.id, 'title', e.target.value)}
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
                                                            placeholder="Bachelor of Science in CS"
                                                            value={edu.degree}
                                                            onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)}
                                                        />
                                                    </div>
                                                     <div>
                                                        <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Graduation Year</label>
                                                        <input 
                                                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm" 
                                                            placeholder="2024"
                                                            value={edu.year}
                                                            onChange={(e) => updateEducation(edu.id, 'year', e.target.value)}
                                                        />
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
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Key Skills</label>
                                    <textarea 
                                        rows={6} 
                                        value={formData.skills}
                                        onChange={(e) => handleChange('skills', e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-black focus:border-black" 
                                        placeholder="React, TypeScript, Node.js, Project Management, Figma..."
                                    ></textarea>
                                    <div className="flex gap-2 flex-wrap mt-3">
                                        {['React', 'Communication', 'Python', 'Leadership'].map(skill => (
                                            <button key={skill} onClick={() => handleChange('skills', formData.skills ? `${formData.skills}, ${skill}` : skill)} className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded-full border border-gray-200 transition">
                                                + {skill}
                                            </button>
                                        ))}
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
                                        onChange={(e) => handleChange('summary', e.target.value)}
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
                         
                         {/* Step 5: Finalize */}
                         {currentStep === 5 && (
                             <div className="text-center py-12 animate-in fade-in slide-in-from-right-4 duration-300">
                                 <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <span className="material-symbols-outlined text-green-600 text-4xl">check_circle</span>
                                </div>
                                <h2 className="text-2xl font-bold text-gray-900 mb-2">Resume Ready!</h2>
                                <p className="text-gray-500 mb-8 max-w-md mx-auto">Your resume includes {formData.experience.length} positions and {formData.education.length} education entries.</p>
                                
                                <div className="flex justify-center gap-4">
                                     <button 
                                        onClick={() => navigate('/resumes/new-id')}
                                        className="px-6 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                                     >
                                        <span className="material-symbols-outlined">visibility</span>
                                        View Resume & Insights
                                    </button>
                                    <button className="px-6 py-3 bg-black text-white rounded-lg font-medium hover:bg-gray-800 shadow-lg shadow-gray-200 flex items-center gap-2">
                                        <span className="material-symbols-outlined">download</span>
                                        Download PDF
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

