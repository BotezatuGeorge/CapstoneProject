import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { makeBook } from '../../test/fixtures';
import { BookCard } from './BookCard';

const renderCard = (book = makeBook()) =>
  render(
    <MemoryRouter>
      <BookCard book={book} />
    </MemoryRouter>
  );

describe('BookCard', () => {
  it('shows the title, author, description and format', () => {
    renderCard();
    expect(screen.getByRole('heading', { name: 'Joy of Minimalism' })).toBeInTheDocument();
    expect(screen.getByText('by Daniel Reed')).toBeInTheDocument();
    expect(screen.getByText(/Declutter your life/)).toBeInTheDocument();
    expect(screen.getByText('Paperback')).toBeInTheDocument();
  });

  it('shows the cover image with the title as alt text', () => {
    renderCard();
    expect(screen.getByAltText('Joy of Minimalism')).toBeInTheDocument();
  });

  it('shows the price in dollars and the delivery date', () => {
    renderCard();
    expect(screen.getByText('$12.99')).toBeInTheDocument();
    expect(screen.getByText('Mon, 21 Jul')).toBeInTheDocument();
  });

  it('links the title to the book details page', () => {
    renderCard();
    expect(screen.getByRole('link', { name: 'Joy of Minimalism' })).toHaveAttribute('href', '/book/joy-of-minimalism');
  });

  it('stretches the title link over the card so the whole card is clickable', () => {
    renderCard();
    expect(screen.getByRole('link', { name: 'Joy of Minimalism' })).toHaveClass('after:absolute', 'after:inset-0');
  });

  it('never nests one link inside another (invalid HTML)', () => {
    const { container } = renderCard();
    expect(container.querySelectorAll('a a')).toHaveLength(0);
  });

  it('links the author to the author page', () => {
    renderCard();
    expect(screen.getByText('by Daniel Reed').closest('a')).toHaveAttribute('href', '/author/daniel-reed');
  });

  it('renders a filter link for every genre', () => {
    renderCard();
    expect(screen.getByText('Non-fiction').closest('a')).toHaveAttribute('href', '/catalog?genre=non-fiction');
    expect(screen.getByText('Self Help').closest('a')).toHaveAttribute('href', '/catalog?genre=self-help');
  });

  it('renders no genre tags for a book without genres', () => {
    renderCard(makeBook({ genres: [] }));
    expect(screen.queryByText('Non-fiction')).toBeNull();
  });
});
