import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { StarRating } from './StarRating';

describe('StarRating', () => {
  it('renders five stars by default', () => {
    render(<StarRating rating={3} />);
    expect(screen.getAllByRole('button')).toHaveLength(5);
  });

  it('renders a custom number of stars', () => {
    render(<StarRating rating={2} max={3} />);
    expect(screen.getAllByRole('button')).toHaveLength(3);
  });

  it('labels each star by its position', () => {
    render(<StarRating rating={0} />);
    expect(screen.getByRole('button', { name: '1 star' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '5 star' })).toBeInTheDocument();
  });

  it('fills as many stars as the rating', () => {
    render(<StarRating rating={3} />);
    const stars = screen.getAllByRole('button');
    expect(stars.filter((s) => s.className.includes('text-[#f1c21b]'))).toHaveLength(3);
  });

  it('rounds fractional ratings to the nearest star', () => {
    render(<StarRating rating={3.6} />);
    const filled = screen.getAllByRole('button').filter((s) => s.className.includes('text-[#f1c21b]'));
    expect(filled).toHaveLength(4);
  });

  it('shows no filled stars for a zero rating', () => {
    render(<StarRating rating={0} />);
    const filled = screen.getAllByRole('button').filter((s) => s.className.includes('text-[#f1c21b]'));
    expect(filled).toHaveLength(0);
  });

  it('is read-only by default', async () => {
    const onChange = vi.fn();
    render(<StarRating rating={2} onChange={onChange} />);
    const star = screen.getByRole('button', { name: '4 star' });
    expect(star).toBeDisabled();
    await userEvent.click(star);
    expect(onChange).not.toHaveBeenCalled();
  });

  it('reports the clicked rating when interactive', async () => {
    const onChange = vi.fn();
    render(<StarRating rating={2} interactive onChange={onChange} />);
    await userEvent.click(screen.getByRole('button', { name: '4 star' }));
    expect(onChange).toHaveBeenCalledWith(4);
  });

  it('does not throw when interactive without an onChange handler', async () => {
    render(<StarRating rating={2} interactive />);
    await userEvent.click(screen.getByRole('button', { name: '1 star' }));
    expect(screen.getAllByRole('button')).toHaveLength(5);
  });
});
