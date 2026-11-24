import { useState } from 'react';
import { Purchase } from '@carbon/icons-react';
import { Button } from '../atoms';
import { useCart } from '../../context/CartContext';

interface OrderSummaryProps {
  onPayNow: () => void;
}

export function OrderSummary({ onPayNow }: OrderSummaryProps) {
  const { subtotal, tax, total, discount } = useCart();
  const [coupon, setCoupon] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);

  const handleApplyCoupon = () => {
    if (coupon.trim()) setCouponApplied(true);
  };

  return (
    <div className="card flex flex-col sm:flex-row gap-6 h-full p-6">
      {/* Decorative image (left column in the mockup) */}
      <div className="hidden sm:block w-40 flex-shrink-0 overflow-hidden">
        <img
          src="https://picsum.photos/seed/books-blue/400/700"
          alt="Books"
          className="w-full h-full object-cover"
        />
      </div>

      <div className="flex-1 flex flex-col gap-4">
        <h2 className="text-xl font-light text-[#f4f4f4]">Grand Total</h2>

        <div className="flex flex-col gap-3 text-sm text-[#f4f4f4]">
          <div className="flex justify-between">
            <span>Price ({useCartItemCount()} items)</span>
            <span>₹{subtotal.toLocaleString('en-IN')}.00</span>
          </div>
          <div className="flex justify-between">
            <span>Tax</span>
            <span>₹{tax.toLocaleString('en-IN')}.00</span>
          </div>
          <div className="flex justify-between">
            <span>Delivery Charges</span>
            <span>Free</span>
          </div>
        </div>

        <hr className="border-0 border-t border-border" />

        {/* Coupon: underlined field with a square Apply button on the right */}
        <div className="flex items-stretch">
          <input
            className="input-base !bg-transparent px-4 py-2"
            placeholder="Apply Coupon"
            aria-label="Apply Coupon"
            value={coupon}
            onChange={(e) => setCoupon(e.target.value)}
            disabled={couponApplied}
          />
          <Button
            variant="primary"
            size="sm"
            onClick={handleApplyCoupon}
            disabled={couponApplied || !coupon.trim()}
            className="flex-shrink-0 px-6"
          >
            Apply
          </Button>
        </div>

        <div className="flex justify-between text-sm text-[#f4f4f4]">
          <span>Discount</span>
          <span>₹{discount.toLocaleString('en-IN')}</span>
        </div>

        <hr className="border-0 border-t border-border" />

        <div className="flex justify-between text-sm font-semibold text-white">
          <span>Total Amount</span>
          <span>₹{total.toLocaleString('en-IN')}</span>
        </div>

        <Button variant="primary" size="md" onClick={onPayNow} icon={<PayIcon />} className="self-end">
          Pay Now
        </Button>
      </div>
    </div>
  );
}

function useCartItemCount() {
  const { items } = useCart();
  return items.reduce((s, i) => s + i.quantity, 0);
}

function PayIcon() {
  return <Purchase size={16} />;
}
