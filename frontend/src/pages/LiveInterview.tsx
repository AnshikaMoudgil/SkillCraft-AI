import React, { useState, useEffect, useRef } from 'react';
import { PageContainer } from '../components/layout/PageContainer';
import { ChatBubble, AiTypingIndicator } from '../components/interview/ChatBubble';
import { QuestionProgressBar } from '../components/interview/QuestionProgressBar';
import { ChatMessage } from '../types';
import { interviewService, SetupConfig } from '../services/interviewService';
import { speechService } from '../services/speechService';
import * as speechsdk from 'microsoft-cognitiveservices-speech-sdk';
import { useNavigate, useLocation } from 'react-router-dom';
import { useToast } from '../context/ToastContext';
import { Send, Mic, Sparkles, Volume2, Info, Loader2 } from 'lucide-react';

export const LiveInterview: React.FC = () => {
  const location = useLocation();
  const config = (location.state?.config as SetupConfig) || {
    title: 'Quick Live Interview',
    type: 'technical',
    role: 'Software Engineer',
    difficulty: 'Intermediate',
    focusAreas: ['React', 'TypeScript', 'General CS'],
    durationMinutes: 15,
    number_of_questions: 3
  };
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [sessionId, setSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isInitializing, setIsInitializing] = useState(true);

  const [inputVal, setInputVal] = useState('');
  const [isAiTyping, setIsAiTyping] = useState(false);
  const [questionCount, setQuestionCount] = useState(1);
  const [currentTopic, setCurrentTopic] = useState('General');
  const [nextTopic, setNextTopic] = useState('General');
  const [timeRemaining, setTimeRemaining] = useState((config.durationMinutes || 30) * 60);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognizerRef = useRef<speechsdk.SpeechRecognizer | null>(null);
  const [interimTranscript, setInterimTranscript] = useState('');
  const [isRecordingSpeech, setIsRecordingSpeech] = useState(false);

  // Initialize Interview
  useEffect(() => {
    let isMounted = true;
    const start = async () => {
      try {
        const response = await interviewService.startInterview(config);
        if (isMounted) {
          setSessionId(response.sessionId);
          setCurrentTopic(response.topic || 'General');
          const now = new Date();
          const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
          
          setMessages([
            {
              id: `ai-${Date.now()}`,
              sender: 'ai',
              text: `${response.greeting} ${response.firstQuestion}`,
              timestamp: timeStr,
              topic: response.topic || 'General'
            }
          ]);
          setIsInitializing(false);
        }
      } catch (err) {
        showToast('Failed to initialize interview. Please try again.', 'error');
        navigate(-1);
      }
    };
    start();
    
    return () => { isMounted = false; };
  }, [config, navigate, showToast]);

  // Scroll to bottom whenever messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isAiTyping]);

  // Countdown timer
  useEffect(() => {
    if (isInitializing) return;
    const timer = setInterval(() => {
      setTimeRemaining((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [isInitializing]);

  const startMic = async () => {
    try {
      console.log("[Speech] Initializing");
      const tokenRes = await speechService.getSpeechToken();
      if (!tokenRes.token) {
        throw new Error("Missing speech token");
      }
      console.log("[Speech] Token acquired");
      
      const speechConfig = speechsdk.SpeechConfig.fromAuthorizationToken(tokenRes.token, tokenRes.region);
      speechConfig.speechRecognitionLanguage = "en-US";
      
      const audioConfig = speechsdk.AudioConfig.fromDefaultMicrophoneInput();
      const recognizer = new speechsdk.SpeechRecognizer(speechConfig, audioConfig);
      recognizerRef.current = recognizer;
      
      console.log("[Speech] Recognizer created");

      recognizer.recognizing = (s, e) => {
        console.log(`[Speech] Recognizing: ${e.result.text}`);
        setInterimTranscript(e.result.text);
      };

      recognizer.recognized = (s, e) => {
        if (e.result.reason === speechsdk.ResultReason.RecognizedSpeech && e.result.text) {
          console.log(`[Speech] Recognized: ${e.result.text}`);
          setInputVal(prev => (prev ? prev + ' ' : '') + e.result.text);
          setInterimTranscript('');
        }
      };

      recognizer.canceled = (s, e) => {
        console.log(`[Speech] Canceled: ${e.errorDetails || e.reason}`);
        if (e.reason === speechsdk.CancellationReason.Error) {
          showToast(`Speech recognition error: ${e.errorDetails}`, "error");
        }
        stopMic();
      };

      recognizer.sessionStarted = (s, e) => {
        console.log("[Speech] Session started");
      };

      recognizer.sessionStopped = (s, e) => {
        console.log("[Speech] Session stopped");
        stopMic();
      };

      recognizer.startContinuousRecognitionAsync(
        () => {
          console.log("[Speech] Listening started");
          setIsRecordingSpeech(true);
          showToast('Listening... Speak your answer.', 'info');
        },
        (err) => {
          console.log(`[Speech] Start Error: ${err}`);
          showToast("Failed to start speech recognition.", "error");
          stopMic();
        }
      );

    } catch (e) {
      console.log("[Speech] Error initializing:", e);
      showToast("Speech SDK initialization failure or Microphone denied.", "error");
      stopMic();
    }
  };

  const stopMic = () => {
    const recognizer = recognizerRef.current;
    if (recognizer) {
      recognizer.stopContinuousRecognitionAsync(
        () => {
          console.log("[Speech] Listening stopped");
          recognizer.close();
          recognizerRef.current = null;
          setIsRecordingSpeech(false);
          setInterimTranscript('');
        },
        (err) => {
          console.log(`[Speech] Stop Error: ${err}`);
          recognizer.close();
          recognizerRef.current = null;
          setIsRecordingSpeech(false);
          setInterimTranscript('');
        }
      );
    } else {
      setIsRecordingSpeech(false);
      setInterimTranscript('');
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isRecordingSpeech) {
      stopMic();
    }

    if (!inputVal.trim() || isAiTyping || !sessionId) return;

    const userText = inputVal;
    setInputVal('');

    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    // The LAST AI message is the question we are answering
    const lastMsg = messages[messages.length - 1];
    const questionText = lastMsg?.sender === 'ai' ? lastMsg.text : "Previous Question";

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: userText,
      timestamp: timeStr,
      topic: currentTopic
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsAiTyping(true);
    console.log("[Interview] Answer submitted");

    try {
      const response = await interviewService.respondToCandidate(sessionId, questionText, userText, currentTopic);
      setIsAiTyping(false);
      console.log("[Interview] Backend response received");

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: `${response.feedback} ${response.followUp}`,
        timestamp: timeStr,
        topic: currentTopic // Keep current or let AI suggest next
      };

      setMessages((prev) => [...prev, aiMsg]);
      setQuestionCount((c) => c + 1);

      console.log("[Speech] TTS started");
      console.log("[VoiceDebug] TTS CALL");
      console.log(`[VoiceDebug] TTS text: ${aiMsg.text}`);
      console.log("[VoiceDebug] TTS caller/location: LiveInterview handleSendMessage");
      await speechService.synthesizeSpeech(aiMsg.text);
      console.log("[Speech] TTS completed");
    } catch (e) {
      setIsAiTyping(false);
      showToast('Error generating AI response. Please try again.', 'error');
      // Revert user message on failure so they can try again
      setMessages((prev) => prev.slice(0, -1));
      setInputVal(userText);
    }
  };

  const handleFinish = async () => {
    if (!sessionId) return;
    setIsAiTyping(true);
    showToast('Interview concluded! Generating full transcript & performance report...', 'info');
    
    try {
      await interviewService.evaluateInterview(sessionId, messages);
      navigate(`/interview/report?session=${sessionId}`);
    } catch (err) {
      showToast('Error generating report. You can view it later in your dashboard.', 'error');
      navigate('/dashboard');
    }
  };

  if (isInitializing) {
    return (
      <PageContainer title="Live Adaptive Interview" subtitle="Foundry Adaptive Agent Flow">
        <div className="flex flex-col items-center justify-center h-[600px] space-y-4">
          <Loader2 className="w-12 h-12 text-indigo-600 animate-spin" />
          <p className="text-slate-600 font-medium">Connecting to Microsoft Foundry Agent...</p>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer
      title="Live Adaptive Interview"
      subtitle="Foundry Adaptive Agent Flow"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-140px)] min-h-[600px]">
        {/* Left: Chat Conversation Area (8 columns matching reference Screen 8) */}
        <div className="lg:col-span-8 flex flex-col h-full bg-slate-50/50 rounded-3xl border border-slate-200/80 overflow-hidden shadow-sm">
          {/* Interview Topic Header */}
          <div className="px-6 py-3.5 bg-white border-b border-slate-200/80 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-bold text-slate-800">
                Active Session: {config?.title || "Live Mock"}
              </span>
            </div>
            <span className="text-xs text-indigo-600 bg-indigo-50 font-semibold px-2.5 py-0.5 rounded-full border border-indigo-100">
              Adaptive Follow-up Active
            </span>
          </div>

          {/* Conversation Stream */}
          <div className="flex-1 p-6 overflow-y-auto space-y-2">
            {messages.map((msg) => (
              <ChatBubble key={msg.id} message={msg} />
            ))}
            {isAiTyping && <AiTypingIndicator />}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Box Bar matching reference */}
          <div className="p-4 bg-white border-t border-slate-200/80">
            <form onSubmit={handleSendMessage} className="flex items-center gap-2">
              <button
                type="button"
                onClick={isRecordingSpeech ? stopMic : startMic}
                className={`p-3 rounded-2xl transition-colors ${isRecordingSpeech ? 'bg-rose-100 text-rose-600 animate-pulse' : 'text-slate-400 hover:text-indigo-600 hover:bg-indigo-50'}`}
                title={isRecordingSpeech ? "Stop Mic" : "Speak answer"}
                disabled={isAiTyping}
              >
                <Mic className="w-5 h-5" />
              </button>

              <div className="flex-1 relative flex items-center">
                <input
                  type="text"
                  value={inputVal}
                  onChange={(e) => setInputVal(e.target.value)}
                  placeholder={interimTranscript ? "" : "Type your response..."}
                  disabled={isAiTyping}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all z-10 bg-transparent"
                />
                {!inputVal && interimTranscript && (
                  <div className="absolute left-4 pointer-events-none text-slate-400 text-sm italic z-0 opacity-70">
                    {interimTranscript}
                  </div>
                )}
                {inputVal && interimTranscript && (
                  <div className="absolute left-0 -top-8 bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs px-3 py-1.5 rounded-lg whitespace-nowrap shadow-sm opacity-80 pointer-events-none">
                    {interimTranscript}
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={!inputVal.trim() || isAiTyping}
                className="p-3 bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] text-white rounded-2xl shadow-md shadow-indigo-600/20 hover:opacity-95 disabled:opacity-50 transition-all"
              >
                <Send className="w-5 h-5" />
              </button>
            </form>
          </div>
        </div>

        {/* Right: Interview Progress Sidebar (4 columns matching Screen 8) */}
        <div className="lg:col-span-4 h-full flex flex-col justify-between space-y-4">
          <QuestionProgressBar
            currentQuestion={questionCount}
            totalQuestions={config?.number_of_questions || 5}
            currentTopic={currentTopic}
            nextTopic={nextTopic}
            timeRemainingSeconds={timeRemaining}
            onFinish={handleFinish}
          />

          {/* AI Assessment Live Feedback Tip */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-100/80 text-xs space-y-2">
            <div className="flex items-center gap-2 text-indigo-700 font-bold">
              <Sparkles className="w-4 h-4" />
              <span>Real-time Evaluation</span>
            </div>
            <p className="text-slate-600 leading-relaxed">
              Your response is being evaluated across <strong className="text-slate-800">correctness, edge-case thoroughness,</strong> and <strong className="text-slate-800">algorithmic trade-offs</strong>.
            </p>
          </div>
        </div>
      </div>
    </PageContainer>
  );
};
