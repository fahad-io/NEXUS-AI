'use client';
import { useState, useEffect, useCallback } from 'react';
import { AuthState } from '@/types';
import {
  getAuthState,
  hasStoredAuthSessionHint,
  setAuthToken,
  clearAuth,
  createGuestSession,
  clearGuestSession,
  subscribeToAuthChanges,
} from '@/lib/auth';
import { authApi, refreshAuthSession } from '@/lib/api';

export function useAuth() {
  const [auth, setAuth] = useState<AuthState>({
    user: null, token: null, isAuthenticated: false, isGuest: false, sessionId: null, sessionExpiry: null,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const syncAuth = () => {
      if (!active) return;
      setAuth(getAuthState());
    };

    const initialize = async () => {
      const initialAuth = getAuthState();
      if (active) setAuth(initialAuth);

      if (!initialAuth.isAuthenticated && hasStoredAuthSessionHint()) {
        try {
          await refreshAuthSession();
        } catch {
          // A missing/expired refresh cookie can happen after the browser kept stale state.
        }
      }

      syncAuth();
      if (active) setLoading(false);
    };

    const unsubscribe = subscribeToAuthChanges(syncAuth);
    void initialize();

    return () => {
      active = false;
      unsubscribe();
    };
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const res = await authApi.login({ email, password });
    const { access_token, user } = res.data;
    setAuthToken(access_token, user);
    setAuth({ user, token: access_token, isAuthenticated: true, isGuest: false, sessionId: null, sessionExpiry: null });
    return user;
  }, []);

  const signup = useCallback(async (name: string, email: string, password: string) => {
    const res = await authApi.signup({ name, email, password });
    const { access_token, user } = res.data;
    setAuthToken(access_token, user);
    setAuth({ user, token: access_token, isAuthenticated: true, isGuest: false, sessionId: null, sessionExpiry: null });
    return user;
  }, []);

  const logout = useCallback(() => {
    void authApi.logout().catch(() => undefined);
    clearAuth();
    setAuth(getAuthState());
  }, []);

  const startGuestSession = useCallback(() => {
    const id = createGuestSession();
    setAuth(getAuthState());
    return id;
  }, []);

  const endGuestSession = useCallback(() => {
    clearGuestSession();
    setAuth(getAuthState());
  }, []);

  return { auth, loading, login, signup, logout, startGuestSession, endGuestSession };
}
