
import { Link } from 'react-router-dom';

export const CTASection = () => {
    return (
      <div id="pricing" className="bg-black py-24 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-900/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-900/20 rounded-full blur-3xl"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h2 className="text-4xl md:text-5xl font-serif text-white mb-6">
            Ready to accelerate your career?
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-10 font-light">
            Join thousands of professional users landing their dream jobs with Resume AI.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-5">
            <Link to="/register" className="bg-white text-black hover:bg-gray-200 px-8 py-4 rounded-full font-bold shadow-lg transition-colors min-w-[180px]">
              Build My Resume
            </Link>
            <button className="bg-transparent border border-white/30 text-white hover:bg-white/10 px-8 py-4 rounded-full font-bold transition-colors min-w-[180px]">
              View Pricing
            </button>
          </div>
        </div>
      </div>
    );
  };
