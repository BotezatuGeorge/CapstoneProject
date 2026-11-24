import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { makeBook } from '../../test/fixtures';
import { BookGrid } from './BookGrid';

const BOOKS = [
  makeBook({ id: 'a', title: 'Book A' }),
  makeBook({ id: 'b', title: 'Book B' }),
  makeBook({ id: 'c', title: 'Book C' }),
];

const renderGrid = (title: string, books = BOOKS) =>
  render(
    <MemoryRouter>
      <BookGrid title={title} books={books} />
    </MemoryRouter>
  );

describe('BookGrid', () => {
  it('shows the section title', () => {
    renderGrid('Recommended for You');
    expect(screen.getByRole('heading', { level: 2, name: 'Recommended for You' })).toBeInTheDocument();
  });

  it('renders a card for every book', () => {
    renderGrid('Bestsellers');
    ['Book A', 'Book B', 'Book C'].forEach((title) => {
      expect(screen.getByRole('link', { name: title })).toBeInTheDocument();
    });
  });

  it('links each card to its own book page', () => {
    renderGrid('New Launches');
    expect(screen.getByRole('link', { name: 'Book B' })).toHaveAttribute('href', '/book/b');
  });

  it('renders nothing when there are no books', () => {
    const { container } = renderGrid('Empty', []);
    expect(container).toBeEmptyDOMElement();
  });
});
