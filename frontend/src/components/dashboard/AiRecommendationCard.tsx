import React from 'react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Bot, ArrowRight, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const AiRecommendationCard: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Card className="p-6 sm:p-7 relative overflow-hidden bg-gradient-to-br from-[#F5F8FF] via-white to-[#FAF5FF] border border-indigo-100 shadow-sm">
      {/* Subtle background glow circle */}
      <div className="absolute -right-10 -bottom-10 w-48 h-48 rounded-full bg-gradient-to-tr from-indigo-200/30 to-purple-200/30 blur-2xl pointer-events-none" />

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
        <div className="max-w-xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100/70 text-indigo-700 text-xs font-bold tracking-wide">
            <Bot className="w-3.5 h-3.5 text-indigo-600" />
            <span>AI Recommendation</span>
            <Sparkles className="w-3 h-3 text-purple-600" />
          </div>

          <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
            Your DBMS scores have dropped in your last 2 interviews.
          </h3>

          <p className="text-sm text-slate-600 leading-relaxed">
            Focus on <span className="font-semibold text-indigo-700">Transactions</span> and{' '}
            <span className="font-semibold text-purple-700">Normalization</span> next to reach your target readiness of 85%+.
          </p>

          <div className="pt-1">
            <Button
              variant="gradient"
              size="md"
              onClick={() => navigate('/learning')}
              icon={<ArrowRight className="w-4 h-4" />}
            >
              Start Recommended Practice
            </Button>
          </div>
        </div>

        {/* AI Robot Mascot Illustration (matching reference image) */}
        <div className="self-center md:self-auto shrink-0 flex items-center justify-center">
          <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-3xl bg-gradient-to-tr from-indigo-500/10 to-purple-500/10 p-2 border border-indigo-100/80 flex items-center justify-center animate-float">
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-tr from-[#4F46E5] to-[#7C3AED] flex flex-col items-center justify-center text-white shadow-xl shadow-indigo-500/30">
              <Bot className="w-12 h-12 stroke-[1.75]" />
              <span className="text-[10px] font-extrabold tracking-wider uppercase mt-1 text-indigo-100">
                SkillCraft AI
              </span>
            </div>
            {/* Ambient status dot */}
            <span className="absolute top-2 right-2 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-white ring-2 ring-emerald-400/20 animate-pulse" />
          </div>
        </div>
      </div>
    </Card>
  );
};
