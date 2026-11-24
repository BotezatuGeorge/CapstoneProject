import { useState } from 'react';
import { Purchase } from '@carbon/icons-react';
import { Button, BookArt, Notice } from '../atoms';
import { useCart } from '../../context/cart';
import { formatMoney as money } from '../../lib/money';
import { errorMessage } from '../../services';

interface OrderSummaryProps {
  onPayNow: () => void;
  /** Disables Pay Now while the address is being validated. */
  paying?: boolean;
}

export function OrderSummary({ onPayNow, paying = false }: OrderSummaryProps) {
  const { quote, coupon, busy, applyCoupon, removeCoupon } = useCart();
  const [code, setCode] = useState('');
  const [couponError, setCouponError] = useState<string | null>(null);

  const handleApply = async () => {
    setCouponError(null);
    try {
      await applyCoupon(code);
      setCode('');
    } catch (error) {
      setCouponError(errorMessage(error));
    }
  };

  return (
    <div className="card flex flex-col sm:flex-row gap-6 h-full p-6">
      {/* Decorative art (left column in the mockup) */}
      <div className="hidden sm:block w-40 flex-shrink-0 overflow-hidden">
        <BookArt variant="panel" />
      </div>

      <div className="flex-1 flex flex-col gap-4">
        <h2 className="text-xl font-light text-[#f4f4f4]">Grand Total</h2>

        <div className="flex flex-col gap-3 text-sm text-[#f4f4f4]">
          <div className="flex justify-between">
            <span>Price ({quote.itemCount} items)</span>
            <span>{money(quote.subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span>Tax</span>
            <span>{money(quote.tax)}</span>
          </div>
          <div className="flex justify-between">
            <span>Delivery Charges</span>
            <span>{quote.shipping === 0 ? 'Free' : money(quote.shipping)}</span>
          </div>
        </div>

        <hr className="border-0 border-t border-border" />

        {/* Coupon: underlined field with a square Apply button on the right */}
        {coupon && quote.couponApplied ? (
          <div className="flex items-center justify-between text-sm">
            <span className="text-[#42be65]">{coupon.code} applied</span>
            <button type="button" onClick={() => void removeCoupon()} className="text-link hover:underline">
              Remove
            </button>
          </div>
        ) : (
          <div className="flex items-stretch">
            <input
              className="input-base !bg-transparent px-4 py-2"
              placeholder="Apply Coupon"
              aria-label="Apply Coupon"
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
            <Button
              variant="primary"
              size="sm"
              onClick={() => void handleApply()}
              disabled={busy || !code.trim()}
              className="flex-shrink-0 px-6"
            >
              Apply
            </Button>
          </div>
        )}
        {couponError && <Notice kind="error">{couponError}</Notice>}
        {coupon && !quote.couponApplied && (
          <Notice kind="warning">
            {coupon.code} needs a minimum order of {money(coupon.minOrder)}.
          </Notice>
        )}

        <div className="flex justify-between text-sm text-[#f4f4f4]">
          <span>Discount</span>
          <span>{quote.discount > 0 ? `−${money(quote.discount)}` : money(0)}</span>
        </div>

        <hr className="border-0 border-t border-border" />

        <div className="flex justify-between text-sm font-semibold text-white">
          <span>Total Amount</span>
          <span>{money(quote.total)}</span>
        </div>

        <Button
          variant="primary"
          size="md"
          onClick={onPayNow}
          disabled={paying || busy || quote.itemCount === 0}
          icon={<Purchase size={16} />}
          className="self-end"
        >
          {paying ? 'Checking…' : 'Pay Now'}
        </Button>
      </div>
    </div>
  );
}
