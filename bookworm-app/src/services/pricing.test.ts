import { describe, expect, it } from 'vitest';
import { makeBook, makeCartItem, makeCoupon } from '../test/fixtures';
import { computeQuote, couponDiscount, maxRedeemablePoints, pointsValue } from './pricing';

/** 2 x $12.99 = $25.98 subtotal, 12% tax = $3.12, free delivery -> $29.10 payable. */
const items = [makeCartItem({ book: makeBook({ price: 12.99 }), quantity: 2 })];

describe('pointsValue', () => {
  it('values one point at ten cents', () => {
    expect(pointsValue(1)).toBe(0.1);
    expect(pointsValue(100)).toBe(10);
  });

  it('does not drift on awkward multiples', () => {
    expect(pointsValue(3)).toBe(0.3);
    expect(pointsValue(145)).toBe(14.5);
  });
});

describe('maxRedeemablePoints', () => {
  it('lets points cover at most half of the payable amount, in whole points', () => {
    expect(maxRedeemablePoints(29.1)).toBe(145);
    expect(maxRedeemablePoints(10)).toBe(50);
  });

  it('rounds down to a whole point', () => {
    expect(maxRedeemablePoints(10.19)).toBe(50);
  });

  it('is zero for nothing payable', () => {
    expect(maxRedeemablePoints(0)).toBe(0);
  });
});

describe('couponDiscount', () => {
  it('is zero without a coupon', () => {
    expect(couponDiscount(null, 100)).toBe(0);
  });

  it('is zero below the minimum order', () => {
    expect(couponDiscount(makeCoupon({ minOrder: 30 }), 29.99)).toBe(0);
  });

  it('gives the flat value', () => {
    expect(couponDiscount(makeCoupon({ type: 'FLAT', value: 5, minOrder: 20 }), 25.98)).toBe(5);
  });

  it('gives a rounded percentage', () => {
    expect(couponDiscount(makeCoupon({ type: 'PERCENT', value: 10, minOrder: 0 }), 25.98)).toBe(2.6);
  });

  it('never exceeds the subtotal', () => {
    expect(couponDiscount(makeCoupon({ type: 'FLAT', value: 50, minOrder: 0 }), 20)).toBe(20);
  });
});

describe('computeQuote', () => {
  it('prices the basket with tax and free delivery', () => {
    expect(computeQuote(items, null)).toEqual({
      itemCount: 2,
      subtotal: 25.98,
      tax: 3.12,
      shipping: 0,
      discount: 0,
      pointsRedeemed: 0,
      pointsDiscount: 0,
      total: 29.1,
      couponApplied: false,
    });
  });

  it('prices an empty basket at zero', () => {
    expect(computeQuote([], null)).toMatchObject({ itemCount: 0, subtotal: 0, shipping: 0, total: 0 });
  });

  it('subtracts a coupon and flags it as applied', () => {
    const quote = computeQuote(items, makeCoupon({ value: 5, minOrder: 20 }));
    expect(quote).toMatchObject({ discount: 5, couponApplied: true, total: 24.1 });
  });

  it('keeps a coupon attached but unapplied below its minimum', () => {
    const quote = computeQuote(items, makeCoupon({ minOrder: 30 }));
    expect(quote).toMatchObject({ discount: 0, couponApplied: false, total: 29.1 });
  });

  describe('gift points', () => {
    it('subtracts the value of the redeemed points', () => {
      expect(computeQuote(items, null, 100)).toMatchObject({ pointsRedeemed: 100, pointsDiscount: 10, total: 19.1 });
    });

    it('caps the points at half of the payable amount', () => {
      expect(computeQuote(items, null, 1000)).toMatchObject({ pointsRedeemed: 145, pointsDiscount: 14.5, total: 14.6 });
    });

    it('applies points after the coupon', () => {
      const quote = computeQuote(items, makeCoupon({ value: 5, minOrder: 20 }), 1000);
      expect(quote).toMatchObject({ discount: 5, pointsRedeemed: 120, pointsDiscount: 12, total: 12.1 });
    });

    it('ignores negative and fractional requests', () => {
      expect(computeQuote(items, null, -5).pointsRedeemed).toBe(0);
      expect(computeQuote(items, null, 10.9).pointsRedeemed).toBe(10);
    });

    it('redeems nothing on an empty basket', () => {
      expect(computeQuote([], null, 50)).toMatchObject({ pointsRedeemed: 0, total: 0 });
    });

    it('always leaves something to charge', () => {
      expect(computeQuote(items, null, 1_000_000).total).toBeGreaterThan(0);
    });
  });
});
