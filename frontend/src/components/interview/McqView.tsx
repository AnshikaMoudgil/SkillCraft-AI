import React, { useState, useEffect } from 'react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { MixedQuestion, McqOption, EvaluateResponse } from '../../services/mixedInterviewService';
import { CheckCircle2, XCircle, AlertCircle, ArrowRight, Clock } from 'lucide-react';

interface McqViewProps {
  question: MixedQuestion;
  onSubmit: (answer: string) => Promise<EvaluateResponse>;
  onNext: () => void;
  isLast: boolean;
}

export const McqView: React.FC<McqViewProps> = ({ question, onSubmit, onNext, isLast }) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<EvaluateResponse | null>(null);

  const [timeLeft, setTimeLeft] = useState(2 * 60); // 2 mins
  const [isTimeUp, setIsTimeUp] = useState(false);

  useEffect(() => {
    if (isTimeUp || result) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsTimeUp(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isTimeUp, result]);

  const handleSubmit = async (overrideOption?: string) => {
    const opt = overrideOption || selectedOption;
    if (!opt) return;
    setIsSubmitting(true);
    try {
      const res = await onSubmit(opt);
      setResult(res);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTimeUpSubmit = () => {
    if (selectedOption) {
      handleSubmit(selectedOption);
    } else {
      // Force submit an invalid option so they get 0
      handleSubmit("TIMEOUT_NO_ANSWER");
    }
    setIsTimeUp(false);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-3xl mx-auto w-full animate-in fade-in duration-300 space-y-6">
      <div className="flex justify-end mb-2">
        <div className={`flex items-center gap-2 px-4 py-2 rounded-xl border shadow-sm font-mono text-lg font-bold transition-colors ${
          timeLeft < 30 ? 'bg-rose-50 border-rose-200 text-rose-600' : 'bg-white border-slate-200 text-slate-700'
        }`}>
          <Clock className="w-5 h-5" />
          <span>{formatTime(timeLeft)}</span>
        </div>
      </div>

      <Card className="p-6 sm:p-8 space-y-6">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 bg-indigo-50 text-indigo-700 text-xs font-bold rounded-lg border border-indigo-100 uppercase tracking-wider">
              {question.category || 'Core CS'}
            </span>
            <span className="px-2.5 py-1 bg-slate-100 text-slate-600 text-xs font-bold rounded-lg border border-slate-200 uppercase tracking-wider">
              Multiple Choice
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 leading-tight">
            {question.question}
          </h2>
        </div>

        <div className="space-y-3 pt-2">
          {question.options?.map((opt: McqOption) => {
            const isSelected = selectedOption === opt.id;
            let optionStateClass = 'bg-white border-slate-200 hover:border-indigo-300 hover:bg-slate-50 cursor-pointer';
            
            if (result) {
              // Answered state
              if (opt.id === result.correct_option_id) {
                optionStateClass = 'bg-emerald-50 border-emerald-500 text-emerald-900';
              } else if (isSelected && !result.is_correct) {
                optionStateClass = 'bg-rose-50 border-rose-500 text-rose-900';
              } else {
                optionStateClass = 'bg-slate-50 border-slate-200 opacity-50 cursor-not-allowed';
              }
            } else if (isSelected) {
              optionStateClass = 'bg-indigo-50 border-indigo-500 ring-1 ring-indigo-500 text-indigo-900';
            }

            return (
              <div
                key={opt.id}
                onClick={() => !result && setSelectedOption(opt.id)}
                className={`p-4 rounded-xl border-2 transition-all flex items-start gap-3 ${optionStateClass}`}
              >
                <div className="mt-0.5 shrink-0">
                  {result && opt.id === result.correct_option_id ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  ) : result && isSelected && !result.is_correct ? (
                    <XCircle className="w-5 h-5 text-rose-600" />
                  ) : (
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      isSelected ? 'border-indigo-600' : 'border-slate-300'
                    }`}>
                      {isSelected && <div className="w-2.5 h-2.5 bg-indigo-600 rounded-full" />}
                    </div>
                  )}
                </div>
                <div className="flex-1 text-sm font-semibold pt-0.5">
                  {opt.text}
                </div>
              </div>
            );
          })}
        </div>

        {result && (
          <div className={`p-4 rounded-xl border animate-in zoom-in-95 duration-200 ${
            result.is_correct ? 'bg-emerald-50 border-emerald-200' : 'bg-rose-50 border-rose-200'
          }`}>
            <h4 className={`text-sm font-bold flex items-center gap-2 mb-2 ${
              result.is_correct ? 'text-emerald-800' : 'text-rose-800'
            }`}>
              {result.is_correct ? (
                <><CheckCircle2 className="w-4 h-4" /> Correct Answer</>
              ) : (
                <><AlertCircle className="w-4 h-4" /> Incorrect Answer</>
              )}
            </h4>
            <p className="text-sm text-slate-700 leading-relaxed">
              {result.explanation}
            </p>
          </div>
        )}

        <div className="pt-6 flex justify-end">
          {!result ? (
            <Button
              variant="gradient"
              onClick={() => handleSubmit()}
              disabled={!selectedOption || isSubmitting}
              isLoading={isSubmitting}
            >
              Submit Answer
            </Button>
          ) : (
            <Button
              variant="primary"
              onClick={onNext}
              icon={<ArrowRight className="w-4 h-4" />}
            >
              {isLast ? 'Finish Interview' : 'Next Question'}
            </Button>
          )}
        </div>
      </Card>

      {isTimeUp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8 max-w-md w-full mx-4 flex flex-col items-center text-center animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center text-rose-600 mb-4">
              <Clock className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Time's Up!</h2>
            <p className="text-slate-600 mb-6">
              You've reached the 2-minute time limit for this question. Your answer will now be submitted.
            </p>
            <button
              onClick={handleTimeUpSubmit}
              disabled={isSubmitting}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-xl transition-colors disabled:opacity-50"
            >
              {isSubmitting ? 'Submitting...' : 'View Results'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
