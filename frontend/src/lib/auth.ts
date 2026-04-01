import { AuthState, User } from '@/types';
import { v4 as uuidv4 } from 'uuid';

const GUEST_SESSION_DURATION = 3 * 60 * 60 * 1000; // 3 hours

export function getAuthState(): AuthState {
  if (typeof window === 'undefined') {
    return { user: null, token: null, isAuthenticated: false, isGuest: false, sessionId: null, sessionExpiry: null };
  }
  const token = localStorage.getItem('nexusai_token');
  const userStr = localStorage.getItem('nexusai_user');
  const sessionId = localStorage.getItem('nexusai_session_id');
  const sessionExpiry = localStorage.getItem('nexusai_session_expiry');

  if (token && userStr) {
    try {
      const user: User = JSON.parse(userStr);
      return { user, token, isAuthenticated: true, isGuest: false, sessionId, sessionExpiry: null };
    } catch { /* ignore */ }
  }

  if (sessionId && sessionExpiry) {
    const expiry = parseInt(sessionExpiry, 10);
    if (Date.now() < expiry) {
      return { user: null, token: null, isAuthenticated: false, isGuest: true, sessionId, sessionExpiry: expiry };
    } else {
      clearGuestSession();
    }
  }

  return { user: null, token: null, isAuthenticated: false, isGuest: false, sessionId: null, sessionExpiry: null };
}

export function createGuestSession(): string {
  const id = uuidv4();
  const expiry = Date.now() + GUEST_SESSION_DURATION;
  if (typeof window !== 'undefined') {
    localStorage.setItem('nexusai_session_id', id);
    localStorage.setItem('nexusai_session_expiry', expiry.toString());
  }
  return id;
}

export function clearGuestSession() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('nexusai_session_id');
  localStorage.removeItem('nexusai_session_expiry');
}

export function setAuthToken(token: string, user: User) {
  if (typeof window === 'undefined') return;
  localStorage.setItem('nexusai_token', token);
  localStorage.setItem('nexusai_user', JSON.stringify(user));
  clearGuestSession();
}

export function clearAuth() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('nexusai_token');
  localStorage.removeItem('nexusai_user');
}

export function getGuestTimeRemaining(expiry: number): string {
  const ms = expiry - Date.now();
  if (ms <= 0) return 'Expired';
  const h = Math.floor(ms / 3600000);
  const m = Math.floor((ms % 3600000) / 60000);
  if (h > 0) return `${h}h ${m}m remaining`;
  return `${m}m remaining`;
}
