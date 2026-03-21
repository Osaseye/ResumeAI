import { DashboardLayout } from '@/layouts/DashboardLayout';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { storage } from '@/utils/storage';

interface InterviewSession {
  id?: string;
  date: string;
  score: number;
  jobTitle: string;
  summary: string;
  fullFeedback?: any;
  messages?: any[];
}

interface InterviewStats {
  averageScore: number;
  totalInterviews: number;
  history: InterviewSession[];
}

export const MockInterviewPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');
  const [stats, setStats] = useState<InterviewStats>({
    averageScore: 0,
    totalInterviews: 0,
    history: []
  });

  useEffect(() => {
    const storedStats = storage.getItem('interview_stats');
    if (storedStats) {
      try {
        setStats(JSON.parse(storedStats));
      } catch (e) {
        console.error("Failed to parse interview stats", e);
      }
    }
  }, []);

  return (
    <DashboardLayout>
       <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Mock Interview</h1>
          <p className="text-gray-500 mt-2">Practice with AI to ace your next technical or behavioral interview.</p>
        </div>
        <button 
          onClick={() => navigate('/mock-interview/configure')}
          className="flex items-center justify-center px-5 py-2.5 bg-black hover:bg-gray-800 text-white rounded-full transition text-sm font-semibold shadow-lg shadow-gray-500/20"
        >
            <span className="material-symbols-outlined text-sm mr-2 font-bold">add</span>
            New Session
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Action Card */}
        <div className="lg:col-span-2 bg-gradient-to-br from-gray-900 to-gray-800 text-white rounded-3xl p-8 relative overflow-hidden shadow-xl">
            <div className="absolute top-0 right-0 p-8 opacity-10">
                 <span className="material-symbols-outlined text-9xl">mic</span>
            </div>
            
            <div className="relative z-10">
                <div className="inline-block bg-white/20 backdrop-blur-md rounded-lg px-3 py-1 text-xs font-bold uppercase tracking-wider mb-4">
                    AI Interviewer
                </div>
                <h2 className="text-3xl font-bold mb-4">Ready to practice?</h2>
                <p className="text-gray-300 max-w-lg mb-8 leading-relaxed">
                    Start a realistic simulation tailored to your target job. Get instant feedback on your tone, pacing, and answer quality.
                </p>
                
                <div className="flex gap-4">
                    <button 
                        onClick={() => navigate('/mock-interview/configure')}
                        className="bg-white text-gray-900 px-6 py-3 rounded-xl font-bold hover:bg-gray-100 transition shadow-lg flex items-center gap-2"
                    >
                        <span className="material-symbols-outlined">play_circle</span>
                        Start Interview
                    </button>
                     <button className="bg-transparent border border-white/30 text-white px-6 py-3 rounded-xl font-bold hover:bg-white/10 transition flex items-center gap-2">
                        <span className="material-symbols-outlined">settings</span>
                        Configure
                    </button>
                </div>
            </div>
        </div>

        {/* Quick Stats */}
        <div className="bg-white rounded-3xl shadow-soft p-6 flex flex-col justify-between">
            <div>
                <h3 className="text-lg font-bold text-gray-900 mb-6">Performance Stats</h3>
                <div className="space-y-6">
                    <div>
                         <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-500">Average Score</span>
                            <span className="font-bold text-gray-900">{stats.averageScore} / 100</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-2">
                            <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${stats.averageScore}%` }}></div>
                        </div>
                    </div>
                     <div>
                         <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-500">Interviews Completed</span>
                            <span className="font-bold text-gray-900">{stats.totalInterviews}</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-2">
                            {/* Assuming 10 interviews is a "full" bar for visual purposes */}
                            <div className="bg-green-500 h-2 rounded-full" style={{ width: `${Math.min(stats.totalInterviews * 10, 100)}%` }}></div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="mt-6 pt-6 border-t border-gray-100">
                <p className="text-sm text-gray-500 italic">
                    {stats.totalInterviews > 0 
                        ? "Keep practicing to improve your score!" 
                        : "Complete your first interview to get personalized tips."}
                </p>
            </div>
        </div>
      </div>

      <div className="mt-8">
        <div className="border-b border-gray-200 mb-6">
            <nav className="-mb-px flex space-x-8">
                <button 
                    onClick={() => setActiveTab('upcoming')}
                    className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                        activeTab === 'upcoming' 
                        ? 'border-black text-black' 
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                >
                    Recommended Sessions
                </button>
                 <button 
                    onClick={() => setActiveTab('past')}
                    className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                        activeTab === 'past' 
                        ? 'border-black text-black' 
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                >
                    Past Sessions
                </button>
            </nav>
        </div>

        {activeTab === 'upcoming' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
                    <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-lg flex items-center justify-center mb-4">
                        <span className="material-symbols-outlined">code</span>
                    </div>
                    <h3 className="font-bold text-gray-900 mb-1">Technical Round</h3>
                    <p className="text-sm text-gray-500 mb-4">React & System Design questions for Senior Frontend roles.</p>
                    <button onClick={() => navigate('/mock-interview/configure')} className="text-sm font-semibold text-purple-600 hover:underline">Start Session</button>
                </div>
                <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
                    <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-lg flex items-center justify-center mb-4">
                        <span className="material-symbols-outlined">groups</span>
                    </div>
                    <h3 className="font-bold text-gray-900 mb-1">Behavioral Fit</h3>
                    <p className="text-sm text-gray-500 mb-4">Common questions about leadership, conflict, and teamwork.</p>
                    <button onClick={() => navigate('/mock-interview/configure')} className="text-sm font-semibold text-orange-600 hover:underline">Start Session</button>
                </div>
                <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
                    <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center mb-4">
                        <span className="material-symbols-outlined">psychology</span>
                    </div>
                    <h3 className="font-bold text-gray-900 mb-1">Salary Negotiation</h3>
                    <p className="text-sm text-gray-500 mb-4">Practice high-stakes conversation scenarios.</p>
                    <button onClick={() => navigate('/mock-interview/configure')} className="text-sm font-semibold text-blue-600 hover:underline">Start Session</button>
                </div>
            </div>
        ) : (
            <div className="space-y-4">
                {stats.history.length === 0 ? (
                    <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                        <span className="material-symbols-outlined text-gray-300 text-5xl mb-4">history</span>
                        <h3 className="text-gray-900 font-medium mb-1">No Past Sessions</h3>
                        <p className="text-gray-500 text-sm">Your completed interview history will appear here.</p>
                    </div>
                ) : (
                    stats.history.slice().reverse().map((session, idx) => (
                        <div key={idx} className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="flex items-start gap-4">
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg shrink-0 ${
                                    session.score >= 80 ? 'bg-green-500' : 
                                    session.score >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                                }`}>
                                    {session.score}
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900">{session.jobTitle}</h3>
                                    <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                                        <span className="material-symbols-outlined text-sm">calendar_today</span>
                                        {new Date(session.date).toLocaleDateString()} at {new Date(session.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                    </div>
                                    <p className="text-sm text-gray-600 mt-2 line-clamp-1">{session.summary}</p>
                                </div>
                            </div>
                            <button 
                                onClick={() => {
                                    if (session.messages && session.fullFeedback) {
                                        navigate('/mock-interview/results', { 
                                            state: { 
                                                messages: session.messages, 
                                                feedback: session.fullFeedback 
                                            } 
                                        });
                                    } else {
                                        // Fallback for sessions without detailed history stored
                                        navigate('/mock-interview/results', {
                                            state: {
                                                messages: [],
                                                feedback: {
                                                    score: session.score,
                                                    summary: session.summary,
                                                    strengths: [],
                                                    improvements: []
                                                }
                                            }
                                        });
                                    }
                                }}
                                className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 text-gray-700 whitespace-nowrap"
                            >
                                View Details
                            </button>
                        </div>
                    ))
                )}
            </div>
        )}

      </div>

    </DashboardLayout>
  );
};
