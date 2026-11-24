import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { AARAV, GUEST, makeCartContext, makeSessionContext, renderWithProviders } from '../../test/providers';
import { Navbar } from './Navbar';

describe('Navbar', () => {
  it('shows the brand linking home', () => {
    renderWithProviders(<Navbar />);
    expect(screen.getByRole('link', { name: /Book Worm/ })).toHaveAttribute('href', '/');
  });

  it('shows the three section links', () => {
    renderWithProviders(<Navbar />);
    expect(screen.getByRole('link', { name: 'My Orders' })).toHaveAttribute('href', '/orders');
    expect(screen.getByRole('link', { name: 'My Wishlist' })).toHaveAttribute('href', '/wishlist');
    expect(screen.getByRole('link', { name: 'My Writers' })).toHaveAttribute('href', '/writers');
  });

  it('highlights the link for the current route', () => {
    renderWithProviders(<Navbar />, { route: '/wishlist' });
    expect(screen.getByRole('link', { name: 'My Wishlist' })).toHaveClass('text-white', 'font-medium');
    expect(screen.getByRole('link', { name: 'My Orders' })).not.toHaveClass('font-medium');
  });

  describe('cart', () => {
    it('links to the cart', () => {
      renderWithProviders(<Navbar />);
      expect(screen.getByRole('link', { name: 'Cart' })).toHaveAttribute('href', '/cart');
    });

    it('shows no badge for an empty cart', () => {
      renderWithProviders(<Navbar />, { cart: makeCartContext({ totalItems: 0 }) });
      expect(screen.getByRole('link', { name: 'Cart' })).toHaveTextContent('');
    });

    it('shows the item count in the badge', () => {
      renderWithProviders(<Navbar />, { cart: makeCartContext({ totalItems: 4 }) });
      expect(screen.getByRole('link', { name: 'Cart' })).toHaveTextContent('4');
    });
  });

  describe('mobile menu', () => {
    it('is closed at first', () => {
      renderWithProviders(<Navbar />);
      expect(screen.getAllByRole('link', { name: 'My Orders' })).toHaveLength(1);
    });

    it('opens and shows the links a second time', async () => {
      renderWithProviders(<Navbar />);
      await userEvent.click(screen.getByRole('button', { name: 'Toggle menu' }));
      expect(screen.getAllByRole('link', { name: 'My Orders' })).toHaveLength(2);
    });

    it('closes again with a second click', async () => {
      renderWithProviders(<Navbar />);
      const toggle = screen.getByRole('button', { name: 'Toggle menu' });
      await userEvent.click(toggle);
      await userEvent.click(toggle);
      expect(screen.getAllByRole('link', { name: 'My Orders' })).toHaveLength(1);
    });

    it('closes after a link is chosen', async () => {
      renderWithProviders(<Navbar />);
      await userEvent.click(screen.getByRole('button', { name: 'Toggle menu' }));
      const mobileLink = screen.getAllByRole('link', { name: 'My Writers' })[1];
      await userEvent.click(mobileLink);
      expect(screen.getAllByRole('link', { name: 'My Writers' })).toHaveLength(1);
    });
  });

  describe('account menu', () => {
    const open = () => userEvent.click(screen.getByRole('button', { name: 'Account' }));

    it('shows the signed in persona name on the button', () => {
      renderWithProviders(<Navbar />);
      expect(screen.getByRole('button', { name: 'Account' })).toHaveTextContent('Aarav Mehta');
    });

    it('is closed at first', () => {
      renderWithProviders(<Navbar />);
      expect(screen.getByRole('button', { name: 'Account' })).toHaveAttribute('aria-expanded', 'false');
      expect(screen.queryByText('Switch persona')).toBeNull();
    });

    it('opens to show the wallet and gift points of a customer', async () => {
      renderWithProviders(<Navbar />);
      await open();
      expect(screen.getByRole('button', { name: 'Account' })).toHaveAttribute('aria-expanded', 'true');
      expect(screen.getByText('Wallet $100.00 · 320 gift points')).toBeInTheDocument();
    });

    it('says a guest is browsing as a guest', async () => {
      renderWithProviders(<Navbar />, { session: makeSessionContext({ user: GUEST }) });
      await open();
      expect(screen.getByText('Browsing as guest')).toBeInTheDocument();
    });

    it('lists every persona and marks the current one', async () => {
      renderWithProviders(<Navbar />);
      await open();
      const current = screen.getByRole('button', { name: /Aarav Mehta aarav\.mehta@example\.com/ });
      expect(current).toHaveClass('border-accent-blue');
      expect(screen.getByRole('button', { name: /Priya Sharma/ })).toHaveClass('border-transparent');
      expect(screen.getByRole('button', { name: /Guest Guest/ })).toBeInTheDocument();
    });

    it('switches persona and closes the menu', async () => {
      const switchPersona = vi.fn().mockResolvedValue(undefined);
      renderWithProviders(<Navbar />, { session: makeSessionContext({ user: AARAV, switchPersona }) });
      await open();
      await userEvent.click(screen.getByRole('button', { name: /Priya Sharma/ }));
      expect(switchPersona).toHaveBeenCalledWith('priya');
      expect(screen.queryByText('Switch persona')).toBeNull();
    });

    it('resets the demo data and closes the menu', async () => {
      const resetDemo = vi.fn().mockResolvedValue(undefined);
      renderWithProviders(<Navbar />, { session: makeSessionContext({ resetDemo }) });
      await open();
      await userEvent.click(screen.getByRole('button', { name: 'Reset demo data' }));
      expect(resetDemo).toHaveBeenCalledTimes(1);
      expect(screen.queryByText('Switch persona')).toBeNull();
    });

    it('toggles closed with a second click on the account button', async () => {
      renderWithProviders(<Navbar />);
      await open();
      await open();
      expect(screen.queryByText('Switch persona')).toBeNull();
    });
  });

  it('is square: no rounded classes besides the cart badge', () => {
    const { container } = renderWithProviders(<Navbar />, { cart: makeCartContext({ totalItems: 2 }) });
    const rounded = Array.from(container.querySelectorAll('[class*="rounded"]'));
    expect(rounded).toHaveLength(1);
    expect(rounded[0]).toHaveTextContent('2');
  });
});
