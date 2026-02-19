import { type ReactNode } from 'react';
import { Link } from 'react-router-dom';

interface AuthLayoutProps {
  children: ReactNode;
  heading: string;
  subheading: string;
}

export const AuthLayout = ({ children, heading, subheading }: AuthLayoutProps) => {
  return (
    <div className="min-h-screen flex bg-background-light">
      {/* Left Panel - Hidden on mobile */}
      <div className="hidden lg:flex w-1/2 bg-surface-light relative overflow-hidden items-center justify-center p-12 border-r border-gray-100">
        <div className="absolute inset-0 bg-background-soft z-0"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-50/50 via-white to-white z-0 pointer-events-none"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-50/50 rounded-full blur-3xl -z-10"></div>
        
        <div className="relative z-10 max-w-lg">
          <Link to="/" className="flex items-center gap-2 mb-12 group w-fit">
             <img 
               alt="Resume AI Logo" 
               className="h-10 w-auto group-hover:scale-105 transition-transform" 
               src="/icon.png" 
             />
             <span className="font-bold text-2xl tracking-tight text-gray-900">Resume<span className="text-gray-400 font-light">AI</span></span>
          </Link>
          
          <h2 className="text-4xl font-serif text-gray-900 mb-6 leading-tight">
            Stand out in the job market with AI-powered precision.
          </h2>
          <p className="text-lg text-gray-500 leading-relaxed mb-8">
            Join thousands of professionals who have accelerated their careers using our intelligent resume builder and interview coach.
          </p>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/60 backdrop-blur-sm p-4 rounded-xl border border-white/60 shadow-sm">
                <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600 mb-3">
                    <span className="material-symbols-outlined">description</span>
                </div>
                <p className="font-semibold text-gray-900 text-sm">Smart Resume Builder</p>
            </div>
            <div className="bg-white/60 backdrop-blur-sm p-4 rounded-xl border border-white/60 shadow-sm">
                <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center text-purple-600 mb-3">
                    <span className="material-symbols-outlined">psychology</span>
                </div>
                <p className="font-semibold text-gray-900 text-sm">AI Interview Coach</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Auth Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 lg:p-24 bg-white relative">
        <div className="w-full max-w-md space-y-8">
           <div className="lg:hidden mb-8">
             <Link to="/" className="flex items-center gap-2 group w-fit">
                <img 
                  alt="Resume AI Logo" 
                  className="h-8 w-auto group-hover:scale-105 transition-transform" 
                  src="/icon.png" 
                />
                <span className="font-bold text-xl tracking-tight text-gray-900">Resume<span className="text-gray-400 font-light">AI</span></span>
             </Link>
           </div>

           <div className="text-center lg:text-left">
             <h2 className="text-3xl font-serif font-bold text-gray-900 tracking-tight">{heading}</h2>
             <p className="mt-2 text-sm text-gray-600">
               {subheading}
             </p>
           </div>

           {children}
        </div>
      </div>
    </div>
  );
};
