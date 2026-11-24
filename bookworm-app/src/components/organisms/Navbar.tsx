import { Link, NavLink } from 'react-router-dom';
import { Catalog, ShoppingCart, UserAvatar, Menu, Close } from '@carbon/icons-react';
import { useState } from 'react';
import { Badge } from '../atoms';
import { useCart } from '../../context/cart';
import { useSession } from '../../context/session';
import { formatMoney } from '../../lib/money';
import clsx from 'clsx';

const NAV_LINKS = [
  { label: 'My Orders', href: '/orders' },
  { label: 'My Wishlist', href: '/wishlist' },
  { label: 'My Writers', href: '/writers' },
];

export function Navbar() {
  const { totalItems } = useCart();
  const { user, personas, switchPersona, resetDemo } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [switching, setSwitching] = useState(false);

  const handleSwitch = async (userId: string) => {
    setSwitching(true);
    try {
      await switchPersona(userId);
      setAccountOpen(false);
    } finally {
      setSwitching(false);
    }
  };

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

          {/* Persona switcher (stands in for login / logout) */}
          <div className="relative">
            <button
              className="flex items-center gap-2 text-muted hover:text-white transition-colors"
              aria-label="Account"
              aria-expanded={accountOpen}
              onClick={() => setAccountOpen((o) => !o)}
            >
              <UserAvatar size={20} />
              <span className="hidden md:inline text-sm">{user.name}</span>
            </button>
            {accountOpen && (
              <div className="absolute right-0 top-full mt-3 w-72 bg-surface-raised border border-border z-50">
                <div className="px-4 py-3 border-b border-border">
                  <p className="text-sm font-semibold text-white">{user.name}</p>
                  <p className="text-xs text-muted">
                    {user.role === 'GUEST'
                      ? 'Browsing as guest'
                      : `Wallet ${formatMoney(user.walletBalance)} · ${user.giftPoints} gift points`}
                  </p>
                </div>
                <p className="px-4 pt-3 text-xs text-helper">Switch persona</p>
                <ul>
                  {personas.map((p) => (
                    <li key={p.id}>
                      <button
                        disabled={switching}
                        onClick={() => void handleSwitch(p.id)}
                        className={clsx(
                          'w-full text-left px-4 py-3 text-sm border-l-[3px] transition-colors disabled:opacity-50',
                          p.id === user.id
                            ? 'border-accent-blue bg-surface-overlay text-white'
                            : 'border-transparent text-muted hover:bg-surface-overlay hover:text-white'
                        )}
                      >
                        {p.name}
                        <span className="block text-xs text-helper">{p.role === 'GUEST' ? 'Guest' : p.email}</span>
                      </button>
                    </li>
                  ))}
                </ul>
                <button
                  disabled={switching}
                  onClick={() => {
                    setAccountOpen(false);
                    void resetDemo();
                  }}
                  className="w-full text-left px-4 py-3 text-xs text-link hover:bg-surface-overlay border-t border-border"
                >
                  Reset demo data
                </button>
              </div>
            )}
          </div>

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
