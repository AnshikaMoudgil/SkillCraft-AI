/**
 * Coding Service
 * 
 * Handles code execution using the secure backend Judge0 integration.
 */
import { apiClient } from '../lib/apiClient';

export interface TestRunResult {
  passed: boolean;
  totalTests: number;
  passedTests: number;
  runtimeMs: number;
  memoryMb: number;
  results: {
    id: number;
    input: string;
    expected: string;
    actual: string;
    status: 'passed' | 'failed';
  }[];
  aiFeedback: string;
  compileError?: string;
  runtimeError?: string;
  percentileScore?: number;
}

export const codingService = {
  async runCode(language: string, code: string, problemTitle: string): Promise<TestRunResult> {
    const res = await apiClient.post<TestRunResult>('/coding/run', {
      language,
      code,
      problemTitle
    });
    return res;
  },

  async submitCode(language: string, code: string, problemTitle: string): Promise<TestRunResult & { percentileScore: number }> {
    const res = await apiClient.post<TestRunResult & { percentileScore: number }>('/coding/submit', {
      language,
      code,
      problemTitle
    });
    return res;
  }
};
