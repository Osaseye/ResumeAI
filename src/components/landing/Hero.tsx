
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const HERO_IMAGES = [
  "/hero-images/Macbook-Air-localhost.png",
  "/hero-images/Macbook-Air-localhost (1).png",
  "/hero-images/Macbook-Air-localhost (2).png",
  "/hero-images/Macbook-Air-localhost (3).png"
];

export const Hero = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative pt-32 pb-20 overflow-hidden bg-background-light">
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-50/50 via-white to-white z-0 pointer-events-none"></div>
      
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-50/50 rounded-full blur-3xl -z-10"></div>
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-50/30 rounded-full blur-3xl -z-10"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col items-center">
        <div className="text-center max-w-4xl mx-auto mb-16 animate-float" style={{ animationDuration: '8s' }}>
          <h1 className="text-5xl md:text-7xl font-serif text-gray-900 leading-[1.1] mb-6 animate-fade-in-up">
            Build Smarter Resumes.<br/>
            <span className="text-gray-400">Practice Smarter Interviews.</span>
          </h1>
          <p className="mt-6 text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed font-light animate-fade-in-up delay-100">
            From resume creation to interview success — manage your entire career journey with AI-driven precision tailored for professional growth.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4 animate-fade-in-up delay-200">
            <Link to="/register" className="bg-black text-white px-8 py-4 rounded-full text-base font-medium hover:bg-gray-800 transition-all transform hover:-translate-y-1 shadow-xl shadow-gray-200 cursor-pointer">
              Start Free
            </Link>
            <a href="#features" className="bg-white text-gray-900 border border-gray-200 px-8 py-4 rounded-full text-base font-medium hover:bg-gray-50 transition-all transform hover:-translate-y-1 cursor-pointer">
              View Features
            </a>
          </div>
        </div>
        
        {/* App Interface Mockup */}
        <div className="relative w-full max-w-6xl mx-auto mt-12 mb-20 perspective-1000 animate-fade-in-up delay-300">
           {/* Main Desktop Dashboard Image */}
           <div className="relative z-20 mx-auto rounded-xl shadow-2xl border bg-gray-900 border-gray-800 overflow-hidden transform transition-all hover:scale-[1.01] duration-500">
              <div className="flex items-center gap-2 px-4 py-3 bg-gray-800 border-b border-gray-700">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                <div className="flex-1 text-center">
                  <div className="inline-block px-3 py-1 rounded-md bg-gray-900 text-xs text-gray-400 font-mono">resume.ai/dashboard</div>
                </div>
              </div>
              <div className="relative w-full aspect-[16/10] bg-gray-900">
                  {HERO_IMAGES.map((img, index) => (
                    <img 
                        key={img}
                        src={img} 
                        alt={`Resume AI Dashboard ${index + 1}`}
                        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${
                            index === currentImageIndex ? 'opacity-100' : 'opacity-0'
                        }`}
                    />
                  ))}
              </div>
           </div>

           {/* Decorative Elements behind */}
           <div className="absolute -top-10 -right-10 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl -z-10 animate-pulse"></div>
           <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl -z-10 animate-pulse delay-1000"></div>

          {/* Floating Cards - Repositioned for Desktop View */}
          <div className="hidden md:block absolute -right-8 md:-right-16 top-1/4 z-30 animate-float" style={{ animationDuration: '7s', animationDelay: '1s' }}>
            <div className="bg-white/90 backdrop-blur-xl p-4 md:p-5 rounded-2xl w-48 shadow-xl border border-white/50">
              <div className="flex justify-between items-start mb-3">
                <span className="text-3xl font-bold text-gray-900">92<span className="text-lg text-gray-400">%</span></span>
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                  <span className="material-symbols-outlined text-green-600 text-sm">check_circle</span>
                </div>
              </div>
              <p className="text-sm font-medium text-gray-900">Resume Score</p>
              <p className="text-xs text-gray-500 mt-1">Ready for Top Tier</p>
              <div className="w-full bg-gray-100 h-1.5 rounded-full mt-3 overflow-hidden">
                <div className="bg-green-500 h-full w-[92%] rounded-full"></div>
              </div>
            </div>
          </div>
          
          <div className="hidden md:flex absolute -left-8 md:-left-12 bottom-1/3 z-30 animate-float" style={{ animationDuration: '8s', animationDelay: '2s' }}>
            <div className="bg-white/90 backdrop-blur-xl p-4 rounded-2xl w-auto flex items-center gap-3 shadow-xl border border-white/50 pr-6">
              <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600">
                <span className="material-symbols-outlined">mic</span>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide font-bold">Interview Prep</p>
                <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                    <p className="text-sm font-bold text-gray-900">Recording...</p>
                </div>
              </div>
            </div>
          </div>

          
          <div className="absolute left-[8%] top-[20%] z-10 hidden md:block animate-float" style={{ animationDuration: '9s' }}>
            <div className="bg-white/85 backdrop-blur-md p-3 rounded-2xl flex items-center gap-3 pr-6 border border-white/60 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05),0_2px_4px_-1px_rgba(0,0,0,0.03)]">
              <img 
                alt="User" 
                className="w-10 h-10 rounded-lg object-cover" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDQ1wtjhoHTLbQ1ApCeUgncmsS5ZzD9x9eQK95gYsD-vNHVpoaGbSusHrJwfmaL9dlgUrab3AeERpZtS8CiSkoX-BfhdblKA0pjA_5sRQY-7avPzMaLw1snyc2_yJFSSBhjIsYDfCSFYm_a0l2urdS9LiON0fDKxDcD1Z0kgQF8Xs8JVnjiAKVNkGi18RbTQ2Rud1xhguxg-EDnd4B9pPOhDAAqpMXliV1wh5dvnmdJcVUUS7BEjIZK_Dm7zgAHsiZOO60rAy_3D-C0" 
              />
              <div className="space-y-1">
                <div className="h-2 w-20 bg-gray-200 rounded-full"></div>
                <div className="h-1.5 w-12 bg-gray-100 rounded-full"></div>
              </div>
            </div>
          </div>
          
          <div className="hidden md:block absolute right-[12%] bottom-[30%] z-10 animate-float" style={{ animationDuration: '6s', animationDelay: '0.5s' }}>
            <div className="bg-white/85 backdrop-blur-md p-4 rounded-2xl border border-white/60 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05),0_2px_4px_-1px_rgba(0,0,0,0.03)]">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-semibold bg-gray-100 px-2 py-0.5 rounded text-gray-600">New Offer</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded bg-black flex items-center justify-center text-white font-bold text-xs">P</div>
                <div>
                  <p className="text-sm font-bold">Paystack</p>
                  <p className="text-xs text-gray-500">Lagos, Nigeria</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Background circles behind main element */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-gray-100 rounded-full -z-10"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-gray-50 rounded-full -z-20"></div>
        </div>
      </div>
    </div>
  );
};
