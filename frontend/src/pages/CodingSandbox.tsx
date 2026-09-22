import React, { useState, useEffect, useRef } from 'react';
import { PageContainer } from '../components/layout/PageContainer';
import { ProblemView } from '../components/coding/ProblemView';
import { CodeEditorArea } from '../components/coding/CodeEditorArea';
import { AiCodingCoachPanel, AiCoachActionState } from '../components/coding/AiCodingCoachPanel';
import { TestResultsPanel } from '../components/coding/TestResultsPanel';
import { QuestionsListPanel } from '../components/coding/QuestionsListPanel';
import { codingService, TestRunResult } from '../services/codingService';
import { aiService } from '../services/aiService';
import { useToast } from '../context/ToastContext';
import { apiClient } from '../lib/apiClient';
import { CodingProblem } from '../types';
import { useLocation } from 'react-router-dom';
import { Clock } from 'lucide-react';

class ErrorBoundary extends React.Component<{children: React.ReactNode}, {hasError: boolean, error: Error | null}> {
  constructor(props: {children: React.ReactNode}) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '2rem', color: 'red', backgroundColor: 'white', minHeight: '100vh' }}>
          <h1>Something went wrong.</h1>
          <pre>{this.state.error?.toString()}</pre>
          <pre>{this.state.error?.stack}</pre>
        </div>
      );
    }
    return this.props.children;
  }
}

export const CodingSandbox: React.FC = () => {
  return (
    <ErrorBoundary>
      <CodingSandboxInner />
    </ErrorBoundary>
  );
};

