import { beforeEach, describe, expect, it, vi } from 'vitest';
import { personas } from '../data';
import { cartService } from './cart';
import { getUser } from './db';
import { ApiError } from './mock';
import { orderService } from './order';
import { setSessionUserId } from './session';

// Run the mock services without their simulated latency.
vi.mock('./mock', async (importOriginal) => ({
  ...(await importOriginal<typeof import('./mock')>()),
  respond: async <T,>(_ms: number, operation: () => T): Promise<T> => operation(),
}));

const BOOK = 'joy-of-minimalism'; // $12.99, 2 copies -> $29.10 payable, at most 145 points
const CARD = {
  method: 'CREDIT_CARD',
  cardNumber: '4242-4242-4242-4242',
  nameOnCard: 'Aarav Mehta',
  cvv: '123',
  expiry: '12/2099',
} as const;

const signIn = (userId: string) => setSessionUserId(userId);
const savedAddress = (userId: string) => {
  const { savedAddress: address } = personas.find((p) => p.id === userId)!;
  return address!;
};
const points = (userId: string) => getUser(userId)!.giftPoints;
const wallet = (userId: string) => getUser(userId)!.walletBalance;

beforeEach(() => {
  localStorage.clear();
  signIn('aarav');
});

describe('cartService.redeemPoints', () => {
  it('is refused for a guest', async () => {
    signIn('guest');
    await cartService.addItem(BOOK, 2);
    await expect(cartService.redeemPoints(10)).rejects.toMatchObject({ code: 'FORBIDDEN' });
  });

  it('is refused for an empty cart', async () => {
    await expect(cartService.redeemPoints(10)).rejects.toMatchObject({ code: 'EMPTY_CART' });
  });

  it.each([0, -3, 2.5, Number.NaN])('rejects %s as not a whole positive number', async (value) => {
    await cartService.addItem(BOOK, 2);
    await expect(cartService.redeemPoints(value)).rejects.toMatchObject({ code: 'VALIDATION' });
  });

  it('rejects more points than the customer has', async () => {
    signIn('priya'); // 40 points
    await cartService.addItem(BOOK, 2);
    await expect(cartService.redeemPoints(41)).rejects.toThrow('You only have 40 gift points');
  });

  it('rejects more than the store policy allows on this order', async () => {
    await cartService.addItem(BOOK, 2);
    await expect(cartService.redeemPoints(146)).rejects.toThrow('You can redeem at most 145 gift points on this order');
  });

  it('reports a validation error as an ApiError', async () => {
    await cartService.addItem(BOOK, 2);
    await expect(cartService.redeemPoints(0)).rejects.toBeInstanceOf(ApiError);
  });

  it('applies the points to the quote', async () => {
    await cartService.addItem(BOOK, 2);
    const { quote } = await cartService.redeemPoints(100);
    expect(quote).toMatchObject({ pointsRedeemed: 100, pointsDiscount: 10, total: 19.1 });
  });

  it('does not spend the points until the order is placed', async () => {
    await cartService.addItem(BOOK, 2);
    await cartService.redeemPoints(100);
    expect(points('aarav')).toBe(320);
  });

  it('measures the cap against the amount after the coupon', async () => {
    await cartService.addItem(BOOK, 2);
    await cartService.applyCoupon('READ5'); // $24.10 payable -> at most 120 points
    await expect(cartService.redeemPoints(121)).rejects.toThrow('at most 120');
    const { quote } = await cartService.redeemPoints(120);
    expect(quote.total).toBe(12.1);
  });

  it('can be changed to another amount', async () => {
    await cartService.addItem(BOOK, 2);
    await cartService.redeemPoints(100);
    const { quote } = await cartService.redeemPoints(50);
    expect(quote.pointsRedeemed).toBe(50);
  });

  it('is shrunk, not refused, when the cart later gets cheaper', async () => {
    await cartService.addItem(BOOK, 2);
    await cartService.redeemPoints(140);
    const { quote } = await cartService.setQuantity(BOOK, 1); // $14.55 payable -> at most 72
    expect(quote.pointsRedeemed).toBe(72);
  });

  it('keeps each customer\'s points separate', async () => {
    await cartService.addItem(BOOK, 2);
    await cartService.redeemPoints(100);
    signIn('priya');
    await cartService.addItem(BOOK, 2);
    expect((await cartService.get()).quote.pointsRedeemed).toBe(0);
  });
});

describe('cartService.removePoints', () => {
  it('puts the full price back', async () => {
    await cartService.addItem(BOOK, 2);
    await cartService.redeemPoints(100);
    const { quote } = await cartService.removePoints();
    expect(quote).toMatchObject({ pointsRedeemed: 0, pointsDiscount: 0, total: 29.1 });
  });
});

describe('placing an order with gift points', () => {
  const checkout = async (pointsToUse: number, payment: Parameters<typeof orderService.placeOrder>[0] = CARD) => {
    await cartService.addItem(BOOK, 2);
    if (pointsToUse > 0) await cartService.redeemPoints(pointsToUse);
    await cartService.saveDeliveryAddress(savedAddress('aarav'));
    return orderService.placeOrder(payment);
  };

  it('charges the reduced total and records the points on the order', async () => {
    const order = await checkout(100);
    expect(order).toMatchObject({
      pointsRedeemed: 100,
      pointsDiscount: 10,
      totalAmount: 19.1,
      payment: { amount: 19.1, status: 'SUCCESS' },
    });
  });

  it('spends the points and earns new ones on what was actually paid', async () => {
    await checkout(100); // earns floor(19.10 / 10) = 1
    expect(points('aarav')).toBe(320 - 100 + 1);
  });

  it('charges the wallet only the reduced amount', async () => {
    await checkout(100, { method: 'WALLET' });
    expect(wallet('aarav')).toBe(100 - 19.1);
  });

  it('clears the points request along with the cart', async () => {
    await checkout(100);
    const { quote } = await cartService.get();
    expect(quote.pointsRedeemed).toBe(0);
  });

  it('leaves the balance alone when no points are used', async () => {
    const order = await checkout(0);
    expect(order).toMatchObject({ pointsRedeemed: 0, pointsDiscount: 0, totalAmount: 29.1 });
    expect(points('aarav')).toBe(320 + 2);
  });

  it('keeps the points when the payment is declined', async () => {
    await cartService.addItem(BOOK, 2);
    await cartService.redeemPoints(100);
    await cartService.saveDeliveryAddress(savedAddress('aarav'));
    await expect(orderService.placeOrder({ ...CARD, cardNumber: '4000-0000-0000-0002' })).rejects.toMatchObject({
      code: 'PAYMENT_DECLINED',
    });
    expect(points('aarav')).toBe(320);
    expect((await cartService.get()).quote.pointsRedeemed).toBe(100);
  });

  it('only lets a customer spend the points they have', async () => {
    signIn('priya'); // 40 points
    await cartService.addItem(BOOK, 2);
    await cartService.redeemPoints(40);
    await cartService.saveDeliveryAddress(savedAddress('priya'));
    const order = await orderService.placeOrder(CARD);
    expect(order.pointsRedeemed).toBe(40);
    expect(points('priya')).toBe(0 + 2); // 40 spent, 2 earned on $25.10
  });

  it('gives the points back when the order is cancelled', async () => {
    const order = await checkout(100, { method: 'WALLET' });
    const cancelled = await orderService.cancelOrder(order.id);
    expect(cancelled.status).toBe('CANCELLED');
    expect(points('aarav')).toBe(320); // 100 returned, the 1 earned is reversed
    expect(wallet('aarav')).toBe(100); // the reduced charge is refunded
  });
});
