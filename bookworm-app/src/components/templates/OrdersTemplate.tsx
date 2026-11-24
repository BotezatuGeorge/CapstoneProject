import { Link } from 'react-router-dom';
import { Button, Notice } from '../atoms';
import { BreadcrumbNav } from '../molecules';
import { formatMoney } from '../../lib/money';
import type { OrderStatus, OrderView } from '../../types';

interface OrdersTemplateProps {
  orders: OrderView[];
  isGuest: boolean;
  /** Order id with an action in flight, so its buttons can be disabled. */
  busyOrderId: string | null;
  feedback: { kind: 'error' | 'success'; message: string } | null;
  onCancel: (orderId: string) => void;
  onReturn: (orderId: string) => void;
  onBuyAgain: (orderId: string) => void;
}

const STATUS_STYLE: Record<OrderStatus, string> = {
  PENDING: 'text-[#f1c21b]',
  CONFIRMED: 'text-[#78a9ff]',
  SHIPPED: 'text-[#78a9ff]',
  DELIVERED: 'text-[#42be65]',
  CANCELLED: 'text-[#ff8389]',
  RETURNED: 'text-[#ff8389]',
};

const money = formatMoney;

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });

function formatRemaining(ms: number): string {
  const totalMinutes = Math.floor(ms / 60_000);
  return `${Math.floor(totalMinutes / 60)}h ${totalMinutes % 60}m`;
}

export function OrdersTemplate({ orders, isGuest, busyOrderId, feedback, onCancel, onReturn, onBuyAgain }: OrdersTemplateProps) {
  return (
    <div className="py-4">
      <BreadcrumbNav crumbs={[{ label: 'Home', href: '/' }, { label: 'My Orders' }]} />
      <h1 className="text-xl font-light text-[#f4f4f4] mb-4">My Orders</h1>

      {feedback && <Notice kind={feedback.kind} className="mb-4">{feedback.message}</Notice>}

      {orders.length === 0 ? (
        <div className="card p-10 text-center text-muted">
          <p>{isGuest ? 'Guests have no order history. Switch to a customer account from the account menu.' : 'You have not placed any orders yet.'}</p>
          <Link to="/" className="text-link hover:underline text-sm mt-3 inline-block">Start shopping</Link>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {orders.map((order) => {
            const busy = busyOrderId === order.id;
            return (
              <article key={order.id} className="card p-5 flex flex-col gap-4">
                <header className="flex flex-wrap items-baseline justify-between gap-2">
                  <div>
                    <h2 className="text-base font-semibold text-white">{order.id}</h2>
                    <p className="text-xs text-muted">Placed {formatDate(order.placedAt)}</p>
                  </div>
                  <span className={`text-sm font-semibold ${STATUS_STYLE[order.status]}`}>{order.status}</span>
                </header>

                <ul className="flex flex-col gap-3">
                  {order.items.map(({ book, quantity }) => (
                    <li key={book.id} className="flex gap-3">
                      <img src={book.coverImage} alt={book.title} className="w-12 h-[72px] object-cover flex-shrink-0" />
                      <div className="min-w-0 text-sm">
                        <Link to={`/book/${book.id}`} className="text-white font-semibold hover:text-link">{book.title}</Link>
                        <p className="text-xs text-muted">by {book.author} · {book.format} · Qty {quantity}</p>
                        <p className="text-xs text-muted">{money(book.price * quantity)}</p>
                      </div>
                    </li>
                  ))}
                </ul>

                <dl className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-surface-overlay p-3">
                  <div><dt className="text-helper">Total</dt><dd className="text-white font-semibold">{money(order.totalAmount)}</dd></div>
                  <div><dt className="text-helper">Payment</dt><dd className="text-white">{order.payment.status}</dd></div>
                  <div><dt className="text-helper">Tracking</dt><dd className="text-white">{order.shipment.trackingNumber}</dd></div>
                  <div>
                    <dt className="text-helper">{order.status === 'DELIVERED' ? 'Delivered' : 'Estimated delivery'}</dt>
                    <dd className="text-white">{formatDate(order.tentativeDeliveryDate)}</dd>
                  </div>
                </dl>

                <footer className="flex flex-wrap items-center gap-3">
                  <Button variant="primary" size="sm" disabled={busy} onClick={() => onBuyAgain(order.id)}>Buy it again</Button>
                  {order.canCancel && (
                    <Button variant="secondary" size="sm" disabled={busy} onClick={() => onCancel(order.id)}>Cancel order</Button>
                  )}
                  {order.canReturn && (
                    <Button variant="secondary" size="sm" disabled={busy} onClick={() => onReturn(order.id)}>Return order</Button>
                  )}
                  {order.canCancel && (
                    <span className="text-xs text-muted">Free cancellation for {formatRemaining(order.cancelMsRemaining)}</span>
                  )}
                  {order.status === 'CANCELLED' && <span className="text-xs text-muted">Refunded to your original payment method</span>}
                </footer>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
