import axios from 'axios';

let BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8081/api/v1';
if (BASE_URL && !BASE_URL.endsWith('/api/v1') && !BASE_URL.endsWith('/api/v1/')) {
  BASE_URL = BASE_URL.replace(/\/$/, '') + '/api/v1';
}

export const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 30000, // 30 second timeout to accommodate production cold starts (Render/Railway/etc.)
  headers: {
    'Content-Type': 'application/json',
  },
});

// Non-blocking background ping to wake up sleeping production servers on app load
export const prewarmBackend = () => {
  if (typeof window !== 'undefined' && BASE_URL) {
    fetch(`${BASE_URL}/auth/me`, { method: 'GET' }).catch(() => {
      // Intentionally silent: this is purely to trigger server spin-up
    });
  }
};

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
