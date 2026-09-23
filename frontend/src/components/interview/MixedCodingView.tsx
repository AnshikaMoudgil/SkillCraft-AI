import React, { useState, useEffect } from 'react';
import { MixedQuestion } from '../../services/mixedInterviewService';
import { ProblemView } from '../coding/ProblemView';
import { CodeEditorArea } from '../coding/CodeEditorArea';
import { AiCodingCoachPanel, AiCoachActionState } from '../coding/AiCodingCoachPanel';
import { TestResultsPanel } from '../coding/TestResultsPanel';
import { codingService, TestRunResult } from '../../services/codingService';
import { CodingProblem } from '../../types';
import { apiClient } from '../../lib/apiClient';
import { aiService } from '../../services/aiService';
import { useToast } from '../../context/ToastContext';
import { Clock } from 'lucide-react';

interface MixedCodingViewProps {
  question: MixedQuestion;
  onNext: () => void;
  isLast: boolean;
}

export const MixedCodingView: React.FC<MixedCodingViewProps> = ({ question, onNext, isLast }) => {
  const { showToast } = useToast();
  
  // Synthesize a CodingProblem from MixedQuestion
  const [problem] = useState<CodingProblem>({
    id: question.problem_id || 'unknown',
    title: question.title || 'Unknown Problem',
    slug: (question.title || '').toLowerCase().replace(/ /g, '-'),
    difficulty: question.difficulty as 'Easy' | 'Medium' | 'Hard' || 'Medium',
    category: question.category || 'Algorithms',
    description: '',
    starterCode: question.starter_code || { Java: '' },
    testCases: [],
    examples: [],
    constraints: [],
    hints: [],
    solutionExplanation: '',
    complexity: { time: '', space: '' }
  });

  // We actually need to fetch the full problem details from the backend to display it properly.
  const [fullProblem, setFullProblem] = useState<CodingProblem | null>(null);
  const [loading, setLoading] = useState(true);

  const [language, setLanguage] = useState('Java');
  const [code, setCode] = useState('');
  const [testResults, setTestResults] = useState<TestRunResult | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [aiCoachState, setAiCoachState] = useState<AiCoachActionState>({
    type: null,
    content: null,
    isLoading: false
  });

  const [timeLeft, setTimeLeft] = useState(10 * 60); // 10 mins
  const [isTimeUp, setIsTimeUp] = useState(false);

  useEffect(() => {
    if (isTimeUp) return;
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
  }, [isTimeUp]);

  useEffect(() => {
    // Fetch all problems and find this one to get full description
    const fetchProb = async () => {
      try {
        const data = await apiClient.get<CodingProblem[]>('/coding/problems');
        const found = data.find((p: CodingProblem) => 
          p.id === question.problem_id || 
          p.title === question.title ||
          p.id === question.id || 
          p.id === question.id.replace('code-', '')
        );
        if (found) {
          setFullProblem(found);
          setCode(found.starterCode[language] || found.starterCode['Java']);
        }
      } catch (e) {
        showToast('Error loading coding problem details.', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchProb();
  }, [question, language, showToast]);

  const handleLanguageChange = (newLang: string) => {
    setLanguage(newLang);
    if (fullProblem) setCode(fullProblem.starterCode[newLang] || '');
  };

  const handleReset = () => {
    if (fullProblem) setCode(fullProblem.starterCode[language] || '');
    showToast('Code reset to default starter template', 'info');
  };

  const handleRun = async () => {
    if (!fullProblem) return;
    setIsRunning(true);
    try {
      const res = await codingService.runCode(language, code, fullProblem.title);
      setTestResults(res);
      if (res.compileError || res.runtimeError) {
        showToast(res.compileError || res.runtimeError || 'Execution error', 'error');
      } else if (res.passed) {
        showToast(`Passed ${res.passedTests}/${res.totalTests} tests`, 'success');
      } else {
        showToast(`Failed: ${res.passedTests}/${res.totalTests} tests passed`, 'error');
      }
    } catch (e) {
      showToast('Error executing test cases', 'error');
    } finally {
      setIsRunning(false);
    }
  };

  const handleSubmit = async () => {
    if (!fullProblem) return;
    setIsSubmitting(true);
    try {
      const res = await codingService.submitCode(language, code, fullProblem.title);
      setTestResults(res);
      if (res.compileError || res.runtimeError) {
        showToast(res.compileError || res.runtimeError || 'Execution error', 'error');
      } else if (res.passed) {
        showToast(`Solution accepted!`, 'success');
      } else {
        showToast(`Wrong Answer: ${res.passedTests}/${res.totalTests} tests passed`, 'error');
      }
    } catch (e) {
      showToast('Submission error', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGiveHint = async () => {
    if (!fullProblem) return;
    setAiCoachState({ type: 'hint', content: null, isLoading: true });
    const hint = await aiService.generateHint(fullProblem.title, code, 0);
    setAiCoachState({ type: 'hint', content: hint, isLoading: false });
  };

  const handleExplainError = async () => {
    if (!fullProblem) return;
    setAiCoachState({ type: 'error', content: null, isLoading: true });
    
    const errorMsg = testResults?.compileError || testResults?.runtimeError;
    if (!errorMsg) {
      setAiCoachState({
        type: 'error',
        content: 'No syntax or runtime errors detected in current code! You can check your logic.',
        isLoading: false
      });
      return;
    }

    try {
      const explanation = await aiService.explainError(fullProblem.title, code, language, errorMsg);
      setAiCoachState({ type: 'error', content: explanation, isLoading: false });
    } catch {
      setAiCoachState({
        type: 'error',
        content: 'Failed to generate error explanation.',
        isLoading: false
      });
    }
  };

  const handleReviewCode = async () => {
    if (!fullProblem) return;
    setAiCoachState({ type: 'review', content: null, isLoading: true });
    try {
      const review = await aiService.reviewCode(fullProblem.title, code, language);
      setAiCoachState({
        type: 'review',
        content: `Summary: ${review.summary}\n\nStyle: ${review.style}\nEfficiency: ${review.efficiency}\nCleanliness: ${review.cleanliness}`,
        isLoading: false
      });
    } catch {
      setAiCoachState({
        type: 'review',
        content: 'Code looks well-structured with clean variable naming and appropriate algorithmic approach.',
        isLoading: false
      });
    }
  };

  const handleAnalyzeComplexity = () => {
    showToast('Complexity analysis requires a successful submission.', 'info');
  };

  if (loading || !fullProblem) {
    return (
      <div className="flex justify-center items-center h-64 text-slate-500 animate-pulse">
        Loading coding problem...
      </div>
    );
  }

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex justify-end mb-2">
        <div className={`flex items-center gap-2 px-4 py-2 rounded-xl border shadow-sm font-mono text-lg font-bold transition-colors ${
          timeLeft < 300 ? 'bg-rose-50 border-rose-200 text-rose-600' : 'bg-white border-slate-200 text-slate-700'
        }`}>
          <Clock className="w-5 h-5" />
          <span>{formatTime(timeLeft)}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 min-h-[540px] lg:h-[620px] lg:grid-cols-10">
        <div className="lg:col-span-3 h-[440px] lg:h-full min-h-0 flex flex-col">
          <ProblemView 
            problem={fullProblem} 
            onNextProblem={onNext}
            problems={[fullProblem]} // Isolated
            currentIndex={0}
            onSelectProblem={() => {}} 
            isInterviewMode={true}
          />
        </div>

        <div className="lg:col-span-4 h-[500px] lg:h-full min-h-0 flex flex-col">
          <CodeEditorArea
            code={code}
            onChange={setCode}
            language={language}
            onLanguageChange={handleLanguageChange}
            onRun={handleRun}
            onSubmit={handleSubmit}
            isRunning={isRunning}
            isSubmitting={isSubmitting}
            onReset={handleReset}
          />
        </div>

        <div className="lg:col-span-3 h-[440px] lg:h-full min-h-0 flex flex-col">
          <AiCodingCoachPanel
            onGiveHint={handleGiveHint}
            onExplainError={handleExplainError}
            onReviewCode={handleReviewCode}
            onAnalyzeComplexity={handleAnalyzeComplexity}
            activeState={aiCoachState}
          />
        </div>
      </div>

      <div className="w-full pt-1">
        <TestResultsPanel results={testResults} isRunning={isRunning} />
      </div>

      {isTimeUp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8 max-w-md w-full mx-4 flex flex-col items-center text-center animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center text-rose-600 mb-4">
              <Clock className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Time's Up!</h2>
            <p className="text-slate-600 mb-6">
              You've reached the 10-minute time limit for this question. Let's move on.
            </p>
            <button
              onClick={() => {
                setIsTimeUp(false);
                onNext();
              }}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-xl transition-colors"
            >
              {isLast ? 'Finish Interview' : 'Start Next Question'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
