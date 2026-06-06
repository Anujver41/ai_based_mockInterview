import apiClient from './axios';
import axios from 'axios';

export interface GithubProfileResponse {
  login: string;
  name: string | null;
  avatar_url: string;
  bio: string | null;
  public_repos: number;
  followers: number;
  following: number;
  html_url: string;
  location: string | null;
  company: string | null;
}

export interface GithubAnalysisResponse {
  username: string;
  totalPublicRepos: number;
  techStackUsage: Record<string, number>;
  commitActivitySummary: string;
  aiInsights: string;
  contributions: Record<string, number>;
}

export const fetchGithubProfile = async (username: string): Promise<GithubProfileResponse> => {
  const response = await axios.get<GithubProfileResponse>(`https://api.github.com/users/${username}`);
  return response.data;
};

export const analyzeGithubProfile = async (username: string): Promise<GithubAnalysisResponse> => {
  const response = await apiClient.get<GithubAnalysisResponse>(`/github/analyze/${username}`);
  return response.data;
};
