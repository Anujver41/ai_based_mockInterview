import axios from 'axios';

const API_URL = 'http://localhost:8081/api/v1/submissions';

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

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const submitCode = async (request: SubmissionRequest): Promise<SubmissionResponse> => {
  const response = await axios.post<SubmissionResponse>(API_URL, request, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

export const getSubmissionStatus = async (id: number): Promise<SubmissionResponse> => {
  const response = await axios.get<SubmissionResponse>(`${API_URL}/${id}`, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

export const getUserSubmissions = async (userId: string): Promise<SubmissionResponse[]> => {
  const response = await axios.get<SubmissionResponse[]>(`${API_URL}/user/${userId}`, {
    headers: getAuthHeaders(),
  });
  return response.data;
};
