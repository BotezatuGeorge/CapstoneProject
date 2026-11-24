import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { makeAuthor } from '../../test/fixtures';
import { AuthorBio } from './AuthorBio';

describe('AuthorBio', () => {
  it('shows the section heading and the author name', () => {
    render(<AuthorBio author={makeAuthor()} />);
    expect(screen.getByRole('heading', { name: 'About the writer' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Daniel Reed' })).toBeInTheDocument();
  });

  it('shows the avatar with the author name as alt text', () => {
    render(<AuthorBio author={makeAuthor()} />);
    expect(screen.getByAltText('Daniel Reed')).toHaveAttribute('src', expect.stringContaining('data:image/svg+xml'));
  });

  it('renders each blank-line separated bio paragraph on its own', () => {
    render(<AuthorBio author={makeAuthor()} />);
    expect(screen.getByText('First paragraph about Daniel.').tagName).toBe('P');
    expect(screen.getByText('Second paragraph about his books.').tagName).toBe('P');
  });

  it('renders a single paragraph for a one-line bio', () => {
    const { container } = render(<AuthorBio author={makeAuthor({ bio: 'Just one line.' })} />);
    expect(container.querySelectorAll('p')).toHaveLength(1);
  });

  it('keeps the avatar circular (the allowed exception)', () => {
    render(<AuthorBio author={makeAuthor()} />);
    expect(screen.getByAltText('Daniel Reed')).toHaveClass('rounded-full');
  });
});
