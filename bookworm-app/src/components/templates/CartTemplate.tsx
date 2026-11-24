import { CartItemRow, BreadcrumbNav } from '../molecules';
import { AddressForm, OrderSummary } from '../organisms';
import { Notice } from '../atoms';
import type { CartItem, AddressFormData } from '../../types';

interface CartTemplateProps {
  items: CartItem[];
  onQuantityChange: (bookId: string, qty: number) => void;
  onRemove: (bookId: string) => void;
  address: AddressFormData;
  onAddressChange: (data: AddressFormData) => void;
  addressErrors: Record<string, string>;
  hasSavedAddress: boolean;
  /** Page-level error, e.g. out of stock or a failed address check. */
  error: string | null;
  checkingOut: boolean;
  onPayNow: () => void;
}

export function CartTemplate({
  items,
  onQuantityChange,
  onRemove,
  address,
  onAddressChange,
  addressErrors,
  hasSavedAddress,
  error,
  checkingOut,
  onPayNow,
}: CartTemplateProps) {
  const lead = items[0]?.book;
  const crumbs = [
    { label: 'Home', href: '/' },
    ...(lead?.genres[0] ? [{ label: lead.genres[0].label, href: `/catalog?genre=${lead.genres[0].slug}` }] : []),
    ...(lead?.genres[1] ? [{ label: lead.genres[1].label, href: `/catalog?genre=${lead.genres[1].slug}` }] : []),
    ...(lead ? [{ label: lead.title, href: `/book/${lead.id}` }] : []),
    { label: 'Checkout' },
  ];

  return (
    <div className="py-4">
      <BreadcrumbNav crumbs={crumbs} />
      <h1 className="text-xl font-light text-[#f4f4f4] mb-4">Shopping Cart</h1>

      {error && <Notice kind="error" className="mb-4">{error}</Notice>}

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
                  onRemove={onRemove}
                />
              ))}
            </div>
          </div>

          {/* Address + Summary */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            {/* Address form takes ~3/5 width */}
            <div className="lg:col-span-3 card p-6">
              <AddressForm
                value={address}
                onChange={onAddressChange}
                errors={addressErrors}
                hasSavedAddress={hasSavedAddress}
              />
            </div>
            {/* Order summary takes ~2/5 width */}
            <div className="lg:col-span-2">
              <OrderSummary onPayNow={onPayNow} paying={checkingOut} />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
