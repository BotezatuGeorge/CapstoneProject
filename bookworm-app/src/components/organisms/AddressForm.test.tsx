import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { makeAddressForm } from '../../test/fixtures';
import type { AddressFormData } from '../../types';
import { AddressForm } from './AddressForm';

/** Controlled wrapper so typing accumulates like it does in the real page. */
function Harness({ onChange }: { onChange?: (data: AddressFormData) => void }) {
  const [value, setValue] = useState(makeAddressForm());
  return (
    <AddressForm
      value={value}
      onChange={(next) => {
        setValue(next);
        onChange?.(next);
      }}
    />
  );
}

describe('AddressForm', () => {
  it('renders every address field', () => {
    render(<AddressForm value={makeAddressForm()} onChange={() => {}} />);
    ['First Name', 'Last Name', 'Address', 'e-mail', 'City', 'Pin', 'Phone Number', 'State', 'Country'].forEach((label) => {
      expect(screen.getByLabelText(label)).toBeInTheDocument();
    });
    expect(screen.getByLabelText('Country code')).toBeInTheDocument();
  });

  it('shows the values it is given', () => {
    render(<AddressForm value={makeAddressForm({ firstName: 'Aarav', city: 'Bengaluru' })} onChange={() => {}} />);
    expect(screen.getByLabelText('First Name')).toHaveValue('Aarav');
    expect(screen.getByLabelText('City')).toHaveValue('Bengaluru');
  });

  it('reports the whole updated address when a field changes', async () => {
    const onChange = vi.fn();
    render(<Harness onChange={onChange} />);
    await userEvent.type(screen.getByLabelText('City'), 'P');
    expect(onChange).toHaveBeenLastCalledWith(expect.objectContaining({ city: 'P', country: 'India', phoneCountry: '+91' }));
  });

  it('keeps digits only in the pin and limits it to 6', async () => {
    render(<Harness />);
    const pin = screen.getByLabelText('Pin');
    await userEvent.type(pin, '56a0b0017');
    expect(pin).toHaveValue('560001');
  });

  it('keeps digits only in the phone number and limits it to 10', async () => {
    render(<Harness />);
    const phone = screen.getByLabelText('Phone Number');
    await userEvent.type(phone, '98-76 54321012');
    expect(phone).toHaveValue('9876543210');
  });

  it('changes the country code and the country', async () => {
    const onChange = vi.fn();
    render(<Harness onChange={onChange} />);
    await userEvent.selectOptions(screen.getByLabelText('Country code'), '+44');
    expect(onChange).toHaveBeenLastCalledWith(expect.objectContaining({ phoneCountry: '+44' }));
    await userEvent.selectOptions(screen.getByLabelText('Country'), 'UK');
    expect(onChange).toHaveBeenLastCalledWith(expect.objectContaining({ country: 'UK' }));
  });

  it('updates the text fields', async () => {
    const onChange = vi.fn();
    render(<Harness onChange={onChange} />);
    await userEvent.type(screen.getByLabelText('First Name'), 'A');
    expect(onChange).toHaveBeenLastCalledWith(expect.objectContaining({ firstName: 'A' }));
    await userEvent.type(screen.getByLabelText('Last Name'), 'B');
    expect(onChange).toHaveBeenLastCalledWith(expect.objectContaining({ lastName: 'B' }));
    await userEvent.type(screen.getByLabelText('Address'), 'C');
    expect(onChange).toHaveBeenLastCalledWith(expect.objectContaining({ addressLine: 'C' }));
    await userEvent.type(screen.getByLabelText('e-mail'), 'd');
    expect(onChange).toHaveBeenLastCalledWith(expect.objectContaining({ email: 'd' }));
    await userEvent.type(screen.getByLabelText('State'), 'E');
    expect(onChange).toHaveBeenLastCalledWith(expect.objectContaining({ state: 'E' }));
  });

  it('shows the field errors next to the fields', () => {
    render(
      <AddressForm
        value={makeAddressForm()}
        onChange={() => {}}
        errors={{ firstName: 'First name is required', pin: 'Enter a 6-digit pin', phone: 'Enter a valid phone' }}
      />
    );
    expect(screen.getByText('First name is required')).toBeInTheDocument();
    expect(screen.getByText('Enter a 6-digit pin')).toBeInTheDocument();
    expect(screen.getByText('Enter a valid phone')).toBeInTheDocument();
  });

  it('shows the country error on the country select', () => {
    render(<AddressForm value={makeAddressForm()} onChange={() => {}} errors={{ country: 'Choose a country' }} />);
    expect(screen.getByText('Choose a country')).toBeInTheDocument();
    expect(screen.getByLabelText('Country')).toHaveClass('border-red-500');
  });

  it('shows no error styling by default', () => {
    render(<AddressForm value={makeAddressForm()} onChange={() => {}} />);
    expect(screen.getByLabelText('First Name')).not.toHaveClass('border-red-500');
  });

  it('toggles the saved address checkbox', async () => {
    const onChange = vi.fn();
    render(<Harness onChange={onChange} />);
    await userEvent.click(screen.getByLabelText('Use Saved Address'));
    expect(onChange).toHaveBeenLastCalledWith(expect.objectContaining({ useSaved: true }));
  });

  it('disables the saved address option for users without one', () => {
    render(<AddressForm value={makeAddressForm()} onChange={() => {}} hasSavedAddress={false} />);
    expect(screen.getByLabelText('Use Saved Address (sign in as a customer)')).toBeDisabled();
  });

  it('shows the email field as an email input', () => {
    render(<AddressForm value={makeAddressForm()} onChange={() => {}} />);
    expect(screen.getByLabelText('e-mail')).toHaveAttribute('type', 'email');
  });
});
