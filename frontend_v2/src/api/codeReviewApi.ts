import axios from 'axios';

const API_URL = 'http://localhost:8081/api/v1/ai/review';

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

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const reviewCode = async (request: CodeReviewRequest): Promise<CodeReviewResponse> => {
  const response = await axios.post<CodeReviewResponse>(API_URL, request, {
    headers: getAuthHeaders(),
  });
  return response.data;
};
