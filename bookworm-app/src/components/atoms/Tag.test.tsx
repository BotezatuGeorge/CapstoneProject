import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { Tag } from './Tag';

describe('Tag', () => {
  it('renders a plain span without an href', () => {
    render(<Tag label="Self Help" />);
    const tag = screen.getByText('Self Help');
    expect(tag.tagName).toBe('SPAN');
    expect(screen.queryByRole('link')).toBeNull();
  });

  it('renders a router link when an href is given', () => {
    render(
      <MemoryRouter>
        <Tag label="Daniel Reed" href="/author/daniel-reed" />
      </MemoryRouter>
    );
    expect(screen.getByRole('link', { name: 'Daniel Reed' })).toHaveAttribute('href', '/author/daniel-reed');
  });

  it('uses the link colour', () => {
    render(<Tag label="Non-fiction" />);
    expect(screen.getByText('Non-fiction')).toHaveClass('text-link');
  });

  it('merges a custom className', () => {
    render(<Tag label="Tag" className="mt-1" />);
    expect(screen.getByText('Tag')).toHaveClass('mt-1');
  });

  it('is square (no rounded classes)', () => {
    render(<Tag label="Tag" />);
    expect(screen.getByText('Tag').className).not.toMatch(/rounded/);
  });
});
