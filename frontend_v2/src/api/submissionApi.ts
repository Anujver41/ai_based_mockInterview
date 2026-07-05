import apiClient from '@/api/axios';

const SUBMISSIONS = '/submissions';

export type SubmissionStatus = 'PENDING' | 'RUNNING' | 'PASSED' | 'FAILED';

export interface SubmissionRequest {
  userId: string;
  problemId: string;
  code: string;
  language: string;
  isRun?: boolean;
}

export interface SubmissionResponse {
  id: number;
  userId: string;
  problemId: string;
  code: string;
  language: string;
  status: SubmissionStatus;
  errorMessage: string | null;
  isRun?: boolean;
  createdAt: string;
}

export const submitCode = async (request: SubmissionRequest): Promise<SubmissionResponse> => {
  const response = await apiClient.post<SubmissionResponse>(SUBMISSIONS, request);
  return response.data;
};

export const getSubmissionStatus = async (id: number): Promise<SubmissionResponse> => {
  const response = await apiClient.get<SubmissionResponse>(`${SUBMISSIONS}/${id}`);
  return response.data;
};

export const getUserSubmissions = async (userId: string): Promise<SubmissionResponse[]> => {
  const response = await apiClient.get<SubmissionResponse[]>(`${SUBMISSIONS}/user/${userId}`);
  return response.data;
};
