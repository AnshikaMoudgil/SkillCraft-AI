import React from 'react';
import { Bot, User, Sparkles } from 'lucide-react';
import { ChatMessage } from '../../types';

export interface ChatBubbleProps {
  message: ChatMessage;
}

export const ChatBubble: React.FC<ChatBubbleProps> = ({ message }) => {
  const isAi = message.sender === 'ai';

  return (
    <div
      className={`flex items-start gap-3 my-4 animate-in fade-in slide-in-from-bottom-2 duration-300 ${
        isAi ? 'justify-start' : 'justify-end'
      }`}
    >
      {/* AI Avatar */}
      {isAi && (
        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#4F46E5] to-[#7C3AED] text-white flex items-center justify-center shrink-0 shadow-md shadow-indigo-500/20 mt-1">
          <Bot className="w-5 h-5" />
        </div>
      )}

      {/* Message Content Bubble */}
      <div
        className={`max-w-xl rounded-2xl p-4 text-sm leading-relaxed shadow-sm transition-all ${
          isAi
            ? 'bg-white border border-slate-200/80 text-slate-800 rounded-tl-sm'
            : 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-tr-sm shadow-indigo-600/20'
        }`}
      >
        <div className="flex items-center justify-between gap-4 mb-1.5">
          <span
            className={`text-xs font-bold tracking-tight ${
              isAi ? 'text-indigo-600 flex items-center gap-1' : 'text-indigo-100'
            }`}
          >
            {isAi && <Sparkles className="w-3 h-3 text-indigo-500" />}
            {isAi ? 'AI Interviewer' : 'You'}
          </span>
          <span className={`text-[10px] ${isAi ? 'text-slate-400' : 'text-indigo-200'}`}>
            {message.timestamp}
          </span>
        </div>

        <p className="whitespace-pre-wrap">{message.text}</p>

        {message.topic && (
          <div className="mt-2 pt-2 border-t border-slate-100 flex items-center gap-1.5">
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-medium">
              Topic: {message.topic}
            </span>
          </div>
        )}
      </div>

      {/* User Avatar */}
      {!isAi && (
        <div className="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center shrink-0 shadow-sm mt-1 font-bold text-xs">
          <User className="w-4 h-4" />
        </div>
      )}
    </div>
  );
};

export const AiTypingIndicator: React.FC = () => {
  return (
    <div className="flex items-start gap-3 my-4 animate-in fade-in duration-200">
      <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#4F46E5] to-[#7C3AED] text-white flex items-center justify-center shrink-0 shadow-md shadow-indigo-500/20">
        <Bot className="w-5 h-5 animate-pulse" />
      </div>
      <div className="bg-white border border-slate-200/80 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm flex items-center gap-1.5">
        <span className="text-xs text-slate-500 font-medium mr-1.5">
          AI Interviewer is analyzing your response
        </span>
        <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce" />
        <div
          className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-bounce"
          style={{ animationDelay: '0.15s' }}
        />
        <div
          className="w-1.5 h-1.5 bg-pink-500 rounded-full animate-bounce"
          style={{ animationDelay: '0.3s' }}
        />
      </div>
    </div>
  );
};
