import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'sonner';
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';
import { useSpeechSynthesis } from '@/hooks/useSpeechSynthesis';

interface Message {
  id: string;
  role: 'ai' | 'user';
  content: string;
  timestamp: Date;
}

const MOCK_QUESTIONS = [
  "This is a placeholder for dynamic questions.",
  "Please configure real resume and job context to receive tailored questions."
];

export const ActiveInterviewSession = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { resumeId, jobId } = location.state || {};
  // Placeholder for real logic
  useEffect(() => { if(resumeId) console.log("Loaded context for resume:", resumeId); }, [resumeId]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  
  // We'll replace manual state with hook state
  const { 
    isListening, 
    transcript: currentTranscript, 
    startListening, 
    stopListening,
    resetTranscript 
  } = useSpeechRecognition();
  
  const { speak, cancel: cancelSpeech, speaking: isSpeaking } = useSpeechSynthesis();

  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'ai',
      content: "Hello! I'm your AI interviewer. Please select a resume and job description in the configuration page to start a real session.",
      timestamp: new Date()
    }
  ]);
  // Removed internal currentTranscript state as it comes from hook now
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, currentTranscript]);

  // Initial greeting
  useEffect(() => {
    // Speak the first message on load if not already speaking
    // However, autoplay policies might block this without user interaction.
    // Better to wait for user to click "Start" or something.
  }, []);

  const toggleRecording = () => {
    if (isListening) {
      stopListening();
      // When stopping, if there's transcript, send it
      if (currentTranscript.trim()) {
          handleSendMessage(currentTranscript);
          resetTranscript();
      }
    } else {
      cancelSpeech(); // Stop AI if speaking
      startListening();
    }
  };

  const handleSendMessage = (text: string) => {
    if (!text.trim()) return;
    
    // Add User Message
    const userMsg: Message = {
        id: Date.now().toString(),
        role: 'user',
        content: text,
        timestamp: new Date()
    };
    setMessages(prev => [...prev, userMsg]);
    
    // Determine next AI response
    setTimeout(() => {
        let responseContent = "";
        
        let nextQuestion = "";
        if (currentQuestionIndex < MOCK_QUESTIONS.length) {
            nextQuestion = MOCK_QUESTIONS[currentQuestionIndex];
            responseContent = `That's interesting. ${nextQuestion}`;
            // If we have job/resume context, we could mention it here
            if (jobId && currentQuestionIndex === 0) {
                 responseContent = `Thanks. Based on the job description for ${jobId === '1' ? 'Frontend Dev' : 'the role'}, ${nextQuestion}`;
            }
            setCurrentQuestionIndex(prev => prev + 1);
        } else {
            responseContent = "Thank you for sharing. That concludes our session. I'll prepare your feedback report now.";
            // After this, navigate to results
            const finalMessages = [...messages, { id: 'final', role: 'ai' as const, content: responseContent, timestamp: new Date() }];
            setTimeout(() => {
                navigate('/mock-interview/results', { state: { messages: finalMessages } });
            }, 4000);
        }

        const aiResponse: Message = {
            id: (Date.now() + 1).toString(),
            role: 'ai',
            content: responseContent,
            timestamp: new Date()
        };
        
        setMessages(prev => [...prev, aiResponse]);
        speak({ text: responseContent });
    }, 1500);
  };

  const handleEndSession = () => {
      toast("Are you sure you want to end the interview?", {
        description: "Your progress will be saved.",
        action: {
          label: "End Session",
          onClick: () => navigate('/mock-interview'),
        },
        cancel: {
            label: "Cancel",
            onClick: () => {},
        }
      });
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b px-4 py-3 md:px-6 md:py-4 flex items-center justify-between shadow-sm z-10 sticky top-0 md:relative">
        <div className="flex items-center gap-3">
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 shrink-0">
                <span className="material-symbols-outlined text-lg md:text-2xl">smart_toy</span>
            </div>
            <div>
                <h1 className="font-bold text-gray-900 text-sm md:text-base">Technical Interview</h1>
                <p className="text-[10px] md:text-xs text-gray-500">React Developer Role • 30 mins remaining</p>
            </div>
        </div>
        <button 
            onClick={handleEndSession}
            className="text-red-500 hover:bg-red-50 px-3 py-1.5 md:px-4 md:py-2 rounded-lg text-xs md:text-sm font-medium transition flex items-center gap-1 md:gap-2 border border-red-100 md:border-transparent bg-red-50 md:bg-transparent"
        >
            <span className="material-symbols-outlined text-base md:text-lg">close</span>
            <span className="hidden sm:inline">End Session</span>
            <span className="sm:hidden">End</span>
        </button>
      </header>

      {/* Main Content - Split View */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden relative">
        
        {/* Left Panel - Visualizer / AI Avatar */}
        <div className="w-full md:w-1/3 bg-gray-900 p-4 md:p-6 flex flex-row md:flex-col items-center justify-between md:justify-center relative border-b md:border-b-0 md:border-r border-gray-800 shrink-0">
            <div className="absolute top-2 left-4 md:top-6 md:left-6 text-gray-400 text-[10px] md:text-sm font-medium flex items-center gap-2">
                <span className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-green-500 animate-pulse"></span>
                Live
            </div>
            
            {/* Avatar Container */}
            <div className={`w-12 h-12 md:w-48 md:h-48 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 p-0.5 md:p-1 md:mb-8 shadow-lg md:shadow-2xl shadow-indigo-500/20 mr-4 md:mr-0 shrink-0 ${isSpeaking ? 'animate-pulse' : ''}`}>
                <div className="w-full h-full rounded-full bg-gray-800 flex items-center justify-center overflow-hidden relative">
                    <span className="material-symbols-outlined text-2xl md:text-8xl text-white opacity-80 z-10">
                        {isSpeaking ? 'graphic_eq' : 'mic'}
                    </span>
                    {isSpeaking && (
                        <div className="absolute inset-0 bg-indigo-500/20 animate-ping rounded-full"></div>
                    )}
                </div>
            </div>
            
            <div className="flex-1 md:text-center space-y-0.5 md:space-y-2">
                <h2 className="text-white font-semibold text-sm md:text-xl">AI Interviewer</h2>
                <p className="text-gray-400 text-xs md:text-sm truncate">
                    {/* Placeholder status */}
                    Waiting...
                </p>
            </div>

            {/* Audio Waveform Visualization Placeholder - Hidden on mobile for space */}
            <div className="hidden md:flex mt-12 gap-1 h-8 items-end justify-center">
                {[...Array(10)].map((_, i) => (
                    <div key={i} className={`w-1 bg-indigo-500 rounded-full transition-all duration-300 ${isListening ? 'animate-bounce' : 'h-2'}`} style={{animationDelay: `${i * 0.1}s`}}></div>
                ))}
            </div>
        </div>

        {/* Right Panel - Chat Interface */}
        <div className="flex-1 flex flex-col bg-white overflow-hidden">
            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 md:space-y-6 pb-20 md:pb-6">
                {messages.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[80%] rounded-2xl px-6 py-4 ${
                            msg.role === 'user' 
                                ? 'bg-indigo-600 text-white rounded-br-none' 
                                : 'bg-gray-100 text-gray-800 rounded-bl-none'
                        }`}>
                            <p className="border-b border-white/10 (msg.role === 'user' ? 'border-white/20' : 'border-gray-200') pb-2 mb-2 text-xs font-bold uppercase tracking-wider opacity-70">
                                {msg.role === 'user' ? 'You' : 'Interviewer'}
                            </p>
                            <p className="leading-relaxed">{msg.content}</p>
                        </div>
                    </div>
                ))}
                
                {currentTranscript && (
                    <div className="flex justify-end">
                        <div className="max-w-[80%] rounded-2xl rounded-br-none px-6 py-4 bg-indigo-50 text-indigo-900 border border-indigo-100 italic">
                            <span className="animate-pulse">... {currentTranscript}</span>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Controls Area */}
            <div className="p-6 border-t bg-gray-50">
                <div className="max-w-3xl mx-auto flex items-center gap-4">
                    <button 
                        onClick={toggleRecording}
                        className={`p-6 rounded-full transition-all shadow-lg transform active:scale-95 ${
                            isListening 
                                ? 'bg-red-500 hover:bg-red-600 text-white ring-4 ring-red-200' 
                                : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                        }`}
                    >
                        <span className="material-symbols-outlined text-3xl">
                            {isListening ? 'stop' : 'mic'}
                        </span>
                    </button>
                    
                    <div className="flex-1 bg-white rounded-xl border border-gray-200 flex items-center px-4 py-3 shadow-sm focus-within:ring-2 focus-within:ring-indigo-500 transition">
                        <input 
                            type="text" 
                            placeholder="Type your answer here if you prefer..."
                            className="flex-1 bg-transparent border-none outline-none text-gray-700 placeholder-gray-400"
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                                    handleSendMessage(e.currentTarget.value);
                                    e.currentTarget.value = '';
                                }
                            }}
                        />
                         <button className="text-gray-400 hover:text-indigo-600 transition">
                            <span className="material-symbols-outlined">send</span>
                        </button>
                    </div>
                </div>
                <p className="text-center text-xs text-gray-400 mt-4">
                    Press the microphone to speak, or type your response. AI generates feedback in real-time.
                </p>
            </div>
        </div>
      </div>
    </div>
  );
};
