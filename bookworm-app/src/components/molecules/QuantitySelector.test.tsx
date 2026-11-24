import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { QuantitySelector } from './QuantitySelector';

const increase = () => screen.getByRole('button', { name: 'Increase quantity' });
const decrease = () => screen.getByRole('button', { name: 'Decrease quantity' });

describe('QuantitySelector', () => {
  it('shows the current value', () => {
    render(<QuantitySelector value={4} onChange={() => {}} />);
    expect(screen.getByText('4')).toBeInTheDocument();
  });

  it('increments by one', async () => {
    const onChange = vi.fn();
    render(<QuantitySelector value={2} onChange={onChange} />);
    await userEvent.click(increase());
    expect(onChange).toHaveBeenCalledWith(3);
  });

  it('decrements by one', async () => {
    const onChange = vi.fn();
    render(<QuantitySelector value={2} onChange={onChange} />);
    await userEvent.click(decrease());
    expect(onChange).toHaveBeenCalledWith(1);
  });

  it('disables decrease at the default minimum of 1', async () => {
    const onChange = vi.fn();
    render(<QuantitySelector value={1} onChange={onChange} />);
    expect(decrease()).toBeDisabled();
    await userEvent.click(decrease());
    expect(onChange).not.toHaveBeenCalled();
  });

  it('respects a custom minimum', () => {
    render(<QuantitySelector value={0} min={0} onChange={() => {}} />);
    expect(decrease()).toBeDisabled();
    expect(increase()).toBeEnabled();
  });

  it('disables increase at the maximum', async () => {
    const onChange = vi.fn();
    render(<QuantitySelector value={3} max={3} onChange={onChange} />);
    expect(increase()).toBeDisabled();
    await userEvent.click(increase());
    expect(onChange).not.toHaveBeenCalled();
  });

  it('allows increasing up to 99 by default', () => {
    const { rerender } = render(<QuantitySelector value={98} onChange={() => {}} />);
    expect(increase()).toBeEnabled();
    rerender(<QuantitySelector value={99} onChange={() => {}} />);
    expect(increase()).toBeDisabled();
  });

  it('is underlined rather than boxed (Carbon style)', () => {
    const { container } = render(<QuantitySelector value={1} onChange={() => {}} />);
    expect(container.firstElementChild).toHaveClass('border-b');
    expect(container.firstElementChild).not.toHaveClass('border');
  });
});
