import axios from 'axios';
import { getGuestSessionId } from '@/lib/auth';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/';

const api = axios.create({ baseURL: BASE_URL, withCredentials: true });

api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('nexusai_token');
    const sessionId = getGuestSessionId();
    if (token) config.headers.Authorization = `Bearer ${token}`;
    if (sessionId) config.headers['x-session-id'] = sessionId;
  }
  return config;
});

api.interceptors.response.use(
  (r) => r,
  (err) => {
    if (err.response?.status === 401 && typeof window !== 'undefined') {
      localStorage.removeItem('nexusai_token');
      localStorage.removeItem('nexusai_user');
    }
    return Promise.reject(err);
  }
);

export default api;

export const authApi = {
  signup: (data: { name: string; email: string; password: string }) =>
    api.post('/auth/signup', data),
  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data),
  me: () => api.get('/auth/me'),
  refresh: () => api.post('/auth/refresh'),
};

export const modelsApi = {
  getAll: (params?: { type?: string; lab?: string; search?: string }) =>
    api.get('/models', { params }),
  getById: (id: string) => api.get(`/models/${id}`),
};

export const chatApi = {
  send: (data: {
    message: string;
    modelId: string;
    sessionId?: string;
    history?: unknown[];
    type?: 'text' | 'voice';
    audioUrl?: string;
    audioDurationMs?: number;
  }) =>
    api.post('/chat/send', data),
  getHistory: (page = 1, limit = 20) => api.get('/chat/history', { params: { page, limit } }),
  createSession: () => api.post('/chat/session'),
  deleteSession: (id: string) => api.delete(`/chat/session/${id}`),
};

export const uploadApi = {
  upload: (file: File) => {
    const fd = new FormData();
    fd.append('file', file);
    return api.post('/upload', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
  },
};

export const dashboardApi = {
  getStats: () => api.get('/dashboard/stats'),
  getHistory: (page = 1) => api.get('/dashboard/history', { params: { page } }),
  getBilling: () => api.get('/dashboard/billing'),
};

export const formsApi = {
  contact: (data: { name: string; email: string; message: string }) =>
    api.post('/forms/contact', data),
  feedback: (data: { rating: number; message: string; page: string }) =>
    api.post('/forms/feedback', data),
};
