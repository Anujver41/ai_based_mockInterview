import apiClient from '@/api/axios';
import { LoginData, SignupData } from '../schemas/authSchemas';

interface AuthResponse {
  token: string;
  email: string;
  role: string;
  id: string;
}

export interface UserResponse {
  id: string;
  email: string;
  role: string;
}

export const login = async (data: LoginData): Promise<AuthResponse> => {
  try {
    const response = await apiClient.post<AuthResponse>('/auth/login', data);
    return response.data;
  } catch (error: any) {
    // If backend returns a clear HTTP status (like 401 Unauthorized or 400 Bad Request), rethrow
    if (error.response && (error.response.status === 401 || error.response.status === 400)) {
      throw error;
    }
    // If backend is unreachable (CORS / Network Error / 404 on Vercel deployment), log in with demo account
    console.warn('Backend API unreachable. Initializing demo session.');
    return {
      token: 'demo-jwt-token-' + Date.now(),
      email: data.email,
      role: 'ADMIN',
      id: 'user-demo-1',
    };
  }
};

export const signup = async (data: SignupData): Promise<AuthResponse> => {
  try {
    const response = await apiClient.post<AuthResponse>('/auth/register', data);
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.status === 400) {
      throw error;
    }
    console.warn('Backend API unreachable. Creating demo account.');
    return {
      token: 'demo-jwt-token-' + Date.now(),
      email: data.email,
      role: 'USER',
      id: 'user-demo-1',
    };
  }
};

export const getMe = async (): Promise<UserResponse> => {
  try {
    const response = await apiClient.get<UserResponse>('/auth/me');
    return response.data;
  } catch {
    return {
      id: 'user-demo-1',
      email: 'jatanujverma@gmail.com',
      role: 'ADMIN',
    };
  }
};
