import { ResumeData } from '../types';
import { apiClient } from '../lib/apiClient';

/**
 * Resume Service
 * 
 * Uploads resumes to Supabase Storage and indexes sections into Azure AI Search RAG
 * via FastAPI backend.
 */

export const resumeService = {
  /**
   * Upload and parse resume file using Azure Document Intelligence + Foundry
   */
  async parseResumeFile(file: File): Promise<any> {
    const formData = new FormData();
    formData.append('file', file);

    const parsed = await apiClient.upload<any>('/resume/upload', formData);
    if (!parsed || !parsed.analysis) {
      throw new Error("Invalid response from backend");
    }
    return parsed;
  },

  /**
   * Fetch previously uploaded resume from Supabase for the current user
   */
  async getLatestResume(): Promise<any> {
    const resumes = await apiClient.get<any[]>('/resume/history');
    if (resumes && resumes.length > 0) {
      return resumes[0];
    }
    return null;
  }
};
