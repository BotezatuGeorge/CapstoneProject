import type { ReactElement, ReactNode } from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { vi } from 'vitest';
import { CartContext, type CartContextValue } from '../context/cart';
import { SessionContext, type SessionContextValue } from '../context/session';
import { makeQuote, makeUser } from './fixtures';

export function makeCartContext(overrides: Partial<CartContextValue> = {}): CartContextValue {
  return {
    items: [],
    coupon: null,
    quote: makeQuote(),
    totalItems: 0,
    loaded: true,
    busy: false,
    addToCart: vi.fn().mockResolvedValue(undefined),
    setQuantity: vi.fn().mockResolvedValue(undefined),
    removeFromCart: vi.fn().mockResolvedValue(undefined),
    applyCoupon: vi.fn().mockResolvedValue(undefined),
    removeCoupon: vi.fn().mockResolvedValue(undefined),
    refresh: vi.fn().mockResolvedValue(undefined),
    ...overrides,
  };
}

export const GUEST = makeUser({ id: 'guest', name: 'Guest', email: '', role: 'GUEST', walletBalance: 0, giftPoints: 0 });
export const AARAV = makeUser({ id: 'aarav', name: 'Aarav Mehta', email: 'aarav.mehta@example.com' });
export const PRIYA = makeUser({
  id: 'priya',
  name: 'Priya Sharma',
  email: 'priya.sharma@example.com',
  walletBalance: 5,
  giftPoints: 40,
});

export function makeSessionContext(overrides: Partial<SessionContextValue> = {}): SessionContextValue {
  return {
    user: AARAV,
    personas: [GUEST, AARAV, PRIYA],
    switchPersona: vi.fn().mockResolvedValue(undefined),
    refreshUser: vi.fn().mockResolvedValue(undefined),
    resetDemo: vi.fn().mockResolvedValue(undefined),
    ...overrides,
  };
}

interface ProviderOptions {
  cart?: CartContextValue;
  session?: SessionContextValue;
  route?: string;
}

/** Renders inside a router plus the cart and session contexts, with controllable values. */
export function renderWithProviders(ui: ReactElement, { cart, session, route = '/' }: ProviderOptions = {}) {
  const cartValue = cart ?? makeCartContext();
  const sessionValue = session ?? makeSessionContext();
  const wrapper = ({ children }: { children: ReactNode }) => (
    <MemoryRouter initialEntries={[route]}>
      <SessionContext.Provider value={sessionValue}>
        <CartContext.Provider value={cartValue}>{children}</CartContext.Provider>
      </SessionContext.Provider>
    </MemoryRouter>
  );
  return { ...render(ui, { wrapper }), cart: cartValue, session: sessionValue };
}
