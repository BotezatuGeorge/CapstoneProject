import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Spinner } from './Spinner';

describe('Spinner', () => {
  it('is announced as Loading', () => {
    render(<Spinner />);
    expect(screen.getByLabelText('Loading')).toBeInTheDocument();
  });

  it('defaults to 20px', () => {
    render(<Spinner />);
    const svg = screen.getByLabelText('Loading');
    expect(svg).toHaveAttribute('width', '20');
    expect(svg).toHaveAttribute('height', '20');
  });

  it('accepts a custom size', () => {
    render(<Spinner size={40} />);
    const svg = screen.getByLabelText('Loading');
    expect(svg).toHaveAttribute('width', '40');
    expect(svg).toHaveAttribute('height', '40');
  });

  it('spins', () => {
    render(<Spinner />);
    expect(screen.getByLabelText('Loading')).toHaveClass('animate-spin');
  });
});
