import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8081/api/v1';

export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor to add JWT token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor for global error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Check if unauthorized and token is invalid/expired
    if (error.response && error.response.status === 401) {
      // Dispatch logout or clear storage
      localStorage.removeItem('token');
      // window.location.href = '/login'; // Alternatively, trigger a global event
    }
    return Promise.reject(error);
  }
);

export default apiClient;
