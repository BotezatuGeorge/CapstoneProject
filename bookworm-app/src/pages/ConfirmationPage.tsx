import { useNavigate, useParams } from 'react-router-dom';
import { Navbar } from '../components/organisms';
import { ConfirmationTemplate, PageMessage } from '../components/templates';
import { useAsync } from '../hooks/useAsync';
import { errorMessage, orderService } from '../services';

export function ConfirmationPage() {
  const { orderId = '' } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const order = useAsync(() => orderService.getOrder(orderId), [orderId]);

  return (
    <div className="flex flex-col min-h-screen bg-surface">
      <Navbar />
      {order.data ? (
        <ConfirmationTemplate
          order={order.data}
          onContinueShopping={() => navigate('/')}
          onViewOrders={() => navigate('/orders')}
        />
      ) : (
        <PageMessage loading={order.loading}>{order.error ? errorMessage(order.error) : 'Loading your order…'}</PageMessage>
      )}
    </div>
  );
}
