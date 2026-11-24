import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { BookArt } from './BookArt';

describe('BookArt', () => {
  it('renders the backdrop artwork as a decorative svg', () => {
    const { container } = render(<BookArt variant="backdrop" />);
    const svg = container.querySelector('svg');
    expect(svg).toHaveAttribute('viewBox', '0 0 1600 1000');
    expect(svg).toHaveAttribute('aria-hidden', 'true');
  });

  it('renders the panel artwork with its own viewBox', () => {
    const { container } = render(<BookArt variant="panel" />);
    expect(container.querySelector('svg')).toHaveAttribute('viewBox', '0 0 200 400');
  });

  it('does not load any network images', () => {
    const { container } = render(<BookArt variant="backdrop" />);
    expect(container.querySelector('img, image')).toBeNull();
  });
});
