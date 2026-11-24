import { storePolicy } from '../data';
import { roundMoney } from '../lib/money';
import type { CartItem, Coupon, Quote } from '../types';
import { shippingFee } from './shipping';

/** Discount the coupon gives for this subtotal, or 0 when the order is below its minimum. */
export function couponDiscount(coupon: Coupon | null, subtotal: number): number {
  if (!coupon || subtotal < coupon.minOrder) return 0;
  const raw = coupon.type === 'FLAT' ? coupon.value : roundMoney((subtotal * coupon.value) / 100);
  return Math.min(raw, subtotal);
}

/** Dollar value of a number of gift points. */
export function pointsValue(points: number): number {
  return roundMoney(points * storePolicy.pointValue);
}

/** Most gift points that may be redeemed against a payable amount (whole points, store policy share). */
export function maxRedeemablePoints(payable: number): number {
  const pointCents = Math.round(storePolicy.pointValue * 100);
  const payableCents = Math.round(payable * 100);
  // Floor the cap in cents too, so a half-cent never rounds a point over the policy share.
  return Math.floor(Math.floor(payableCents * storePolicy.maxPointsCoverage) / pointCents);
}

/** `requestedPoints` is capped here by the store policy; callers cap it by the user's balance. */
export function computeQuote(items: CartItem[], coupon: Coupon | null, requestedPoints = 0): Quote {
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = roundMoney(items.reduce((sum, item) => sum + item.book.price * item.quantity, 0));
  const tax = roundMoney(subtotal * storePolicy.taxRate);
  const shipping = items.length > 0 ? shippingFee('STANDARD') : 0;
  const discount = couponDiscount(coupon, subtotal);
  const payable = roundMoney(subtotal + tax + shipping - discount);
  const pointsRedeemed = Math.min(Math.max(0, Math.floor(requestedPoints)), maxRedeemablePoints(payable));
  const pointsDiscount = pointsValue(pointsRedeemed);
  return {
    itemCount,
    subtotal,
    tax,
    shipping,
    discount,
    pointsRedeemed,
    pointsDiscount,
    total: roundMoney(payable - pointsDiscount),
    couponApplied: discount > 0,
  };
}
