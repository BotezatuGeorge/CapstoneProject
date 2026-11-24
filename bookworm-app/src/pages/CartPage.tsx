import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageLayout, PageMessage, CartTemplate } from '../components/templates';
import { useCart } from '../context/cart';
import { useSession } from '../context/session';
import { cartService, errorMessage, fieldErrorsOf } from '../services';
import type { Address, AddressFormData } from '../types';

const EMPTY_ADDRESS: AddressFormData = {
  firstName: '',
  lastName: '',
  addressLine: '',
  email: '',
  city: '',
  pin: '',
  phoneCountry: '+91',
  phone: '',
  state: '',
  country: 'India',
  useSaved: false,
};

export function CartPage() {
  const { items, loaded, setQuantity, removeFromCart } = useCart();
  const { user } = useSession();
  const navigate = useNavigate();
  const [address, setAddress] = useState<AddressFormData>(EMPTY_ADDRESS);
  const [addressErrors, setAddressErrors] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);
  const [checkingOut, setCheckingOut] = useState(false);

  const handleAddressChange = (next: AddressFormData) => {
    if (next.useSaved && !address.useSaved && user.savedAddress) {
      setAddress({ ...user.savedAddress, useSaved: true });
    } else if (!next.useSaved && address.useSaved) {
      setAddress({ ...EMPTY_ADDRESS });
    } else {
      setAddress(next);
    }
    setAddressErrors({});
  };

  const guard = async (action: Promise<unknown>) => {
    setError(null);
    try {
      await action;
    } catch (err) {
      setError(errorMessage(err));
    }
  };

  const handlePayNow = async () => {
    setCheckingOut(true);
    setError(null);
    setAddressErrors({});
    try {
      const { useSaved: _useSaved, ...details } = address;
      await cartService.saveDeliveryAddress(details as Address);
      navigate('/payment');
    } catch (err) {
      setAddressErrors(fieldErrorsOf(err));
      setError(errorMessage(err));
    } finally {
      setCheckingOut(false);
    }
  };

  if (!loaded) {
    return (
      <PageLayout>
        <PageMessage loading>Loading your cart…</PageMessage>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <CartTemplate
        items={items}
        onQuantityChange={(bookId, qty) => void guard(setQuantity(bookId, qty))}
        onRemove={(bookId) => void guard(removeFromCart(bookId))}
        address={address}
        onAddressChange={handleAddressChange}
        addressErrors={addressErrors}
        hasSavedAddress={user.savedAddress !== null}
        error={error}
        checkingOut={checkingOut}
        onPayNow={() => void handlePayNow()}
      />
    </PageLayout>
  );
}
