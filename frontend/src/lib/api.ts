import axios, { AxiosError, AxiosHeaders, InternalAxiosRequestConfig } from 'axios';
import { MessageAttachment, User } from '@/types';
import {
  clearAuth,
  getGuestSessionId,
  getStoredAuthToken,
  setAuthToken,
} from '@/lib/auth';

const rawBaseUrl = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080').replace(/\/+$/, '');
const API_BASE_URL = /\/api$/i.test(rawBaseUrl) ? rawBaseUrl : `${rawBaseUrl}/api`;
const BACKEND_BASE_URL = API_BASE_URL.replace(/\/api$/i, '');
const AUTH_ROUTES = ['/auth/login', '/auth/signup', '/auth/refresh', '/auth/logout'];

interface RefreshResponse {
  access_token: string;
  user: User;
}

interface RetryableRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

const api = axios.create({ baseURL: API_BASE_URL, withCredentials: true });
const refreshClient = axios.create({ baseURL: API_BASE_URL, withCredentials: true });

let refreshPromise: Promise<RefreshResponse | null> | null = null;

function shouldSkipRefresh(config?: RetryableRequestConfig) {
  const url = config?.url ?? '';
  return AUTH_ROUTES.some(route => url.includes(route));
}

export function resolveBackendUrl(url?: string) {
  if (!url) return '';
  if (
    url.startsWith('http://') ||
    url.startsWith('https://') ||
    url.startsWith('data:') ||
    url.startsWith('blob:')
  ) {
    return url;
  }

  return new URL(url, `${BACKEND_BASE_URL}/`).toString();
}

export async function refreshAuthSession() {
  if (typeof window === 'undefined') return null;

  if (!refreshPromise) {
    refreshPromise = refreshClient
      .post<RefreshResponse>('/auth/refresh')
      .then(response => {
        const session = response.data;
        if (!session?.access_token || !session?.user) {
          throw new Error('Refresh response was incomplete');
        }

        setAuthToken(session.access_token, session.user);
        return session;
      })
      .catch(error => {
        clearAuth();
        throw error;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }

  return refreshPromise;
}

api.interceptors.request.use((config) => {
  if (typeof window === 'undefined') return config;

  const token = getStoredAuthToken();
  const sessionId = getGuestSessionId();

  if (token) {
    const headers = AxiosHeaders.from(config.headers);
    headers.set('Authorization', `Bearer ${token}`);
    config.headers = headers;
  }

  if (sessionId && !token) {
    const headers = AxiosHeaders.from(config.headers);
    headers.set('x-session-id', sessionId);
    config.headers = headers;
  }

  return config;
});

api.interceptors.response.use(
  response => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as RetryableRequestConfig | undefined;

    if (
      typeof window === 'undefined' ||
      error.response?.status !== 401 ||
      !originalRequest ||
      originalRequest._retry ||
      shouldSkipRefresh(originalRequest) ||
      !getStoredAuthToken()
    ) {
      if (
        typeof window !== 'undefined' &&
        error.response?.status === 401 &&
        shouldSkipRefresh(originalRequest)
      ) {
        clearAuth();
      }
      return Promise.reject(error);
    }

    try {
      originalRequest._retry = true;
      const session = await refreshAuthSession();
      if (!session) return Promise.reject(error);

      const headers = AxiosHeaders.from(originalRequest.headers);
      headers.set('Authorization', `Bearer ${session.access_token}`);
      originalRequest.headers = headers;

      return api(originalRequest);
    } catch (refreshError) {
      return Promise.reject(refreshError);
    }
  },
);

export default api;

export const authApi = {
  signup: (data: { name: string; email: string; password: string }) =>
    api.post('/auth/signup', data),
  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data),
  me: () => api.get('/auth/me'),
  refresh: () => api.post('/auth/refresh'),
  logout: () => api.post('/auth/logout'),
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
    attachments?: MessageAttachment[];
  }) =>
    api.post('/chat/send', data),
  getHistory: (page = 1, limit = 20) => api.get('/chat/history', { params: { page, limit } }),
  getSession: (id: string) => api.get(`/chat/session/${id}`),
  createSession: () => api.post('/chat/session'),
  deleteSession: (id: string) => api.delete(`/chat/session/${id}`),
};

export const uploadApi = {
  upload: (file: File) => {
    const fd = new FormData();
    fd.append('file', file);
    return api.post('/upload', fd);
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
