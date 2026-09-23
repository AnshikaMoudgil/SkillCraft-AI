import React, { useState, useEffect } from 'react';
import { PageContainer } from '../components/layout/PageContainer';
import { useLocation, useNavigate } from 'react-router-dom';
import { useToast } from '../context/ToastContext';
import { mixedInterviewService, MixedQuestion, EvaluateResponse } from '../services/mixedInterviewService';
import { McqView } from '../components/interview/McqView';
import { MixedTechnicalView } from '../components/interview/MixedTechnicalView';
import { MixedVoiceView } from '../components/interview/MixedVoiceView';
import { MixedCodingView } from '../components/interview/MixedCodingView';

export const MixedInterview: React.FC = () => {
  const { showToast } = useToast();
  const location = useLocation();
  const navigate = useNavigate();
  
  const config = location.state?.config || {
    title: 'Mixed Mock Interview',
    type: 'mixed',
    role: 'Software Engineer',
    difficulty: 'Intermediate',
    numQuestions: 5
  };

  const [loading, setLoading] = useState(true);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [questions, setQuestions] = useState<MixedQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const startSession = async () => {
      try {
        const res = await mixedInterviewService.startSession({
          role: config.role,
          difficulty: config.difficulty,
          numQuestions: config.numQuestions
        });
        setSessionId(res.session_id);
        setQuestions(res.questions);
      } catch (e) {
        showToast('Failed to start mixed session', 'error');
        navigate('/interview/report');
      } finally {
        setLoading(false);
      }
    };
    startSession();
  }, [config.role, config.difficulty, config.numQuestions, navigate, showToast]);

  const currentQuestion = questions[currentIndex];
  const isLast = currentIndex === questions.length - 1;

  const handleNext = async () => {
    if (isLast && sessionId) {
      // Finish session
      try {
        await mixedInterviewService.finishSession(sessionId);
        showToast('Mixed Interview Completed!', 'success');
        navigate(`/interview/report?sessionId=${sessionId}`);
      } catch (e) {
        showToast('Failed to finalize session', 'error');
      }
    } else {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handleSubmit = async (answer: string): Promise<EvaluateResponse> => {
    if (!sessionId || !currentQuestion) throw new Error("No active session");
    return await mixedInterviewService.evaluateAnswer(sessionId, currentQuestion.id, answer);
  };

  if (loading) {
    return (
      <PageContainer title={config.title} isFullWidth>
        <div className="flex justify-center items-center h-64 text-slate-500 animate-pulse">Initializing Mixed Environment...</div>
      </PageContainer>
    );
  }

  if (!currentQuestion) {
    return (
      <PageContainer title={config.title} isFullWidth>
        <div className="flex justify-center items-center h-64 text-slate-500">No questions generated.</div>
      </PageContainer>
    );
  }

  const renderCurrentView = () => {
    switch (currentQuestion.type) {
      case 'mcq':
        return (
          <McqView 
            key={currentQuestion.id}
            question={currentQuestion} 
            onSubmit={handleSubmit} 
            onNext={handleNext} 
            isLast={isLast} 
          />
        );
      case 'technical':
        return (
          <MixedTechnicalView 
            key={currentQuestion.id}
            question={currentQuestion} 
            onSubmit={handleSubmit} 
            onNext={handleNext} 
            isLast={isLast} 
          />
        );
      case 'voice':
        return (
          <MixedVoiceView 
            key={currentQuestion.id}
            question={currentQuestion} 
            onSubmit={handleSubmit} 
            onNext={handleNext} 
            isLast={isLast} 
          />
        );
      case 'coding':
        return (
          <MixedCodingView 
            key={currentQuestion.id}
            question={currentQuestion}
            onNext={handleNext}
            isLast={isLast}
          />
        );
      default:
        return <div>Unknown question type</div>;
    }
  };

  return (
    <PageContainer
      title={config.title}
      subtitle={`Question ${currentIndex + 1} of ${questions.length} • Mixed Session`}
      isFullWidth={currentQuestion.type === 'coding'} // Full width only for coding
    >
      <div className="py-6">
        {renderCurrentView()}
      </div>
    </PageContainer>
  );
};
