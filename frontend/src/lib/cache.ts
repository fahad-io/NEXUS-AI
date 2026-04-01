'use client';

type CacheScope = 'local' | 'session';

interface CacheEntry<T> {
  value: T;
  expiresAt: number | null;
  savedAt: number;
}

function getStorage(scope: CacheScope) {
  if (typeof window === 'undefined') return null;
  return scope === 'session' ? window.sessionStorage : window.localStorage;
}

export function getCachedValue<T>(key: string, scope: CacheScope = 'local'): T | null {
  const storage = getStorage(scope);
  if (!storage) return null;

  const raw = storage.getItem(key);
  if (!raw) return null;

  try {
    const entry = JSON.parse(raw) as CacheEntry<T>;
    if (entry.expiresAt && Date.now() > entry.expiresAt) {
      storage.removeItem(key);
      return null;
    }
    return entry.value;
  } catch {
    storage.removeItem(key);
    return null;
  }
}

export function setCachedValue<T>(
  key: string,
  value: T,
  options?: { scope?: CacheScope; ttlMs?: number },
) {
  const scope = options?.scope ?? 'local';
  const storage = getStorage(scope);
  if (!storage) return;

  const entry: CacheEntry<T> = {
    value,
    expiresAt: options?.ttlMs ? Date.now() + options.ttlMs : null,
    savedAt: Date.now(),
  };

  storage.setItem(key, JSON.stringify(entry));
}

export function removeCachedValue(key: string, scope: CacheScope = 'local') {
  const storage = getStorage(scope);
  storage?.removeItem(key);
}
