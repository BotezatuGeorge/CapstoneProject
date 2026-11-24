import { createContext, useContext } from 'react';
import type { User } from '../types';

export interface SessionContextValue {
  user: User;
  personas: User[];
  switchPersona: (userId: string) => Promise<void>;
  /** Re-reads the user (wallet balance, gift points) after a payment or order change. */
  refreshUser: () => Promise<void>;
  resetDemo: () => Promise<void>;
}

export const SessionContext = createContext<SessionContextValue | null>(null);

export function useSession(): SessionContextValue {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error('useSession must be used within SessionProvider');
  return ctx;
}
