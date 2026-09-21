import { InterviewPlanItem } from '../types';

import { apiClient } from '../lib/apiClient';

export interface SetupConfig {
  title?: string;
  type?: string;
  role: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  focusAreas: string[];
  durationMinutes: number;
  number_of_questions?: number;
  experience_level?: string;
  programming_language?: string;
  resumeContext?: string;
}

export const interviewService = {
  /**
   * Generates a tailored interview plan based on role, difficulty, and focus areas
   */
  async generateInterviewPlan(config: SetupConfig): Promise<any> {
    const payload = {
      title: config.title || "Mock Interview",
      type: config.type || "technical",
      role: config.role,
      difficulty: config.difficulty,
      number_of_questions: config.number_of_questions || 5,
      experience_level: config.experience_level || "Fresher",
      programming_language: config.programming_language || null,
      focus_areas: config.focusAreas || [],
      resumeContext: config.resumeContext || null
    };
    return await apiClient.post('/interview/plan', payload);
  },

  /**
   * Start a new live interview session
   */
  async startInterview(config: SetupConfig): Promise<any> {
    const payload = {
      title: config.title || "Mock Interview",
      type: config.type || "technical",
      role: config.role,
      difficulty: config.difficulty,
      number_of_questions: config.number_of_questions || 5,
      experience_level: config.experience_level || "Fresher",
      programming_language: config.programming_language || null,
      focus_areas: config.focusAreas || [],
      resumeContext: config.resumeContext || null,
      generated_plan: (config as any).generated_plan || null
    };
    
    return await apiClient.post('/interview/start', payload);
  },

  /**
   * Get next dynamic question in an adaptive interview session
   */
  async respondToCandidate(sessionId: string, question: string, answer: string, topic: string): Promise<any> {
    const payload = {
      sessionId,
      question,
      answer,
      topic
    };
    return await apiClient.post('/interview/respond', payload);
  },
  
  /**
   * Conclude and evaluate the interview
   */
  async evaluateInterview(sessionId: string, transcripts: any[]): Promise<any> {
    const payload = {
      sessionId,
      transcripts
    };
    return await apiClient.post('/interview/evaluate', payload);
  },

  /**
   * Fetch final interview report
   */
  async getInterviewReport(sessionId: string): Promise<any> {
    return await apiClient.get(`/interview/report/${sessionId}`);
  },

  /**
   * Fetch interview transcripts
   */
  async getInterviewTranscripts(sessionId: string): Promise<any[]> {
    return await apiClient.get(`/interview/transcript/${sessionId}`);
  }
};
