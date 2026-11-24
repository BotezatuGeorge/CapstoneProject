import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { FilterDropdown } from './FilterDropdown';

const OPTIONS = ['All', 'English', 'Hindi'];

describe('FilterDropdown', () => {
  it('shows the label', () => {
    render(<FilterDropdown label="Language" options={OPTIONS} value="All" onChange={() => {}} />);
    expect(screen.getByText('Language')).toBeInTheDocument();
  });

  it('renders every option', () => {
    render(<FilterDropdown label="Language" options={OPTIONS} value="All" onChange={() => {}} />);
    expect(screen.getAllByRole('option').map((o) => o.textContent)).toEqual(OPTIONS);
  });

  it('selects the given value', () => {
    render(<FilterDropdown label="Language" options={OPTIONS} value="Hindi" onChange={() => {}} />);
    expect(screen.getByRole('combobox')).toHaveValue('Hindi');
  });

  it('reports the chosen option as a string', async () => {
    const onChange = vi.fn();
    render(<FilterDropdown label="Language" options={OPTIONS} value="All" onChange={onChange} />);
    await userEvent.selectOptions(screen.getByRole('combobox'), 'English');
    expect(onChange).toHaveBeenCalledWith('English');
  });

  it('uses the Carbon filled input style', () => {
    render(<FilterDropdown label="Language" options={OPTIONS} value="All" onChange={() => {}} />);
    const select = screen.getByRole('combobox');
    expect(select).toHaveClass('input-base');
    expect(select.className).not.toMatch(/rounded/);
  });

  it('merges a custom className on the wrapper', () => {
    const { container } = render(
      <FilterDropdown label="Language" options={OPTIONS} value="All" onChange={() => {}} className="min-w-[140px]" />
    );
    expect(container.firstElementChild).toHaveClass('min-w-[140px]');
  });
});
