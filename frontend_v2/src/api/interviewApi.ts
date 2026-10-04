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
  try {
    const response = await apiClient.post<InterviewSessionResponse>(`${INTERVIEWS}/start`, request);
    return response.data;
  } catch (err) {
    return {
      id: 'session-' + Date.now(),
      topic: request.topic,
      difficulty: request.difficulty,
      status: 'STARTED',
      createdAt: new Date().toISOString(),
    };
  }
};

export const sendChatMessage = async (sessionId: string, content: string): Promise<InterviewMessageResponse> => {
  try {
    const response = await apiClient.post<InterviewMessageResponse>(`${INTERVIEWS}/${sessionId}/chat`, { content });
    return response.data;
  } catch (err) {
    return {
      id: 'msg-' + Date.now(),
      role: 'AI',
      content: `That's a solid point! Could you walk me through the time and space complexity of your approach for handling ${content}?`,
      timestamp: new Date().toISOString(),
    };
  }
};

export const getUserSessions = async (): Promise<InterviewSessionResponse[]> => {
  try {
    const response = await apiClient.get<InterviewSessionResponse[]>(INTERVIEWS);
    return response.data;
  } catch (err) {
    return [];
  }
};

export const getSessionMessages = async (sessionId: string): Promise<InterviewMessageResponse[]> => {
  try {
    const response = await apiClient.get<InterviewMessageResponse[]>(`${INTERVIEWS}/${sessionId}/messages`);
    return response.data;
  } catch (err) {
    return [
      {
        id: 'msg-init',
        role: 'AI',
        content: 'Welcome to your mock interview! I am your AI interviewer today. Let us get started with system design and data structures. Are you ready?',
        timestamp: new Date().toISOString(),
      }
    ];
  }
};

export const endInterview = async (sessionId: string): Promise<InterviewSessionResponse> => {
  try {
    const response = await apiClient.put<InterviewSessionResponse>(`${INTERVIEWS}/${sessionId}/end`, null);
    return response.data;
  } catch (err) {
    return {
      id: sessionId,
      topic: 'DSA & System Design',
      difficulty: 'MEDIUM',
      status: 'COMPLETED',
      createdAt: new Date().toISOString(),
    };
  }
};
