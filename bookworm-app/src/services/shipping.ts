import { storePolicy } from '../data';
import type { Shipment } from '../types';
import { DAY_MS, newId } from './mock';

export type ShippingMethod = 'STANDARD' | 'EXPRESS';

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/** Standard shipping is free; express costs a flat fee. */
export function shippingFee(method: ShippingMethod): number {
  return method === 'EXPRESS' ? storePolicy.expressShippingFee : 0;
}

/** Standard = now + 3 days, Express = now + 1 day, plus any per-title handling days. */
export function estimateDelivery(method: ShippingMethod, extraDays: number, from: Date): Date {
  const baseDays = method === 'EXPRESS' ? 1 : 3;
  return new Date(from.getTime() + (baseDays + extraDays) * DAY_MS);
}

/** Formats as "Mon, 21 Jul", the format used in the mockups. */
export function formatDeliveryDate(date: Date): string {
  return `${WEEKDAYS[date.getDay()]}, ${date.getDate()} ${MONTHS[date.getMonth()]}`;
}

export function createShipment(method: ShippingMethod, extraDays: number, placedAt: Date): Shipment {
  return {
    trackingNumber: newId('TRK'),
    carrier: method === 'EXPRESS' ? 'BookWorm Express' : 'BookWorm Standard',
    status: 'PROCESSING',
    estimatedDeliveryDate: estimateDelivery(method, extraDays, placedAt).toISOString(),
    shippingRate: shippingFee(method),
  };
}
