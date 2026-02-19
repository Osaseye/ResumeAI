
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 border-b border-transparent ${scrolled ? 'bg-surface-light/90 backdrop-blur-md border-gray-100 shadow-sm' : ''}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          <Link to="/" className="flex-shrink-0 flex items-center gap-2 cursor-pointer group">
            <img 
              alt="Resume AI Logo" 
              className="h-8 w-auto group-hover:scale-105 transition-transform" 
              src="/icon.png" 
            />
            <span className="font-bold text-xl tracking-tight text-gray-900">Resume<span className="text-gray-400 font-light">AI</span></span>
          </Link>
          <div className="hidden md:flex space-x-10 items-center">
            <a className="text-sm font-medium text-gray-600 hover:text-black transition-colors" href="/#features">Features</a>
            <a className="text-sm font-medium text-gray-600 hover:text-black transition-colors" href="/#how-it-works">How it Works</a>
            <a className="text-sm font-medium text-gray-600 hover:text-black transition-colors" href="/#pricing">Pricing</a>
          </div>
          <div className="flex items-center space-x-4">
            <a href="#features" className="hidden md:block text-sm font-medium text-gray-900 hover:text-gray-600">View Features</a>
            <Link to="/login" className="bg-black hover:bg-gray-800 text-white px-6 py-2.5 rounded-full text-sm font-medium transition-all shadow-lg shadow-gray-200 hover:shadow-gray-400">Get Started</Link>
          </div>
        </div>
      </div>
    </nav>
  );
};
