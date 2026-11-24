import { bookRecords, inventory, personas, storePolicy } from '../data';
import type { Address, CartItem, Order, OrderStatus, ShipmentStatus } from '../types';
import { toBook } from './bookFactory';
import { DAY_MS, HOUR_MS } from './mock';
import { computeQuote } from './pricing';

interface SeedSpec {
  id: string;
  hoursAgo: number;
  status: OrderStatus;
  shipment: ShipmentStatus;
  lines: [string, number][];
}

const SPECS: SeedSpec[] = [
  {
    id: 'ORD-SEED-1001',
    hoursAgo: 6 * 24,
    status: 'DELIVERED',
    shipment: 'DELIVERED',
    lines: [
      ['art-of-focus', 1],
      ['midnight-hour', 1],
    ],
  },
  {
    id: 'ORD-SEED-1002',
    hoursAgo: 3 * 24,
    status: 'SHIPPED',
    shipment: 'IN_TRANSIT',
    lines: [['beneath-the-stars', 1]],
  },
];

/** Demo order history for the pre-seeded customer, so My Orders / Buy It Again have data. */
export function buildSeedOrders(now: Date): Order[] {
  const customer = personas.find((p) => p.id === 'aarav');
  const address = customer?.savedAddress as Address;
  return SPECS.map((spec) => {
    const items: CartItem[] = spec.lines.map(([bookId, quantity]) => {
      const record = bookRecords.find((b) => b.id === bookId)!;
      return { book: toBook(record, inventory[bookId].stock, 0, now), quantity };
    });
    const quote = computeQuote(items, null);
    const placedAt = new Date(now.getTime() - spec.hoursAgo * HOUR_MS);
    const delivery = new Date(placedAt.getTime() + 3 * DAY_MS);
    return {
      id: spec.id,
      userId: 'aarav',
      status: spec.status,
      items,
      address,
      subtotal: quote.subtotal,
      taxAmount: quote.tax,
      shippingFee: quote.shipping,
      discountAmount: 0,
      totalAmount: quote.total,
      pointsEarned: Math.floor(quote.total / 10) * storePolicy.pointsPerTenDollars,
      payment: {
        id: `PAY-${spec.id}`,
        method: 'CREDIT_CARD',
        transactionRef: `TXN-${spec.id}`,
        amount: quote.total,
        status: 'SUCCESS',
        processedAt: placedAt.toISOString(),
      },
      shipment: {
        trackingNumber: `TRK-${spec.id}`,
        carrier: 'BookWorm Standard',
        status: spec.shipment,
        estimatedDeliveryDate: delivery.toISOString(),
        shippingRate: 0,
      },
      placedAt: placedAt.toISOString(),
      cancellationDeadline: new Date(
        placedAt.getTime() + storePolicy.cancellationWindowHours * HOUR_MS
      ).toISOString(),
      tentativeDeliveryDate: delivery.toISOString(),
    };
  });
}
