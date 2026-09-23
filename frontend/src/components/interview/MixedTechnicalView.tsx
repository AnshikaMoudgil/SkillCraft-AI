import React, { useState, useEffect } from 'react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { MixedQuestion, EvaluateResponse } from '../../services/mixedInterviewService';
import { CheckCircle2, ArrowRight, Bot, Clock } from 'lucide-react';

interface MixedTechnicalViewProps {
  question: MixedQuestion;
  onSubmit: (answer: string) => Promise<EvaluateResponse>;
  onNext: () => void;
  isLast: boolean;
}

export const MixedTechnicalView: React.FC<MixedTechnicalViewProps> = ({ question, onSubmit, onNext, isLast }) => {
  const [answer, setAnswer] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<EvaluateResponse | null>(null);

  const [timeLeft, setTimeLeft] = useState(5 * 60); // 5 mins
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

  const handleSubmit = async (overrideAnswer?: string) => {
    const finalAnswer = overrideAnswer ?? answer;
    if (!finalAnswer.trim() && !overrideAnswer) return;
    setIsSubmitting(true);
    try {
      const res = await onSubmit(finalAnswer || "No answer provided");
      setResult(res);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTimeUpSubmit = () => {
    handleSubmit();
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
          timeLeft < 60 ? 'bg-rose-50 border-rose-200 text-rose-600' : 'bg-white border-slate-200 text-slate-700'
        }`}>
          <Clock className="w-5 h-5" />
          <span>{formatTime(timeLeft)}</span>
        </div>
      </div>

      <Card className="p-6 sm:p-8 space-y-6">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 bg-purple-50 text-purple-700 text-xs font-bold rounded-lg border border-purple-100 uppercase tracking-wider">
              {question.category || 'System Design'}
            </span>
            <span className="px-2.5 py-1 bg-slate-100 text-slate-600 text-xs font-bold rounded-lg border border-slate-200 uppercase tracking-wider">
              Technical Discussion
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 leading-tight">
            {question.question}
          </h2>
        </div>

        {!result ? (
          <div className="space-y-3 pt-2">
            <label className="block text-sm font-bold text-slate-700">Your Answer</label>
            <textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Type your answer here... Be as detailed as possible."
              className="w-full h-40 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all resize-none"
            />
          </div>
        ) : (
          <div className="space-y-6 pt-4">
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Your Answer</h4>
              <p className="text-sm text-slate-700 whitespace-pre-wrap">{answer || "No answer provided"}</p>
            </div>

            <div className={`p-5 rounded-xl border ${result.score && result.score > 70 ? 'bg-emerald-50 border-emerald-200' : result.score && result.score > 40 ? 'bg-amber-50 border-amber-200' : 'bg-rose-50 border-rose-200'}`}>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shrink-0 shadow-sm border border-slate-100">
                  <Bot className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-sm font-bold text-slate-900">AI Feedback</h4>
                    <span className="px-2 py-0.5 bg-white border rounded text-xs font-bold shadow-sm">
                      Score: {result.score}/100
                    </span>
                  </div>
                  <p className="text-sm text-slate-700 leading-relaxed mb-4">
                    {result.feedback}
                  </p>
                  
                  {result.expected_points && result.expected_points.length > 0 && (
                    <div>
                      <h5 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Expected Key Points</h5>
                      <ul className="space-y-1.5">
                        {result.expected_points.map((point, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-sm text-slate-700">
                            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                            <span>{point}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="pt-6 flex justify-end">
          {!result ? (
            <Button
              variant="gradient"
              onClick={() => handleSubmit()}
              disabled={!answer.trim() || isSubmitting}
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
              You've reached the 5-minute time limit for this question. Your answer will now be submitted.
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
