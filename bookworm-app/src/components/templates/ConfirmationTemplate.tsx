import { CheckmarkFilled, Catalog } from '@carbon/icons-react';
import { Button, BookArt } from '../atoms';
import { RelatedBookCard } from '../molecules';
import { formatMoney } from '../../lib/money';
import type { OrderView } from '../../types';

interface ConfirmationTemplateProps {
  order: OrderView;
  onContinueShopping: () => void;
  onViewOrders: () => void;
}

const formatDate = (iso: string) =>
  new Date(iso).toLocaleString('en-US', { weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });

export function ConfirmationTemplate({ order, onContinueShopping, onViewOrders }: ConfirmationTemplateProps) {
  return (
    <div className="relative min-h-screen">
      <div className="absolute inset-0 z-0">
        <BookArt variant="backdrop" />
      </div>

      {/* Confirmation card */}
      <div className="relative z-10 flex items-center justify-center min-h-screen px-4 py-10">
        <div className="card w-full max-w-2xl p-8 flex flex-col items-center gap-6">
          {/* Success icon */}
          <CheckmarkFilled size={48} className="text-[#24a148]" aria-label="Success" />

          <p className="text-center text-white text-base leading-relaxed max-w-sm">
            Your purchase of the following reads is successful
          </p>

          {/* Purchased items */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">
            {order.items.map((item) => (
              <RelatedBookCard key={item.book.id} book={item.book} />
            ))}
          </div>

          {/* Order receipt */}
          <dl className="w-full bg-surface-overlay p-4 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-sm">
            <div className="flex justify-between gap-4"><dt className="text-muted">Order</dt><dd className="text-white">{order.id}</dd></div>
            <div className="flex justify-between gap-4"><dt className="text-muted">Total paid</dt><dd className="text-white font-semibold">{formatMoney(order.totalAmount)}</dd></div>
            <div className="flex justify-between gap-4"><dt className="text-muted">Payment ref</dt><dd className="text-white">{order.payment.transactionRef}</dd></div>
            {order.pointsRedeemed > 0 && (
              <div className="flex justify-between gap-4"><dt className="text-muted">Gift points used</dt><dd className="text-white">−{order.pointsRedeemed} ({formatMoney(order.pointsDiscount)})</dd></div>
            )}
            <div className="flex justify-between gap-4"><dt className="text-muted">Gift points earned</dt><dd className="text-white">+{order.pointsEarned}</dd></div>
            <div className="flex justify-between gap-4"><dt className="text-muted">Tracking</dt><dd className="text-white">{order.shipment.trackingNumber}</dd></div>
            <div className="flex justify-between gap-4"><dt className="text-muted">Free cancellation until</dt><dd className="text-white">{formatDate(order.cancellationDeadline)}</dd></div>
          </dl>

          <div className="flex flex-wrap justify-center gap-3">
            <Button variant="primary" size="md" onClick={onContinueShopping} icon={<GridIcon />}>
              Continue your Shopping
            </Button>
            <Button variant="secondary" size="md" onClick={onViewOrders}>
              View my orders
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function GridIcon() {
  return <Catalog size={16} />;
}
