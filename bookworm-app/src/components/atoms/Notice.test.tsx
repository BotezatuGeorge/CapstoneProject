import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Notice } from './Notice';

describe('Notice', () => {
  it('renders its children', () => {
    render(<Notice>Saved</Notice>);
    expect(screen.getByText('Saved')).toBeInTheDocument();
  });

  it('defaults to the info kind with the status role', () => {
    render(<Notice>Heads up</Notice>);
    const notice = screen.getByRole('status');
    expect(notice).toHaveClass('border-[#4589ff]');
  });

  it('uses the alert role for errors so screen readers announce them', () => {
    render(<Notice kind="error">Card declined</Notice>);
    const notice = screen.getByRole('alert');
    expect(notice).toHaveClass('border-[#fa4d56]');
  });

  it.each([
    ['success', 'border-[#42be65]'],
    ['warning', 'border-[#f1c21b]'],
    ['info', 'border-[#4589ff]'],
  ] as const)('styles the %s kind', (kind, expectedClass) => {
    render(<Notice kind={kind}>Message</Notice>);
    expect(screen.getByRole('status')).toHaveClass(expectedClass);
  });

  it('is square with a left status bar', () => {
    render(<Notice>Square</Notice>);
    const notice = screen.getByRole('status');
    expect(notice).toHaveClass('border-l-[3px]');
    expect(notice.className).not.toMatch(/rounded/);
  });

  it('merges a custom className', () => {
    render(<Notice className="mt-4">Spaced</Notice>);
    expect(screen.getByRole('status')).toHaveClass('mt-4');
  });
});
