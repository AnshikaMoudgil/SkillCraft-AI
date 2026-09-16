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
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 flex items-center justify-center gap-3 text-slate-600 text-sm">
        <div className="w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
        <span>Executing test cases in sandbox environment...</span>
      </div>
    );
  }

  if (!results) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 text-xs text-slate-400 flex items-center justify-between">
        <span>Click "Run" or "Submit" to execute test cases.</span>
        <span className="text-[11px] text-slate-400">Sandbox environment ready</span>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 space-y-4">
      {/* Top metrics bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-slate-900">Test Results</span>
          <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            {results.passedTests} / {results.totalTests} Passed
          </span>
        </div>

        <div className="flex items-center gap-4 text-xs font-medium text-slate-500">
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-indigo-500" />
            Runtime: <strong className="text-slate-800 font-mono">{results.runtimeMs}ms</strong>
          </span>
          <span className="flex items-center gap-1">
            <Database className="w-3.5 h-3.5 text-purple-500" />
            Memory: <strong className="text-slate-800 font-mono">{results.memoryMb}MB</strong>
          </span>
        </div>
      </div>

      {/* Test Cases Checklist matching reference */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
        {results.results.map((tc) => (
          <div
            key={tc.id}
            className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-200/70 text-xs"
          >
            {tc.status === 'passed' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
            ) : (
              <XCircle className="w-4 h-4 text-rose-500 shrink-0" />
            )}
            <div className="min-w-0">
              <p className="font-bold text-slate-800">Test {tc.id} Passed</p>
              <p className="text-[10px] text-slate-400 truncate font-mono">{tc.input}</p>
            </div>
          </div>
        ))}
      </div>

      {/* AI Feedback card below editor */}
      <div className="p-3.5 rounded-xl bg-gradient-to-r from-emerald-50/70 to-teal-50/70 border border-emerald-100 flex items-start gap-3">
        <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0 mt-0.5">
          <Sparkles className="w-4 h-4" />
        </div>
        <div className="text-xs">
          <h5 className="font-bold text-emerald-900">AI Test Verdict</h5>
          <p className="text-emerald-800 mt-0.5">{results.aiFeedback}</p>
        </div>
      </div>
    </div>
  );
};
