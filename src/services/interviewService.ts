import { InterviewPlanItem } from '../types';
import { mockDefaultInterviewPlan } from '../data/mockInterviews';

/**
 * Interview Service
 * 
 * Manages interview configuration, plan generation, and lifecycle.
 * 
 * TODO: Future Integration with Microsoft Foundry Agent
 * - Dynamically synthesize interview questions using candidate profile & job spec
 * - Implement state machine for real-time interview progression
 */

export interface SetupConfig {
  role: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  focusAreas: string[];
  durationMinutes: number;
}

export const interviewService = {
  /**
   * Generates a tailored interview plan based on role, difficulty, and focus areas
   */
  async generateInterviewPlan(config: SetupConfig): Promise<InterviewPlanItem[]> {
    await new Promise((res) => setTimeout(res, 850));

    // Customize topic steps based on selected focus areas
    const customizedPlan = mockDefaultInterviewPlan.map((item) => {
      if (item.step === 3 && config.focusAreas.length > 0) {
        return { ...item, title: `${config.focusAreas[0]} Core Principles`, topic: config.focusAreas[0] };
      }
      if (item.step === 6 && config.focusAreas.length > 1) {
        return { ...item, title: `${config.focusAreas[1]} Deep Dive`, topic: config.focusAreas[1] };
      }
      return item;
    });

    return customizedPlan;
  },

  /**
   * Get next dynamic question in an adaptive interview session
   */
  async getNextAdaptiveQuestion(currentQuestionIndex: number, lastAnswer: string): Promise<{
    question: string;
    topic: string;
    totalQuestions: number;
  }> {
    await new Promise((res) => setTimeout(res, 700));

    const followUps = [
      {
        question: "That's a good approach. What happens if the list has no cycle? How would the algorithm safely terminate without null pointer exceptions?",
        topic: 'Linked Lists'
      },
      {
        question: "Let us pivot to Database Systems. Can you explain the difference between Optimistic and Pessimistic Concurrency Control in high-throughput transactions?",
        topic: 'DBMS'
      },
      {
        question: "How would you handle a distributed transaction across two microservices where one fails mid-execution?",
        topic: 'System Design'
      }
    ];

    const item = followUps[currentQuestionIndex % followUps.length];
    return {
      question: item.question,
      topic: item.topic,
      totalQuestions: 9
    };
  }
};
