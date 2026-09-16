import React from 'react';
import { CodingProblem } from '../../types';
import { Badge } from '../common/Badge';
import { ArrowRight, CheckCircle, HelpCircle } from 'lucide-react';

export interface ProblemViewProps {
  problem: CodingProblem;
  onNextProblem: () => void;
}

export const ProblemView: React.FC<ProblemViewProps> = ({ problem, onNextProblem }) => {
  return (
    <div className="flex flex-col h-full bg-white rounded-2xl border border-slate-200/80 p-5 overflow-y-auto">
      {/* Problem Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div>
          <h2 className="text-xl font-bold text-slate-900">{problem.title}</h2>
          <div className="flex items-center gap-2 mt-2">
            <Badge
              variant={
                problem.difficulty === 'Easy'
                  ? 'success'
                  : problem.difficulty === 'Medium'
                  ? 'warning'
                  : 'danger'
              }
            >
              {problem.difficulty}
            </Badge>
            <Badge variant="primary">{problem.category}</Badge>
          </div>
        </div>

        <button
          onClick={onNextProblem}
          className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg transition-colors"
        >
          <span>Next Problem</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Description */}
      <div className="py-4 space-y-4 text-sm text-slate-700 leading-relaxed">
        <p className="whitespace-pre-line">{problem.description}</p>

        {/* Examples */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            Examples
          </h4>
          {problem.examples.map((ex, idx) => (
            <div
              key={idx}
              className="bg-slate-50 border border-slate-200/70 rounded-xl p-3 text-xs font-mono space-y-1"
            >
              <p>
                <span className="text-slate-500 font-sans">Input: </span>
                <span className="text-indigo-700">{ex.input}</span>
              </p>
              <p>
                <span className="text-slate-500 font-sans">Output: </span>
                <span className="text-emerald-700">{ex.output}</span>
              </p>
              {ex.explanation && (
                <p className="text-slate-500 font-sans text-[11px] pt-1 border-t border-slate-200/60">
                  <span className="font-semibold">Explanation: </span>
                  {ex.explanation}
                </p>
              )}
            </div>
          ))}
        </div>

        {/* Constraints */}
        <div className="space-y-2 pt-2">
          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            Constraints
          </h4>
          <ul className="list-disc list-inside text-xs text-slate-600 space-y-1 font-mono">
            {problem.constraints.map((c, i) => (
              <li key={i}>{c}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
