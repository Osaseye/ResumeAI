import { DashboardLayout } from '@/layouts/DashboardLayout';
import { Link, useNavigate } from 'react-router-dom';
import { useState, useRef } from 'react';

export const MyResumesPage = () => {
  const [activeTab, setActiveTab] = useState<'resumes' | 'cover-letters'>('resumes');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Logic for file upload would go here
      console.log('File selected:', file.name);
      alert(`Simulating import of ${file.name}...`);
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
                    onClick={() => setActiveTab('resumes')}
                    className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                        activeTab === 'resumes' 
                        ? 'border-black text-black' 
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                >
                    Resumes
                </button>
                 <button 
                    onClick={() => setActiveTab('cover-letters')}
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


        {/* Existing Resume Card 1 */}
        <div 
            onClick={() => navigate('/resumes/1')}
            className="group bg-white rounded-xl shadow-soft hover:shadow-card transition-all overflow-hidden flex flex-col h-[400px] cursor-pointer"
        >
          <div className="relative flex-1 bg-gray-100 overflow-hidden group-hover:opacity-90 transition-opacity">
            {/* Visual representation of a resume doc */}
            <div className="absolute top-4 left-4 right-4 bottom-0 bg-white shadow-sm rounded-t-lg p-6 transform translate-y-2 transition-transform group-hover:translate-y-0">
                <div className="space-y-3">
                    <div className="h-6 bg-gray-200 w-2/3 rounded"></div>
                    <div className="h-4 bg-gray-100 w-1/2 rounded"></div>
                    <div className="space-y-2 mt-6">
                        <div className="h-3 bg-gray-100 w-full rounded"></div>
                        <div className="h-3 bg-gray-100 w-full rounded"></div>
                        <div className="h-3 bg-gray-100 w-5/6 rounded"></div>
                    </div>
                </div>
            </div>
            
            <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                 <button className="bg-white p-2 rounded-full shadow-sm hover:bg-gray-50 text-gray-600 hover:text-blue-600 transition-colors" title="Edit">
                    <span className="material-symbols-outlined text-[18px]">edit</span>
                 </button>
                 <button className="bg-white p-2 rounded-full shadow-sm hover:bg-gray-50 text-gray-600 hover:text-red-600 transition-colors" title="Delete">
                    <span className="material-symbols-outlined text-[18px]">delete</span>
                 </button>
            </div>
            <div className="absolute bottom-3 left-3 bg-green-100 text-green-700 text-xs font-semibold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                Product Design Role
            </div>
          </div>
          <div className="p-4 border-t border-gray-100">
            <div className="flex justify-between items-start mb-1">
                <h3 className="font-bold text-gray-900 truncate pr-2">Software Engineer Resume</h3>
                <span className="material-symbols-outlined text-gray-400 text-[18px] cursor-pointer hover:text-gray-600">more_vert</span>
            </div>
            <p className="text-xs text-gray-500 mb-3">Last updated 2 days ago</p>
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded font-medium">
                    <span className="material-symbols-outlined text-[14px]">check_circle</span>
                    <span>ATS: 85</span>
                </div>
                <button className="text-xs font-semibold hover:underline">Download PDF</button>
            </div>
          </div>
        </div>

        {/* Existing Resume Card 2 */}
         <div 
            onClick={() => navigate('/resumes/1')}
            className="group bg-white rounded-xl shadow-soft hover:shadow-card transition-all overflow-hidden flex flex-col h-[400px] cursor-pointer"
        >
          <div className="relative flex-1 bg-gray-100 overflow-hidden group-hover:opacity-90 transition-opacity">
            <div className="absolute top-4 left-4 right-4 bottom-0 bg-white shadow-sm rounded-t-lg p-6 transform translate-y-2 transition-transform group-hover:translate-y-0">
                <div className="space-y-3">
                    <div className="h-6 bg-gray-200 w-1/2 rounded"></div>
                    <div className="h-4 bg-gray-100 w-3/4 rounded"></div>
                    <div className="space-y-2 mt-6">
                        <div className="h-3 bg-gray-100 w-full rounded"></div>
                        <div className="h-3 bg-gray-100 w-5/6 rounded"></div>
                    </div>
                </div>
            </div>

            
            <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                 <button className="bg-white p-2 rounded-full shadow-sm hover:bg-gray-50 text-gray-600 hover:text-blue-600 transition-colors" title="Edit">
                    <span className="material-symbols-outlined text-[18px]">edit</span>
                 </button>
                 <button className="bg-white p-2 rounded-full shadow-sm hover:bg-gray-50 text-gray-600 hover:text-red-600 transition-colors" title="Delete">
                    <span className="material-symbols-outlined text-[18px]">delete</span>
                 </button>
            </div>
            <div className="absolute bottom-3 left-3 bg-blue-100 text-blue-700 text-xs font-semibold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                Applying to Google
            </div>
          </div>
          <div className="p-4 border-t border-gray-100">
            <div className="flex justify-between items-start mb-1">
                <h3 className="font-bold text-gray-900 truncate pr-2">Senior Product Manager</h3>
                <span className="material-symbols-outlined text-gray-400 text-[18px] cursor-pointer hover:text-gray-600">more_vert</span>
            </div>
            <p className="text-xs text-gray-500 mb-3">Last updated 1 week ago</p>
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 text-xs text-yellow-600 bg-yellow-50 px-2 py-1 rounded font-medium">
                    <span className="material-symbols-outlined text-[14px]">warning</span>
                    <span>ATS: 62</span>
                </div>
                <button className="text-xs font-semibold hover:underline">Download PDF</button>
            </div>
          </div>
        </div>
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

            {/* Mock Cover Letter */}
            <div 
                onClick={() => navigate('/cover-letters/1')}
                className="group bg-white rounded-xl shadow-soft hover:shadow-card transition-all overflow-hidden flex flex-col h-[400px] cursor-pointer"
            >
                <div className="relative flex-1 bg-gray-100 overflow-hidden group-hover:opacity-90 transition-opacity p-8">
                     <div className="w-full h-full bg-white shadow-sm rounded-lg p-6 text-[4px] leading-relaxed text-gray-400 overflow-hidden">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                        <br/><br/>
                        Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
                     </div>
                     
                     <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                        <button className="bg-white p-2 rounded-full shadow-sm hover:bg-gray-50 text-gray-600 hover:text-blue-600 transition-colors" title="Edit" onClick={(e) => e.stopPropagation()}>
                            <span className="material-symbols-outlined text-[18px]">edit</span>
                        </button>
                         <button className="bg-white p-2 rounded-full shadow-sm hover:bg-gray-50 text-gray-600 hover:text-red-600 transition-colors" title="Delete" onClick={(e) => e.stopPropagation()}>
                            <span className="material-symbols-outlined text-[18px]">delete</span>
                         </button>
                    </div>
                </div>
                <div className="p-4 border-t border-gray-100">
                    <div className="flex justify-between items-start mb-1">
                        <h3 className="font-bold text-gray-900 truncate pr-2">Google - PM Role</h3>
                        <span className="material-symbols-outlined text-gray-400 text-[18px] cursor-pointer hover:text-gray-600">more_vert</span>
                    </div>
                    <p className="text-xs text-gray-500 mb-3">Created 1 week ago</p>
                     <button className="text-xs font-semibold hover:underline" onClick={(e) => e.stopPropagation()}>Download PDF</button>
                </div>
            </div>
        </div>
       )}


    </DashboardLayout>
  );
};
