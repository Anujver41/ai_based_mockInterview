import apiClient from '@/api/axios';

const AI_REVIEW = '/ai/review';

export interface CodeReviewRequest {
  code: string;
  language: string;
  problemDescription?: string;
}

export interface CodeReviewResponse {
  timeComplexity: string;
  spaceComplexity: string;
  qualityFeedback: string[];
  optimizationSuggestions: string[];
  overallScore: string;
}

export const reviewCode = async (request: CodeReviewRequest): Promise<CodeReviewResponse> => {
  const response = await apiClient.post<CodeReviewResponse>(AI_REVIEW, request);
  return response.data;
};
