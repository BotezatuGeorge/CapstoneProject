const PREFIX = 'bookworm:v2:';

export function readStore<T>(key: string, fallback: T): T {
  const raw = localStorage.getItem(PREFIX + key);
  return raw === null ? fallback : (JSON.parse(raw) as T);
}

export function writeStore<T>(key: string, value: T): void {
  localStorage.setItem(PREFIX + key, JSON.stringify(value));
}

export function hasStore(key: string): boolean {
  return localStorage.getItem(PREFIX + key) !== null;
}

/** Removes every key owned by the mock backend, restoring the seeded demo state. */
export function resetStore(): void {
  Object.keys(localStorage)
    .filter((key) => key.startsWith(PREFIX))
    .forEach((key) => localStorage.removeItem(key));
}
