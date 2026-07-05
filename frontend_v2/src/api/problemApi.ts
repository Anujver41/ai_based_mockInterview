import apiClient from '@/api/axios';

const PROBLEMS = '/problems';

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
  const response = await apiClient.get<Page<Problem>>(PROBLEMS, {
    params: { page, size, sortBy, direction },
  });
  return response.data;
};

export const getProblemById = async (id: string): Promise<Problem> => {
  const response = await apiClient.get<Problem>(`${PROBLEMS}/${id}`);
  return response.data;
};

export const createProblem = async (problem: ProblemCreateRequest): Promise<Problem> => {
  const response = await apiClient.post<Problem>(PROBLEMS, problem);
  return response.data;
};
