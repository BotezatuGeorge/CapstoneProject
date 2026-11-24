import { CartItemRow, BreadcrumbNav } from '../molecules';
import { AddressForm, OrderSummary } from '../organisms';
import type { CartItem, AddressFormData } from '../../types';

interface CartTemplateProps {
  items: CartItem[];
  onQuantityChange: (bookId: string, qty: number) => void;
  address: AddressFormData;
  onAddressChange: (data: AddressFormData) => void;
  onPayNow: () => void;
}

const CRUMBS = [
  { label: 'Home', href: '/' },
  { label: 'Non-Fiction', href: '/catalog?genre=non-fiction' },
  { label: 'Self Help', href: '/catalog?genre=self-help' },
  { label: 'Joy of Minimalism', href: '/book/joy-of-minimalism' },
  { label: 'Checkout' },
];

export function CartTemplate({
  items,
  onQuantityChange,
  address,
  onAddressChange,
  onPayNow,
}: CartTemplateProps) {
  return (
    <div className="py-4">
      <BreadcrumbNav crumbs={CRUMBS} />
      <h1 className="text-xl font-light text-[#f4f4f4] mb-4">Shopping Cart</h1>

      {items.length === 0 ? (
        <div className="card p-10 text-center text-muted">
          <p className="text-base">Your cart is empty.</p>
        </div>
      ) : (
        <>
          {/* Cart items grid */}
          <div className="card mb-6 overflow-hidden p-2">
            <div className="grid grid-cols-1 md:grid-cols-2">
              {items.map((item) => (
                <CartItemRow
                  key={item.book.id}
                  item={item}
                  onQuantityChange={onQuantityChange}
                />
              ))}
            </div>
          </div>

          {/* Address + Summary */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            {/* Address form takes ~3/5 width */}
            <div className="lg:col-span-3 card p-6">
              <AddressForm value={address} onChange={onAddressChange} />
            </div>
            {/* Order summary takes ~2/5 width */}
            <div className="lg:col-span-2">
              <OrderSummary onPayNow={onPayNow} />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
