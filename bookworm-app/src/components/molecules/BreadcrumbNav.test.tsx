import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { BreadcrumbNav } from './BreadcrumbNav';

const renderNav = (crumbs: { label: string; href?: string }[]) =>
  render(
    <MemoryRouter>
      <BreadcrumbNav crumbs={crumbs} />
    </MemoryRouter>
  );

describe('BreadcrumbNav', () => {
  it('is exposed as a breadcrumb navigation landmark', () => {
    renderNav([{ label: 'Home', href: '/' }]);
    expect(screen.getByRole('navigation', { name: 'breadcrumb' })).toBeInTheDocument();
  });

  it('renders every crumb label', () => {
    renderNav([{ label: 'Home', href: '/' }, { label: 'Catalog', href: '/catalog' }, { label: 'Joy of Minimalism' }]);
    ['Home', 'Catalog', 'Joy of Minimalism'].forEach((label) => {
      expect(screen.getByText(label)).toBeInTheDocument();
    });
  });

  it('links earlier crumbs that have an href', () => {
    renderNav([{ label: 'Home', href: '/' }, { label: 'Catalog', href: '/catalog' }, { label: 'Book' }]);
    expect(screen.getByRole('link', { name: 'Home' })).toHaveAttribute('href', '/');
    expect(screen.getByRole('link', { name: 'Catalog' })).toHaveAttribute('href', '/catalog');
  });

  it('renders the last crumb as plain text even when it has an href', () => {
    renderNav([{ label: 'Home', href: '/' }, { label: 'Current', href: '/current' }]);
    expect(screen.queryByRole('link', { name: 'Current' })).toBeNull();
    expect(screen.getByText('Current')).toHaveClass('text-muted');
  });

  it('renders earlier crumbs without an href as plain text', () => {
    renderNav([{ label: 'Orders' }, { label: 'ORD-1' }]);
    expect(screen.queryAllByRole('link')).toHaveLength(0);
    expect(screen.getByText('Orders')).toHaveClass('text-link');
  });

  it('puts a separator between crumbs but not after the last one', () => {
    const { container } = renderNav([{ label: 'A', href: '/' }, { label: 'B', href: '/b' }, { label: 'C' }]);
    expect(container.querySelectorAll('svg')).toHaveLength(2);
  });

  it('renders a single crumb without a separator', () => {
    const { container } = renderNav([{ label: 'Only' }]);
    expect(container.querySelectorAll('svg')).toHaveLength(0);
  });
});
