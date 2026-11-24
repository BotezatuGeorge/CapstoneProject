import { Link } from 'react-router-dom';
import { BookArt } from '../atoms';
import { PaymentPanel } from '../organisms';
import type { PaymentRequest } from '../../types';

interface PaymentTemplateProps {
  amount: number;
  walletBalance: number;
  processing: boolean;
  error: string | null;
  fieldErrors: Record<string, string>;
  onPay: (request: PaymentRequest) => void;
}

export function PaymentTemplate({ amount, walletBalance, processing, error, fieldErrors, onPay }: PaymentTemplateProps) {
  return (
    <div className="relative min-h-screen">
      <div className="absolute inset-0 z-0">
        <BookArt variant="backdrop" />
      </div>

      {/* Centered payment panel */}
      <div className="relative z-10 flex items-center justify-center min-h-screen px-4 py-10">
        <div className="w-full max-w-2xl">
          <PaymentPanel
            amount={amount}
            walletBalance={walletBalance}
            processing={processing}
            error={error}
            fieldErrors={fieldErrors}
            onPay={onPay}
          />
          <Link to="/cart" className="inline-block mt-4 text-sm text-accent-blue hover:underline">
            Back to cart
          </Link>
        </div>
      </div>
    </div>
  );
}
