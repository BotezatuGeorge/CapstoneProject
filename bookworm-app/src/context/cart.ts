import { createContext, useContext } from 'react';
import type { CartItem, Coupon, Quote } from '../types';

export interface CartContextValue {
  items: CartItem[];
  coupon: Coupon | null;
  quote: Quote;
  totalItems: number;
  /** True once the first cart load has finished (before that, `items` is just the empty default). */
  loaded: boolean;
  /** True while a cart request is in flight. */
  busy: boolean;
  /** All actions reject with an ApiError (out of stock, invalid coupon, ...) for the caller to display. */
  addToCart: (bookId: string, quantity?: number) => Promise<void>;
  setQuantity: (bookId: string, quantity: number) => Promise<void>;
  removeFromCart: (bookId: string) => Promise<void>;
  applyCoupon: (code: string) => Promise<void>;
  removeCoupon: () => Promise<void>;
  /** Spends gift points on the order; rejects when over the balance or the store-policy cap. */
  redeemPoints: (points: number) => Promise<void>;
  removePoints: () => Promise<void>;
  /** Re-reads the cart after something outside the context changed it (checkout, buy again). */
  refresh: () => Promise<void>;
}

export const CartContext = createContext<CartContextValue | null>(null);

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
