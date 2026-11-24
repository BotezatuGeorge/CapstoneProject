import { Link, NavLink } from 'react-router-dom';
import { Catalog, ShoppingCart, UserAvatar, Menu, Close } from '@carbon/icons-react';
import { useState } from 'react';
import { Badge } from '../atoms';
import { useCart } from '../../context/CartContext';
import clsx from 'clsx';

const NAV_LINKS = [
  { label: 'My Orders', href: '/orders' },
  { label: 'My Wishlist', href: '/wishlist' },
  { label: 'My Writers', href: '/writers' },
];

export function Navbar() {
  const { totalItems } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-surface border-b border-border">
      <div className="max-w-screen-xl mx-auto px-4 h-14 flex items-center gap-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 text-white font-semibold text-lg flex-shrink-0">
          <Catalog size={20} className="text-white" />
          <span className="hidden sm:inline">Book Worm</span>
        </Link>

        {/* Divider */}
        <span className="hidden sm:block h-6 w-px bg-border" />

        {/* Desktop nav */}
        <nav className="hidden sm:flex items-center gap-6 flex-1">
          {NAV_LINKS.map((l) => (
            <NavLink
              key={l.href}
              to={l.href}
              className={({ isActive }) =>
                clsx('text-sm transition-colors', isActive ? 'text-white font-medium' : 'text-muted hover:text-white')
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        {/* Spacer */}
        <div className="flex-1 sm:hidden" />

        {/* Right actions */}
        <div className="flex items-center gap-4">
          <Link to="/cart" className="relative text-muted hover:text-white transition-colors" aria-label="Cart">
            <ShoppingCart size={20} />
            <Badge count={totalItems} />
          </Link>
          <button className="text-muted hover:text-white transition-colors" aria-label="Account">
            <UserAvatar size={20} />
          </button>
          {/* Mobile hamburger */}
          <button
            className="sm:hidden text-muted hover:text-white transition-colors"
            onClick={() => setMenuOpen((o) => !o)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <Close size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile nav drawer */}
      {menuOpen && (
        <nav className="sm:hidden bg-surface border-t border-border px-4 py-3 flex flex-col gap-3">
          {NAV_LINKS.map((l) => (
            <NavLink
              key={l.href}
              to={l.href}
              className="text-sm text-muted hover:text-white transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              {l.label}
            </NavLink>
          ))}
        </nav>
      )}
    </header>
  );
}
