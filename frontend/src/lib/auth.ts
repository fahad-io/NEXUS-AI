import { AuthState, User } from '@/types';
import { v4 as uuidv4 } from 'uuid';
import { getCachedValue, removeCachedValue, setCachedValue } from '@/lib/cache';

const GUEST_SESSION_DURATION = 3 * 60 * 60 * 1000;
const GUEST_SESSION_CACHE_KEY = 'nexusai_guest_session';
const LEGACY_GUEST_ID_KEY = 'nexusai_session_id';
const LEGACY_GUEST_EXPIRY_KEY = 'nexusai_session_expiry';

interface GuestSessionCache {
  id: string;
  expiresAt: number;
}

function readGuestSession(): GuestSessionCache | null {
  const cached = getCachedValue<GuestSessionCache>(GUEST_SESSION_CACHE_KEY, 'session');
  if (cached) return cached;

  if (typeof window === 'undefined') return null;

  const legacyId = localStorage.getItem(LEGACY_GUEST_ID_KEY);
  const legacyExpiry = localStorage.getItem(LEGACY_GUEST_EXPIRY_KEY);
  if (!legacyId || !legacyExpiry) return null;

  const expiresAt = Number(legacyExpiry);
  if (!expiresAt || Date.now() >= expiresAt) {
    localStorage.removeItem(LEGACY_GUEST_ID_KEY);
    localStorage.removeItem(LEGACY_GUEST_EXPIRY_KEY);
    return null;
  }

  const migrated = { id: legacyId, expiresAt };
  setCachedValue(GUEST_SESSION_CACHE_KEY, migrated, {
    scope: 'session',
    ttlMs: Math.max(expiresAt - Date.now(), 1),
  });
  localStorage.removeItem(LEGACY_GUEST_ID_KEY);
  localStorage.removeItem(LEGACY_GUEST_EXPIRY_KEY);
  return migrated;
}

export function getGuestSessionId(): string | null {
  return readGuestSession()?.id ?? null;
}

export function getAuthState(): AuthState {
  if (typeof window === 'undefined') {
    return { user: null, token: null, isAuthenticated: false, isGuest: false, sessionId: null, sessionExpiry: null };
  }

  const token = localStorage.getItem('nexusai_token');
  const userStr = localStorage.getItem('nexusai_user');
  const guestSession = readGuestSession();

  if (token && userStr) {
    try {
      const user: User = JSON.parse(userStr);
      return {
        user,
        token,
        isAuthenticated: true,
        isGuest: false,
        sessionId: null,
        sessionExpiry: null,
      };
    } catch {
      localStorage.removeItem('nexusai_user');
      localStorage.removeItem('nexusai_token');
    }
  }

  if (guestSession) {
    return {
      user: null,
      token: null,
      isAuthenticated: false,
      isGuest: true,
      sessionId: guestSession.id,
      sessionExpiry: guestSession.expiresAt,
    };
  }

  return { user: null, token: null, isAuthenticated: false, isGuest: false, sessionId: null, sessionExpiry: null };
}

export function createGuestSession(): string {
  const id = uuidv4();
  const expiresAt = Date.now() + GUEST_SESSION_DURATION;
  setCachedValue(
    GUEST_SESSION_CACHE_KEY,
    { id, expiresAt },
    { scope: 'session', ttlMs: GUEST_SESSION_DURATION },
  );
  return id;
}

export function clearGuestSession() {
  removeCachedValue(GUEST_SESSION_CACHE_KEY, 'session');
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(LEGACY_GUEST_ID_KEY);
  window.localStorage.removeItem(LEGACY_GUEST_EXPIRY_KEY);
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
