import type { User } from '../types';
import { emptyCart, getStoredCart, getUser, getUsers, saveStoredCart } from './db';
import { LATENCY, respond } from './mock';
import { GUEST_ID, getSessionUserId, setSessionUserId } from './session';
import { resetStore } from './storage';

/** The signed-in user, or the guest when the stored session no longer resolves. */
export function currentUser(): User {
  const user = getUser(getSessionUserId()) ?? getUser(GUEST_ID);
  if (!user) throw new Error('Seed data is missing the guest user');
  return user;
}

/** Moves a guest's basket into the customer's basket on sign-in, like a real storefront. */
function mergeGuestCart(targetUserId: string): void {
  const guest = getStoredCart(GUEST_ID);
  if (guest.lines.length === 0) return;
  const target = getStoredCart(targetUserId);
  for (const line of guest.lines) {
    const existing = target.lines.find((l) => l.bookId === line.bookId);
    if (existing) existing.quantity += line.quantity;
    else target.lines.push({ ...line });
  }
  saveStoredCart(targetUserId, target);
  saveStoredCart(GUEST_ID, emptyCart());
}

export const memberService = {
  getCurrentUser: (): Promise<User> => respond(LATENCY.read, currentUser),

  listPersonas: (): Promise<User[]> => respond(LATENCY.read, getUsers),

  /** Persona Switcher: stands in for login/logout without OAuth, JWT or passwords. */
  switchPersona: (userId: string): Promise<User> =>
    respond(LATENCY.write, () => {
      const next = getUser(userId);
      if (!next) throw new Error(`Unknown persona: ${userId}`);
      if (getSessionUserId() === GUEST_ID && next.id !== GUEST_ID) mergeGuestCart(next.id);
      setSessionUserId(next.id);
      return next;
    }),

  /** Clears every mock record, restoring the seeded demo data. */
  resetDemo: (): Promise<void> =>
    respond(LATENCY.write, () => {
      resetStore();
    }),
};
