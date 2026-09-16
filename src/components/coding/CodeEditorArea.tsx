import React, { useState } from 'react';
import { Play, Send, Copy, Check, RotateCcw } from 'lucide-react';
import { Button } from '../common/Button';

export interface CodeEditorAreaProps {
  code: string;
  onChange: (newCode: string) => void;
  language: string;
  onLanguageChange: (lang: string) => void;
  onRun: () => void;
  onSubmit: () => void;
  isRunning: boolean;
  isSubmitting: boolean;
  onReset: () => void;
}

export const CodeEditorArea: React.FC<CodeEditorAreaProps> = ({
  code,
  onChange,
  language,
  onLanguageChange,
  onRun,
  onSubmit,
  isRunning,
  isSubmitting,
  onReset
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const lines = code.split('\n');

  return (
    <div className="flex flex-col h-full bg-[#0B192C] text-slate-200 rounded-2xl border border-slate-800 shadow-xl overflow-hidden">
      {/* Editor Topbar */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#071324] border-b border-slate-800">
        <div className="flex items-center gap-3">
          <select
            value={language}
            onChange={(e) => onLanguageChange(e.target.value)}
            className="bg-[#0E223F] text-slate-200 border border-slate-700 text-xs font-semibold rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
          >
            <option value="Java">Java 17</option>
            <option value="C++">C++ (GCC 12)</option>
            <option value="Python">Python 3.11</option>
            <option value="JavaScript">JavaScript (ES6)</option>
          </select>

          <button
            onClick={onReset}
            title="Reset to starter template"
            className="p-1.5 text-slate-400 hover:text-slate-200 rounded-md transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="p-1.5 text-slate-400 hover:text-slate-200 rounded-md transition-colors flex items-center gap-1 text-xs"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy</span>
              </>
            )}
          </button>

          <Button
            variant="outline"
            size="sm"
            onClick={onRun}
            isLoading={isRunning}
            icon={<Play className="w-3.5 h-3.5 text-indigo-400 fill-indigo-400" />}
            className="!bg-[#0E223F] !border-slate-700 !text-slate-200 hover:!bg-[#15325B]"
          >
            Run
          </Button>

          <Button
            variant="gradient"
            size="sm"
            onClick={onSubmit}
            isLoading={isSubmitting}
            icon={<Send className="w-3.5 h-3.5" />}
          >
            Submit
          </Button>
        </div>
      </div>

      {/* Code Editor Box with Line Numbers */}
      <div className="flex-1 relative flex overflow-hidden font-mono text-xs sm:text-sm">
        {/* Line Numbers */}
        <div className="w-12 py-3 px-2 bg-[#081527] text-slate-500 select-none text-right font-mono border-r border-slate-800 shrink-0 leading-6">
          {lines.map((_, i) => (
            <div key={i}>{i + 1}</div>
          ))}
        </div>

        {/* Textarea Code Input */}
        <textarea
          value={code}
          onChange={(e) => onChange(e.target.value)}
          spellCheck={false}
          className="w-full h-full p-3 bg-transparent text-emerald-300 font-mono resize-none focus:outline-none leading-6 selection:bg-indigo-600/40 selection:text-white"
        />
      </div>
    </div>
  );
};
