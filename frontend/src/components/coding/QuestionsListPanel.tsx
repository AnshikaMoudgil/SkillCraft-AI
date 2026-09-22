import React from 'react';
import { CodingProblem } from '../../types';
import { Badge } from '../common/Badge';
import { ChevronRight, ListChecks } from 'lucide-react';

export interface QuestionsListPanelProps {
  problems: CodingProblem[];
  currentIndex: number;
  onSelectProblem: (index: number) => void;
}

export const QuestionsListPanel: React.FC<QuestionsListPanelProps> = ({
  problems,
  currentIndex,
  onSelectProblem
}) => {
  return (
    <div className="flex flex-col h-full bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs overflow-hidden">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100 shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <ListChecks className="w-4 h-4" />
          </div>
          <h2 className="text-sm font-bold text-slate-900">Questions List</h2>
        </div>
        <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
          {problems.length} questions
        </span>
      </div>

      <div className="pt-4 pb-2 shrink-0">
        <p className="text-xs text-slate-500">
          Solve the problems in order or jump to any question.
        </p>
      </div>

      <div className="flex-1 overflow-y-auto min-h-0 pr-1 space-y-2 mt-2">
        {problems.map((problem, idx) => {
          const isActive = idx === currentIndex;
          return (
            <button
              key={idx}
              onClick={() => onSelectProblem(idx)}
              className={`w-full flex items-center justify-between p-3 rounded-xl border text-left transition-all ${
                isActive
                  ? 'border-indigo-300 bg-indigo-50/50 shadow-sm'
                  : 'border-slate-100 bg-white hover:border-slate-200 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-3 overflow-hidden">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${
                  isActive ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-500'
                }`}>
                  {idx + 1}
                </div>
                <span className={`text-xs font-semibold truncate ${isActive ? 'text-indigo-900' : 'text-slate-700'}`}>
                  {problem.title}
                </span>
              </div>
              <div className="flex items-center gap-2 shrink-0 ml-2">
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
                <ChevronRight className={`w-3.5 h-3.5 ${isActive ? 'text-indigo-400' : 'text-slate-300'}`} />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
