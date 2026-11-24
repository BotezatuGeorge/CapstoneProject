import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { PriceDisplay } from './PriceDisplay';

describe('PriceDisplay', () => {
  it('formats the amount as US dollars with cents', () => {
    render(<PriceDisplay amount={12.99} />);
    expect(screen.getByText('$12.99')).toBeInTheDocument();
  });

  it('pads whole amounts to two decimals', () => {
    render(<PriceDisplay amount={8} />);
    expect(screen.getByText('$8.00')).toBeInTheDocument();
  });

  it('uses thousands separators', () => {
    render(<PriceDisplay amount={1234.5} />);
    expect(screen.getByText('$1,234.50')).toBeInTheDocument();
  });

  it('never shows the rupee symbol', () => {
    const { container } = render(<PriceDisplay amount={149} />);
    expect(container).not.toHaveTextContent('₹');
  });

  it.each([
    ['sm', 'text-sm'],
    ['md', 'text-xl'],
    ['lg', 'text-3xl'],
  ] as const)('applies the %s size', (size, expectedClass) => {
    render(<PriceDisplay amount={1} size={size} />);
    expect(screen.getByText('$1.00')).toHaveClass(expectedClass);
  });

  it('defaults to the md size', () => {
    render(<PriceDisplay amount={1} />);
    expect(screen.getByText('$1.00')).toHaveClass('text-xl');
  });

  it('merges a custom className', () => {
    render(<PriceDisplay amount={1} className="mt-2" />);
    expect(screen.getByText('$1.00')).toHaveClass('mt-2');
  });
});
