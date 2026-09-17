import React from 'react';
import { CheckCircle2, XCircle, Clock, Database, Sparkles } from 'lucide-react';
import { TestRunResult } from '../../services/codingService';

export interface TestResultsPanelProps {
  results: TestRunResult | null;
  isRunning: boolean;
}

export const TestResultsPanel: React.FC<TestResultsPanelProps> = ({ results, isRunning }) => {
  if (isRunning) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 flex items-center justify-center gap-3 text-slate-600 text-sm shadow-xs">
        <div className="w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin shrink-0" />
        <span className="font-medium">Executing test cases in sandbox environment...</span>
      </div>
    );
  }

  if (!results) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-5 text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2 shadow-xs">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-pulse" />
          <span className="font-semibold text-slate-700">Sandbox Test Runner Ready</span>
        </div>
        <span className="text-slate-400">Click &ldquo;Run&rdquo; or &ldquo;Submit&rdquo; above to execute test cases against the compiler.</span>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 space-y-4 shadow-sm">
      {/* Top metrics bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3.5 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <span className="text-sm sm:text-base font-bold text-slate-900">Execution Results</span>
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-xs">
            {results.passedTests} / {results.totalTests} Passed
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs font-medium text-slate-500">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200/70">
            <Clock className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
            <span>Runtime: <strong className="text-slate-800 font-mono font-bold">{results.runtimeMs}ms</strong></span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200/70">
            <Database className="w-3.5 h-3.5 text-purple-500 shrink-0" />
            <span>Memory: <strong className="text-slate-800 font-mono font-bold">{results.memoryMb}MB</strong></span>
          </div>
        </div>
      </div>

      {/* Test Cases Checklist */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {results.results.map((tc) => (
          <div
            key={tc.id}
            className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200/70 text-xs min-w-0"
          >
            {tc.status === 'passed' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
            ) : (
              <XCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
            )}
            <div className="min-w-0 flex-1">
              <p className="font-bold text-slate-800 leading-tight">Test Case #{tc.id}</p>
              <p className="text-[11px] text-slate-500 truncate font-mono mt-0.5" title={tc.input}>{tc.input}</p>
            </div>
          </div>
        ))}
      </div>

      {/* AI Feedback card */}
      <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-50/80 via-teal-50/80 to-emerald-50/40 border border-emerald-200/80 flex items-start gap-3 shadow-xs">
        <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
          <Sparkles className="w-4 h-4" />
        </div>
        <div className="text-xs min-w-0 flex-1">
          <h5 className="font-bold text-emerald-900 uppercase tracking-wide text-[11px]">AI Performance Verdict</h5>
          <p className="text-emerald-800 mt-1 leading-relaxed font-medium">{results.aiFeedback}</p>
        </div>
      </div>
    </div>
  );
};

