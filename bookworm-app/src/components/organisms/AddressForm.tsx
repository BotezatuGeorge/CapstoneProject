import { Input, Select, Checkbox } from '../atoms';
import type { AddressFormData } from '../../types';

interface AddressFormProps {
  value: AddressFormData;
  onChange: (data: AddressFormData) => void;
  /** Field errors keyed by address field name, as returned by the validation service. */
  errors?: Record<string, string>;
  /** Shown next to the "Use Saved Address" checkbox; the box is disabled when there is none. */
  hasSavedAddress?: boolean;
}

const COUNTRY_CODES = [
  { label: '+91', value: '+91' },
  { label: '+1', value: '+1' },
  { label: '+44', value: '+44' },
  { label: '+61', value: '+61' },
];

const COUNTRIES = [
  { label: 'India', value: 'India' },
  { label: 'USA', value: 'USA' },
  { label: 'UK', value: 'UK' },
  { label: 'Australia', value: 'Australia' },
];

export function AddressForm({ value, onChange, errors = {}, hasSavedAddress = true }: AddressFormProps) {
  const set = (field: Partial<AddressFormData>) => onChange({ ...value, ...field });

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-xl font-light text-[#f4f4f4]">Address</h2>

      <Checkbox
        label={hasSavedAddress ? 'Use Saved Address' : 'Use Saved Address (sign in as a customer)'}
        checked={value.useSaved}
        disabled={!hasSavedAddress}
        onChange={(e) => set({ useSaved: e.target.checked })}
      />

      {/* Row 1 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        <Input
          label="First Name"
          placeholder="First Name"
          value={value.firstName}
          error={errors.firstName}
          onChange={(e) => set({ firstName: e.target.value })}
        />
        <Input
          label="Last Name"
          placeholder="Last Name"
          value={value.lastName}
          error={errors.lastName}
          onChange={(e) => set({ lastName: e.target.value })}
        />
        <Input
          label="Address"
          placeholder="Address Line 2"
          value={value.addressLine}
          error={errors.addressLine}
          onChange={(e) => set({ addressLine: e.target.value })}
        />
      </div>

      {/* Row 2 */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <Input
          label="e-mail"
          type="email"
          placeholder="e-mail"
          value={value.email}
          error={errors.email}
          onChange={(e) => set({ email: e.target.value })}
        />
        <Input
          label="City"
          placeholder="City"
          value={value.city}
          error={errors.city}
          onChange={(e) => set({ city: e.target.value })}
        />
        <Input
          label="Pin"
          placeholder="000000"
          inputMode="numeric"
          maxLength={6}
          value={value.pin}
          error={errors.pin}
          onChange={(e) => set({ pin: e.target.value.replace(/\D/g, '') })}
        />
      </div>

      {/* Row 3 */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Phone with country code */}
        <div className="flex flex-col gap-1">
          <span className="text-xs text-muted">Phone Number</span>
          <div className="flex gap-2">
            <Select
              aria-label="Country code"
              options={COUNTRY_CODES}
              value={value.phoneCountry}
              onChange={(e) => set({ phoneCountry: e.target.value })}
              className="w-20 flex-shrink-0"
            />
            <Input
              aria-label="Phone Number"
              placeholder="12345567890"
              inputMode="numeric"
              maxLength={10}
              value={value.phone}
              error={errors.phone}
              onChange={(e) => set({ phone: e.target.value.replace(/\D/g, '') })}
            />
          </div>
        </div>
        <Input
          label="State"
          placeholder="State"
          value={value.state}
          error={errors.state}
          onChange={(e) => set({ state: e.target.value })}
        />
        <Select
          label="Country"
          options={COUNTRIES}
          value={value.country}
          error={errors.country}
          onChange={(e) => set({ country: e.target.value })}
        />
      </div>
    </div>
  );
}
