import { readStore, writeStore } from './storage';

export const GUEST_ID = 'guest';

export function getSessionUserId(): string {
  return readStore<string>('session', GUEST_ID);
}

export function setSessionUserId(userId: string): void {
  writeStore('session', userId);
}
