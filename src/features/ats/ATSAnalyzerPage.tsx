import { DashboardLayout } from '@/layouts/DashboardLayout';
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import { toast } from 'sonner';
import { fileParser } from '@/services/fileParser';
import { vertexService } from '@/features/ai/services/vertexService';
import { resumeService } from '@/features/resumes/services/resumeService';
import { useAuth } from '@/features/auth/AuthContext';
import { ResumePreview } from '@/features/resumes/components/ResumePreview';
import type { ResumeFormData } from '@/features/resumes/types';

interface ATSAnalysisResult {
    score: number;
    matchedKeywords: string[];
    missingKeywords: string[];
    summary: string;
    role?: string;
    company?: string;
}

export const ATSAnalyzerPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { user } = useAuth();
    
    // Initialize with state from Job Board if available
    const [file, setFile] = useState<File | null>(null);
    const [jobDescription, setJobDescription] = useState(location.state?.jobDescription || '');
    const [analyzing, setAnalyzing] = useState(false);
    const [step, setStep] = useState(1); // 1: Upload, 2: Job Target, 3: Results
    const [result, setResult] = useState<ATSAnalysisResult | null>(null);
    const [isOptimizing, setIsOptimizing] = useState(false);
    const [optimizedResume, setOptimizedResume] = useState<ResumeFormData | null>(null);
    const [originalText, setOriginalText] = useState<string>('');
    const [isSaving, setIsSaving] = useState(false);
    const [savedResumes, setSavedResumes] = useState<Resume[]>([]);
    const [selectedResumeId, setSelectedResumeId] = useState<string | null>(null);

    useEffect(() => {
        if (location.state?.jobDescription) {
            toast.info("Job description loaded from Job Board. Please upload your resume to analyze.");
        }
    }, [location.state]);

    useEffect(() => {
        if (!user) return;
        const loadResumes = async () => {
            try {
                const resumes = await resumeService.getUserResumes(user.uid);
                setSavedResumes(resumes);
            } catch (error) {
                console.error("Failed to load resumes:", error);
            }
        };
        loadResumes();
    }, [user]);

    const onDrop = (acceptedFiles: File[]) => {
        if (acceptedFiles.length > 0) {
            setFile(acceptedFiles[0]);
            setSelectedResumeId(null);
        }
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
        onDrop, 
        accept: {'application/pdf': ['.pdf'], 'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']},
        maxFiles: 1
    });

    const handleOptimize = async () => {
        setIsOptimizing(true);
        try {
            const improvedData = await vertexService.improveResumeFromJob(originalText, jobDescription);
            setOptimizedResume(improvedData);
            toast.success("Resume optimized successfully!");
        } catch (error) {
            console.error(error);
            toast.error("Failed to optimize resume.");
        } finally {
            setIsOptimizing(false);
        }
    };

    const handleSaveOptimized = async () => {
        if (!user || !optimizedResume) return;
        setIsSaving(true);
        try {
            await resumeService.createResume(user.uid, optimizedResume);
            toast.success("Optimized resume saved to dashboard!");
            navigate('/dashboard');
        } catch (error) {
            console.error(error);
            toast.error("Failed to save resume.");
        } finally {
            setIsSaving(false);
        }
    };

    const handleAnalyze = async () => {
        if ((!file && !selectedResumeId) || !jobDescription.trim()) {
            toast.error("Please provide both a resume and a job description.");
            return;
        }

        setAnalyzing(true);
        try {
            let resumeText = '';
            
            // 1. Extract text from resume
            if (file) {
                resumeText = await fileParser.extractText(file);
            } else if (selectedResumeId) {
                const selected = savedResumes.find(r => r.id === selectedResumeId);
                if (selected) {
                    resumeText = `${selected.personalInfo?.fullName || ''}\n`;
                    resumeText += `${selected.personalInfo?.email || ''} | ${selected.personalInfo?.phone || ''}\n\n`;
                    if (selected.professionalSummary) resumeText += `Summary\n${selected.professionalSummary}\n\n`;
                    if (selected.experience) {
                        resumeText += `Experience\n`;
                        selected.experience.forEach(exp => {
                            resumeText += `${exp.jobTitle} at ${exp.company} (${exp.startDate} - ${exp.endDate || 'Present'})\n${exp.description}\n\n`;
                        });
                    }
                    if (selected.education) {
                        resumeText += `Education\n`;
                        selected.education.forEach(edu => {
                            resumeText += `${edu.degree} in ${edu.field} from ${edu.school}\n\n`;
                        });
                    }
                    if (selected.skills) resumeText += `Skills\n${selected.skills.join(', ')}\n\n`;
                }
            }
            
            setOriginalText(resumeText);
            
            // 2. Analyze with AI
            const analysis = await vertexService.analyzeMatch(resumeText, jobDescription);
            
            setResult(analysis);
            setStep(3);
            toast.success("Analysis complete!");
        } catch (error) {
            console.error("Analysis failed:", error);
            toast.error("Failed to analyze resume. Please try again.");
        } finally {
            setAnalyzing(false);
        }
    };



    const getScoreColor = (score: number) => {
        if (score >= 80) return 'text-green-500';
        if (score >= 60) return 'text-yellow-500';
        return 'text-red-500';
    };

    const getScoreStroke = (score: number) => {
         // Circumference is approx 440 (2 * pi * 70)
         const max = 440;
         const offset = max - (score / 100) * max;
         return offset;
    }

    return (
        <DashboardLayout>
            <div className="max-w-5xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">ATS Resume Analyzer</h1>
                    <p className="text-gray-500 mt-2">Get instant feedback on how well your resume matches job descriptions.</p>
                </div>

                {step === 1 && (
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className={`bg-white rounded-3xl shadow-soft p-12 text-center border-2 border-dashed transition-colors cursor-pointer ${file ? 'border-purple-600 bg-purple-50' : 'border-gray-200 hover:border-blue-500'}`} {...getRootProps()}>
                            <input {...getInputProps()} />
                            <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                                 <span className="material-symbols-outlined text-4xl">cloud_upload</span>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">
                                {isDragActive ? "Drop your resume here" : "Upload new resume"}
                            </h3>
                            {file ? (
                                 <div className="mt-4 p-4 bg-white rounded-xl inline-flex items-center gap-3 border border-purple-200">
                                    <span className="material-symbols-outlined text-purple-600">description</span>
                                    <span className="font-medium text-gray-900">{file.name}</span>
                                    <button onClick={(e) => { e.stopPropagation(); setFile(null); }} className="text-gray-400 hover:text-red-500 ml-2">
                                        <span className="material-symbols-outlined">close</span>
                                    </button>
                                 </div>
                            ) : (
                                <p className="text-gray-500 max-w-sm mx-auto">
                                    Drag and drop your PDF or DOCX file here, or click to browse.
                                    <br/><span className="text-sm mt-2 block text-gray-400">Max file size: 5MB</span>
                                </p>
                            )}
                        </div>
                        
                        <div className="bg-white rounded-3xl shadow-soft p-8 border border-gray-100 flex flex-col items-center">
                            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                <span className="material-symbols-outlined text-purple-600">file_copy</span>
                                Or Select Saved Resume
                            </h3>
                            {savedResumes.length > 0 ? (
                                <div className="w-full space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                                    {savedResumes.map(r => (
                                        <div 
                                            key={r.id} 
                                            onClick={() => { setSelectedResumeId(r.id); setFile(null); }}
                                            className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${selectedResumeId === r.id ? 'border-purple-600 bg-purple-50' : 'border-gray-100 hover:border-purple-200'}`}
                                        >
                                            <h4 className="font-semibold text-gray-900">{r.title || r.personalInfo?.fullName || 'Untitled Resume'}</h4>
                                            <p className="text-xs text-gray-500 mt-1">Last edited: {new Date(r.updatedAt).toLocaleDateString()}</p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center p-6 bg-gray-50 rounded-2xl w-full text-gray-500 h-full flex flex-col items-center justify-center">
                                    <p>No saved resumes found.</p>
                                    <button onClick={() => navigate('/builder')} className="mt-4 px-4 py-2 bg-white text-black text-sm font-medium rounded-lg border border-gray-200 shadow-sm hover:bg-gray-50">Create One Now</button>
                                </div>
                            )}
                        </div>

                        {(file || selectedResumeId) && (
                            <div className="md:col-span-2 mt-4 flex justify-center">
                                <button 
                                    onClick={(e) => { e.stopPropagation(); setStep(2); }}
                                    className="bg-black text-white px-8 py-3 rounded-full font-medium hover:bg-gray-800 transition-all shadow-lg flex items-center gap-2"
                                >
                                    {jobDescription ? "Continue with Loaded Job Description" : "Continue to Job Targeting"} <span className="material-symbols-outlined text-sm">arrow_forward</span>
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {step === 2 && !analyzing && (
                    <div className="bg-white rounded-3xl shadow-soft p-12 max-w-2xl mx-auto">
                         <button onClick={() => setStep(1)} className="flex items-center text-gray-500 hover:text-gray-900 mb-6 text-sm">
                            <span className="material-symbols-outlined text-sm mr-1">arrow_back</span> Back
                        </button>
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Target Job Details</h2>
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Job Description <span className="text-red-500">*</span></label>
                                <div className="relative">
                                     <textarea 
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-black focus:border-black h-60" 
                                        placeholder="Paste the full job description here..."
                                        value={jobDescription}
                                        onChange={(e) => setJobDescription(e.target.value)}
                                    ></textarea>
                                </div>
                                <p className="text-xs text-gray-500 mt-2">Our AI scoring engine will compare your resume against these requirements.</p>
                            </div>
                            <button 
                                onClick={handleAnalyze} 
                                disabled={!jobDescription.trim()}
                                className="w-full bg-black text-white py-4 rounded-xl font-bold hover:bg-gray-800 transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <span className="material-symbols-outlined">analytics</span>
                                Analyze Resume
                            </button>
                        </div>
                    </div>
                )}

                {analyzing && (
                    <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center">
                        <div className="w-20 h-20 border-4 border-gray-200 border-t-black rounded-full animate-spin mb-6"></div>
                        <h3 className="text-2xl font-bold text-gray-900">Analyzing your resume...</h3>
                        <p className="text-gray-500 mt-2">Checking ATS compatibility and keyword matching</p>
                    </div>
                )}

                {step === 3 && result && (
                     <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 text-left">
                        <div className="lg:col-span-1 space-y-6">
                            <div className="bg-white p-6 rounded-3xl shadow-soft text-center">
                                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">ATS Match Score</h3>
                                <div className="relative w-40 h-40 mx-auto mb-4">
                                    <svg className="w-full h-full transform -rotate-90">
                                        <circle className="text-gray-100" cx="80" cy="80" fill="transparent" r="70" stroke="currentColor" strokeWidth="12"></circle>
                                        <circle 
                                            className={getScoreColor(result.score)} 
                                            cx="80" cy="80" 
                                            fill="transparent" 
                                            r="70" 
                                            stroke="currentColor" 
                                            strokeDasharray="440" 
                                            strokeDashoffset={getScoreStroke(result.score)} 
                                            strokeLinecap="round" 
                                            strokeWidth="12"
                                        ></circle>
                                    </svg>
                                    <div className="absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center">
                                        <span className="text-4xl font-bold text-gray-900">{result.score}</span>
                                        <span className="text-sm text-gray-400">/ 100</span>
                                    </div>
                                </div>
                                <p className="text-sm text-gray-600">
                                    {result.score >= 80 ? "Excellent match! " : result.score >= 60 ? "Good start. " : "Needs improvement. "}
                                    Targeting: <strong>{result.role || 'Job'}</strong> at <strong>{result.company || 'Company'}</strong>.
                                </p>
                            </div>
                            
                            <button 
                                onClick={() => { setStep(1); setFile(null); setSelectedResumeId(null); setJobDescription(''); setResult(null); }}
                                className="w-full py-3 border border-gray-200 rounded-xl font-medium text-gray-600 hover:bg-gray-50 block"
                            >
                                Analyze Another
                            </button>
                        </div>

                        <div className="lg:col-span-2 bg-white rounded-3xl shadow-soft p-8">
                             <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold text-gray-900">Detailed Analysis</h2>
                                {/* <button className="text-blue-600 font-medium text-sm hover:underline">Download Report</button> */}
                             </div>
                             
                             <div className="space-y-8">
                                <div>
                                    <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                                        <span className="material-symbols-outlined text-blue-500">info</span>
                                        Summary
                                    </h3>
                                    <p className="text-gray-600 text-sm leading-relaxed pl-8">
                                        {result.summary}
                                    </p>
                                </div>
                                
                                <div className="border-t border-gray-100 pt-6">
                                    <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                                        <span className="material-symbols-outlined text-green-500">check_circle</span>
                                        Matched Keywords
                                    </h3>
                                    <div className="pl-8 flex flex-wrap gap-2">
                                        {result.matchedKeywords.length > 0 ? (
                                            result.matchedKeywords.map((kw, i) => (
                                                <span key={i} className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-xs font-semibold border border-green-100">{kw}</span>
                                            ))
                                        ) : (
                                            <p className="text-sm text-gray-500">No strong keyword matches found.</p>
                                        )}
                                    </div>
                                </div>

                                <div className="border-t border-gray-100 pt-6">
                                    <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                                        <span className="material-symbols-outlined text-red-500">error</span>
                                        Missing Keywords
                                    </h3>
                                    <div className="pl-8 flex flex-wrap gap-2">
                                        {result.missingKeywords.length > 0 ? (
                                            result.missingKeywords.map((kw, i) => (
                                                <span key={i} className="px-3 py-1 bg-red-50 text-red-600 rounded-full text-xs font-semibold border border-red-100">{kw}</span>
                                            ))
                                        ) : (
                                            <p className="text-sm text-gray-500">No major keywords missing!</p>
                                        )}
                                    </div>
                                    {result.missingKeywords.length > 0 && (
                                        <p className="text-xs text-gray-500 mt-3 pl-8">
                                            Tip: Try incorporating these keywords into your skills or experience sections naturally.
                                        </p>
                                    )}
                                </div>

                                {/* Optimization Section */}
                                <div className="border-t border-gray-100 pt-8 mt-8">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                            <span className="material-symbols-outlined text-purple-600">auto_fix_high</span>
                                            AI Resume Optimizer
                                        </h3>
                                        {!optimizedResume && !isOptimizing && (
                                            <button 
                                                onClick={handleOptimize}
                                                className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-medium text-sm hover:opacity-90 transition shadow-md"
                                            >
                                                Optimize for this Job
                                            </button>
                                        )}
                                    </div>

                                    {isOptimizing && (
                                         <div className="bg-purple-50 rounded-xl p-6 text-center">
                                            <div className="w-8 h-8 border-2 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-3"></div>
                                            <p className="text-purple-700 font-medium">Analyzing job description and rewriting resume...</p>
                                        </div>
                                    )}

                                    {optimizedResume && (
                                        <div className="space-y-4">
                                            <div className="bg-gray-50 rounded-xl border border-gray-200 overflow-hidden">
                                                <div className="flex border-b border-gray-200">
                                                    <div className="w-1/2 p-3 bg-gray-100 text-center font-semibold text-gray-600 border-r border-gray-200">Original</div>
                                                    <div className="w-1/2 p-3 bg-purple-50 text-center font-semibold text-purple-700">Preview Optimized</div>
                                                </div>
                                                <div className="flex h-[500px]">
                                                    <div className="w-1/2 p-4 overflow-y-auto text-sm text-gray-600 border-r border-gray-200 font-mono whitespace-pre-wrap">
                                                        {originalText}
                                                    </div>
                                                    <div className="w-1/2 p-4 overflow-y-auto bg-purple-50/10">
                                                        <div className="transform scale-[0.6] origin-top h-[900px] w-[166%] overflow-y-visible">
                                                            <ResumePreview data={optimizedResume} template="professional" />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            <div className="flex justify-end gap-3">
                                                <button 
                                                    onClick={() => setOptimizedResume(null)}
                                                    className="px-4 py-2 text-gray-500 hover:text-gray-700 font-medium"
                                                >
                                                    Discard
                                                </button>
                                                <button 
                                                    onClick={handleSaveOptimized}
                                                    disabled={isSaving}
                                                    className="px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 shadow-sm flex items-center gap-2"
                                                >
                                                    <span className="material-symbols-outlined text-[18px]">save_alt</span>
                                                    {isSaving ? 'Saving...' : 'Save Optimized Resume'}
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                    {!isOptimizing && !optimizedResume && (
                                        <p className="text-sm text-gray-500">
                                            Click "Optimize for this Job" to let our AI rewrite your resume tailored specifically to the job description above.
                                            It will highlight relevant skills and adjust your experience descriptions.
                                        </p>
                                    )}
                                </div>
                             </div>
                        </div>
                     </div>
                )}
            </div>
        </DashboardLayout>
    );
};
