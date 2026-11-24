import { useCallback, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { cartService } from '../services';
import type { CartSnapshot } from '../types';
import { CartContext } from './cart';
import type { CartContextValue } from './cart';
import { useSession } from './session';

const EMPTY: CartSnapshot = {
  items: [],
  coupon: null,
  quote: {
    itemCount: 0,
    subtotal: 0,
    tax: 0,
    shipping: 0,
    discount: 0,
    pointsRedeemed: 0,
    pointsDiscount: 0,
    total: 0,
    couponApplied: false,
  },
};

/** The cart belongs to the signed-in persona, so the store (and the pages under it) remount on persona change. */
export function CartProvider({ children }: { children: ReactNode }) {
  const { user } = useSession();
  return <CartStore key={user.id}>{children}</CartStore>;
}

function CartStore({ children }: { children: ReactNode }) {
  const [snapshot, setSnapshot] = useState<CartSnapshot>(EMPTY);
  const [pending, setPending] = useState(0);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    void cartService.get().then((initial) => {
      if (!cancelled) {
        setSnapshot(initial);
        setLoaded(true);
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  /** Runs a cart request, tracks the busy flag and stores the returned snapshot. */
  const run = useCallback(async (request: Promise<CartSnapshot>) => {
    setPending((n) => n + 1);
    try {
      setSnapshot(await request);
      setLoaded(true);
    } finally {
      setPending((n) => n - 1);
    }
  }, []);

  const value = useMemo<CartContextValue>(
    () => ({
      items: snapshot.items,
      coupon: snapshot.coupon,
      quote: snapshot.quote,
      totalItems: snapshot.quote.itemCount,
      loaded,
      busy: pending > 0,
      addToCart: (bookId, quantity) => run(cartService.addItem(bookId, quantity)),
      setQuantity: (bookId, quantity) => run(cartService.setQuantity(bookId, quantity)),
      removeFromCart: (bookId) => run(cartService.removeItem(bookId)),
      applyCoupon: (code) => run(cartService.applyCoupon(code)),
      removeCoupon: () => run(cartService.removeCoupon()),
      redeemPoints: (points) => run(cartService.redeemPoints(points)),
      removePoints: () => run(cartService.removePoints()),
      refresh: () => run(cartService.get()),
    }),
    [snapshot, loaded, pending, run]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
