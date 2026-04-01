'use client';
import { useState, useEffect, useCallback } from 'react';
import { AuthState, User } from '@/types';
import { getAuthState, setAuthToken, clearAuth, createGuestSession, clearGuestSession } from '@/lib/auth';
import { authApi } from '@/lib/api';

export function useAuth() {
  const [auth, setAuth] = useState<AuthState>({
    user: null, token: null, isAuthenticated: false, isGuest: false, sessionId: null, sessionExpiry: null,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setAuth(getAuthState());
    setLoading(false);
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
    clearAuth();
    setAuth({ user: null, token: null, isAuthenticated: false, isGuest: false, sessionId: null, sessionExpiry: null });
  }, []);

  const startGuestSession = useCallback(() => {
    const id = createGuestSession();
    const expiry = Date.now() + 3 * 60 * 60 * 1000;
    setAuth(prev => ({ ...prev, isGuest: true, sessionId: id, sessionExpiry: expiry }));
    return id;
  }, []);

  const endGuestSession = useCallback(() => {
    clearGuestSession();
    setAuth(prev => ({ ...prev, isGuest: false, sessionId: null, sessionExpiry: null }));
  }, []);

  return { auth, loading, login, signup, logout, startGuestSession, endGuestSession };
}
