import { bookRecords, coupons, inventory, personas, seedReviews } from '../data';
import type { Book, Coupon, Order, Review, User } from '../types';
import { toBook } from './bookFactory';
import { HOUR_MS } from './mock';
import { buildSeedOrders } from './orderSeed';
import { readStore, writeStore } from './storage';

/*
 * Mock "database": every read/write goes through localStorage so state survives reloads.
 * These helpers are synchronous and internal to the service layer; UI code must use the
 * async services (which add latency and error handling) instead.
 */

/* ---------- Users ---------- */

export function getUsers(): User[] {
  return readStore<User[]>('users', personas);
}

export function getUser(userId: string): User | undefined {
  return getUsers().find((u) => u.id === userId);
}

export function saveUser(user: User): void {
  writeStore(
    'users',
    getUsers().map((u) => (u.id === user.id ? user : u))
  );
}

/* ---------- Inventory & books ---------- */

interface StockLevel {
  stock: number;
  sold: number;
}

function getStockLevels(): Record<string, StockLevel> {
  const seed = Object.fromEntries(
    Object.entries(inventory).map(([id, level]) => [id, { stock: level.stock, sold: 0 }])
  );
  return readStore<Record<string, StockLevel>>('inventory', seed);
}

export function adjustStock(bookId: string, stockDelta: number, soldDelta: number): void {
  const levels = getStockLevels();
  const level = levels[bookId] ?? { stock: 0, sold: 0 };
  levels[bookId] = {
    stock: Math.max(0, level.stock + stockDelta),
    sold: Math.max(0, level.sold + soldDelta),
  };
  writeStore('inventory', levels);
}

export function getBooks(now: Date = new Date()): Book[] {
  const levels = getStockLevels();
  return bookRecords.map((record) => {
    const level = levels[record.id] ?? { stock: 0, sold: 0 };
    return toBook(record, level.stock, level.sold, now);
  });
}

export function getBookById(bookId: string, now: Date = new Date()): Book | undefined {
  return getBooks(now).find((b) => b.id === bookId);
}

/* ---------- Cart (stored as ids so prices/stock are always read fresh) ---------- */

export interface StoredCart {
  lines: { bookId: string; quantity: number }[];
  couponCode: string | null;
}

const EMPTY_CART: StoredCart = { lines: [], couponCode: null };

export function getStoredCart(userId: string): StoredCart {
  return readStore<StoredCart>(`cart:${userId}`, EMPTY_CART);
}

export function saveStoredCart(userId: string, cart: StoredCart): void {
  writeStore(`cart:${userId}`, cart);
}

export function findCoupon(code: string): Coupon | null {
  const normalized = code.trim().toUpperCase();
  return coupons.find((c) => c.code === normalized) ?? null;
}

/* ---------- Checkout draft ---------- */

export function getCheckoutAddress<T>(userId: string): T | null {
  return readStore<T | null>(`checkout:${userId}`, null);
}

export function saveCheckoutAddress<T>(userId: string, address: T | null): void {
  writeStore(`checkout:${userId}`, address);
}

/* ---------- Wishlist ---------- */

export function getWishlistIds(userId: string): string[] {
  return readStore<string[]>(`wishlist:${userId}`, []);
}

export function saveWishlistIds(userId: string, ids: string[]): void {
  writeStore(`wishlist:${userId}`, ids);
}

/* ---------- Reviews ---------- */

export function getReviews(bookId: string): Review[] {
  const submitted = readStore<Review[]>('reviews', []);
  return [...submitted, ...seedReviews].filter((r) => r.bookId === bookId);
}

export function addReview(review: Review): void {
  writeStore('reviews', [review, ...readStore<Review[]>('reviews', [])]);
}

/* ---------- Orders ---------- */

const SHIP_AFTER_HOURS = 36;

/** Advances CONFIRMED -> SHIPPED -> DELIVERED as time passes, like a real fulfilment pipeline. */
function advanceOrder(order: Order, now: Date): Order {
  let next = order;
  if (
    next.status === 'CONFIRMED' &&
    now.getTime() >= new Date(next.placedAt).getTime() + SHIP_AFTER_HOURS * HOUR_MS
  ) {
    next = { ...next, status: 'SHIPPED', shipment: { ...next.shipment, status: 'IN_TRANSIT' } };
  }
  if (next.status === 'SHIPPED' && now.getTime() >= new Date(next.shipment.estimatedDeliveryDate).getTime()) {
    next = { ...next, status: 'DELIVERED', shipment: { ...next.shipment, status: 'DELIVERED' } };
  }
  return next;
}

export function getOrders(now: Date = new Date()): Order[] {
  const stored = readStore<Order[] | null>('orders', null);
  const orders = stored ?? buildSeedOrders(now);
  const advanced = orders.map((o) => advanceOrder(o, now));
  if (stored === null || advanced.some((o, i) => o !== orders[i])) writeStore('orders', advanced);
  return advanced;
}

export function saveOrders(orders: Order[]): void {
  writeStore('orders', orders);
}
