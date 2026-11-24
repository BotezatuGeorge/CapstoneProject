import { Input, Select, Checkbox } from '../atoms';
import type { AddressFormData } from '../../types';

interface AddressFormProps {
  value: AddressFormData;
  onChange: (data: AddressFormData) => void;
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

export function AddressForm({ value, onChange }: AddressFormProps) {
  const set = (field: Partial<AddressFormData>) => onChange({ ...value, ...field });

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-xl font-light text-[#f4f4f4]">Address</h2>

      <Checkbox
        label="Use Saved Address"
        checked={value.useSaved}
        onChange={(e) => set({ useSaved: e.target.checked })}
      />

      {/* Row 1 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        <Input
          label="First Name"
          placeholder="First Name"
          value={value.firstName}
          onChange={(e) => set({ firstName: e.target.value })}
        />
        <Input
          label="Last Name"
          placeholder="Last Name"
          value={value.lastName}
          onChange={(e) => set({ lastName: e.target.value })}
        />
        <Input
          label="Address"
          placeholder="Address Line 2"
          value={value.addressLine}
          onChange={(e) => set({ addressLine: e.target.value })}
          className="sm:col-span-2 lg:col-span-1"
        />
      </div>

      {/* Row 2 */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <Input
          label="e-mail"
          type="email"
          placeholder="e-mail"
          value={value.email}
          onChange={(e) => set({ email: e.target.value })}
          className="sm:col-span-1"
        />
        <Input
          label="City"
          placeholder="City"
          value={value.city}
          onChange={(e) => set({ city: e.target.value })}
        />
        <Input
          label="Pin"
          placeholder="000000"
          value={value.pin}
          onChange={(e) => set({ pin: e.target.value })}
        />
      </div>

      {/* Row 3 */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Phone with country code */}
        <div className="flex flex-col gap-1">
          <span className="text-xs text-muted">Phone Number</span>
          <div className="flex gap-2">
            <Select
              options={COUNTRY_CODES}
              value={value.phoneCountry}
              onChange={(e) => set({ phoneCountry: e.target.value })}
              className="w-20 flex-shrink-0"
            />
            <Input
              placeholder="12345567890"
              value={value.phone}
              onChange={(e) => set({ phone: e.target.value })}
            />
          </div>
        </div>
        <Input
          label="State"
          placeholder="State"
          value={value.state}
          onChange={(e) => set({ state: e.target.value })}
        />
        <Select
          label="Country"
          options={COUNTRIES}
          value={value.country}
          onChange={(e) => set({ country: e.target.value })}
        />
      </div>
    </div>
  );
}
