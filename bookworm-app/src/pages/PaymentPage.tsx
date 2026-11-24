import { useNavigate } from 'react-router-dom';
import { Navbar } from '../components/organisms';
import { PaymentTemplate } from '../components/templates';
import { useCart } from '../context/CartContext';

export function PaymentPage() {
  const { total, clearCart } = useCart();
  const navigate = useNavigate();

  const handlePay = () => {
    clearCart();
    navigate('/confirmation');
  };

  return (
    <div className="flex flex-col min-h-screen bg-surface">
      <Navbar />
      <PaymentTemplate amount={total} onPay={handlePay} />
    </div>
  );
}
