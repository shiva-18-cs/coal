import axios from 'axios';
import { LoginCredentials, AuthResponse, DashboardStats, Document, ExtractedInfo, Difference } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authService = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
};

export const dashboardService = {
  getStats: async (): Promise<DashboardStats> => {
    const response = await api.get('/dashboard');
    return response.data;
  }
};

export const documentService = {
  getDocuments: async (): Promise<Document[]> => {
    const response = await api.get('/documents');
    return response.data;
  }
};

export const dataService = {
  getCheckData: async (): Promise<ExtractedInfo[]> => {
    const response = await api.get('/check-data');
    return response.data;
  },
  getDifferences: async (): Promise<Difference[]> => {
    const response = await api.get('/differences');
    return response.data;
  }
};
