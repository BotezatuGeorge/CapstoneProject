import { useCallback, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { Spinner } from '../components/atoms';
import { memberService } from '../services';
import type { User } from '../types';
import { SessionContext } from './session';
import type { SessionContextValue } from './session';

export function SessionProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [personas, setPersonas] = useState<User[]>([]);

  const load = useCallback(async () => {
    const [current, all] = await Promise.all([memberService.getCurrentUser(), memberService.listPersonas()]);
    setUser(current);
    setPersonas(all);
  }, []);

  useEffect(() => {
    let cancelled = false;
    void Promise.all([memberService.getCurrentUser(), memberService.listPersonas()]).then(([current, all]) => {
      if (!cancelled) {
        setUser(current);
        setPersonas(all);
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const value = useMemo<SessionContextValue | null>(() => {
    if (!user) return null;
    return {
      user,
      personas,
      switchPersona: async (userId) => {
        await memberService.switchPersona(userId);
        await load();
      },
      refreshUser: load,
      resetDemo: async () => {
        await memberService.resetDemo();
        await load();
      },
    };
  }, [user, personas, load]);

  if (!value) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <Spinner size={32} />
      </div>
    );
  }
  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}
