import { formatMoney } from '../lib/money';
import type { PaymentRequest, PaymentTransaction } from '../types';
import { getUser, saveUser } from './db';
import { ApiError, newId } from './mock';

/*
 * Simulated payment gateway. Demo values:
 *   4242 4242 4242 4242  -> approved        4000 0000 0000 0002 -> declined by bank
 *   any UPI id           -> approved        an id starting with "fail" -> declined
 */

const DECLINED_CARD_SUFFIX = '0002';
const UPI_PATTERN = /^[\w.-]{2,}@[a-zA-Z]{2,}$/;

function validateCard(request: Extract<PaymentRequest, { cardNumber: string }>, now: Date): string {
  const errors: Record<string, string> = {};
  const digits = request.cardNumber.replace(/\D/g, '');
  if (!request.nameOnCard.trim()) errors.nameOnCard = 'Name on card is required';
  if (!/^\d{3,4}$/.test(request.cvv)) errors.cvv = 'CVV must be 3 or 4 digits';

  const expiry = /^(\d{2})\/(\d{4})$/.exec(request.expiry.trim());
  const month = expiry ? Number(expiry[1]) : 0;
  const year = expiry ? Number(expiry[2]) : 0;
  const endOfMonth = new Date(year, month, 1);
  if (!expiry || month < 1 || month > 12) errors.expiry = 'Use the MM/YYYY format';
  else if (endOfMonth.getTime() <= now.getTime()) errors.expiry = 'This card has expired';

  if (Object.keys(errors).length > 0) {
    throw new ApiError('VALIDATION', 'Please check your card details', errors);
  }
  return digits;
}

/** Charges the request. Debits the wallet for WALLET payments; throws on any failure. */
export function processPayment(
  request: PaymentRequest,
  amount: number,
  userId: string,
  now: Date
): PaymentTransaction {
  if (request.method === 'CREDIT_CARD' || request.method === 'DEBIT_CARD') {
    const digits = validateCard(request, now);
    if (digits.endsWith(DECLINED_CARD_SUFFIX)) {
      throw new ApiError('PAYMENT_DECLINED', 'Your card was declined by the bank. Try another card.');
    }
  } else if (request.method === 'UPI') {
    if (!UPI_PATTERN.test(request.vpa.trim())) {
      throw new ApiError('VALIDATION', 'Please check your UPI ID', { vpa: 'Enter a valid UPI ID, e.g. name@bank' });
    }
    if (request.vpa.trim().toLowerCase().startsWith('fail')) {
      throw new ApiError('PAYMENT_DECLINED', 'The UPI request was declined. Try another UPI ID.');
    }
  } else {
    const user = getUser(userId);
    if (!user || user.walletBalance < amount) {
      throw new ApiError(
        'INSUFFICIENT_FUNDS',
        `Wallet balance ${formatMoney(user?.walletBalance ?? 0)} is less than the payable ${formatMoney(amount)}`
      );
    }
    saveUser({ ...user, walletBalance: user.walletBalance - amount });
  }

  return {
    id: newId('PAY'),
    method: request.method,
    transactionRef: newId('TXN'),
    amount,
    status: 'SUCCESS',
    processedAt: now.toISOString(),
  };
}

/** Marks the transaction refunded; wallet payments are credited back to the wallet. */
export function refundPayment(payment: PaymentTransaction, userId: string): PaymentTransaction {
  if (payment.method === 'WALLET') {
    const user = getUser(userId);
    if (user) saveUser({ ...user, walletBalance: user.walletBalance + payment.amount });
  }
  return { ...payment, status: 'REFUNDED' };
}
