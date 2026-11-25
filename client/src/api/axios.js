import axios from 'axios';

export const TOKEN_STORAGE_KEY = 'blogsphere_token';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(TOKEN_STORAGE_KEY);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const getErrorMessage = (error, fallback = 'Something went wrong. Please try again.') => {
  if (error?.response?.data?.message) {
    return error.response.data.message;
  }
  if (error?.message === 'Network Error') {
    return 'Unable to reach the server. Please check your connection and try again.';
  }
  return error?.message || fallback;
};

export default api;
