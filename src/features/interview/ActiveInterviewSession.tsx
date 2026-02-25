import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'sonner';
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';
import { useSpeechSynthesis } from '@/hooks/useSpeechSynthesis';
import { vertexService } from '@/features/ai/services/vertexService';

interface Message {
  id: string;
  role: 'ai' | 'user';
  content: string;
  timestamp: Date;
}

export const ActiveInterviewSession = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { resumeText, jobDescription, jobTitle } = location.state || {}; // Expecting full text
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState("");
  
  const { 
    isListening, 
    transcript, 
    startListening, 
    stopListening
  } = useSpeechRecognition();
  
  const { speak, cancel: cancelSpeech, speaking: isSpeaking } = useSpeechSynthesis();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, transcript]);

  // Helper: Finish Interview
  const finishInterview = async (currentMessages: Message[]) => {
      setIsProcessing(true);
      toast.info("Analyzing your interview performance...");
      
      try {
          // Format history for analysis
          const history = currentMessages.map(m => ({ role: m.role, content: m.content }));
          
          // Generate Feedback
          const feedback = await vertexService.generateInterviewFeedback(history);
          
          // Save Stats to LocalStorage (Simulating Backend)
          const statsStr = localStorage.getItem('interview_stats');
          let stats = statsStr ? JSON.parse(statsStr) : { averageScore: 0, totalInterviews: 0, history: [] };
          
          // Update Stats
          const newTotal = stats.totalInterviews + 1;
          const currentTotalScore = (stats.averageScore * stats.totalInterviews) + feedback.score;
          stats.averageScore = Math.round(currentTotalScore / newTotal);
          stats.totalInterviews = newTotal;
          stats.lastInterviewDate = new Date().toISOString();
          stats.history.push({
              id: Date.now().toString(),
              date: new Date().toISOString(),
              score: feedback.score,
              jobTitle: jobTitle || 'Unknown Role',
              summary: feedback.summary,
              fullFeedback: feedback,
              messages: currentMessages
          });
          
          localStorage.setItem('interview_stats', JSON.stringify(stats));
          
          // Navigate to Results
          toast.success("Analysis Complete!");
          navigate('/mock-interview/results', { 
              state: { 
                  messages: currentMessages,
                  feedback: feedback
              } 
          });

      } catch (error) {
          console.error("Error finishing interview:", error);
          toast.error("Failed to generate report");
          navigate('/mock-interview');
      } finally {
          setIsProcessing(false);
      }
  };

  // Initialize Interview
  useEffect(() => {
    const initSession = async () => {
        if (!resumeText || !jobDescription) {
            // Check if mock mode is requested or context is missing
            toast.error("Missing interview context", {
                description: "Please configure the interview first."
            });
            navigate('/mock-interview/configure');
            return;
        }

        try {
            const data = await vertexService.startInterviewSession(resumeText, jobDescription);
            const initialMsg: Message = {
                id: 'init',
                role: 'ai',
                content: data.message,
                timestamp: new Date()
            };
            setMessages([initialMsg]);
            setCurrentQuestion(data?.question || "");
            speak({ text: data.message });
        } catch (error) {
            console.error("Failed to start session:", error);
            toast.error("Failed to start interview session");
        } finally {
            setIsLoading(false);
        }
    };

    initSession();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run once on mount

  const handleSendMessage = async (text: string) => {
    if (!text.trim() || isProcessing) return;
    
    // 1. Add User Message
    const userMsg: Message = {
        id: Date.now().toString(),
        role: 'user',
        content: text,
        timestamp: new Date()
    };
    
    // IMPORTANT: Need to use functional update to ensure we have latest messages if multiple come in?
    // But here we need the array for the API call immediately.
    // So we'll build the new array.
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setIsProcessing(true); // Disable input while thinking

    try {
        // 2. Get AI Response
        // Format history for the service
        const history = newMessages.map(m => ({ role: m.role, content: m.content }));
        
        // Determine if this is the last question
        const aiMessageCount = newMessages.filter(m => m.role === 'ai').length;
        const isLastQuestion = aiMessageCount >= 5;

        const responseData = await vertexService.chatInterview(history, text, isLastQuestion);

        const aiMsg: Message = {
            id: (Date.now() + 1).toString(),
            role: 'ai',
            content: responseData.message,
            timestamp: new Date()
        };
        
        const finalMessages = [...newMessages, aiMsg];
        setMessages(finalMessages);
        setCurrentQuestion(responseData.nextQuestion || "Interview Complete");
        
        // 3. Speak Response
        speak({ text: responseData.message });

        if (isLastQuestion || responseData.isComplete) {
            toast.success("Interview Completed!");
            // Wait for speech to likely finish or just a delay
            setTimeout(() => {
                finishInterview(finalMessages);
            }, 5000);
        }

    } catch (error) {
        console.error("Error getting AI response:", error);
        toast.error("AI failed to respond. Please try again.");
    } finally {
        setIsProcessing(false);
    }
  };

  // Handle manual text submission
  const [inputText, setInputText] = useState("");
  const handleKeySubmit = (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          handleSendMessage(inputText);
          setInputText("");
      }
  };

  // Handle Speech Transcript
  // When user stops listening, update input text
  useEffect(() => {
      if (transcript) {
          setInputText(transcript);
      }
  }, [transcript]);

  const toggleRecording = () => {
    if (isListening) {
      stopListening();
    } else {
      cancelSpeech(); // Stop AI if speaking
      startListening();
    }
  };

  const handleEndSession = () => {
      const confirmEnd = window.confirm("Are you sure you want to end the session? We will generate your report now.");
      if (confirmEnd) {
          finishInterview(messages);
      }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b px-4 py-3 md:px-6 md:py-4 flex items-center justify-between shadow-sm z-10 sticky top-0">
        <div className="flex items-center gap-3">
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 shrink-0">
                <span className="material-symbols-outlined text-lg md:text-2xl">smart_toy</span>
            </div>
            <div>
                <h1 className="font-bold text-gray-900 text-sm md:text-base">Technical Interview</h1>
                <p className="text-[10px] md:text-xs text-gray-500">{jobTitle || 'General Role'} • Active Session</p>
            </div>
        </div>
        <button 
            onClick={handleEndSession}
            className="text-red-500 hover:bg-red-50 px-3 py-1.5 md:px-4 md:py-2 rounded-lg text-xs md:text-sm font-medium transition flex items-center gap-1 md:gap-2 border border-red-100 bg-white"
        >
            <span className="material-symbols-outlined text-base">close</span>
            <span className="hidden sm:inline">End Session</span>
        </button>
      </header>

      {/* Main Content - Split View */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden relative">
        
        {/* Left Panel - Visualizer / AI Avatar */}
        <div className="w-full md:w-1/3 bg-gray-900 p-4 md:p-6 flex md:flex-col items-center justify-between md:justify-center relative border-b md:border-b-0 md:border-r border-gray-800 shrink-0 h-32 md:h-auto">
            <div className="absolute top-2 left-4 md:top-6 md:left-6 text-green-400 text-[10px] md:text-sm font-medium flex items-center gap-2">
                <span className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-green-500 animate-pulse"></span>
                Live
            </div>
            
            {/* Avatar Container */}
            <div className={`w-12 h-12 md:w-48 md:h-48 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 p-0.5 md:p-1 md:mb-8 shadow-lg md:shadow-2xl shadow-indigo-500/20 mr-4 md:mr-0 shrink-0 ${isSpeaking ? 'animate-pulse' : ''}`}>
                <div className="w-full h-full rounded-full bg-gray-800 flex items-center justify-center overflow-hidden relative">
                    <span className="material-symbols-outlined text-2xl md:text-8xl text-white opacity-80 z-10">
                        {isSpeaking ? 'graphic_eq' : 'mic'}
                    </span>
                </div>
            </div>
            
            <div className="flex-1 md:text-center">
                <h2 className="text-white font-semibold text-sm md:text-xl">AI Interviewer</h2>
                <p className="text-gray-400 text-xs md:text-sm truncate">
                    {isSpeaking ? 'Speaking...' : isProcessing ? 'Thinking...' : 'Listening...'}
                </p>
                {currentQuestion && !isProcessing && (
                     <p className="text-gray-500 text-xs mt-2 hidden md:block max-w-[80%] mx-auto italic">
                        Current Question: "{currentQuestion.substring(0, 60)}..."
                     </p>
                )}
            </div>

            {/* Audio Visualizer */}
            <div className="hidden md:flex mt-12 gap-1 h-8 items-end justify-center">
                {[...Array(5)].map((_, i) => (
                    <div key={i} className={`w-1 bg-indigo-500 rounded-full transition-all duration-300 ${isSpeaking ? 'h-6 animate-pulse' : 'h-2'}`}></div>
                ))}
            </div>
        </div>

        {/* Right Panel - Chat Interface */}
        <div className="flex-1 flex flex-col bg-white overflow-hidden">
            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 md:space-y-6 bg-slate-50">
                {isLoading ? (
                    <div className="flex items-center justify-center h-full">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                        <span className="ml-3 text-gray-500">Preparing interview context...</span>
                    </div>
                ) : (
                    messages.map((msg) => (
                        <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[85%] md:max-w-[75%] rounded-2xl px-4 py-3 md:px-6 md:py-4 shadow-sm ${
                                msg.role === 'user' 
                                    ? 'bg-indigo-600 text-white rounded-br-none' 
                                    : 'bg-white border border-gray-100 text-gray-800 rounded-bl-none'
                            }`}>
                                <p className="text-sm md:text-base leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                                <span className={`text-[10px] md:text-xs mt-2 block ${msg.role === 'user' ? 'text-indigo-200' : 'text-gray-400'}`}>
                                    {msg.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                </span>
                            </div>
                        </div>
                    ))
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 md:p-6 bg-white border-t border-gray-100 z-20">
                <div className="relative flex items-center gap-2">
                    <button 
                        onClick={toggleRecording}
                        className={`p-3 md:p-4 rounded-full transition-all shadow-sm shrink-0 ${
                            isListening 
                                ? 'bg-red-100 text-red-600 animate-pulse ring-2 ring-red-400 ring-offset-2' 
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-900'
                        }`}
                        title={isListening ? "Stop Recording" : "Start Recording"}
                    >
                        <span className="material-symbols-outlined text-xl md:text-2xl">
                            {isListening ? 'mic_off' : 'mic'}
                        </span>
                    </button>
                    
                    <div className="flex-1 relative">
                        <textarea
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            onKeyDown={handleKeySubmit}
                            placeholder={isListening ? "Listening..." : "Type your answer..."}
                            className="w-full pl-4 pr-12 py-3 md:py-4 bg-gray-50 border-0 rounded-xl focus:ring-2 focus:ring-indigo-500 resize-none h-[52px] md:h-[60px] max-h-32 shadow-inner text-sm md:text-base disabled:opacity-50"
                            disabled={isProcessing || isListening} 
                        />
                        <button 
                            onClick={() => { handleSendMessage(inputText); setInputText(""); }}
                            disabled={!inputText.trim() || isProcessing || isListening}
                            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                        >
                            <span className="material-symbols-outlined">send</span>
                        </button>
                    </div>
                </div>
                <p className="text-center text-xs text-gray-400 mt-3 md:hidden">
                    {isListening ? "Tap mic to stop" : "Tap mic to speak"}
                </p>
            </div>
        </div>
      </div>
    </div>
  );
};
