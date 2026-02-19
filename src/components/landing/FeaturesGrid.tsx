
const features = [
  {
    title: "AI Resume Builder",
    description: "Generate professional, formatted resumes tailored to your industry in seconds. No more formatting nightmares.",
    icon: "https://lh3.googleusercontent.com/aida-public/AB6AXuA9P2F96L8AgqnAGnHVvjjoaUSrGBOdSZdQPsnGK4SippgM59LFnvKrUx9RXs5_vczK4XNYZV_0S-fP5zC-94F0tQ1bcCUFnSxZEno-UnVGuBGEI2auiHtXNsvlmf6O3bbYnjiOxRA8ZREy1Cu_mOOgCgJGv6AJQysFTQ3m--zBV77p44bJaSTs2E4Q_bupp9M-tPg8bxSZLWKxYrF_bzS2aY_GK7BEWKK8C8rBrZqTQ1h6ofILpXXD7uUcdAZE9HUl1m--vXG66tvi",
    isImage: true,
    colorClass: "bg-blue-50 text-blue-600 group-hover:bg-blue-600",
    gradientClass: "from-blue-500 to-indigo-500"
  },
  {
    title: "ATS Analyzer",
    description: "Scan your resume against job descriptions to ensure you pass the Application Tracking System filters.",
    icon: "analytics",
    isImage: false,
    colorClass: "bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600",
    gradientClass: "from-indigo-500 to-purple-500"
  },
  {
    title: "Mock Interview AI",
    description: "Practice with a realistic AI interviewer that adapts to your responses and gives instant feedback.",
    icon: "psychology",
    isImage: false,
    colorClass: "bg-purple-50 text-purple-600 group-hover:bg-purple-600",
    gradientClass: "from-purple-500 to-pink-500"
  },
  {
    title: "Smart Job Match",
    description: "Get personalized job recommendations from top Nigerian companies that match your skill set perfectly.",
    icon: "work_outline",
    isImage: false,
    colorClass: "bg-green-50 text-green-600 group-hover:bg-green-600",
    gradientClass: "from-green-500 to-emerald-500"
  },
  {
    title: "Cover Letter Generator",
    description: "Create persuasive cover letters that highlight your unique value proposition for each specific application.",
    icon: "edit_note",
    isImage: false,
    colorClass: "bg-yellow-50 text-yellow-600 group-hover:bg-yellow-600",
    gradientClass: "from-yellow-500 to-orange-500"
  },
  {
    title: "LinkedIn Optimization",
    description: "Receive actionable tips to optimize your LinkedIn profile and attract recruiters actively looking for talent.",
    icon: "share",
    isImage: false,
    colorClass: "bg-pink-50 text-pink-600 group-hover:bg-pink-600",
    gradientClass: "from-pink-500 to-red-500"
  }
];

export const FeaturesGrid = () => {
  return (
    <div id="features" className="py-24 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-widest mb-3">All-In-One Platform</h2>
          <p className="text-3xl md:text-5xl font-serif text-gray-900 mb-6">Everything you need to get hired faster</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div key={index} className="group bg-white rounded-2xl p-8 border border-gray-100 hover:shadow-xl hover:border-gray-200 transition-all duration-300 relative overflow-hidden">
              <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${feature.gradientClass} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500`}></div>
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 transition-colors group-hover:text-white ${feature.colorClass}`}>
                {feature.isImage ? (
                  <img 
                    alt={`${feature.title} Icon`} 
                    className="w-6 h-6 object-contain brightness-0 group-hover:brightness-200 transition-all" 
                    src={feature.icon} 
                  />
                ) : (
                  <span className="material-symbols-outlined text-2xl">{feature.icon}</span>
                )}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
              <p className="text-gray-500 leading-relaxed text-sm">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
