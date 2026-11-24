import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { ApiError } from '../../services';
import { makeCoupon, makeQuote } from '../../test/fixtures';
import { makeCartContext, renderWithProviders } from '../../test/providers';
import { OrderSummary } from './OrderSummary';

const renderSummary = (cart = makeCartContext(), props: Partial<React.ComponentProps<typeof OrderSummary>> = {}) =>
  renderWithProviders(<OrderSummary onPayNow={() => {}} {...props} />, { cart });

describe('OrderSummary', () => {
  it('breaks the total down in dollars', () => {
    renderSummary(
      makeCartContext({ quote: makeQuote({ itemCount: 3, subtotal: 40, tax: 4.8, shipping: 0, total: 44.8 }) })
    );
    expect(screen.getByText('Price (3 items)')).toBeInTheDocument();
    expect(screen.getByText('$40.00')).toBeInTheDocument();
    expect(screen.getByText('$4.80')).toBeInTheDocument();
    expect(screen.getByText('$44.80')).toBeInTheDocument();
  });

  it('shows free delivery when there is no shipping charge', () => {
    renderSummary(makeCartContext({ quote: makeQuote({ shipping: 0 }) }));
    expect(screen.getByText('Free')).toBeInTheDocument();
  });

  it('shows the delivery charge when there is one', () => {
    renderSummary(makeCartContext({ quote: makeQuote({ shipping: 5 }) }));
    expect(screen.getByText('$5.00')).toBeInTheDocument();
    expect(screen.queryByText('Free')).toBeNull();
  });

  it('shows a zero discount when no coupon is applied', () => {
    renderSummary(makeCartContext({ quote: makeQuote({ discount: 0 }) }));
    expect(screen.getByText('Discount').nextSibling).toHaveTextContent('$0.00');
  });

  it('shows the discount as a negative amount', () => {
    renderSummary(makeCartContext({ quote: makeQuote({ discount: 10 }) }));
    expect(screen.getByText('Discount').nextSibling).toHaveTextContent('−$10.00');
  });

  describe('coupon', () => {
    it('keeps Apply disabled until a code is typed', async () => {
      renderSummary();
      const apply = screen.getByRole('button', { name: 'Apply' });
      expect(apply).toBeDisabled();
      await userEvent.type(screen.getByLabelText('Apply Coupon'), 'READ5');
      expect(apply).toBeEnabled();
    });

    it('does not enable Apply for whitespace', async () => {
      renderSummary();
      await userEvent.type(screen.getByLabelText('Apply Coupon'), '   ');
      expect(screen.getByRole('button', { name: 'Apply' })).toBeDisabled();
    });

    it('applies the typed code and clears the field', async () => {
      const applyCoupon = vi.fn().mockResolvedValue(undefined);
      renderSummary(makeCartContext({ applyCoupon }));
      const input = screen.getByLabelText('Apply Coupon');
      await userEvent.type(input, 'READ5');
      await userEvent.click(screen.getByRole('button', { name: 'Apply' }));
      expect(applyCoupon).toHaveBeenCalledWith('READ5');
      expect(input).toHaveValue('');
    });

    it('shows the service error and keeps the code when it is refused', async () => {
      const applyCoupon = vi.fn().mockRejectedValue(new ApiError('INVALID_COUPON', 'This coupon code is not valid'));
      renderSummary(makeCartContext({ applyCoupon }));
      const input = screen.getByLabelText('Apply Coupon');
      await userEvent.type(input, 'NOPE');
      await userEvent.click(screen.getByRole('button', { name: 'Apply' }));
      expect(await screen.findByRole('alert')).toHaveTextContent('This coupon code is not valid');
      expect(input).toHaveValue('NOPE');
    });

    it('clears an earlier error on the next attempt', async () => {
      const applyCoupon = vi
        .fn()
        .mockRejectedValueOnce(new ApiError('INVALID_COUPON', 'This coupon code is not valid'))
        .mockResolvedValueOnce(undefined);
      renderSummary(makeCartContext({ applyCoupon }));
      await userEvent.type(screen.getByLabelText('Apply Coupon'), 'X');
      await userEvent.click(screen.getByRole('button', { name: 'Apply' }));
      await screen.findByRole('alert');
      await userEvent.click(screen.getByRole('button', { name: 'Apply' }));
      expect(screen.queryByRole('alert')).toBeNull();
    });

    it('shows the applied coupon with a Remove action instead of the input', async () => {
      const removeCoupon = vi.fn().mockResolvedValue(undefined);
      renderSummary(
        makeCartContext({
          coupon: makeCoupon({ code: 'READ5' }),
          quote: makeQuote({ discount: 5, couponApplied: true }),
          removeCoupon,
        })
      );
      expect(screen.getByText('READ5 applied')).toBeInTheDocument();
      expect(screen.queryByLabelText('Apply Coupon')).toBeNull();
      await userEvent.click(screen.getByRole('button', { name: 'Remove' }));
      expect(removeCoupon).toHaveBeenCalledTimes(1);
    });

    it('warns when the coupon is attached but the order is below its minimum', () => {
      renderSummary(
        makeCartContext({
          coupon: makeCoupon({ code: 'BOOKWORM10', minOrder: 30 }),
          quote: makeQuote({ couponApplied: false }),
        })
      );
      expect(screen.getByRole('status')).toHaveTextContent('BOOKWORM10 needs a minimum order of $30.00.');
      expect(screen.getByLabelText('Apply Coupon')).toBeInTheDocument();
    });

    it('disables Apply while the cart is busy', async () => {
      renderSummary(makeCartContext({ busy: true }));
      await userEvent.type(screen.getByLabelText('Apply Coupon'), 'READ5');
      expect(screen.getByRole('button', { name: 'Apply' })).toBeDisabled();
    });
  });

  describe('Pay Now', () => {
    it('calls onPayNow', async () => {
      const onPayNow = vi.fn();
      renderSummary(makeCartContext(), { onPayNow });
      await userEvent.click(screen.getByRole('button', { name: /Pay Now/ }));
      expect(onPayNow).toHaveBeenCalledTimes(1);
    });

    it('is disabled for an empty cart', () => {
      renderSummary(makeCartContext({ quote: makeQuote({ itemCount: 0 }) }));
      expect(screen.getByRole('button', { name: /Pay Now/ })).toBeDisabled();
    });

    it('is disabled while the cart is busy', () => {
      renderSummary(makeCartContext({ busy: true }));
      expect(screen.getByRole('button', { name: /Pay Now/ })).toBeDisabled();
    });

    it('shows Checking… and is disabled while paying', () => {
      renderSummary(makeCartContext(), { paying: true });
      expect(screen.getByRole('button', { name: /Checking…/ })).toBeDisabled();
    });
  });
});
