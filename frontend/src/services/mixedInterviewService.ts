import { apiClient } from '../lib/apiClient';

export interface MixedSessionConfig {
  role: string;
  difficulty: string;
  numQuestions: number;
}

export interface McqOption {
  id: string;
  text: string;
}

export interface MixedQuestion {
  id: string;
  type: 'mcq' | 'technical' | 'coding' | 'voice';
  category?: string;
  
  // MCQ specific
  question?: string;
  options?: McqOption[];
  
  // Technical specific (also uses 'question')
  expected_key_points?: string[];
  
  // Coding specific
  problem_id?: string;
  title?: string;
  difficulty?: string;
  starter_code?: Record<string, string>;
}

export interface StartSessionResponse {
  session_id: string;
  questions: MixedQuestion[];
}

export interface EvaluateResponse {
  is_correct?: boolean; // for MCQ
  correct_option_id?: string;
  explanation?: string;
  
  score?: number; // for technical
  feedback?: string;
  expected_points?: string[];
  
  status?: string;
}

export interface FinishSessionResponse {
  session_id: string;
  final_score: number;
  breakdown: Record<string, number>;
}

class MixedInterviewService {
  async startSession(config: MixedSessionConfig): Promise<StartSessionResponse> {
    const response = await apiClient.post<StartSessionResponse>('/mixed/start', {
      role: config.role,
      difficulty: config.difficulty,
      num_questions: config.numQuestions
    });
    return response;
  }

  async evaluateAnswer(sessionId: string, questionId: string, answer: string): Promise<EvaluateResponse> {
    const response = await apiClient.post<EvaluateResponse>('/mixed/evaluate', {
      session_id: sessionId,
      question_id: questionId,
      answer
    });
    return response;
  }

  async finishSession(sessionId: string): Promise<FinishSessionResponse> {
    const response = await apiClient.post<FinishSessionResponse>(`/mixed/finish?session_id=${sessionId}`, {});
    return response;
  }
}

export const mixedInterviewService = new MixedInterviewService();
