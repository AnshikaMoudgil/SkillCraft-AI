import React from 'react';
import { Lightbulb, AlertTriangle, CheckSquare, Zap, Bot, Sparkles, Loader2 } from 'lucide-react';

export interface AiCoachActionState {
  type: 'hint' | 'error' | 'review' | 'complexity' | null;
  content: string | null;
  isLoading: boolean;
}

export interface AiCodingCoachPanelProps {
  onGiveHint: () => void;
  onExplainError: () => void;
  onReviewCode: () => void;
  onAnalyzeComplexity: () => void;
  activeState: AiCoachActionState;
}

export const AiCodingCoachPanel: React.FC<AiCodingCoachPanelProps> = ({
  onGiveHint,
  onExplainError,
  onReviewCode,
  onAnalyzeComplexity,
  activeState
}) => {
  return (
    <div className="flex flex-col h-full bg-white rounded-2xl border border-slate-200/80 p-5 overflow-y-auto">
      {/* Header */}
      <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-sm">
          <Bot className="w-4 h-4" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-slate-900 leading-tight">AI Coding Coach</h3>
          <p className="text-[11px] text-slate-400">Real-time reasoning assistant</p>
        </div>
      </div>

      {/* Action Buttons Grid */}
      <div className="grid grid-cols-2 gap-2 my-4">
        <button
          onClick={onGiveHint}
          disabled={activeState.isLoading}
          className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center gap-2 transition-all text-left ${
            activeState.type === 'hint'
              ? 'bg-amber-50 border-amber-200 text-amber-900 shadow-sm'
              : 'bg-slate-50 border-slate-200/70 text-slate-700 hover:bg-white hover:border-indigo-200'
          }`}
        >
          <Lightbulb className="w-4 h-4 text-amber-500 shrink-0" />
          <span>Give Hint</span>
        </button>

        <button
          onClick={onExplainError}
          disabled={activeState.isLoading}
          className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center gap-2 transition-all text-left ${
            activeState.type === 'error'
              ? 'bg-rose-50 border-rose-200 text-rose-900 shadow-sm'
              : 'bg-slate-50 border-slate-200/70 text-slate-700 hover:bg-white hover:border-indigo-200'
          }`}
        >
          <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0" />
          <span>Explain Error</span>
        </button>

        <button
          onClick={onReviewCode}
          disabled={activeState.isLoading}
          className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center gap-2 transition-all text-left ${
            activeState.type === 'review'
              ? 'bg-indigo-50 border-indigo-200 text-indigo-900 shadow-sm'
              : 'bg-slate-50 border-slate-200/70 text-slate-700 hover:bg-white hover:border-indigo-200'
          }`}
        >
          <CheckSquare className="w-4 h-4 text-indigo-600 shrink-0" />
          <span>Review Code</span>
        </button>

        <button
          onClick={onAnalyzeComplexity}
          disabled={activeState.isLoading}
          className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center gap-2 transition-all text-left ${
            activeState.type === 'complexity'
              ? 'bg-purple-50 border-purple-200 text-purple-900 shadow-sm'
              : 'bg-slate-50 border-slate-200/70 text-slate-700 hover:bg-white hover:border-indigo-200'
          }`}
        >
          <Zap className="w-4 h-4 text-purple-600 shrink-0" />
          <span>Complexity</span>
        </button>
      </div>

      {/* Dynamic AI Feedback Container */}
      <div className="flex-1 bg-gradient-to-b from-slate-50/80 to-white rounded-xl border border-slate-200/80 p-4 overflow-y-auto">
        {activeState.isLoading ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-4">
            <Loader2 className="w-6 h-6 animate-spin text-indigo-600 mb-2" />
            <p className="text-xs font-medium text-slate-600">AI Coach is analyzing your code...</p>
          </div>
        ) : activeState.content ? (
          <div className="space-y-2 animate-in fade-in duration-200 text-xs leading-relaxed">
            <div className="flex items-center gap-1.5 text-indigo-600 font-bold uppercase text-[10px] tracking-wider pb-1 border-b border-slate-200/60">
              <Sparkles className="w-3 h-3" />
              <span>
                {activeState.type === 'hint'
                  ? 'Algorithmic Hint'
                  : activeState.type === 'error'
                  ? 'Error Diagnosis'
                  : activeState.type === 'review'
                  ? 'Code Review Analysis'
                  : 'Time & Space Complexity'}
              </span>
            </div>
            <p className="text-slate-700 whitespace-pre-line font-medium pt-1">
              {activeState.content}
            </p>
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center p-4 text-slate-400">
            <Bot className="w-8 h-8 stroke-1 text-slate-300 mb-2" />
            <p className="text-xs font-medium text-slate-500">
              Need assistance?
            </p>
            <p className="text-[11px] text-slate-400 mt-1 max-w-[200px]">
              Click any button above for step-by-step guidance, code quality audits, or Big-O analysis.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
