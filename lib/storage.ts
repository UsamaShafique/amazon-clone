/**
 * Safe JSON access to Web Storage. Everything is namespaced under
 * "shopora." and guarded so SSR and privacy modes never throw.
 */

function safeGet(storage: Storage | undefined, key: string): string | null {
  try {
    return storage ? storage.getItem(key) : null;
  } catch {
    return null;
  }
}

function safeSet(storage: Storage | undefined, key: string, value: string): void {
  try {
    storage?.setItem(key, value);
  } catch {
    // Storage full or blocked — demo data loss is acceptable.
  }
}

function safeRemove(storage: Storage | undefined, key: string): void {
  try {
    storage?.removeItem(key);
  } catch {
    // ignore
  }
}

const local = () => (typeof window === "undefined" ? undefined : window.localStorage);
const session = () => (typeof window === "undefined" ? undefined : window.sessionStorage);

export function readJSON<T>(key: string, fallback: T): T {
  const raw = safeGet(local(), key);
  if (raw === null) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function writeJSON<T>(key: string, value: T): void {
  safeSet(local(), key, JSON.stringify(value));
}

export function removeKey(key: string): void {
  safeRemove(local(), key);
}

export function readSessionJSON<T>(key: string, fallback: T): T {
  const raw = safeGet(session(), key);
  if (raw === null) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function writeSessionJSON<T>(key: string, value: T): void {
  safeSet(session(), key, JSON.stringify(value));
}

export function removeSessionKey(key: string): void {
  safeRemove(session(), key);
}
