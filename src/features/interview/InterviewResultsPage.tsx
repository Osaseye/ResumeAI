import { useNavigate, useLocation } from 'react-router-dom';
import { DashboardLayout } from '@/layouts/DashboardLayout';

interface Message {
  id: string;
  role: 'ai' | 'user';
  content: string;
}

export const InterviewResultsPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const messages = (location.state as { messages?: Message[] })?.messages || [];

  // Filter out user answers for display in mock analysis
  const userAnswers = messages.filter(m => m.role === 'user');

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto pb-12">
        <div className="flex items-center justify-between mb-8">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Session Analysis</h1>
                <p className="text-gray-500 mt-2">Here is how you performed in your mock interview.</p>
            </div>
            <div className="flex gap-3">
                 <button 
                    onClick={() => navigate('/mock-interview')}
                    className="px-5 py-2.5 bg-white border border-gray-200 rounded-full text-gray-700 hover:bg-gray-50 font-semibold text-sm"
                >
                    Back to Dashboard
                </button>
                <button 
                    onClick={() => navigate('/mock-interview/configure')}
                    className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full font-semibold text-sm shadow-lg shadow-indigo-500/20"
                >
                    Start New Session
                </button>
            </div>
        </div>

        {/* Top Level Scores - Empty State */}
        {userAnswers.length === 0 ? (
             <div className="bg-white rounded-3xl shadow-sm p-12 text-center border border-gray-100 flex flex-col items-center justify-center min-h-[400px]">
                <div className="w-20 h-20 bg-indigo-50 text-indigo-200 rounded-full flex items-center justify-center mb-6">
                    <span className="material-symbols-outlined text-4xl">analytics</span>
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">No Analysis Available</h2>
                <p className="text-gray-500 max-w-md mx-auto mb-8">
                    Complete your first mock interview to see detailed AI feedback on your performance, clarity, and keyword usage.
                </p>
                <div className="flex gap-4">
                     <button 
                        onClick={() => navigate('/mock-interview/configure')}
                        className="bg-black text-white px-8 py-3 rounded-full font-bold hover:bg-gray-800 transition shadow-lg"
                    >
                        Start First Session
                    </button>
                </div>
            </div>
        ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-3xl shadow-soft flex flex-col items-center text-center">
                <div className="relative w-32 h-32 mb-4">
                     <svg className="w-full h-full transform -rotate-90">
                        <circle className="text-gray-100" cx="64" cy="64" fill="transparent" r="56" stroke="currentColor" strokeWidth="12"></circle>
                        <circle className="text-green-500" cx="64" cy="64" fill="transparent" r="56" stroke="currentColor" strokeDasharray="351.86" strokeDashoffset="35" strokeLinecap="round" strokeWidth="12"></circle>
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-3xl font-bold text-gray-900">92%</span>
                        <span className="text-xs text-gray-400 font-medium uppercase tracking-wide">Overall</span>
                    </div>
                </div>
                <h3 className="font-bold text-gray-900">Great Performance!</h3>
                <p className="text-sm text-gray-500 mt-1">You showed strong technical knowledge.</p>
            </div>

            <div className="bg-white p-6 rounded-3xl shadow-soft md:col-span-2 grid grid-cols-2 gap-6">
                 <div>
                    <h4 className="text-gray-500 text-sm font-medium mb-4">Communication Metrics</h4>
                    <div className="space-y-4">
                        <div>
                            <div className="flex justify-between text-sm mb-1">
                                <span className="font-medium text-gray-700">Clarity & Pacing</span>
                                <span className="font-bold text-indigo-600">88/100</span>
                            </div>
                            <div className="w-full bg-gray-100 rounded-full h-2">
                                <div className="bg-indigo-500 h-2 rounded-full" style={{ width: '88%' }}></div>
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between text-sm mb-1">
                                <span className="font-medium text-gray-700">Confidence Tone</span>
                                <span className="font-bold text-blue-600">95/100</span>
                            </div>
                            <div className="w-full bg-gray-100 rounded-full h-2">
                                <div className="bg-blue-500 h-2 rounded-full" style={{ width: '95%' }}></div>
                            </div>
                        </div>
                         <div>
                            <div className="flex justify-between text-sm mb-1">
                                <span className="font-medium text-gray-700">Keyword Usage</span>
                                <span className="font-bold text-purple-600">76/100</span>
                            </div>
                            <div className="w-full bg-gray-100 rounded-full h-2">
                                <div className="bg-purple-500 h-2 rounded-full" style={{ width: '76%' }}></div>
                            </div>
                        </div>
                    </div>
                </div>
                
                 <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100">
                    <h4 className="flex items-center gap-2 text-sm font-bold text-gray-900 mb-3">
                        <span className="material-symbols-outlined text-yellow-500">lightbulb</span>
                        Key Feedback
                    </h4>
                    <ul className="space-y-3 text-sm text-gray-600">
                        <li className="flex gap-2 items-start">
                            <span className="material-symbols-outlined text-green-500 text-base mt-0.5">check_circle</span>
                            Good use of STAR method in the behavioral question.
                        </li>
                        <li className="flex gap-2 items-start">
                             <span className="material-symbols-outlined text-orange-400 text-base mt-0.5">warning</span>
                            Try to be more specific about the outcomes in your first answer.
                        </li>
                        <li className="flex gap-2 items-start">
                             <span className="material-symbols-outlined text-blue-500 text-base mt-0.5">info</span>
                            Your speaking pace was slightly fast in the beginning.
                        </li>
                    </ul>
                </div>
            </div>
        </div>
        )}

        {/* Detailed Transcript Analysis */}
        {userAnswers.length > 0 && (
        <div className="bg-white rounded-3xl shadow-soft overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
                <h3 className="font-bold text-gray-900">Transcript Analysis</h3>
                <button className="text-sm text-indigo-600 font-medium hover:text-indigo-700">Download Report</button>
            </div>
            <div className="p-6 space-y-6">
                {/* Q1 Analysis */}
                <div className="border border-gray-100 rounded-2xl p-6 hover:shadow-md transition">
                    <div className="flex items-start gap-4 mb-4">
                        <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold flex-shrink-0">Q1</div>
                        <div>
                            <p className="font-medium text-gray-900">Tell me about yourself.</p>
                            <p className="text-sm text-gray-500 mt-1">Difficulty: Introductory</p>
                        </div>
                        <span className="ml-auto px-3 py-1 bg-green-50 text-green-700 text-xs font-bold rounded-full border border-green-100">Strong Answer</span>
                    </div>
                    
                    <div className="bg-gray-50 rounded-xl p-4 mb-4">
                        <p className="text-sm text-gray-600 italic">
                             {userAnswers.length > 0 ? `"${userAnswers[0].content}"` : `"I have been a software engineer for 5 years, primarily working with React and Node.js..."`}
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 text-sm">
                        <div className="flex-1">
                            <h5 className="font-bold text-gray-800 mb-1 flex items-center gap-1">
                                <span className="material-symbols-outlined text-green-500 text-sm">thumb_up</span> Positives
                            </h5>
                            <p className="text-gray-500">Concise summary of relevant experience. Good mention of current tech stack.</p>
                        </div>
                        <div className="flex-1">
                            <h5 className="font-bold text-gray-800 mb-1 flex items-center gap-1">
                                <span className="material-symbols-outlined text-orange-500 text-sm">trending_up</span> Improvements
                            </h5>
                            <p className="text-gray-500">Could have connected the introduction more directly to this specific role's requirements.</p>
                        </div>
                    </div>
                </div>

                 {/* Q2 Analysis */}
                 <div className="border border-gray-100 rounded-2xl p-6 hover:shadow-md transition">
                    <div className="flex items-start gap-4 mb-4">
                        <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold flex-shrink-0">Q2</div>
                        <div>
                            <p className="font-medium text-gray-900">Can you describe a challenging technical problem you've solved?</p>
                            <p className="text-sm text-gray-500 mt-1">Difficulty: Hard</p>
                        </div>
                        <span className="ml-auto px-3 py-1 bg-yellow-50 text-yellow-700 text-xs font-bold rounded-full border border-yellow-100">Average Answer</span>
                    </div>
                    
                    <div className="bg-gray-50 rounded-xl p-4 mb-4">
                        <p className="text-sm text-gray-600 italic">"[User Answer Transcript Placeholder]..."</p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 text-sm">
                        <div className="flex-1">
                             <h5 className="font-bold text-gray-800 mb-1 flex items-center gap-1">
                                <span className="material-symbols-outlined text-purple-500 text-sm">psychology</span> AI Insight
                            </h5>
                            <p className="text-gray-500">The technical depth was good, but the explanation of the "Why" behind the solution was lacking detail.</p>
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
