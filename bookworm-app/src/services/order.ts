import { storePolicy } from '../data';
import type { Address, Order, OrderView, PaymentRequest } from '../types';
import { buildSnapshot } from './cart';
import {
  adjustStock,
  emptyCart,
  getBookById,
  getCheckoutAddress,
  getOrders,
  getStoredCart,
  getUser,
  saveCheckoutAddress,
  saveOrders,
  saveStoredCart,
  saveUser,
} from './db';
import { leadDaysFor } from './bookFactory';
import { currentUser } from './member';
import { ApiError, DAY_MS, HOUR_MS, LATENCY, newId, respond } from './mock';
import { processPayment, refundPayment } from './payment';
import { createShipment, estimateDelivery } from './shipping';

function toView(order: Order, now: Date): OrderView {
  const cancelMsRemaining = Math.max(0, new Date(order.cancellationDeadline).getTime() - now.getTime());
  const returnDeadline = new Date(order.shipment.estimatedDeliveryDate).getTime() + storePolicy.returnWindowDays * DAY_MS;
  return {
    ...order,
    cancelMsRemaining,
    canCancel: order.status === 'CONFIRMED' && cancelMsRemaining > 0,
    canReturn: order.status === 'DELIVERED' && now.getTime() <= returnDeadline,
  };
}

function ownedOrder(orders: Order[], orderId: string, userId: string): Order {
  const order = orders.find((o) => o.id === orderId);
  if (!order) throw new ApiError('NOT_FOUND', 'Order not found');
  if (order.userId !== userId) throw new ApiError('FORBIDDEN', 'This order belongs to another account');
  return order;
}

function replaceOrder(orders: Order[], updated: Order): void {
  saveOrders(orders.map((o) => (o.id === updated.id ? updated : o)));
}

/** Gift points: earned at 1 per $10, spent at checkout; both are reversed on cancellation or return. */
function adjustPoints(userId: string, delta: number): void {
  const user = getUser(userId);
  if (user) saveUser({ ...user, giftPoints: Math.max(0, user.giftPoints + delta) });
}

