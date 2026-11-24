import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageLayout, CartTemplate } from '../components/templates';
import { useCart } from '../context/CartContext';
import type { AddressFormData } from '../types';

const DEFAULT_ADDRESS: AddressFormData = {
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
  const { items, updateQuantity } = useCart();
  const navigate = useNavigate();
  const [address, setAddress] = useState<AddressFormData>(DEFAULT_ADDRESS);

  const handlePayNow = () => {
    navigate('/payment');
  };

  return (
    <PageLayout>
      <CartTemplate
        items={items}
        onQuantityChange={updateQuantity}
        address={address}
        onAddressChange={setAddress}
        onPayNow={handlePayNow}
      />
    </PageLayout>
  );
}
