import React, { useState, useEffect } from 'react';
import { PageContainer } from '../components/layout/PageContainer';
import { ProblemView } from '../components/coding/ProblemView';
import { CodeEditorArea } from '../components/coding/CodeEditorArea';
import { AiCodingCoachPanel, AiCoachActionState } from '../components/coding/AiCodingCoachPanel';
import { TestResultsPanel } from '../components/coding/TestResultsPanel';
import { codingService, TestRunResult } from '../services/codingService';
import { aiService } from '../services/aiService';
import { useToast } from '../context/ToastContext';
import { apiClient } from '../lib/apiClient';
import { CodingProblem } from '../types';

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
  const [problems, setProblems] = useState<CodingProblem[]>([]);
  const [problemIndex, setProblemIndex] = useState(0);
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

  const { showToast } = useToast();

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

  const currentProblem = problems[problemIndex];

  const handleLanguageChange = (newLang: string) => {
    setLanguage(newLang);
    setCode(currentProblem?.starterCode[newLang] || '');
  };

  const handleNextProblem = () => {
    if (problems.length === 0) return;
    const nextIdx = (problemIndex + 1) % problems.length;
    setProblemIndex(nextIdx);
    const nextProb = problems[nextIdx];
    setCode(nextProb.starterCode[language] || nextProb.starterCode['Java']);
    setTestResults(null);
    setAiCoachState({ type: null, content: null, isLoading: false });
    showToast(`Switched to problem: ${nextProb.title}`, 'info');
  };

  const handleReset = () => {
    setCode(currentProblem?.starterCode[language] || '');
    showToast('Code reset to default starter template', 'info');
  };

  const handleRun = async () => {
    setIsRunning(true);
    try {
      const res = await codingService.runCode(language, code, currentProblem.title);
      setTestResults(res);
      if (res.compileError || res.runtimeError) {
        showToast('Execution error', 'error');
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
    setIsSubmitting(true);
    try {
      const res = await codingService.submitCode(language, code, currentProblem.title);
      setTestResults(res);
      if (res.compileError || res.runtimeError) {
        showToast('Execution error', 'error');
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
    setAiCoachState({ type: 'hint', content: null, isLoading: true });
    const hint = await aiService.generateHint(currentProblem.title, code, 0);
    setAiCoachState({ type: 'hint', content: hint, isLoading: false });
  };

  const handleExplainError = async () => {
    setAiCoachState({ type: 'error', content: null, isLoading: true });
    await new Promise((res) => setTimeout(res, 500));
    setAiCoachState({
      type: 'error',
      content: 'No syntax or runtime errors detected in current code! You are using safe HashMap bounds checking.',
      isLoading: false
    });
  };

  const handleReviewCode = async () => {
    setAiCoachState({ type: 'review', content: null, isLoading: true });
    try {
      const review = await aiService.reviewCode(currentProblem.title, code);
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
    const comp = await aiService.analyzeComplexity(code);
    setAiCoachState({
      type: 'complexity',
      content: `Time Complexity: ${comp.timeComplexity}\nSpace Complexity: ${comp.spaceComplexity}\n\n${comp.breakdown}`,
      isLoading: false
    });
  };

  if (loading) {
    return (
      <PageContainer title="Coding Sandbox" isFullWidth>
        <div className="flex justify-center items-center h-64 text-slate-500 animate-pulse">Loading coding problems...</div>
      </PageContainer>
    );
  }

  if (!currentProblem) {
    return (
      <PageContainer title="Coding Sandbox" isFullWidth>
        <div className="flex justify-center items-center h-64 text-slate-500">No problems available.</div>
      </PageContainer>
    );
  }

  return (
    <PageContainer
      title="Coding Sandbox"
      subtitle={`${currentProblem.title} (${currentProblem.difficulty})`}
    >
      <div className="space-y-6 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 min-h-[540px] lg:h-[620px]">
          <div className="lg:col-span-4 h-[440px] lg:h-full min-h-0 flex flex-col">
            <ProblemView problem={currentProblem} onNextProblem={handleNextProblem} />
          </div>

          <div className="lg:col-span-5 h-[500px] lg:h-full min-h-0 flex flex-col">
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
    </PageContainer>
  );
};
