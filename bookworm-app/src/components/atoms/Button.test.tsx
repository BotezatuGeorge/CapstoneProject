import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Button } from './Button';

describe('Button', () => {
  it('renders its children and defaults to the primary medium style', () => {
    render(<Button>Pay Now</Button>);
    const button = screen.getByRole('button', { name: 'Pay Now' });
    expect(button).toHaveClass('bg-accent-blue');
    expect(button).toHaveClass('px-4', 'py-3');
  });

  it.each([
    ['secondary', 'bg-surface-overlay'],
    ['ghost', 'bg-transparent'],
  ] as const)('applies the %s variant', (variant, expectedClass) => {
    render(<Button variant={variant}>Go</Button>);
    expect(screen.getByRole('button')).toHaveClass(expectedClass);
  });

  it('applies the size classes', () => {
    render(<Button size="sm">Small</Button>);
    expect(screen.getByRole('button')).toHaveClass('py-2', 'text-xs');
  });

  it('has square corners (no rounded classes)', () => {
    render(<Button>Square</Button>);
    expect(screen.getByRole('button').className).not.toMatch(/rounded/);
  });

  it('stretches to full width when requested', () => {
    render(<Button fullWidth>Wide</Button>);
    expect(screen.getByRole('button')).toHaveClass('w-full');
  });

  it('places the icon after the label by default', () => {
    render(<Button icon={<span data-testid="icon" />}>Label</Button>);
    const button = screen.getByRole('button');
    expect(button.lastElementChild).toBe(screen.getByTestId('icon'));
  });

  it('places the icon before the label when iconPosition is left', () => {
    render(<Button icon={<span data-testid="icon" />} iconPosition="left">Label</Button>);
    expect(screen.getByRole('button').firstElementChild).toBe(screen.getByTestId('icon'));
  });

  it('calls onClick when pressed', async () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Click</Button>);
    await userEvent.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('does not call onClick when disabled', async () => {
    const onClick = vi.fn();
    render(<Button disabled onClick={onClick}>Click</Button>);
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    await userEvent.click(button);
    expect(onClick).not.toHaveBeenCalled();
  });

  it('forwards native attributes such as type', () => {
    render(<Button type="submit">Submit</Button>);
    expect(screen.getByRole('button')).toHaveAttribute('type', 'submit');
  });
});
