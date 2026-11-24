import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { SearchBar } from './SearchBar';

describe('SearchBar', () => {
  it('uses "Search" as the default placeholder', () => {
    render(<SearchBar />);
    expect(screen.getByPlaceholderText('Search')).toBeInTheDocument();
  });

  it('accepts a custom placeholder', () => {
    render(<SearchBar placeholder="Search books, authors…" />);
    expect(screen.getByPlaceholderText('Search books, authors…')).toBeInTheDocument();
  });

  it('updates as the user types', async () => {
    render(<SearchBar />);
    const input = screen.getByRole('searchbox');
    await userEvent.type(input, 'minimal');
    expect(input).toHaveValue('minimal');
  });

  it('does not search while typing', async () => {
    const onSearch = vi.fn();
    render(<SearchBar onSearch={onSearch} />);
    await userEvent.type(screen.getByRole('searchbox'), 'abc');
    expect(onSearch).not.toHaveBeenCalled();
  });

  it('searches when the button is clicked', async () => {
    const onSearch = vi.fn();
    render(<SearchBar onSearch={onSearch} />);
    await userEvent.type(screen.getByRole('searchbox'), 'focus');
    await userEvent.click(screen.getByRole('button', { name: 'Search' }));
    expect(onSearch).toHaveBeenCalledTimes(1);
    expect(onSearch).toHaveBeenCalledWith('focus');
  });

  it('searches when Enter is pressed', async () => {
    const onSearch = vi.fn();
    render(<SearchBar onSearch={onSearch} />);
    await userEvent.type(screen.getByRole('searchbox'), 'learning{Enter}');
    expect(onSearch).toHaveBeenCalledWith('learning');
  });

  it('submits an empty query so the search can be cleared', async () => {
    const onSearch = vi.fn();
    render(<SearchBar onSearch={onSearch} />);
    await userEvent.click(screen.getByRole('button', { name: 'Search' }));
    expect(onSearch).toHaveBeenCalledWith('');
  });

  it('does not throw without an onSearch handler', async () => {
    render(<SearchBar />);
    await userEvent.type(screen.getByRole('searchbox'), 'x{Enter}');
    expect(screen.getByRole('searchbox')).toHaveValue('x');
  });

  it('uses the Carbon filled input style', () => {
    render(<SearchBar />);
    expect(screen.getByRole('searchbox')).toHaveClass('input-base');
  });
});