export const orderService = {
  /**
   * Checkout pipeline: validate cart + stock -> charge payment -> persist a CONFIRMED order ->
   * decrement stock, clear the cart, credit gift points. Fails without side effects if payment fails.
   */
  placeOrder: (payment: PaymentRequest): Promise<OrderView> =>
    respond(LATENCY.payment, () => {
      const user = currentUser();
      const snapshot = buildSnapshot(user.id);
      if (snapshot.items.length === 0) throw new ApiError('EMPTY_CART', 'Your cart is empty');

      const address = getCheckoutAddress<Address>(user.id);
      if (!address) throw new ApiError('VALIDATION', 'Add a delivery address before paying');

      for (const { book, quantity } of snapshot.items) {
        const fresh = getBookById(book.id);
        if (!fresh || fresh.stock < quantity) {
          throw new ApiError('OUT_OF_STOCK', `${book.title} no longer has enough stock`);
        }
      }

      const now = new Date();
      const transaction = processPayment(payment, snapshot.quote.total, user.id, now);
      const extraDays = Math.max(...snapshot.items.map((i) => leadDaysFor(i.book.id)));
      const order: Order = {
        id: newId('ORD'),
        userId: user.id,
        status: 'CONFIRMED',
        items: snapshot.items,
        address,
        subtotal: snapshot.quote.subtotal,
        taxAmount: snapshot.quote.tax,
        shippingFee: snapshot.quote.shipping,
        discountAmount: snapshot.quote.discount,
        totalAmount: snapshot.quote.total,
        couponCode: snapshot.quote.couponApplied ? snapshot.coupon?.code : undefined,
        pointsRedeemed: snapshot.quote.pointsRedeemed,
        pointsDiscount: snapshot.quote.pointsDiscount,
        pointsEarned: Math.floor(snapshot.quote.total / 10) * storePolicy.pointsPerTenDollars,
        payment: transaction,
        shipment: createShipment('STANDARD', extraDays, now),
        placedAt: now.toISOString(),
        cancellationDeadline: new Date(now.getTime() + storePolicy.cancellationWindowHours * HOUR_MS).toISOString(),
        tentativeDeliveryDate: estimateDelivery('STANDARD', extraDays, now).toISOString(),
      };

      saveOrders([order, ...getOrders(now)]);
      snapshot.items.forEach(({ book, quantity }) => adjustStock(book.id, -quantity, quantity));
      saveStoredCart(user.id, emptyCart());
      saveCheckoutAddress(user.id, null);
      adjustPoints(user.id, order.pointsEarned - order.pointsRedeemed);
      return toView(order, now);
    }),

  getOrder: (orderId: string): Promise<OrderView> =>
    respond(LATENCY.read, () => {
      const now = new Date();
      return toView(ownedOrder(getOrders(now), orderId, currentUser().id), now);
    }),

  listMyOrders: (): Promise<OrderView[]> =>
    respond(LATENCY.read, () => {
      const now = new Date();
      const userId = currentUser().id;
      return getOrders(now)
        .filter((o) => o.userId === userId)
        .sort((a, b) => b.placedAt.localeCompare(a.placedAt))
        .map((o) => toView(o, now));
    }),

  /** 48-hour rule: allowed only while CONFIRMED and now <= placedAt + 48h. Refunds, restocks, reverses points. */
  cancelOrder: (orderId: string): Promise<OrderView> =>
    respond(LATENCY.write, () => {
      const now = new Date();
      const orders = getOrders(now);
      const order = ownedOrder(orders, orderId, currentUser().id);
      if (order.status === 'CANCELLED') throw new ApiError('CONFLICT', 'This order is already cancelled');
      if (order.status !== 'CONFIRMED') {
        throw new ApiError('CONFLICT', 'This order has already shipped and can no longer be cancelled');
      }
      if (now.getTime() > new Date(order.cancellationDeadline).getTime()) {
        throw new ApiError('CONFLICT', 'The 48-hour cancellation window has closed');
      }

      const updated: Order = { ...order, status: 'CANCELLED', payment: refundPayment(order.payment, order.userId) };
      replaceOrder(orders, updated);
      order.items.forEach(({ book, quantity }) => adjustStock(book.id, quantity, -quantity));
      adjustPoints(order.userId, order.pointsRedeemed - order.pointsEarned);
      return toView(updated, now);
    }),

  /** Return workflow: delivered orders within the return window are refunded and flagged for reverse logistics. */
  returnOrder: (orderId: string): Promise<OrderView> =>
    respond(LATENCY.write, () => {
      const now = new Date();
      const orders = getOrders(now);
      const order = ownedOrder(orders, orderId, currentUser().id);
      const view = toView(order, now);
      if (!view.canReturn) {
        throw new ApiError('CONFLICT', 'Only delivered orders inside the return window can be returned');
      }
      const updated: Order = {
        ...order,
        status: 'RETURNED',
        payment: refundPayment(order.payment, order.userId),
        shipment: { ...order.shipment, status: 'RETURN_IN_PROGRESS' },
      };
      replaceOrder(orders, updated);
      order.items.forEach(({ book, quantity }) => adjustStock(book.id, quantity, -quantity));
      adjustPoints(order.userId, order.pointsRedeemed - order.pointsEarned);
      return toView(updated, now);
    }),

  /** "Buy It Again": repopulates the basket from a past order, skipping anything out of stock. */
  buyAgain: (orderId: string): Promise<{ added: number; skipped: string[] }> =>
    respond(LATENCY.write, () => {
      const user = currentUser();
      const order = ownedOrder(getOrders(), orderId, user.id);
      const cart = getStoredCart(user.id);
      const skipped: string[] = [];
      let added = 0;
      for (const { book, quantity } of order.items) {
        const fresh = getBookById(book.id);
        const line = cart.lines.find((l) => l.bookId === book.id);
        const wanted = (line?.quantity ?? 0) + quantity;
        if (!fresh || fresh.stock < wanted) {
          skipped.push(book.title);
          continue;
        }
        if (line) line.quantity = wanted;
        else cart.lines.push({ bookId: book.id, quantity });
        added += quantity;
      }
      saveStoredCart(user.id, cart);
      return { added, skipped };
    }),
};
