import { DashboardLayout } from '@/layouts/DashboardLayout';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/features/auth/AuthContext';
import { resumeService } from './services/resumeService';
import { coverLetterService } from '@/features/cover-letter/services/coverLetterService';
import { fileParser } from '@/services/fileParser';
import { vertexService } from '@/features/ai/services/vertexService';
import type { Resume } from './types';
import type { CoverLetter } from '@/features/cover-letter/types';
import { toast } from 'sonner';

export const MyResumesPage = () => {
    const { user } = useAuth();
    const [searchParams, setSearchParams] = useSearchParams();
    const tabParam = searchParams.get('tab');
    
    const [activeTab, setActiveTab] = useState<'resumes' | 'cover-letters'>(
        (tabParam === 'cover-letters') ? 'cover-letters' : 'resumes'
    );
    
    const [resumes, setResumes] = useState<Resume[]>([]);
    const [coverLetters, setCoverLetters] = useState<CoverLetter[]>([]);
    const [loading, setLoading] = useState(true);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const navigate = useNavigate();

    // Sync state with URL
    useEffect(() => {
        if (tabParam === 'cover-letters') {
            setActiveTab('cover-letters');
        } else {
            setActiveTab('resumes');
        }
    }, [tabParam]);

    const handleDeleteResume = async (id: string, e: React.MouseEvent) => {
        e.preventDefault();
        if (window.confirm('Are you sure you want to delete this resume?')) {
            try {
                await resumeService.deleteResume(id);
                setResumes(resumes.filter(r => r.id !== id));
                toast.success("Resume deleted");
            } catch (error) {
                toast.error("Failed to delete resume");
            }
        }
    };

    const handleDeleteCoverLetter = async (id: string, e: React.MouseEvent) => {
        e.preventDefault();
        if (window.confirm('Are you sure you want to delete this cover letter?')) {
            try {
                await coverLetterService.deleteCoverLetter(id);
                setCoverLetters(coverLetters.filter(c => c.id !== id));
                toast.success("Cover letter deleted");
            } catch (error) {
                toast.error("Failed to delete cover letter");
            }
        }
    };

    const handleTabChange = (tab: 'resumes' | 'cover-letters') => {
        setActiveTab(tab);
        setSearchParams({ tab });
    };

    useEffect(() => {
        const fetchData = async () => {
            if (!user) return;
            setLoading(true);
            try {
                if (activeTab === 'resumes') {
                    const data = await resumeService.getUserResumes(user.uid);
                    setResumes(data);
                } else {
                    const data = await coverLetterService.getUserCoverLetters(user.uid);
                    setCoverLetters(data);
                }
            } catch (error) {
                console.error("Failed to fetch documents:", error);
                toast.error("Could not load your documents");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [user, activeTab]);


  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const toastId = toast.loading(`Importing ${file.name}...`);
    
    try {
        const textContent = await fileParser.extractText(file);
        
        if (activeTab === 'resumes') {
            toast.loading("Analyzing resume content with AI...", { id: toastId });
            const parsedData = await vertexService.parseResume(textContent);
            toast.dismiss(toastId);
            toast.success("Resume parsed!");
            navigate('/resume-builder', { state: { parsedData } });
        } else {
            toast.loading("Analyzing cover letter with AI...", { id: toastId });
            const parsedData = await vertexService.parseCoverLetter(textContent);
            toast.dismiss(toastId);
            toast.success("Cover letter parsed!");
            navigate('/cover-letter-builder', { state: { parsedData } });
        }
    } catch (error) {
        console.error("Import failed:", error);
        toast.error("Failed to import document. Please try again.", { id: toastId });
    } finally {
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    }
  };

  return (
    <DashboardLayout>
       <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            accept=".pdf,.docx,.doc"
            onChange={handleFileChange}
        />
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">My Documents</h1>
          <p className="text-gray-500 mt-2">Manage your professional resumes and cover letters.</p>
        </div>
        <div className="flex gap-3">
            <button 
                onClick={handleImportClick}
                className="flex items-center justify-center px-5 py-2.5 bg-white border border-gray-200 rounded-full text-gray-700 hover:bg-gray-50 transition text-sm font-semibold shadow-sm"
            >
                <span className="material-symbols-outlined text-sm mr-2">upload_file</span>
                Import
            </button>
            <Link to={activeTab === 'resumes' ? "/resume-builder" : "/cover-letter-builder"} className="flex items-center justify-center px-5 py-2.5 bg-gray-900 hover:bg-gray-800 text-white rounded-full transition text-sm font-semibold shadow-lg shadow-gray-500/20">
                <span className="material-symbols-outlined text-sm mr-2 font-bold">add</span>
                Create New {activeTab === 'resumes' ? 'Resume' : 'Cover Letter'}
            </Link>
        </div>
      </div>

      <div className="border-b border-gray-200 mb-6">
            <nav className="-mb-px flex space-x-8">
                <button 
                    onClick={() => handleTabChange('resumes')}
                    className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                        activeTab === 'resumes' 
                        ? 'border-black text-black' 
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                >
                    Resumes
                </button>
                 <button 
                    onClick={() => handleTabChange('cover-letters')}
                    className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                        activeTab === 'cover-letters' 
                        ? 'border-black text-black' 
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                >
                    Cover Letters
                </button>
            </nav>
      </div>

      {activeTab === 'resumes' ? (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {/* New Resume Card */}
        <Link to="/resume-builder" className="group relative flex flex-col items-center justify-center h-[400px] border-2 border-dashed border-gray-300 rounded-xl hover:border-gray-900 hover:bg-gray-50 transition-all cursor-pointer">
          <div className="w-16 h-16 rounded-full bg-gray-100 group-hover:bg-white flex items-center justify-center mb-4 shadow-sm group-hover:shadow-md transition-all">
            <span className="material-symbols-outlined text-3xl text-gray-400 group-hover:text-gray-900 transition-colors">add</span>
          </div>
          <p className="font-semibold text-gray-900">Create New Resume</p>
          <p className="text-sm text-gray-500 mt-1">Start from scratch or use AI</p>
        </Link>
        
        {loading ? (
             <div className="col-span-1 md:col-span-2 lg:col-span-3 flex justify-center py-12">
                 <p className="text-gray-400">Loading your resumes...</p>
             </div>
        ) : (
            resumes.map(resume => (
                <div key={resume.id} className="relative bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow flex flex-col justify-between h-[400px]">
                    <div>
                        <div className="flex justify-between items-start mb-4">
                            <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-bold uppercase">ATS: {resume.atsScore || 'N/A'}</span>
                            <button onClick={(e) => handleDeleteResume(resume.id, e)} className="text-gray-400 hover:text-red-600">
                                <span className="material-symbols-outlined">delete</span>
                            </button>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-1 line-clamp-2">{resume.title || 'Untitled Resume'}</h3>
                         <p className="text-sm text-gray-500">{new Date(resume.updatedAt).toLocaleDateString()}</p>
                        
                        <div className="mt-6 space-y-2">
                             <div className="flex items-center text-sm text-gray-600">
                                <span className="material-symbols-outlined text-sm mr-2 text-gray-400">person</span>
                                {resume.contact.fullName || 'No Name'}
                            </div>
                             <div className="flex items-center text-sm text-gray-600">
                                <span className="material-symbols-outlined text-sm mr-2 text-gray-400">work</span>
                                {resume.experience.length} Positions
                            </div>
                         </div>
                    </div>

                    <div className="flex gap-2">
                         <Link to={`/resumes/${resume.id}`} className="flex-1 py-2 bg-black text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition flex items-center justify-center">
                            View
                        </Link>
                         <button className="px-3 py-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50">
                            <span className="material-symbols-outlined text-sm">download</span>
                        </button>
                    </div>
                </div>
            ))
        )}
      </div>
       ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
             {/* New Cover Letter Card */}
            <Link to="/cover-letter-builder" className="group relative flex flex-col items-center justify-center h-[400px] border-2 border-dashed border-gray-300 rounded-xl hover:border-gray-900 hover:bg-gray-50 transition-all cursor-pointer">
            <div className="w-16 h-16 rounded-full bg-gray-100 group-hover:bg-white flex items-center justify-center mb-4 shadow-sm group-hover:shadow-md transition-all">
                <span className="material-symbols-outlined text-3xl text-gray-400 group-hover:text-gray-900 transition-colors">add</span>
            </div>
            <p className="font-semibold text-gray-900">Create Cover Letter</p>
            <p className="text-sm text-gray-500 mt-1">Tailored for specific roles</p>
            </Link>

            {loading ? (
                <div className="col-span-1 md:col-span-2 lg:col-span-3 flex justify-center py-12">
                     <p className="text-gray-400">Loading your cover letters...</p>
                 </div>
            ) : (
                coverLetters.map(letter => (
                    <div key={letter.id} className="relative bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow flex flex-col justify-between h-[400px]">
                        <div>
                             <div className="flex justify-between items-start mb-4">
                                <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded text-xs font-bold uppercase">Draft</span>
                                <button onClick={(e) => handleDeleteCoverLetter(letter.id, e)} className="text-gray-400 hover:text-red-600">
                                    <span className="material-symbols-outlined">delete</span>
                                </button>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-1 line-clamp-2">{letter.title || 'Untitled'}</h3>
                            <p className="text-sm text-gray-500">{new Date(letter.updatedAt).toLocaleDateString()}</p>
                            
                             <div className="mt-6 space-y-2">
                                <div className="flex items-center text-sm text-gray-600">
                                    <span className="material-symbols-outlined text-sm mr-2 text-gray-400">business</span>
                                    {letter.company || 'No Company'}
                                </div>
                                <div className="flex items-center text-sm text-gray-600">
                                    <span className="material-symbols-outlined text-sm mr-2 text-gray-400">badge</span>
                                    {letter.jobTitle || 'No Job Title'}
                                </div>
                             </div>
                        </div>

                         <div className="flex gap-2">
                             <Link to={`/cover-letters/${letter.id}`} className="flex-1 py-2 bg-black text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition flex items-center justify-center">
                                View
                            </Link>
                             <button className="px-3 py-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50">
                                <span className="material-symbols-outlined text-sm">download</span>
                            </button>
                        </div>
                    </div>
                ))
            )}
        </div>
       )}


    </DashboardLayout>
  );
};
