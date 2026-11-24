import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '../components/organisms';
import { PageMessage, PaymentTemplate } from '../components/templates';
import { useCart } from '../context/cart';
import { useSession } from '../context/session';
import { useAsync } from '../hooks/useAsync';
import { cartService, errorMessage, fieldErrorsOf, orderService } from '../services';
import type { PaymentRequest } from '../types';

export function PaymentPage() {
  const { quote, items, loaded, refresh } = useCart();
  const { user, refreshUser } = useSession();
  const navigate = useNavigate();
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const completed = useRef(false);

  const address = useAsync(() => cartService.getDeliveryAddress(), [user.id]);

  // A payment needs items and a validated address; otherwise send the user back to checkout.
  useEffect(() => {
    if (completed.current || !loaded || address.loading) return;
    if (items.length === 0 || !address.data) navigate('/cart', { replace: true });
  }, [loaded, items.length, address.loading, address.data, navigate]);

  const handlePay = async (request: PaymentRequest) => {
    setProcessing(true);
    setError(null);
    setFieldErrors({});
    try {
      const order = await orderService.placeOrder(request);
      completed.current = true;
      navigate(`/confirmation/${order.id}`, { replace: true });
      await Promise.all([refresh(), refreshUser()]);
    } catch (err) {
      setFieldErrors(fieldErrorsOf(err));
      setError(errorMessage(err));
      setProcessing(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-surface">
      <Navbar />
      {!loaded || address.loading ? (
        <PageMessage loading>Preparing checkout…</PageMessage>
      ) : (
        <PaymentTemplate
          amount={quote.total}
          walletBalance={user.walletBalance}
          processing={processing}
          error={error}
          fieldErrors={fieldErrors}
          onPay={(request) => void handlePay(request)}
        />
      )}
    </div>
  );
}
