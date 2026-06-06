import axios from 'axios';

const API_URL = 'http://localhost:8081/api/v1/interviews';

export interface StartInterviewRequest {
  topic: string;
  difficulty: string;
}

export interface ChatRequest {
  content: string;
}

export interface InterviewSessionResponse {
  id: string;
  topic: string;
  difficulty: string;
  status: 'STARTED' | 'COMPLETED' | 'ABORTED';
  createdAt: string;
}

export interface InterviewMessageResponse {
  id: string;
  role: 'USER' | 'AI' | 'SYSTEM';
  content: string;
  timestamp: string;
}

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const startInterview = async (request: StartInterviewRequest): Promise<InterviewSessionResponse> => {
  const response = await axios.post<InterviewSessionResponse>(`${API_URL}/start`, request, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

export const sendChatMessage = async (sessionId: string, content: string): Promise<InterviewMessageResponse> => {
  const response = await axios.post<InterviewMessageResponse>(`${API_URL}/${sessionId}/chat`, { content }, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

export const getUserSessions = async (): Promise<InterviewSessionResponse[]> => {
  const response = await axios.get<InterviewSessionResponse[]>(API_URL, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

export const getSessionMessages = async (sessionId: string): Promise<InterviewMessageResponse[]> => {
  const response = await axios.get<InterviewMessageResponse[]>(`${API_URL}/${sessionId}/messages`, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

export const endInterview = async (sessionId: string): Promise<InterviewSessionResponse> => {
  const response = await axios.put<InterviewSessionResponse>(`${API_URL}/${sessionId}/end`, null, {
    headers: getAuthHeaders(),
  });
  return response.data;
};
