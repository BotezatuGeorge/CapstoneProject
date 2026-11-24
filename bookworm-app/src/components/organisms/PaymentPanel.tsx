import { useState } from 'react';
import { Purchase } from '@carbon/icons-react';
import { Button, Input } from '../atoms';
import clsx from 'clsx';

type PaymentMethod = 'credit' | 'debit' | 'upi' | 'wallet';

interface PaymentPanelProps {
  amount: number;
  onPay: () => void;
}

const METHODS: { id: PaymentMethod; label: string }[] = [
  { id: 'credit', label: 'Credit Card' },
  { id: 'debit', label: 'Debit card' },
  { id: 'upi', label: 'UPI' },
  { id: 'wallet', label: 'Wallet' },
];

export function PaymentPanel({ amount, onPay }: PaymentPanelProps) {
  const [method, setMethod] = useState<PaymentMethod>('credit');
  const [card, setCard] = useState({ number: '', name: '', cvv: '', expiry: '' });

  const handlePay = (e: React.FormEvent) => {
    e.preventDefault();
    onPay();
  };

  return (
    <div className="card overflow-hidden w-full max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-5 border-b border-accent-blue/40">
        <h2 className="text-lg font-light text-[#f4f4f4]">Complete Payment</h2>
        <span className="text-base font-semibold text-white">
          Payable Amount: ₹{amount.toLocaleString('en-IN')}
        </span>
      </div>

      <div className="flex flex-col sm:flex-row">
        {/* Payment method tabs: active tab merges with the form layer and gets a 3px left blue bar */}
        <ul className="flex flex-row sm:flex-col sm:w-44 flex-shrink-0 bg-surface-overlay">
          {METHODS.map((m) => (
            <li key={m.id} className="flex-1 sm:flex-none border-b border-surface">
              <button
                type="button"
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
        <form onSubmit={handlePay} className="flex-1 p-4">
          {(method === 'credit' || method === 'debit') && (
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Card Number"
                  placeholder="XXXX-XXXX-XXXX-XXXX"
                  value={card.number}
                  onChange={(e) => setCard((c) => ({ ...c, number: e.target.value }))}
                />
                <Input
                  label="Name on Card"
                  placeholder="Name"
                  value={card.name}
                  onChange={(e) => setCard((c) => ({ ...c, name: e.target.value }))}
                />
                <Input
                  label="CVV"
                  placeholder="XXX"
                  type="password"
                  maxLength={4}
                  value={card.cvv}
                  onChange={(e) => setCard((c) => ({ ...c, cvv: e.target.value }))}
                />
                <Input
                  label="Date of Expiry"
                  placeholder="MM/YYYY"
                  value={card.expiry}
                  onChange={(e) => setCard((c) => ({ ...c, expiry: e.target.value }))}
                />
              </div>
              <div className="flex justify-end">
                <Button type="submit" variant="primary" size="md" icon={<CardIcon />}>
                  Pay Now
                </Button>
              </div>
            </div>
          )}

          {method === 'upi' && (
            <div className="flex flex-col gap-4">
              <Input label="UPI ID" placeholder="yourname@upi" />
              <div className="flex justify-end">
                <Button type="submit" variant="primary" size="md" icon={<CardIcon />}>
                  Pay Now
                </Button>
              </div>
            </div>
          )}

          {method === 'wallet' && (
            <div className="flex flex-col gap-4">
              <p className="text-sm text-muted">Select your wallet provider and proceed.</p>
              <div className="grid grid-cols-2 gap-3">
                {['Paytm', 'PhonePe', 'Amazon Pay', 'Google Pay'].map((w) => (
                  <button
                    key={w}
                    type="button"
                    className="bg-surface-overlay border border-border px-4 py-2 text-sm text-white hover:border-accent-blue transition-colors"
                  >
                    {w}
                  </button>
                ))}
              </div>
              <div className="flex justify-end">
                <Button type="submit" variant="primary" size="md" icon={<CardIcon />}>
                  Pay Now
                </Button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

function CardIcon() {
  return <Purchase size={16} />;
}
