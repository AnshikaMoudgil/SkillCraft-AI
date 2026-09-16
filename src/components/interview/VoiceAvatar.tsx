import React from 'react';
import { Bot, Sparkles } from 'lucide-react';

export interface VoiceAvatarProps {
  isAiSpeaking: boolean;
  name?: string;
  role?: string;
}

export const VoiceAvatar: React.FC<VoiceAvatarProps> = ({
  isAiSpeaking,
  name = 'AI Interviewer',
  role = 'Foundry Adaptive Agent'
}) => {
  return (
    <div className="flex flex-col items-center justify-center text-center">
      <div className="relative">
        {/* Outer glowing pulsing ring when speaking */}
        {isAiSpeaking && (
          <div className="absolute -inset-3 rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-60 blur-md animate-pulse" />
        )}

        <div
          className={`relative w-28 h-28 sm:w-36 sm:h-36 rounded-full p-1.5 transition-all duration-300 ${
            isAiSpeaking
              ? 'bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 shadow-2xl shadow-indigo-500/50 scale-105'
              : 'bg-slate-800 border-2 border-slate-700'
          }`}
        >
          <div className="w-full h-full rounded-full overflow-hidden bg-slate-900 flex items-center justify-center">
            {/* Elegant AI Interviewer portrait placeholder matching reference image */}
            <img
              src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80"
              alt="AI Interviewer"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* AI Tag badge */}
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-[#071324] border border-indigo-500/40 text-[10px] font-bold text-indigo-300 flex items-center gap-1 shadow-lg shrink-0">
          <Sparkles className="w-3 h-3 text-indigo-400" />
          <span>{name}</span>
        </div>
      </div>

      <p className="text-xs text-slate-400 mt-4">{role}</p>
    </div>
  );
};
