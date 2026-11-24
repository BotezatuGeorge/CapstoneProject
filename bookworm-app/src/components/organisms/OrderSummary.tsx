import { useState } from 'react';
import { Purchase } from '@carbon/icons-react';
import { Button, BookArt, Notice } from '../atoms';
import { useCart } from '../../context/cart';
import { useSession } from '../../context/session';
import { storePolicy } from '../../data';
import { formatMoney as money } from '../../lib/money';
import { errorMessage } from '../../services';

interface OrderSummaryProps {
  onPayNow: () => void;
  /** Disables Pay Now while the address is being validated. */
  paying?: boolean;
}

export function OrderSummary({ onPayNow, paying = false }: OrderSummaryProps) {
  const { quote, coupon, busy, applyCoupon, removeCoupon, redeemPoints, removePoints } = useCart();
  const { user } = useSession();
  const [code, setCode] = useState('');
  const [couponError, setCouponError] = useState<string | null>(null);
  const [points, setPoints] = useState('');
  const [pointsError, setPointsError] = useState<string | null>(null);

  const handleApply = async () => {
    setCouponError(null);
    try {
      await applyCoupon(code);
      setCode('');
    } catch (error) {
      setCouponError(errorMessage(error));
    }
  };

  const handleRedeem = async () => {
    setPointsError(null);
    try {
      await redeemPoints(Number(points));
      setPoints('');
    } catch (error) {
      setPointsError(errorMessage(error));
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

        {/* Gift points: customers only; capped by balance and by the store policy */}
        {user.role === 'GUEST' ? (
          <p className="text-xs text-helper">Sign in as a customer to redeem gift points.</p>
        ) : quote.pointsRedeemed > 0 ? (
          <div className="flex items-center justify-between text-sm">
            <span className="text-[#42be65]">{quote.pointsRedeemed} gift points applied</span>
            <button
              type="button"
              aria-label="Remove gift points"
              onClick={() => void removePoints()}
              className="text-link hover:underline"
            >
              Remove
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-1">
            <div className="flex items-stretch">
              <input
                className="input-base !bg-transparent px-4 py-2"
                placeholder="Redeem Gift Points"
                aria-label="Gift points to redeem"
                inputMode="numeric"
                value={points}
                onChange={(e) => setPoints(e.target.value.replace(/\D/g, ''))}
              />
              <Button
                variant="primary"
                size="sm"
                onClick={() => void handleRedeem()}
                disabled={busy || !points.trim() || quote.itemCount === 0}
                className="flex-shrink-0 px-6"
              >
                Redeem
              </Button>
            </div>
            <p className="text-xs text-helper">
              You have {user.giftPoints} points · 1 point = {money(storePolicy.pointValue)}
            </p>
          </div>
        )}
        {pointsError && <Notice kind="error">{pointsError}</Notice>}

        <div className="flex justify-between text-sm text-[#f4f4f4]">
          <span>Discount</span>
          <span>{quote.discount > 0 ? `−${money(quote.discount)}` : money(0)}</span>
        </div>
        {quote.pointsRedeemed > 0 && (
          <div className="flex justify-between text-sm text-[#f4f4f4]">
            <span>Gift points</span>
            <span>−{money(quote.pointsDiscount)}</span>
          </div>
        )}

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
