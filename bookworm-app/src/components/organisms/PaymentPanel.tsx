import { useState } from 'react';
import { Purchase } from '@carbon/icons-react';
import { Button, Input, Notice } from '../atoms';
import clsx from 'clsx';
import { formatMoney } from '../../lib/money';
import type { PaymentRequest } from '../../types';

type MethodId = 'credit' | 'debit' | 'upi' | 'wallet';

interface PaymentPanelProps {
  amount: number;
  /** Wallet balance of the signed-in persona, shown on the Wallet tab. */
  walletBalance: number;
  /** True while the gateway call is in flight. */
  processing: boolean;
  /** Gateway error message (declined card, insufficient wallet funds, ...). */
  error: string | null;
  /** Per-field errors from gateway validation (cardNumber, nameOnCard, cvv, expiry, vpa). */
  fieldErrors: Record<string, string>;
  onPay: (request: PaymentRequest) => void;
}

const METHODS: { id: MethodId; label: string }[] = [
  { id: 'credit', label: 'Credit Card' },
  { id: 'debit', label: 'Debit card' },
  { id: 'upi', label: 'UPI' },
  { id: 'wallet', label: 'Wallet' },
];

/** Groups digits as XXXX-XXXX-XXXX-XXXX while typing. */
const formatCardNumber = (raw: string) =>
  raw
    .replace(/\D/g, '')
    .slice(0, 16)
    .replace(/(\d{4})(?=\d)/g, '$1-');

/** Inserts the slash for MM/YYYY while typing. */
const formatExpiry = (raw: string) => {
  const digits = raw.replace(/\D/g, '').slice(0, 6);
  return digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits;
};

export function PaymentPanel({ amount, walletBalance, processing, error, fieldErrors, onPay }: PaymentPanelProps) {
  const [method, setMethod] = useState<MethodId>('credit');
  const [card, setCard] = useState({ number: '', name: '', cvv: '', expiry: '' });
  const [vpa, setVpa] = useState('');

  const handlePay = (e: React.FormEvent) => {
    e.preventDefault();
    if (method === 'upi') onPay({ method: 'UPI', vpa });
    else if (method === 'wallet') onPay({ method: 'WALLET' });
    else {
      onPay({
        method: method === 'credit' ? 'CREDIT_CARD' : 'DEBIT_CARD',
        cardNumber: card.number,
        nameOnCard: card.name,
        cvv: card.cvv,
        expiry: card.expiry,
      });
    }
  };

  const payButton = (
    <div className="flex justify-end">
      <Button type="submit" variant="primary" size="md" disabled={processing} icon={<Purchase size={16} />}>
        {processing ? 'Processing…' : 'Pay Now'}
      </Button>
    </div>
  );

  return (
    <div className="card overflow-hidden w-full max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-5 border-b border-accent-blue/40">
        <h2 className="text-lg font-light text-[#f4f4f4]">Complete Payment</h2>
        <span className="text-base font-semibold text-white">
          Payable Amount: {formatMoney(amount)}
        </span>
      </div>

      <div className="flex flex-col sm:flex-row">
        {/* Payment method tabs: active tab merges with the form layer and gets a 3px left blue bar */}
        <ul className="flex flex-row sm:flex-col sm:w-44 flex-shrink-0 bg-surface-overlay">
          {METHODS.map((m) => (
            <li key={m.id} className="flex-1 sm:flex-none border-b border-surface">
              <button
                type="button"
                disabled={processing}
                onClick={() => setMethod(m.id)}
                className={clsx(
                  'w-full text-left px-4 py-5 text-sm border-l-[3px] transition-colors',
                  method === m.id
                    ? 'bg-surface-raised border-accent-blue text-white font-semibold'
                    : 'border-transparent text-muted hover:bg-[#4c4c4c] hover:text-white'
                )}
              >
                {m.label}
              </button>
            </li>
          ))}
        </ul>

        {/* Form area */}
        <form onSubmit={handlePay} className="flex-1 p-4 flex flex-col gap-4">
          {error && <Notice kind="error">{error}</Notice>}

          {(method === 'credit' || method === 'debit') && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Card Number"
                  placeholder="XXXX-XXXX-XXXX-XXXX"
                  inputMode="numeric"
                  autoComplete="cc-number"
                  value={card.number}
                  error={fieldErrors.cardNumber}
                  onChange={(e) => setCard((c) => ({ ...c, number: formatCardNumber(e.target.value) }))}
                />
                <Input
                  label="Name on Card"
                  placeholder="Name"
                  autoComplete="cc-name"
                  value={card.name}
                  error={fieldErrors.nameOnCard}
                  onChange={(e) => setCard((c) => ({ ...c, name: e.target.value }))}
                />
                <Input
                  label="CVV"
                  placeholder="XXX"
                  type="password"
                  inputMode="numeric"
                  autoComplete="cc-csc"
                  maxLength={4}
                  value={card.cvv}
                  error={fieldErrors.cvv}
                  onChange={(e) => setCard((c) => ({ ...c, cvv: e.target.value.replace(/\D/g, '') }))}
                />
                <Input
                  label="Date of Expiry"
                  placeholder="MM/YYYY"
                  inputMode="numeric"
                  autoComplete="cc-exp"
                  value={card.expiry}
                  error={fieldErrors.expiry}
                  onChange={(e) => setCard((c) => ({ ...c, expiry: formatExpiry(e.target.value) }))}
                />
              </div>
              <p className="text-xs text-helper">
                Demo: any card number is accepted; a number ending in 0002 is declined.
              </p>
              {payButton}
            </>
          )}

          {method === 'upi' && (
            <>
              <Input
                label="UPI ID"
                placeholder="yourname@upi"
                value={vpa}
                error={fieldErrors.vpa}
                onChange={(e) => setVpa(e.target.value)}
              />
              <p className="text-xs text-helper">Demo: any valid UPI ID is approved; IDs starting with “fail” are declined.</p>
              {payButton}
            </>
          )}

          {method === 'wallet' && (
            <>
              <div className="flex items-center justify-between bg-surface-overlay px-4 py-3 text-sm">
                <span className="text-muted">Available balance</span>
                <span className="font-semibold text-white">{formatMoney(walletBalance)}</span>
              </div>
              {walletBalance < amount && (
                <Notice kind="warning">Your wallet balance is below the payable amount.</Notice>
              )}
              {payButton}
            </>
          )}
        </form>
      </div>
    </div>
  );
}
