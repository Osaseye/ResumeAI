
export const FeatureShowcase = () => {
    return (
      <div id="how-it-works" className="py-24 bg-background-soft">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-widest mb-3">Real-Time AI Fixer</h2>
            <p className="text-3xl md:text-5xl font-serif text-gray-900 mb-4">See your resume improve in real-time</p>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto font-light">
              Our AI highlights weak points and suggests impactful power verbs instantly, turning good resumes into great ones.
            </p>
          </div>
          <div className="grid lg:grid-cols-2 gap-12 items-center bg-white rounded-3xl shadow-soft p-2 border border-gray-100">
            <div className="p-8 lg:p-12 border-b lg:border-b-0 lg:border-r border-gray-100 relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 to-transparent pointer-events-none"></div>
              <div className="space-y-8 relative z-10">
                <div className="relative pl-6 border-l-2 border-red-200 py-2 transition-all hover:border-red-400">
                  <p className="text-xs text-gray-400 uppercase font-semibold mb-2">Original Phrasing</p>
                  <p className="text-gray-500 line-through decoration-red-400 decoration-2 text-lg">
                    "Responsible for managing a team of sales people."
                  </p>
                </div>
                <div className="flex justify-center">
                  <div className="bg-gray-50 p-2 rounded-full shadow-sm animate-bounce text-gray-400">
                    <span className="material-symbols-outlined">arrow_downward</span>
                  </div>
                </div>
                <div className="relative pl-6 border-l-4 border-green-500 py-4 bg-green-50/50 rounded-r-xl transition-all shadow-sm">
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-xs text-green-600 font-bold uppercase tracking-wide">AI Suggestion</p>
                    <span className="text-[10px] bg-white border border-green-100 text-green-700 px-2 py-1 rounded-full font-medium shadow-sm">Stronger Impact</span>
                  </div>
                  <p className="text-gray-900 text-lg font-medium leading-relaxed">
                    "Spearheaded a high-performing sales team of 15, resulting in a <span className="bg-green-200 text-green-900 px-1 rounded mx-0.5">20% revenue increase</span> YoY."
                  </p>
                  <div className="mt-4 flex gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button className="text-xs bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors">Apply Fix</button>
                    <button className="text-xs text-gray-500 hover:text-gray-900 px-3 py-2">Dismiss</button>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-8 lg:p-12 flex flex-col justify-center">
              <h3 className="text-2xl font-serif text-gray-900 mb-8">Why it works</h3>
              <ul className="space-y-8">
                <li className="flex items-start">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mr-4">
                    <span className="material-symbols-outlined text-xl">bolt</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-lg mb-1">Power Verbs</h4>
                    <p className="text-gray-500 leading-relaxed">Replaces passive language with active, strong leadership verbs that catch a recruiter's eye immediately.</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center mr-4">
                    <span className="material-symbols-outlined text-xl">analytics</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-lg mb-1">Quantifiable Results</h4>
                    <p className="text-gray-500 leading-relaxed">Adds metrics and numbers. Specificity builds credibility and shows tangible impact.</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  };
