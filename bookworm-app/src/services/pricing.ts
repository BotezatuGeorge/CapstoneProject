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

export function computeQuote(items: CartItem[], coupon: Coupon | null): Quote {
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = roundMoney(items.reduce((sum, item) => sum + item.book.price * item.quantity, 0));
  const tax = roundMoney(subtotal * storePolicy.taxRate);
  const shipping = items.length > 0 ? shippingFee('STANDARD') : 0;
  const discount = couponDiscount(coupon, subtotal);
  return {
    itemCount,
    subtotal,
    tax,
    shipping,
    discount,
    total: roundMoney(subtotal + tax + shipping - discount),
    couponApplied: discount > 0,
  };
}
