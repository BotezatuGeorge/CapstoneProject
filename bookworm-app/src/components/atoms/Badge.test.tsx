import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Badge } from './Badge';

describe('Badge', () => {
  it('renders nothing when the count is zero or negative', () => {
    const { container, rerender } = render(<Badge count={0} />);
    expect(container).toBeEmptyDOMElement();
    rerender(<Badge count={-3} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('shows the count', () => {
    render(<Badge count={7} />);
    expect(screen.getByText('7')).toBeInTheDocument();
  });

  it('caps the display at 99+', () => {
    render(<Badge count={100} />);
    expect(screen.getByText('99+')).toBeInTheDocument();
  });

  it('shows 99 without the plus sign', () => {
    render(<Badge count={99} />);
    expect(screen.getByText('99')).toBeInTheDocument();
  });

  it('merges a custom className', () => {
    render(<Badge count={1} className="custom-class" />);
    expect(screen.getByText('1')).toHaveClass('custom-class');
  });
});
