'use client';

import { ChatSession } from '@/types';
import { getCachedValue, removeCachedValue, setCachedValue } from '@/lib/cache';

const USER_CHAT_CACHE_TTL_MS = 24 * 60 * 60 * 1000;

function getUserSessionsKey(userId: string) {
  return `nexusai_chat_sessions_user_${userId}`;
}

function getGuestSessionKey(sessionId: string) {
  return `nexusai_guest_chat_session_${sessionId}`;
}

function getUserActiveSessionKey(userId: string) {
  return `nexusai_active_chat_session_user_${userId}`;
}

function getGuestActiveSessionKey(sessionId: string) {
  return `nexusai_active_chat_session_guest_${sessionId}`;
}

export function getCachedUserChatSessions(userId: string) {
  return getCachedValue<ChatSession[]>(getUserSessionsKey(userId)) ?? [];
}

export function setCachedUserChatSessions(userId: string, sessions: ChatSession[]) {
  setCachedValue(getUserSessionsKey(userId), sessions, { ttlMs: USER_CHAT_CACHE_TTL_MS });
}

export function getCachedGuestChatSession(sessionId: string) {
  return getCachedValue<ChatSession>(getGuestSessionKey(sessionId), 'session');
}

export function setCachedGuestChatSession(
  sessionId: string,
  session: ChatSession,
  ttlMs: number,
) {
  setCachedValue(getGuestSessionKey(sessionId), session, { scope: 'session', ttlMs });
}

export function clearCachedGuestChatSession(sessionId: string) {
  removeCachedValue(getGuestSessionKey(sessionId), 'session');
  removeCachedValue(getGuestActiveSessionKey(sessionId), 'session');
}

export function getCachedActiveUserSessionId(userId: string) {
  return getCachedValue<string>(getUserActiveSessionKey(userId));
}

export function setCachedActiveUserSessionId(userId: string, sessionId: string | null) {
  if (!sessionId) {
    removeCachedValue(getUserActiveSessionKey(userId));
    return;
  }
  setCachedValue(getUserActiveSessionKey(userId), sessionId, { ttlMs: USER_CHAT_CACHE_TTL_MS });
}

export function getCachedActiveGuestSessionId(sessionId: string) {
  return getCachedValue<string>(getGuestActiveSessionKey(sessionId), 'session');
}

export function setCachedActiveGuestSessionId(sessionId: string, activeSessionId: string | null, ttlMs: number) {
  if (!activeSessionId) {
    removeCachedValue(getGuestActiveSessionKey(sessionId), 'session');
    return;
  }
  setCachedValue(getGuestActiveSessionKey(sessionId), activeSessionId, { scope: 'session', ttlMs });
}

export function upsertChatSession(sessions: ChatSession[], incoming: ChatSession) {
  const next = [...sessions];
  const existingIndex = next.findIndex(session => session.id === incoming.id);
  if (existingIndex >= 0) next[existingIndex] = incoming;
  else next.unshift(incoming);

  return next.sort((a, b) => {
    const aTime = new Date(a.updatedAt ?? a.createdAt).getTime();
    const bTime = new Date(b.updatedAt ?? b.createdAt).getTime();
    return bTime - aTime;
  });
}
