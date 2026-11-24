import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { makeReview } from '../../test/fixtures';
import { ReviewCard } from './ReviewCard';

describe('ReviewCard', () => {
  it('shows the reviewer name and text', () => {
    render(<ReviewCard review={makeReview()} />);
    expect(screen.getByRole('heading', { name: 'Maya Lin' })).toBeInTheDocument();
    expect(screen.getByText('A calm, practical read.')).toBeInTheDocument();
  });

  it('renders the rating as five read-only stars', () => {
    render(<ReviewCard review={makeReview({ rating: 4 })} />);
    const stars = screen.getAllByRole('button');
    expect(stars).toHaveLength(5);
    stars.forEach((star) => expect(star).toBeDisabled());
  });

  it('fills as many stars as the rating', () => {
    render(<ReviewCard review={makeReview({ rating: 2 })} />);
    const filled = screen.getAllByRole('button').filter((s) => s.className.includes('text-[#f1c21b]'));
    expect(filled).toHaveLength(2);
  });
});
