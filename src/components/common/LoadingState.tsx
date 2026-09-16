import React from 'react';
import { Bot } from 'lucide-react';

export interface LoadingStateProps {
  message?: string;
  submessage?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  message = 'AI is processing your request...',
  submessage = 'Analyzing context and generating response',
  size = 'md'
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center animate-in fade-in duration-300">
      <div className="relative flex items-center justify-center mb-4">
        {/* Glowing pulse aura */}
        <div className="absolute w-16 h-16 rounded-full bg-indigo-500/20 animate-ping" />
        <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30 text-white">
          <Bot className="w-7 h-7 animate-bounce" />
        </div>
      </div>
      <h4 className="text-base font-semibold text-slate-800 tracking-tight">{message}</h4>
      {submessage && <p className="text-xs text-slate-400 mt-1 max-w-sm">{submessage}</p>}
    </div>
  );
};
