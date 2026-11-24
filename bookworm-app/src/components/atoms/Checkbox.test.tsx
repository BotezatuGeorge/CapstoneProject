import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Checkbox } from './Checkbox';

describe('Checkbox', () => {
  it('is reachable through its label', () => {
    render(<Checkbox label="Use saved address" />);
    expect(screen.getByLabelText('Use saved address')).toHaveAttribute('type', 'checkbox');
  });

  it('derives the id from the label', () => {
    render(<Checkbox label="Use saved address" />);
    expect(screen.getByRole('checkbox')).toHaveAttribute('id', 'chk-use-saved-address');
  });

  it('prefers an explicit id', () => {
    render(<Checkbox label="Terms" id="terms" />);
    expect(screen.getByRole('checkbox')).toHaveAttribute('id', 'terms');
  });

  it('reflects the checked prop', () => {
    render(<Checkbox label="On" checked onChange={() => {}} />);
    expect(screen.getByRole('checkbox')).toBeChecked();
  });

  it('calls onChange when toggled by clicking the label text', async () => {
    const onChange = vi.fn();
    render(<Checkbox label="Toggle me" onChange={onChange} />);
    await userEvent.click(screen.getByText('Toggle me'));
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(screen.getByRole('checkbox')).toBeChecked();
  });

  it('cannot be toggled when disabled', async () => {
    const onChange = vi.fn();
    render(<Checkbox label="Locked" disabled onChange={onChange} />);
    await userEvent.click(screen.getByRole('checkbox'));
    expect(onChange).not.toHaveBeenCalled();
  });
});
