import { DashboardLayout } from '@/layouts/DashboardLayout';
import { useState } from 'react';
import { useDropzone } from 'react-dropzone';

export const ATSAnalyzerPage = () => {
    const [file, setFile] = useState<File | null>(null);
    const [analyzing, setAnalyzing] = useState(false);
    const [step, setStep] = useState(1); // 1: Upload, 2: Job Target, 3: Results

    const onDrop = (acceptedFiles: File[]) => {
        if (acceptedFiles.length > 0) {
            setFile(acceptedFiles[0]);
        }
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
        onDrop, 
        accept: {'application/pdf': ['.pdf'], 'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']},
        maxFiles: 1
    });

    const handleAnalyze = () => {
        setAnalyzing(true);
        // Simulate analysis
        setTimeout(() => {
            setAnalyzing(false);
            setStep(3);
        }, 3000);
    };

    return (
        <DashboardLayout>
            <div className="max-w-5xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">ATS Resume Analyzer</h1>
                    <p className="text-gray-500 mt-2">Get instant feedback on how well your resume matches job descriptions.</p>
                </div>

                {step === 1 && (
                     <div className="bg-white rounded-3xl shadow-soft p-12 text-center border-2 border-dashed border-gray-200 hover:border-blue-500 transition-colors cursor-pointer" {...getRootProps()}>
                        <input {...getInputProps()} />
                        <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                             <span className="material-symbols-outlined text-4xl">cloud_upload</span>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                            {isDragActive ? "Drop your resume here" : "Upload your resume"}
                        </h3>
                        {file ? (
                             <div className="mt-4 p-4 bg-gray-50 rounded-xl inline-flex items-center gap-3">
                                <span className="material-symbols-outlined text-gray-500">description</span>
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
                        
                        {file && (
                            <div className="mt-8">
                                <button 
                                    onClick={(e) => { e.stopPropagation(); setStep(2); }}
                                    className="bg-black text-white px-8 py-3 rounded-full font-medium hover:bg-gray-800 transition-all shadow-lg"
                                >
                                    Continue to Job Targeting
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {step === 2 && (
                    <div className="bg-white rounded-3xl shadow-soft p-12 max-w-2xl mx-auto">
                         <button onClick={() => setStep(1)} className="flex items-center text-gray-500 hover:text-gray-900 mb-6 text-sm">
                            <span className="material-symbols-outlined text-sm mr-1">arrow_back</span> Back
                        </button>
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Target Job Details</h2>
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Job Title</label>
                                <input type="text" className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-black focus:border-black" placeholder="e.g. Senior Frontend Engineer" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Job Description (Optional)</label>
                                <div className="relative">
                                     <textarea 
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-black focus:border-black h-40" 
                                        placeholder="Paste the job description here for better matching..."
                                    ></textarea>
                                    <div className="absolute bottom-3 right-3 text-xs text-gray-400">0/5000</div>
                                </div>
                            </div>
                            <button 
                                onClick={handleAnalyze} 
                                className="w-full bg-black text-white py-4 rounded-xl font-bold hover:bg-gray-800 transition-all shadow-lg flex items-center justify-center gap-2"
                            >
                                <span className="material-symbols-outlined">analytics</span>
                                Analyze Resume
                            </button>
                        </div>
                    </div>
                )}

                {step === 2 && analyzing && (
                    <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center">
                        <div className="w-20 h-20 border-4 border-gray-200 border-t-black rounded-full animate-spin mb-6"></div>
                        <h3 className="text-2xl font-bold text-gray-900">Analyzing your resume...</h3>
                        <p className="text-gray-500 mt-2">Checking ATS compatibility and keyword matching</p>
                    </div>
                )}

                {step === 3 && (
                     <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-1 space-y-6">
                            <div className="bg-white p-6 rounded-3xl shadow-soft text-center">
                                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">ATS Match Score</h3>
                                <div className="relative w-40 h-40 mx-auto mb-4">
                                    <svg className="w-full h-full transform -rotate-90">
                                        <circle className="text-gray-100" cx="80" cy="80" fill="transparent" r="70" stroke="currentColor" strokeWidth="12"></circle>
                                        <circle className="text-green-500" cx="80" cy="80" fill="transparent" r="70" stroke="currentColor" strokeDasharray="440" strokeDashoffset="110" strokeLinecap="round" strokeWidth="12"></circle>
                                    </svg>
                                    <div className="absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center">
                                        <span className="text-4xl font-bold text-gray-900">75</span>
                                        <span className="text-sm text-gray-400">/ 100</span>
                                    </div>
                                </div>
                                <p className="text-sm text-gray-600">Great start! Improve keywords to reach 85+.</p>
                            </div>
                            
                            <div className="bg-white p-6 rounded-3xl shadow-soft">
                                <h3 className="font-bold text-gray-900 mb-4">Critical Issues</h3>
                                <div className="space-y-3">
                                    <div className="flex items-start gap-3 p-3 bg-red-50 rounded-xl">
                                        <span className="material-symbols-outlined text-red-500 mt-0.5">error</span>
                                        <div>
                                            <h4 className="text-sm font-bold text-red-700">Missing Keywords</h4>
                                            <p className="text-xs text-red-600 mt-1">"React", "TypeScript", "Agile" not found in experience.</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3 p-3 bg-yellow-50 rounded-xl">
                                        <span className="material-symbols-outlined text-yellow-600 mt-0.5">warning</span>
                                        <div>
                                            <h4 className="text-sm font-bold text-yellow-700">Formatting Risk</h4>
                                            <p className="text-xs text-yellow-600 mt-1">Header columns might be unreadable by older ATS.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="lg:col-span-2 bg-white rounded-3xl shadow-soft p-8">
                             <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold text-gray-900">Detailed Analysis</h2>
                                <button className="text-blue-600 font-medium text-sm hover:underline">Download Report</button>
                             </div>
                             
                             <div className="space-y-8">
                                <div>
                                    <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                                        <span className="material-symbols-outlined text-green-500">check_circle</span>
                                        Contact Information
                                    </h3>
                                    <p className="text-gray-600 text-sm leading-relaxed pl-8">
                                        Your contact details are clear and easily found. Email address and phone number are properly formatted. Location is present.
                                    </p>
                                </div>
                                <div className="border-t border-gray-100 pt-6">
                                    <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                                        <span className="material-symbols-outlined text-yellow-500">warning</span>
                                        Impact & Metrics
                                    </h3>
                                    <p className="text-gray-600 text-sm leading-relaxed pl-8">
                                        You have strong action verbs, but only <span className="font-bold text-gray-900">14%</span> of your bullet points contain measurable metrics (%, $, numbers). Aim for at least 40% to demonstrate value.
                                    </p>
                                    <div className="mt-4 pl-8">
                                        <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                                            <p className="text-xs text-gray-500 uppercase font-bold mb-2">Suggestion</p>
                                            <p className="text-sm text-gray-800">Instead of "Improved site performance", try "Improved site performance by <span className="text-green-600 font-bold">25%</span> which led to a <span className="text-green-600 font-bold">10%</span> increase in conversion."</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="border-t border-gray-100 pt-6">
                                    <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                                        <span className="material-symbols-outlined text-red-500">error</span>
                                        Skills Gap
                                    </h3>
                                    <div className="pl-8 flex flex-wrap gap-2">
                                        <span className="px-3 py-1 bg-red-50 text-red-600 rounded-full text-xs font-semibold border border-red-100">Next.js</span>
                                        <span className="px-3 py-1 bg-red-50 text-red-600 rounded-full text-xs font-semibold border border-red-100">GraphQL</span>
                                        <span className="px-3 py-1 bg-red-50 text-red-600 rounded-full text-xs font-semibold border border-red-100">Tailwind CSS</span>
                                    </div>
                                </div>
                             </div>
                        </div>
                     </div>
                )}
            </div>
        </DashboardLayout>
    );
};
