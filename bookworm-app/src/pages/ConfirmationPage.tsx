import { useNavigate } from 'react-router-dom';
import { Navbar } from '../components/organisms';
import { ConfirmationTemplate } from '../components/templates';
import { books } from '../data';
import type { CartItem } from '../types';

// Use hardcoded demo items on the confirmation page
// (cart was cleared after payment)
const DEMO_ITEMS: CartItem[] = [
  { book: books[0], quantity: 1 },
  { book: books[3], quantity: 1 },
];

export function ConfirmationPage() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-screen bg-surface">
      <Navbar />
      <ConfirmationTemplate
        items={DEMO_ITEMS}
        onContinueShopping={() => navigate('/')}
      />
    </div>
  );
}
