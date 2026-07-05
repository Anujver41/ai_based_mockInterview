import apiClient from '@/api/axios';

const INTERVIEWS = '/interviews';

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

export const startInterview = async (request: StartInterviewRequest): Promise<InterviewSessionResponse> => {
  const response = await apiClient.post<InterviewSessionResponse>(`${INTERVIEWS}/start`, request);
  return response.data;
};

export const sendChatMessage = async (sessionId: string, content: string): Promise<InterviewMessageResponse> => {
  const response = await apiClient.post<InterviewMessageResponse>(`${INTERVIEWS}/${sessionId}/chat`, { content });
  return response.data;
};

export const getUserSessions = async (): Promise<InterviewSessionResponse[]> => {
  const response = await apiClient.get<InterviewSessionResponse[]>(INTERVIEWS);
  return response.data;
};

export const getSessionMessages = async (sessionId: string): Promise<InterviewMessageResponse[]> => {
  const response = await apiClient.get<InterviewMessageResponse[]>(`${INTERVIEWS}/${sessionId}/messages`);
  return response.data;
};

export const endInterview = async (sessionId: string): Promise<InterviewSessionResponse> => {
  const response = await apiClient.put<InterviewSessionResponse>(`${INTERVIEWS}/${sessionId}/end`, null);
  return response.data;
};
