import axios, { AxiosInstance, AxiosResponse } from 'axios';

// API Configuration
const API_CONFIG = {
  // Free Dictionary API - no auth required
  DICTIONARY_BASE_URL: 'https://api.dictionaryapi.dev/api/v2',
  
  // Backup APIs for enhanced functionality
  WORDNIK_BASE_URL: 'https://api.wordnik.com/v4',
  WORDNIK_API_KEY: process.env.VITE_WORDNIK_API_KEY || '',
  
  // Mock backend for user management (replace with your backend)
  BACKEND_BASE_URL: process.env.VITE_API_BASE_URL || 'http://localhost:3001/api',
  
  // Request timeout
  TIMEOUT: 10000,
};

// Create axios instances
export const dictionaryApi: AxiosInstance = axios.create({
  baseURL: API_CONFIG.DICTIONARY_BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const wordnikApi: AxiosInstance = axios.create({
  baseURL: API_CONFIG.WORDNIK_BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
  params: {
    api_key: API_CONFIG.WORDNIK_API_KEY,
  },
});

export const backendApi: AxiosInstance = axios.create({
  baseURL: API_CONFIG.BACKEND_BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptors
backendApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptors
backendApi.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Generic API response handler
export const handleApiResponse = <T>(response: AxiosResponse<T>): T => {
  return response.data;
};

// Generic error handler
export const handleApiError = (error: any): never => {
  if (error.response) {
    throw new Error(error.response.data?.message || 'API request failed');
  } else if (error.request) {
    throw new Error('Network error - please check your connection');
  } else {
    throw new Error('Request failed - please try again');
  }
};

export { API_CONFIG };
