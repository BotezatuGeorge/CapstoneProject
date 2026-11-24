import { CheckmarkFilled, Catalog } from '@carbon/icons-react';
import { Button } from '../atoms';
import { RelatedBookCard } from '../molecules';
import type { CartItem } from '../../types';

interface ConfirmationTemplateProps {
  items: CartItem[];
  onContinueShopping: () => void;
}

export function ConfirmationTemplate({ items, onContinueShopping }: ConfirmationTemplateProps) {
  return (
    <div className="relative min-h-screen">
      {/* Background */}
      <div
        className="absolute inset-0 z-0"
        style={{
          background: 'linear-gradient(135deg, #0d2137 0%, #1a3a5c 50%, #0d2137 100%)',
        }}
      >
        <img
          src="https://picsum.photos/seed/book1/300/300"
          alt=""
          aria-hidden="true"
          className="absolute top-8 left-16 w-40 h-48 object-cover opacity-70 rotate-[-15deg]"
        />
        <img
          src="https://picsum.photos/seed/book2/200/280"
          alt=""
          aria-hidden="true"
          className="absolute bottom-16 left-24 w-32 h-44 object-cover opacity-70 rotate-[8deg]"
        />
        <img
          src="https://picsum.photos/seed/book3/180/260"
          alt=""
          aria-hidden="true"
          className="absolute bottom-20 right-1/3 w-32 h-44 object-cover opacity-70 rotate-[-5deg]"
        />
        <img
          src="https://picsum.photos/seed/book4/200/300"
          alt=""
          aria-hidden="true"
          className="absolute top-12 right-16 w-16 h-40 object-cover opacity-70"
        />
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
            {items.map((item) => (
              <RelatedBookCard key={item.book.id} book={item.book} />
            ))}
          </div>

          <Button
            variant="primary"
            size="md"
            onClick={onContinueShopping}
            icon={<GridIcon />}
          >
            Continue your Shopping
          </Button>
        </div>
      </div>
    </div>
  );
}

function GridIcon() {
  return <Catalog size={16} />;
}
