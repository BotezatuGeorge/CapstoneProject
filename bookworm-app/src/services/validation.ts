import type { Address } from '../types';
import { ApiError } from './mock';

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateAddress(address: Address): void {
  const errors: Record<string, string> = {};
  if (!address.firstName.trim()) errors.firstName = 'First name is required';
  if (!address.lastName.trim()) errors.lastName = 'Last name is required';
  if (!address.addressLine.trim()) errors.addressLine = 'Address is required';
  if (!EMAIL.test(address.email.trim())) errors.email = 'Enter a valid e-mail address';
  if (!address.city.trim()) errors.city = 'City is required';
  if (!/^\d{6}$/.test(address.pin.trim())) errors.pin = 'Pin must be 6 digits';
  if (!/^\d{10}$/.test(address.phone.trim())) errors.phone = 'Phone must be 10 digits';
  if (!address.state.trim()) errors.state = 'State is required';
  if (!address.country.trim()) errors.country = 'Country is required';
  if (Object.keys(errors).length > 0) {
    throw new ApiError('VALIDATION', 'Please correct the highlighted address fields', errors);
  }
}
