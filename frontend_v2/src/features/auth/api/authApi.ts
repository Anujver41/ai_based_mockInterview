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
  const response = await apiClient.post<AuthResponse>('/auth/login', data);
  return response.data;
};

export const signup = async (data: SignupData): Promise<AuthResponse> => {
  const response = await apiClient.post<AuthResponse>('/auth/register', data);
  return response.data;
};

export const getMe = async (): Promise<UserResponse> => {
  const response = await apiClient.get<UserResponse>('/auth/me');
  return response.data;
};
