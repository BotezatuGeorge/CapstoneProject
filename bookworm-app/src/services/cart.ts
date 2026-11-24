import { formatMoney, roundMoney } from '../lib/money';
import type { CartItem, CartSnapshot } from '../types';
import {
  findCoupon,
  getUser,
  getBookById,
  getBooks,
  getCheckoutAddress,
  getStoredCart,
  saveCheckoutAddress,
  saveStoredCart,
} from './db';
import { currentUser } from './member';
import { ApiError, LATENCY, respond } from './mock';
import { computeQuote, maxRedeemablePoints } from './pricing';
import { validateAddress } from './validation';
import type { Address } from '../types';

/** Builds the cart from stored ids so price and stock are always read fresh. */
export function buildSnapshot(userId: string): CartSnapshot {
  const stored = getStoredCart(userId);
  const books = getBooks();
  const items: CartItem[] = stored.lines.flatMap((line) => {
    const book = books.find((b) => b.id === line.bookId);
    return book ? [{ book, quantity: line.quantity }] : [];
  });
  const coupon = stored.couponCode ? findCoupon(stored.couponCode) : null;
  const balance = getUser(userId)?.giftPoints ?? 0;
  return { items, coupon, quote: computeQuote(items, coupon, Math.min(stored.pointsToRedeem, balance)) };
}

function assertStock(bookId: string, quantity: number): void {
  const book = getBookById(bookId);
  if (!book) throw new ApiError('NOT_FOUND', 'This book is no longer available');
  if (quantity > book.stock) {
    const message =
      book.stock === 0 ? `${book.title} is out of stock` : `Only ${book.stock} copies of ${book.title} left`;
    throw new ApiError('OUT_OF_STOCK', message);
  }
}

export const cartService = {
  get: (): Promise<CartSnapshot> => respond(LATENCY.cart, () => buildSnapshot(currentUser().id)),

  addItem: (bookId: string, quantity = 1): Promise<CartSnapshot> =>
    respond(LATENCY.cart, () => {
      const userId = currentUser().id;
      const cart = getStoredCart(userId);
      const line = cart.lines.find((l) => l.bookId === bookId);
      assertStock(bookId, (line?.quantity ?? 0) + quantity);
      if (line) line.quantity += quantity;
      else cart.lines.push({ bookId, quantity });
      saveStoredCart(userId, cart);
      return buildSnapshot(userId);
    }),

  setQuantity: (bookId: string, quantity: number): Promise<CartSnapshot> =>
    respond(LATENCY.cart, () => {
      const userId = currentUser().id;
      const cart = getStoredCart(userId);
      const line = cart.lines.find((l) => l.bookId === bookId);
      if (!line) throw new ApiError('NOT_FOUND', 'This item is not in your cart');
      if (quantity < 1) throw new ApiError('VALIDATION', 'Quantity must be at least 1');
      assertStock(bookId, quantity);
      line.quantity = quantity;
      saveStoredCart(userId, cart);
      return buildSnapshot(userId);
    }),

  removeItem: (bookId: string): Promise<CartSnapshot> =>
    respond(LATENCY.cart, () => {
      const userId = currentUser().id;
      const cart = getStoredCart(userId);
      saveStoredCart(userId, { ...cart, lines: cart.lines.filter((l) => l.bookId !== bookId) });
      return buildSnapshot(userId);
    }),

  applyCoupon: (code: string): Promise<CartSnapshot> =>
    respond(LATENCY.write, () => {
      const userId = currentUser().id;
      const snapshot = buildSnapshot(userId);
      if (snapshot.items.length === 0) throw new ApiError('EMPTY_CART', 'Your cart is empty');
      const coupon = findCoupon(code);
      if (!coupon) throw new ApiError('INVALID_COUPON', 'This coupon code is not valid');
      if (snapshot.quote.subtotal < coupon.minOrder) {
        const shortfall = roundMoney(coupon.minOrder - snapshot.quote.subtotal);
        throw new ApiError('INVALID_COUPON', `Add ${formatMoney(shortfall)} more to use ${coupon.code}`);
      }
      saveStoredCart(userId, { ...getStoredCart(userId), couponCode: coupon.code });
      return buildSnapshot(userId);
    }),

  removeCoupon: (): Promise<CartSnapshot> =>
    respond(LATENCY.cart, () => {
      const userId = currentUser().id;
      saveStoredCart(userId, { ...getStoredCart(userId), couponCode: null });
      return buildSnapshot(userId);
    }),

  /** Redeems gift points against the payable amount (after any coupon), within balance and store policy. */
  redeemPoints: (points: number): Promise<CartSnapshot> =>
    respond(LATENCY.write, () => {
      const user = currentUser();
      if (user.role === 'GUEST') throw new ApiError('FORBIDDEN', 'Sign in as a customer to redeem gift points');
      const snapshot = buildSnapshot(user.id);
      if (snapshot.items.length === 0) throw new ApiError('EMPTY_CART', 'Your cart is empty');
      if (!Number.isInteger(points) || points < 1) {
        throw new ApiError('VALIDATION', 'Enter a whole number of gift points (1 or more)');
      }
      if (points > user.giftPoints) {
        throw new ApiError('VALIDATION', `You only have ${user.giftPoints} gift points`);
      }
      const payable = roundMoney(snapshot.quote.total + snapshot.quote.pointsDiscount);
      const max = maxRedeemablePoints(payable);
      if (points > max) {
        throw new ApiError('VALIDATION', `You can redeem at most ${max} gift points on this order`);
      }
      saveStoredCart(user.id, { ...getStoredCart(user.id), pointsToRedeem: points });
      return buildSnapshot(user.id);
    }),

  removePoints: (): Promise<CartSnapshot> =>
    respond(LATENCY.cart, () => {
      const userId = currentUser().id;
      saveStoredCart(userId, { ...getStoredCart(userId), pointsToRedeem: 0 });
      return buildSnapshot(userId);
    }),

  /** Validates the delivery address and stores it as the checkout draft for the payment step. */
  saveDeliveryAddress: (address: Address): Promise<void> =>
    respond(LATENCY.write, () => {
      const userId = currentUser().id;
      if (buildSnapshot(userId).items.length === 0) throw new ApiError('EMPTY_CART', 'Your cart is empty');
      validateAddress(address);
      saveCheckoutAddress(userId, address);
    }),

  getDeliveryAddress: (): Promise<Address | null> =>
    respond(LATENCY.cart, () => getCheckoutAddress<Address>(currentUser().id)),
};
