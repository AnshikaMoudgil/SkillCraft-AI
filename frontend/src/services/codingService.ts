/**
 * Coding Service
 * 
 * Handles code execution simulation, test case verification, and submission.
 * 
 * TODO: Future Integration with Secure Sandboxed Code Runner
 * - Connect to Judge0, Azure Container Apps, or AWS Lambda sandboxed runners
 * - Stream compile logs and runtime output
 */

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
}

export const codingService = {
  async runCode(language: string, code: string, problemTitle: string): Promise<TestRunResult> {
    await new Promise((res) => setTimeout(res, 900));

    // Simulated test runner verification
    return {
      passed: true,
      totalTests: 3,
      passedTests: 3,
      runtimeMs: 12,
      memoryMb: 42,
      results: [
        { id: 1, input: 'nums = [2,7,11,15], target = 9', expected: '[0,1]', actual: '[0,1]', status: 'passed' },
        { id: 2, input: 'nums = [3,2,4], target = 6', expected: '[1,2]', actual: '[1,2]', status: 'passed' },
        { id: 3, input: 'nums = [3,3], target = 6', expected: '[0,1]', actual: '[0,1]', status: 'passed' }
      ],
      aiFeedback: 'Your approach is correct and efficient. Time Complexity: O(n) | Space Complexity: O(n)'
    };
  },

  async submitCode(language: string, code: string, problemTitle: string): Promise<TestRunResult & { percentileScore: number }> {
    await new Promise((res) => setTimeout(res, 1100));

    const isCpp = language === 'C++';
    const runtime = isCpp ? 4 : language === 'Java' ? 12 : 24;
    const memory = isCpp ? 14 : language === 'Java' ? 42 : 36;

    return {
      passed: true,
      totalTests: 3,
      passedTests: 3,
      runtimeMs: runtime,
      memoryMb: memory,
      percentileScore: isCpp ? 98.4 : 94.8,
      results: [
        { id: 1, input: 'nums = [2,7,11,15], target = 9', expected: '[0,1]', actual: '[0,1]', status: 'passed' },
        { id: 2, input: 'nums = [3,2,4], target = 6', expected: '[1,2]', actual: '[1,2]', status: 'passed' },
        { id: 3, input: 'nums = [3,3], target = 6', expected: '[0,1]', actual: '[0,1]', status: 'passed' }
      ],
      aiFeedback: `Accepted! Faster than ${isCpp ? '98.4%' : '94.8%'} of ${language} online submissions. Memory usage beats ${isCpp ? '96.2%' : '89.2%'} of submissions.`
    };
  }
};
