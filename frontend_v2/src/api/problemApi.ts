import axios from 'axios';

const API_URL = 'http://localhost:8081/api/v1/problems';

export interface TestCase {
  input: string;
  expectedOutput: string;
  isHidden: boolean;
}

export interface Problem {
  id: string;
  title: string;
  description: string;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  tags: string[];
  constraints: string[];
  testCases: TestCase[];
}

export interface ProblemCreateRequest {
  title: string;
  description: string;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  tags: string[];
  constraints: string[];
  testCases: TestCase[];
}

export interface Page<T> {
  content: T[];
  pageable: any;
  totalElements: number;
  totalPages: number;
  last: boolean;
  size: number;
  number: number;
  sort: any;
  numberOfElements: number;
  first: boolean;
  empty: boolean;
}

export const getProblems = async (page: number = 0, size: number = 10, sortBy: string = 'createdAt', direction: string = 'DESC'): Promise<Page<Problem>> => {
  const token = localStorage.getItem('token');
  const headers = token ? { Authorization: `Bearer ${token}` } : {};
  const response = await axios.get<Page<Problem>>(API_URL, {
    params: { page, size, sortBy, direction },
    headers
  });
  return response.data;
};

export const getProblemById = async (id: string): Promise<Problem> => {
  const token = localStorage.getItem('token');
  const headers = token ? { Authorization: `Bearer ${token}` } : {};
  const response = await axios.get<Problem>(`${API_URL}/${id}`, { headers });
  return response.data;
};

export const createProblem = async (problem: ProblemCreateRequest): Promise<Problem> => {
  const token = localStorage.getItem('token');
  const headers = token ? { Authorization: `Bearer ${token}` } : {};
  const response = await axios.post<Problem>(API_URL, problem, { headers });
  return response.data;
};
