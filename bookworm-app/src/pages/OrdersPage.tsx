import { useState } from 'react';
import { PageLayout, PageMessage, OrdersTemplate } from '../components/templates';
import { useCart } from '../context/cart';
import { useSession } from '../context/session';
import { useAsync } from '../hooks/useAsync';
import { errorMessage, orderService } from '../services';

interface Feedback {
  kind: 'error' | 'success';
  message: string;
}

export function OrdersPage() {
  const { user, refreshUser } = useSession();
  const { refresh } = useCart();
  const orders = useAsync(() => orderService.listMyOrders(), [user.id]);
  const [busyOrderId, setBusyOrderId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<Feedback | null>(null);

  const act = async (orderId: string, action: () => Promise<string | void>) => {
    setBusyOrderId(orderId);
    setFeedback(null);
    try {
      const message = await action();
      if (message) setFeedback({ kind: 'success', message });
      orders.reload();
      await refreshUser();
    } catch (error) {
      setFeedback({ kind: 'error', message: errorMessage(error) });
    } finally {
      setBusyOrderId(null);
    }
  };

  const handleBuyAgain = async (orderId: string) => {
    setBusyOrderId(orderId);
    setFeedback(null);
    try {
      const { added, skipped } = await orderService.buyAgain(orderId);
      await refresh();
      if (skipped.length > 0) {
        setFeedback({ kind: 'error', message: `Skipped (out of stock): ${skipped.join(', ')}` });
      } else if (added > 0) {
        setFeedback({ kind: 'success', message: `Added ${added} ${added === 1 ? 'book' : 'books'} to your cart` });
      }
    } catch (error) {
      setFeedback({ kind: 'error', message: errorMessage(error) });
    } finally {
      setBusyOrderId(null);
    }
  };

  if (orders.loading && !orders.data) {
    return (
      <PageLayout>
        <PageMessage loading>Loading your orders…</PageMessage>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <OrdersTemplate
        orders={orders.data ?? []}
        isGuest={user.role === 'GUEST'}
        busyOrderId={busyOrderId}
        feedback={feedback ?? (orders.error ? { kind: 'error', message: errorMessage(orders.error) } : null)}
        onCancel={(id) => void act(id, async () => { await orderService.cancelOrder(id); return 'Order cancelled. Your payment will be refunded.'; })}
        onReturn={(id) => void act(id, async () => { await orderService.returnOrder(id); return 'Return requested. Your refund is on its way.'; })}
        onBuyAgain={(id) => void handleBuyAgain(id)}
      />
    </PageLayout>
  );
}
