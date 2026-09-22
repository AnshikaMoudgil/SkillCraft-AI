import React, { useState } from 'react';
import { CodingProblem } from '../../types';
import { Badge } from '../common/Badge';
import { ArrowRight, FileText, BookOpen, Code } from 'lucide-react';

export interface ProblemViewProps {
  problem: CodingProblem;
  onNextProblem: () => void;
  problems?: CodingProblem[];
  currentIndex?: number;
  onSelectProblem?: (index: number) => void;
  isInterviewMode?: boolean;
}

export const ProblemView: React.FC<ProblemViewProps> = ({ 
  problem, 
  onNextProblem,
  problems,
  currentIndex,
  onSelectProblem,
  isInterviewMode
}) => {
  const [activeTab, setActiveTab] = useState<'description' | 'examples' | 'constraints'>('description');

  return (
    <div className="flex flex-col h-full bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs overflow-hidden">
      {/* Problem Header */}
      <div className="flex flex-col gap-4 pb-4 border-b border-slate-100 shrink-0">
        <div className="flex items-start justify-between">
          <div className="flex flex-col gap-3">
            <h2 className="text-xl font-bold text-slate-900">{problem.title}</h2>
            <div className="flex items-center gap-2">
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

          <div className="flex flex-col items-end gap-3 shrink-0">
            {(!isInterviewMode && problems && onSelectProblem && currentIndex !== undefined) && (
              <select
                value={currentIndex}
                onChange={(e) => onSelectProblem(Number(e.target.value))}
                className="text-xs px-3 py-1.5 rounded-full border border-slate-200 bg-white text-slate-700 outline-none cursor-pointer hover:bg-slate-50 transition-colors w-40 text-ellipsis font-medium shadow-sm appearance-none text-center"
                style={{ backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%2364748B%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right .7rem top 50%', backgroundSize: '.65rem auto' }}
              >
                {problems.map((p, idx) => (
                  <option key={idx} value={idx}>{p.title}</option>
                ))}
              </select>
            )}
            <button
              onClick={onNextProblem}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 hover:bg-indigo-50 px-2 py-1 rounded-lg transition-colors"
            >
              <span>Next Problem</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-4 mt-2">
          <button
            onClick={() => setActiveTab('description')}
            className={`flex items-center gap-1.5 text-xs font-semibold pb-1 border-b-2 transition-colors ${
              activeTab === 'description' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            Description
          </button>
          <button
            onClick={() => setActiveTab('examples')}
            className={`flex items-center gap-1.5 text-xs font-semibold pb-1 border-b-2 transition-colors ${
              activeTab === 'examples' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            Examples
          </button>
          <button
            onClick={() => setActiveTab('constraints')}
            className={`flex items-center gap-1.5 text-xs font-semibold pb-1 border-b-2 transition-colors ${
              activeTab === 'constraints' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <Code className="w-3.5 h-3.5" />
            Constraints
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="py-4 text-sm text-slate-700 leading-relaxed overflow-y-auto min-h-0 flex-1 pr-1">
        {activeTab === 'description' && (
          <div className="animate-in fade-in duration-200">
            <p className="whitespace-pre-line">{problem.description}</p>
          </div>
        )}

        {activeTab === 'examples' && (
          <div className="space-y-4 animate-in fade-in duration-200">
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
        )}

        {activeTab === 'constraints' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Constraints
            </h4>
            <ul className="list-disc list-inside text-xs text-slate-600 space-y-2 font-mono">
              {problem.constraints.map((c, i) => (
                <li key={i}>{c}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};
