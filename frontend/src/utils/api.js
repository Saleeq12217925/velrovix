import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('velrovix_token');

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Response Interceptor: Catch 401 Unauthorized (Expired Token)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token expired or invalid — clear state and force login
      localStorage.removeItem('velrovix_token');
      localStorage.removeItem('velrovix_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
