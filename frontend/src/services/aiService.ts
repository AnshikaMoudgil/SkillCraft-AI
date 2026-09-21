/**
 * AI Service
 * 
 * Powered by Microsoft Foundry & Azure AI Agent Service via FastAPI backend.
 * Features automated local fallback for development resiliency.
 */

import { apiClient } from '../lib/apiClient';

export interface AiEvaluationResponse {
  score: number;
  feedback: string;
  strengths: string[];
  improvements: string[];
}

export const aiService = {
  /**
   * Generates a contextual hint for coding problems via Microsoft Foundry Code Coach
   */
  async generateHint(problemTitle: string, userCode: string, hintIndex: number = 0): Promise<string> {
    try {
      const res = await apiClient.post<{ hint: string }>('/coding/hint', {
        problemTitle,
        userCode,
        hintIndex,
      });
      return res?.hint || 'No hint generated.';
    } catch (e) {
      console.error('[aiService] Backend unreachable:', e);
      throw e;
    }
  },

  /**
   * AI Code Review via Microsoft Foundry Agent Service
   */
  async reviewCode(problemTitle: string, code: string): Promise<{
    summary: string;
    style: string;
    efficiency: string;
    cleanliness: string;
  }> {
    try {
      const res = await apiClient.post<{
        summary: string;
        style: string;
        efficiency: string;
        cleanliness: string;
      }>('/coding/review', {
        problemTitle,
        code,
        language: 'javascript',
      });
      return res;
    } catch (e) {
      console.error('[aiService] Backend review error:', e);
      throw e;
    }
  },

  /**
   * Analyze algorithmic complexity via Microsoft Foundry
   */
  async analyzeComplexity(code: string): Promise<{
    timeComplexity: string;
    spaceComplexity: string;
    breakdown: string;
  }> {
    try {
      const res = await apiClient.post<{
        timeComplexity: string;
        spaceComplexity: string;
        breakdown: string;
      }>('/coding/complexity', {
        code,
        language: 'javascript',
      });
      return res;
    } catch (e) {
      console.error('[aiService] Backend complexity error:', e);
      throw e;
    }
  },

  /**
   * Evaluate candidate interview answer via Adaptive Interviewer Foundry Agent
   */
  async evaluateCandidateAnswer(question: string, answer: string): Promise<{
    feedback: string;
    followUp: string;
    score: number;
  }> {
    try {
      const res = await apiClient.post<{
        feedback: string;
        followUp: string;
        score: number;
      }>('/interview/respond', {
        sessionId: 'session-live',
        question,
        answer,
        topic: 'System Design',
      });
      return res;
    } catch (e) {
      console.error('[aiService] Backend interview evaluation error:', e);
      throw e;
    }
  }
};
