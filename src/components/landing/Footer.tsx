
import { Link } from 'react-router-dom';

export const Footer = () => {
    return (
      <footer className="bg-background-soft pt-20 pb-10 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            <div className="col-span-1 md:col-span-1">
              <Link to="/" className="flex items-center gap-2 mb-6 group w-fit">
                <img 
                  alt="Resume AI Logo" 
                  className="h-8 w-auto group-hover:scale-105 transition-transform" 
                  src="/icon.png" 
                />
                <span className="font-bold text-xl tracking-tight text-gray-900">Resume<span className="text-gray-400 font-light">AI</span></span>
              </Link>
              <p className="text-sm text-gray-500 leading-relaxed mb-6">
                Empowering talent with AI-driven career tools for a global market.
              </p>
              <div className="flex space-x-4">
                <a className="text-gray-400 hover:text-black transition-colors" href="#">
                  <span className="sr-only">Twitter</span>
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path></svg>
                </a>
                <a className="text-gray-400 hover:text-black transition-colors" href="#">
                  <span className="sr-only">LinkedIn</span>
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"></path></svg>
                </a>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase mb-6">Product</h3>
              <ul className="space-y-3">
                <li><a className="text-sm text-gray-600 hover:text-black transition-colors" href="#">Resume Builder</a></li>
                <li><a className="text-sm text-gray-600 hover:text-black transition-colors" href="#">Cover Letter</a></li>
                <li><a className="text-sm text-gray-600 hover:text-black transition-colors" href="#">Interview Coach</a></li>
                <li><a className="text-sm text-gray-600 hover:text-black transition-colors" href="#">Pricing</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase mb-6">Resources</h3>
              <ul className="space-y-3">
                <li><a className="text-sm text-gray-600 hover:text-black transition-colors" href="#">Blog</a></li>
                <li><a className="text-sm text-gray-600 hover:text-black transition-colors" href="#">Templates</a></li>
                <li><a className="text-sm text-gray-600 hover:text-black transition-colors" href="#">Success Stories</a></li>
                <li><a className="text-sm text-gray-600 hover:text-black transition-colors" href="#">Career Guide</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase mb-6">Company</h3>
              <ul className="space-y-3">
                <li><a className="text-sm text-gray-600 hover:text-black transition-colors" href="#">About Us</a></li>
                <li><a className="text-sm text-gray-600 hover:text-black transition-colors" href="#">Careers</a></li>
                <li><a className="text-sm text-gray-600 hover:text-black transition-colors" href="#">Contact</a></li>
                <li><a className="text-sm text-gray-600 hover:text-black transition-colors" href="#">Privacy Policy</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-200 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-400">© 2026 Resume AI. All rights reserved.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a className="text-sm text-gray-400 hover:text-gray-600" href="#">Terms</a>
              <a className="text-sm text-gray-400 hover:text-gray-600" href="#">Privacy</a>
              <a className="text-sm text-gray-400 hover:text-gray-600" href="#">Cookies</a>
            </div>
          </div>
        </div>
      </footer>
    );
  };