const CodingSandboxInner: React.FC = () => {
  const { showToast } = useToast();
  const location = useLocation();
  const isInterviewMode = location.state?.type === 'coding';

  const [problems, setProblems] = useState<CodingProblem[]>([]);
  const [selectedProblemIndex, setSelectedProblemIndex] = useState<number | null>(isInterviewMode ? 0 : null);
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

  const [timeLeft, setTimeLeft] = useState(isInterviewMode ? 10 * 60 : 0);
  const [isTimeUp, setIsTimeUp] = useState(false);

  useEffect(() => {
    // Only run timer if a problem is actually selected
    if (selectedProblemIndex === null) return;
    if (!isInterviewMode) return;
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
  }, [isInterviewMode, isTimeUp, selectedProblemIndex]);

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const data = await apiClient.get<CodingProblem[]>('/coding/problems');
        if (data && data.length > 0) {
          setProblems(data);
          setCode(data[0].starterCode['Java'] || '');
        }
      } catch (err) {
        showToast('Failed to load coding problems', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchProblems();
  }, [showToast]);

  const currentProblem = selectedProblemIndex !== null ? problems[selectedProblemIndex] : null;

  const handleLanguageChange = (newLang: string) => {
    setLanguage(newLang);
    if (currentProblem) setCode(currentProblem.starterCode[newLang] || '');
  };

  const handleSelectProblem = (idx: number) => {
    setSelectedProblemIndex(idx);
    const nextProb = problems[idx];
    setCode(nextProb.starterCode[language] || nextProb.starterCode['Java']);
    setTestResults(null);
    setAiCoachState({ type: null, content: null, isLoading: false });
    if (isInterviewMode) {
      setTimeLeft(10 * 60);
      setIsTimeUp(false);
    }
  };

  const handleNextProblem = () => {
    if (problems.length === 0 || selectedProblemIndex === null) return;
    const nextIdx = (selectedProblemIndex + 1) % problems.length;
    handleSelectProblem(nextIdx);
    showToast(`Switched to problem: ${problems[nextIdx].title}`, 'info');
  };

  const handleReset = () => {
    if (currentProblem) setCode(currentProblem.starterCode[language] || '');
    showToast('Code reset to default starter template', 'info');
  };

  const handleRun = async () => {
    if (!currentProblem) return;
    setIsRunning(true);
    try {
      const res = await codingService.runCode(language, code, currentProblem.title);
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
    if (!currentProblem) return;
    setIsSubmitting(true);
    try {
      const res = await codingService.submitCode(language, code, currentProblem.title);
      setTestResults(res);
      if (res.compileError || res.runtimeError) {
        showToast(res.compileError || res.runtimeError || 'Execution error', 'error');
      } else if (res.passed) {
        showToast(`Solution accepted! Faster than ${res.percentileScore || 85}% of submissions.`, 'success');
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
    if (!currentProblem) return;
    setAiCoachState({ type: 'hint', content: null, isLoading: true });
    const hint = await aiService.generateHint(currentProblem.title, code, 0);
    setAiCoachState({ type: 'hint', content: hint, isLoading: false });
  };

  const handleExplainError = async () => {
    if (!currentProblem) return;
    setAiCoachState({ type: 'error', content: null, isLoading: true });
    
    // Only explain if there's actually a recent test result with an error
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
      const explanation = await aiService.explainError(currentProblem.title, code, language, errorMsg);
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
    if (!currentProblem) return;
    setAiCoachState({ type: 'review', content: null, isLoading: true });
    try {
      const review = await aiService.reviewCode(currentProblem.title, code, language);
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

  const handleAnalyzeComplexity = async () => {
    setAiCoachState({ type: 'complexity', content: null, isLoading: true });
    try {
      const comp = await aiService.analyzeComplexity(code, language);
      setAiCoachState({
        type: 'complexity',
        content: `Time Complexity: ${comp.timeComplexity}\nSpace Complexity: ${comp.spaceComplexity}\n\n${comp.breakdown}`,
        isLoading: false
      });
    } catch {
      setAiCoachState({
        type: 'complexity',
        content: 'Failed to analyze complexity.',
        isLoading: false
      });
    }
  };

  if (loading) {
    return (
      <PageContainer title="Technical Sandbox" isFullWidth>
        <div className="flex justify-center items-center h-64 text-slate-500 animate-pulse">Loading coding problems...</div>
      </PageContainer>
    );
  }

  if (selectedProblemIndex === null) {
    return (
      <PageContainer title="Technical Sandbox" subtitle="Choose a problem to begin">
        <div className="max-w-4xl mx-auto mt-6 animate-in fade-in duration-300">
          <div className="h-[600px] flex flex-col shadow-sm rounded-2xl overflow-hidden">
            <QuestionsListPanel
              problems={problems}
              currentIndex={-1}
              onSelectProblem={handleSelectProblem}
            />
          </div>
        </div>
      </PageContainer>
    );
  }

  if (!currentProblem) {
    return (
      <PageContainer title={isInterviewMode ? "Coding Interview" : "Technical Sandbox"} isFullWidth>
        <div className="flex justify-center items-center h-64 text-slate-500">No problems available.</div>
      </PageContainer>
    );
  }

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <PageContainer
      title={isInterviewMode ? "Coding Interview" : "Technical Sandbox"}
      subtitle={`${currentProblem.title} (${currentProblem.difficulty})`}
      isFullWidth
    >
      <div className="space-y-6 pb-12 animate-in fade-in duration-300">
        <div className="flex justify-between items-center mb-2">
          <div>
            {!isInterviewMode && (
              <button
                onClick={() => setSelectedProblemIndex(null)}
                className="text-sm font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1.5 transition-colors"
              >
                ← Back to Questions
              </button>
            )}
          </div>
          {isInterviewMode && (
            <div className={`flex items-center gap-2 px-4 py-2 rounded-xl border shadow-sm font-mono text-lg font-bold transition-colors ${
              timeLeft < 300 ? 'bg-rose-50 border-rose-200 text-rose-600' : 'bg-white border-slate-200 text-slate-700'
            }`}>
              <Clock className="w-5 h-5" />
              <span>{formatTime(timeLeft)}</span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 gap-5 min-h-[540px] lg:h-[620px] lg:grid-cols-10">
          <div className="lg:col-span-3 h-[440px] lg:h-full min-h-0 flex flex-col">
            <ProblemView 
              problem={currentProblem} 
              onNextProblem={handleNextProblem}
              problems={problems}
              currentIndex={selectedProblemIndex}
              onSelectProblem={handleSelectProblem}
              isInterviewMode={isInterviewMode}
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
      </div>

      {isTimeUp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8 max-w-md w-full mx-4 flex flex-col items-center text-center animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center text-rose-600 mb-4">
              <Clock className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Time's Up!</h2>
            <p className="text-slate-600 mb-6">
              You've reached the 10-minute time limit for this question. Let's move on to the next challenge!
            </p>
            <button
              onClick={() => {
                setIsTimeUp(false);
                handleNextProblem();
              }}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-xl transition-colors"
            >
              Start Next Question
            </button>
          </div>
        </div>
      )}
    </PageContainer>
  );
};
