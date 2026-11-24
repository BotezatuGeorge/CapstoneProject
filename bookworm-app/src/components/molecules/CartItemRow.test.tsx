import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import { makeBook, makeCartItem } from '../../test/fixtures';
import { CartItemRow } from './CartItemRow';

const renderRow = (item = makeCartItem(), handlers: { onQuantityChange?: () => void; onRemove?: () => void } = {}) => {
  const onQuantityChange = vi.fn(handlers.onQuantityChange);
  const onRemove = vi.fn(handlers.onRemove);
  render(
    <MemoryRouter>
      <CartItemRow item={item} onQuantityChange={onQuantityChange} onRemove={onRemove} />
    </MemoryRouter>
  );
  return { onQuantityChange, onRemove };
};

describe('CartItemRow', () => {
  it('shows the book details', () => {
    renderRow();
    expect(screen.getByRole('heading', { name: 'Joy of Minimalism' })).toBeInTheDocument();
    expect(screen.getByText('by Daniel Reed')).toBeInTheDocument();
    expect(screen.getByText('Paperback')).toBeInTheDocument();
    expect(screen.getByText('$12.99')).toBeInTheDocument();
    expect(screen.getByText('Mon, 21 Jul')).toBeInTheDocument();
  });

  it('shows the current quantity', () => {
    renderRow(makeCartItem({ quantity: 3 }));
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('links the cover to the book page and the author to the author page', () => {
    renderRow();
    expect(screen.getByAltText('Joy of Minimalism').closest('a')).toHaveAttribute('href', '/book/joy-of-minimalism');
    expect(screen.getByText('by Daniel Reed')).toHaveAttribute('href', '/author/daniel-reed');
  });

  it('reports a quantity increase with the book id', async () => {
    const { onQuantityChange } = renderRow(makeCartItem({ quantity: 2 }));
    await userEvent.click(screen.getByRole('button', { name: 'Increase quantity' }));
    expect(onQuantityChange).toHaveBeenCalledWith('joy-of-minimalism', 3);
  });

  it('reports a quantity decrease with the book id', async () => {
    const { onQuantityChange } = renderRow(makeCartItem({ quantity: 2 }));
    await userEvent.click(screen.getByRole('button', { name: 'Decrease quantity' }));
    expect(onQuantityChange).toHaveBeenCalledWith('joy-of-minimalism', 1);
  });

  it('caps the quantity at the available stock', () => {
    renderRow(makeCartItem({ book: makeBook({ stock: 3 }), quantity: 3 }));
    expect(screen.getByRole('button', { name: 'Increase quantity' })).toBeDisabled();
  });

  it('keeps the stepper usable for a single unit when stock is zero', () => {
    renderRow(makeCartItem({ book: makeBook({ stock: 0 }), quantity: 1 }));
    expect(screen.getByRole('button', { name: 'Increase quantity' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Decrease quantity' })).toBeDisabled();
  });

  it('warns when five or fewer copies are left', () => {
    renderRow(makeCartItem({ book: makeBook({ stock: 5 }) }));
    expect(screen.getByText('Only 5 left in stock')).toBeInTheDocument();
  });

  it('does not warn when stock is plentiful', () => {
    renderRow(makeCartItem({ book: makeBook({ stock: 6 }) }));
    expect(screen.queryByText(/left in stock/)).toBeNull();
  });

  it('calls onRemove with the book id', async () => {
    const { onRemove } = renderRow();
    await userEvent.click(screen.getByRole('button', { name: 'Remove' }));
    expect(onRemove).toHaveBeenCalledWith('joy-of-minimalism');
  });
});
