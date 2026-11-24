import { inventory as inventoryFixture } from '../data';
import type { Book, BookRecord } from '../types';
import { estimateDelivery, formatDeliveryDate } from './shipping';

/** Combines a catalog record with live stock/sales and the standard-shipping ETA. */
export function toBook(record: BookRecord, stock: number, sold: number, now: Date): Book {
  const leadDays = inventoryFixture[record.id]?.deliveryLeadDays ?? 0;
  return {
    ...record,
    soldCount: record.soldCount + sold,
    stock,
    deliveryDate: formatDeliveryDate(estimateDelivery('STANDARD', leadDays, now)),
  };
}

export function leadDaysFor(bookId: string): number {
  return inventoryFixture[bookId]?.deliveryLeadDays ?? 0;
}
