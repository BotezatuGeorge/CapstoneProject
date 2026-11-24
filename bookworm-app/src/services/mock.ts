export type ApiErrorCode =
  | 'VALIDATION'
  | 'NOT_FOUND'
  | 'OUT_OF_STOCK'
  | 'EMPTY_CART'
  | 'INVALID_COUPON'
  | 'PAYMENT_DECLINED'
  | 'INSUFFICIENT_FUNDS'
  | 'FORBIDDEN'
  | 'CONFLICT';

/** Error shape a real API would return: a machine code, a message and per-field errors. */
export class ApiError extends Error {
  readonly code: ApiErrorCode;
  readonly fieldErrors: Record<string, string>;

  constructor(code: ApiErrorCode, message: string, fieldErrors: Record<string, string> = {}) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
    this.fieldErrors = fieldErrors;
  }
}

/** Simulated network latency in milliseconds. */
export const LATENCY = { cart: 120, read: 180, write: 320, payment: 1600 } as const;

const wait = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));

/** Runs a synchronous domain operation behind simulated latency; thrown errors become rejections. */
export async function respond<T>(ms: number, operation: () => T): Promise<T> {
  await wait(ms);
  return operation();
}

export const HOUR_MS = 3_600_000;
export const DAY_MS = 24 * HOUR_MS;

let idCounter = 0;
export function newId(prefix: string): string {
  idCounter += 1;
  return `${prefix}-${Date.now().toString(36).toUpperCase()}${idCounter.toString(36).toUpperCase()}`;
}

/** User-facing text for any thrown value. */
export function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : 'Something went wrong. Please try again.';
}

/** Per-field messages from a VALIDATION error, or an empty object for any other error. */
export function fieldErrorsOf(error: unknown): Record<string, string> {
  return error instanceof ApiError ? error.fieldErrors : {};
}
