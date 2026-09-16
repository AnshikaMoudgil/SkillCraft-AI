import React, { useState } from 'react';
import { PageContainer } from '../components/layout/PageContainer';
import { ProblemView } from '../components/coding/ProblemView';
import { CodeEditorArea } from '../components/coding/CodeEditorArea';
import { AiCodingCoachPanel, AiCoachActionState } from '../components/coding/AiCodingCoachPanel';
import { TestResultsPanel } from '../components/coding/TestResultsPanel';
import { mockCodingProblems } from '../data/mockQuestions';
import { codingService, TestRunResult } from '../services/codingService';
import { aiService } from '../services/aiService';
import { useToast } from '../context/ToastContext';

export const CodingSandbox: React.FC = () => {
  const [problemIndex, setProblemIndex] = useState(0);
  const currentProblem = mockCodingProblems[problemIndex];

  const [language, setLanguage] = useState('Java');
  const [code, setCode] = useState(currentProblem.starterCode[language] || currentProblem.starterCode['Java']);
  const [testResults, setTestResults] = useState<TestRunResult | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [aiCoachState, setAiCoachState] = useState<AiCoachActionState>({
    type: null,
    content: null,
    isLoading: false
  });

  const { showToast } = useToast();

  const handleLanguageChange = (newLang: string) => {
    setLanguage(newLang);
    setCode(currentProblem.starterCode[newLang] || '');
  };

  const handleNextProblem = () => {
    const nextIdx = (problemIndex + 1) % mockCodingProblems.length;
    setProblemIndex(nextIdx);
    const nextProb = mockCodingProblems[nextIdx];
    setCode(nextProb.starterCode[language] || nextProb.starterCode['Java']);
    setTestResults(null);
    setAiCoachState({ type: null, content: null, isLoading: false });
    showToast(`Switched to problem: ${nextProb.title}`, 'info');
  };

  const handleReset = () => {
    setCode(currentProblem.starterCode[language] || '');
    showToast('Code reset to default starter template', 'info');
  };

  const handleRun = async () => {
    setIsRunning(true);
    try {
      const res = await codingService.runCode(language, code, currentProblem.title);
      setTestResults(res);
      showToast('All 3 test cases passed!', 'success');
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
      showToast(`Solution accepted! Faster than ${res.percentileScore}% of submissions.`, 'success');
    } catch (e) {
      showToast('Submission error', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // AI Coach Interactions
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
    const review = await aiService.reviewCode(currentProblem.title, code);
    setAiCoachState({
      type: 'review',
      content: `Summary: ${review.summary}\n\n• Style: ${review.style}\n• Efficiency: ${review.efficiency}\n• Cleanliness: ${review.cleanliness}`,
      isLoading: false
    });
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

  return (
    <PageContainer
      title="Technical Coding Sandbox"
      subtitle={`${currentProblem.title} (${currentProblem.difficulty})`}
    >
      <div className="space-y-6 pb-12">
        {/* Main 3-Column IDE Layout matching reference Screen 6 */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 min-h-[540px] lg:h-[620px]">
          {/* Left: Problem Description (4 columns) */}
          <div className="lg:col-span-4 h-[440px] lg:h-full min-h-0 flex flex-col">
            <ProblemView problem={currentProblem} onNextProblem={handleNextProblem} />
          </div>

          {/* Center: Code Editor Area (5 columns) */}
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

          {/* Right: AI Coding Coach (3 columns) */}
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

        {/* Below Editor: Test Results Panel */}
        <div className="w-full pt-1">
          <TestResultsPanel results={testResults} isRunning={isRunning} />
        </div>
      </div>
    </PageContainer>
  );
};
