import React, { useState, useEffect, useRef } from 'react';
import { PageContainer } from '../components/layout/PageContainer';
import { ChatBubble, AiTypingIndicator } from '../components/interview/ChatBubble';
import { QuestionProgressBar } from '../components/interview/QuestionProgressBar';
import { ChatMessage } from '../types';
import { interviewService } from '../services/interviewService';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../context/ToastContext';
import { Send, Mic, Sparkles, Volume2, Info } from 'lucide-react';

export const LiveInterview: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-1',
      sender: 'ai',
      text: 'Explain your approach to detecting a cycle in a linked list.',
      timestamp: '05:30',
      topic: 'Linked Lists'
    },
    {
      id: 'msg-2',
      sender: 'user',
      text: "I would use Floyd's cycle detection algorithm with slow and fast pointers. The slow pointer moves one node while the fast pointer moves two nodes at each step.",
      timestamp: '05:52',
      topic: 'Linked Lists'
    },
    {
      id: 'msg-3',
      sender: 'ai',
      text: "That's a good approach. What happens if the list has no cycle? How do we handle that case and ensure the algorithm terminates safely?",
      timestamp: '06:15',
      topic: 'Linked Lists'
    }
  ]);

  const [inputVal, setInputVal] = useState('');
  const [isAiTyping, setIsAiTyping] = useState(false);
  const [questionCount, setQuestionCount] = useState(4);
  const [currentTopic, setCurrentTopic] = useState('Linked Lists');
  const [nextTopic, setNextTopic] = useState('DBMS');
  const [timeRemaining, setTimeRemaining] = useState(1104); // 18:24 in seconds

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { showToast } = useToast();

  // Scroll to bottom whenever messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isAiTyping]);

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim() || isAiTyping) return;

    const userText = inputVal;
    setInputVal('');

    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: userText,
      timestamp: timeStr,
      topic: currentTopic
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsAiTyping(true);

    try {
      const nextData = await interviewService.getNextAdaptiveQuestion(questionCount, userText);
      setIsAiTyping(false);

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: nextData.question,
        timestamp: timeStr,
        topic: nextData.topic
      };

      setMessages((prev) => [...prev, aiMsg]);
      setQuestionCount((c) => Math.min(9, c + 1));
      if (nextData.topic !== currentTopic) {
        setCurrentTopic(nextData.topic);
        setNextTopic(nextData.topic === 'DBMS' ? 'System Design' : 'Behavioral');
      }
    } catch (e) {
      setIsAiTyping(false);
      showToast('Error generating AI response', 'error');
    }
  };

  const handleFinish = () => {
    showToast('Interview concluded! Generating full transcript & performance report.', 'success');
    navigate('/interview/transcript');
  };

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
                Active Session: Technical & Behavioral Mock
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
                onClick={() => showToast('Speech-to-text listening...', 'info')}
                className="p-3 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-2xl transition-colors"
                title="Speak answer"
              >
                <Mic className="w-5 h-5" />
              </button>

              <input
                type="text"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                placeholder="Type your response..."
                disabled={isAiTyping}
                className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all"
              />

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
            totalQuestions={9}
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
