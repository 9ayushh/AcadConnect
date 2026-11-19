import axios, { AxiosError } from 'axios';
import { setupMockAdapter } from '../mocks/mockAdapter';
import { ApiError } from '../types';

const baseURL = import.meta.env.VITE_API_BASE_URL || '/api';

export const api = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Setup Mock Adapter if mock mode enabled (or fallback in dev)
setupMockAdapter(api);

// Response error handler interceptor
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ message?: string; errors?: Record<string, string> }>) => {
    const formattedError: ApiError = {
      message: error.response?.data?.message || error.message || 'An unexpected error occurred',
      statusCode: error.response?.status,
      errors: error.response?.data?.errors,
    };

    // If 401 and not on login page, can notify or redirect
    if (error.response?.status === 401 && !window.location.pathname.includes('/login')) {
      // In-memory session handles redirection
    }

    return Promise.reject(formattedError);
  }
);

export default api;
