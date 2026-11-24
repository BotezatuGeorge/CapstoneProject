import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Input } from './Input';

describe('Input', () => {
  it('renders a label linked to the input', () => {
    render(<Input label="Card Number" />);
    const input = screen.getByLabelText('Card Number');
    expect(input).toHaveAttribute('id', 'card-number');
  });

  it('renders without a label', () => {
    render(<Input placeholder="Search" />);
    expect(screen.getByPlaceholderText('Search')).toBeInTheDocument();
    expect(document.querySelector('label')).toBeNull();
  });

  it('prefers an explicit id over the label-derived one', () => {
    render(<Input label="Email" id="custom-id" />);
    expect(screen.getByLabelText('Email')).toHaveAttribute('id', 'custom-id');
  });

  it('uses the Carbon filled input class', () => {
    render(<Input label="Name" />);
    expect(screen.getByLabelText('Name')).toHaveClass('input-base');
  });

  it('shows the error message and error styling', () => {
    render(<Input label="CVV" error="CVV must be 3 or 4 digits" />);
    expect(screen.getByText('CVV must be 3 or 4 digits')).toBeInTheDocument();
    expect(screen.getByLabelText('CVV')).toHaveClass('border-red-500');
  });

  it('shows no error text when there is no error', () => {
    render(<Input label="CVV" />);
    expect(screen.getByLabelText('CVV')).not.toHaveClass('border-red-500');
  });

  it('forwards typing to onChange', async () => {
    const onChange = vi.fn();
    render(<Input label="Name" onChange={onChange} />);
    await userEvent.type(screen.getByLabelText('Name'), 'Ann');
    expect(onChange).toHaveBeenCalledTimes(3);
    expect(screen.getByLabelText('Name')).toHaveValue('Ann');
  });

  it('forwards native attributes', () => {
    render(<Input label="Pin" maxLength={6} inputMode="numeric" />);
    const input = screen.getByLabelText('Pin');
    expect(input).toHaveAttribute('maxlength', '6');
    expect(input).toHaveAttribute('inputmode', 'numeric');
  });
});
