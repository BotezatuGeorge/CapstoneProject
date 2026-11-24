import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { CategorySidebar } from './CategorySidebar';

const CATEGORIES = ['All', 'Fiction', 'Self Help'];

describe('CategorySidebar', () => {
  it('renders every category in both the mobile strip and the desktop list', () => {
    render(<CategorySidebar categories={CATEGORIES} selected="All" onSelect={() => {}} />);
    CATEGORIES.forEach((cat) => {
      expect(screen.getAllByRole('button', { name: cat })).toHaveLength(2);
    });
  });

  it('reports the clicked category from the desktop list', async () => {
    const onSelect = vi.fn();
    render(<CategorySidebar categories={CATEGORIES} selected="All" onSelect={onSelect} />);
    const list = screen.getByRole('list');
    await userEvent.click(within(list).getByRole('button', { name: 'Fiction' }));
    expect(onSelect).toHaveBeenCalledWith('Fiction');
  });

  it('reports the clicked category from the mobile strip', async () => {
    const onSelect = vi.fn();
    const { container } = render(<CategorySidebar categories={CATEGORIES} selected="All" onSelect={onSelect} />);
    const strip = container.querySelector('.md\\:hidden') as HTMLElement;
    await userEvent.click(within(strip).getByRole('button', { name: 'Self Help' }));
    expect(onSelect).toHaveBeenCalledWith('Self Help');
  });

  it('highlights only the selected category', () => {
    render(<CategorySidebar categories={CATEGORIES} selected="Fiction" onSelect={() => {}} />);
    const list = screen.getByRole('list');
    expect(within(list).getByRole('button', { name: 'Fiction' })).toHaveClass('bg-surface-overlay', 'text-white');
    expect(within(list).getByRole('button', { name: 'All' })).not.toHaveClass('bg-surface-overlay');
  });

  it('has no rounded corners', () => {
    const { container } = render(<CategorySidebar categories={CATEGORIES} selected="All" onSelect={() => {}} />);
    expect(container.innerHTML).not.toMatch(/rounded/);
  });

  it('renders an empty list without categories', () => {
    render(<CategorySidebar categories={[]} selected="" onSelect={() => {}} />);
    expect(screen.queryAllByRole('button')).toHaveLength(0);
  });
});
