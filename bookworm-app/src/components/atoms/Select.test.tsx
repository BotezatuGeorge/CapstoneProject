import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Select } from './Select';

const OPTIONS = [
  { label: 'India', value: 'IN' },
  { label: 'United States', value: 'US' },
];

describe('Select', () => {
  it('renders a label linked to the select', () => {
    render(<Select label="Country" options={OPTIONS} />);
    expect(screen.getByLabelText('Country')).toHaveAttribute('id', 'country');
  });

  it('renders every option', () => {
    render(<Select label="Country" options={OPTIONS} />);
    expect(screen.getAllByRole('option').map((o) => o.textContent)).toEqual(['India', 'United States']);
  });

  it('prefers an explicit id', () => {
    render(<Select label="Country" id="c" options={OPTIONS} />);
    expect(screen.getByLabelText('Country')).toHaveAttribute('id', 'c');
  });

  it('renders without a label', () => {
    render(<Select options={OPTIONS} aria-label="Country" />);
    expect(screen.getByRole('combobox', { name: 'Country' })).toBeInTheDocument();
  });

  it('calls onChange with the chosen value', async () => {
    const onChange = vi.fn();
    render(<Select label="Country" options={OPTIONS} onChange={onChange} />);
    await userEvent.selectOptions(screen.getByLabelText('Country'), 'US');
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(screen.getByLabelText('Country')).toHaveValue('US');
  });

  it('shows the error message and error styling', () => {
    render(<Select label="State" options={OPTIONS} error="State is required" />);
    expect(screen.getByText('State is required')).toBeInTheDocument();
    expect(screen.getByLabelText('State')).toHaveClass('border-red-500');
  });

  it('uses the Carbon filled input class', () => {
    render(<Select label="Country" options={OPTIONS} />);
    expect(screen.getByLabelText('Country')).toHaveClass('input-base');
  });
});
