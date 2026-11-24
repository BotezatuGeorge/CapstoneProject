import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { ApiError, MAX_REVIEW_LENGTH } from '../../services';
import { makeReview } from '../../test/fixtures';
import { ReviewSection } from './ReviewSection';

const renderSection = (props: Partial<React.ComponentProps<typeof ReviewSection>> = {}) => {
  const onSubmit = vi.fn().mockResolvedValue(undefined);
  render(<ReviewSection reviews={[]} onSubmit={onSubmit} {...props} />);
  return { onSubmit };
};

const textbox = () => screen.getByLabelText('Leave Your Review');
const submit = () => screen.getByRole('button', { name: /Submit|Submitting/ });
const star = (n: number) => screen.getByRole('button', { name: `${n} star` });

describe('ReviewSection', () => {
  it('shows the existing reviews', () => {
    renderSection({
      reviews: [makeReview({ id: '1', author: 'Maya Lin' }), makeReview({ id: '2', author: 'Tom Hale', text: 'Loved it.' })],
    });
    expect(screen.getByRole('heading', { name: 'Maya Lin' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Tom Hale' })).toBeInTheDocument();
    expect(screen.getByText('Loved it.')).toBeInTheDocument();
  });

  it('works with no reviews yet', () => {
    renderSection();
    expect(screen.getByRole('heading', { name: 'Reviews' })).toBeInTheDocument();
    expect(textbox()).toBeInTheDocument();
  });

  it('starts with an empty counter', () => {
    renderSection();
    expect(screen.getByText(`0/${MAX_REVIEW_LENGTH}`)).toBeInTheDocument();
  });

  it('counts the typed characters', async () => {
    renderSection();
    await userEvent.type(textbox(), 'Great read');
    expect(screen.getByText(`10/${MAX_REVIEW_LENGTH}`)).toBeInTheDocument();
  });

  it('limits the review to the maximum length', async () => {
    renderSection();
    await userEvent.click(textbox());
    await userEvent.paste('x'.repeat(MAX_REVIEW_LENGTH + 25));
    expect(textbox()).toHaveValue('x'.repeat(MAX_REVIEW_LENGTH));
    expect(screen.getByText(`${MAX_REVIEW_LENGTH}/${MAX_REVIEW_LENGTH}`)).toBeInTheDocument();
  });

  describe('Submit button', () => {
    it('is disabled when nothing has been entered', () => {
      renderSection();
      expect(submit()).toBeDisabled();
    });

    it('is disabled with text but no rating', async () => {
      renderSection();
      await userEvent.type(textbox(), 'Nice');
      expect(submit()).toBeDisabled();
    });

    it('is disabled with a rating but no text', async () => {
      renderSection();
      await userEvent.click(star(4));
      expect(submit()).toBeDisabled();
    });

    it('is disabled for whitespace-only text', async () => {
      renderSection();
      await userEvent.type(textbox(), '   ');
      await userEvent.click(star(3));
      expect(submit()).toBeDisabled();
    });

    it('is enabled with text and a rating', async () => {
      renderSection();
      await userEvent.type(textbox(), 'Nice');
      await userEvent.click(star(3));
      expect(submit()).toBeEnabled();
    });
  });

  describe('submitting', () => {
    it('sends the trimmed text and the chosen rating', async () => {
      const { onSubmit } = renderSection();
      await userEvent.type(textbox(), '  Wonderful book  ');
      await userEvent.click(star(5));
      await userEvent.click(submit());
      expect(onSubmit).toHaveBeenCalledWith('Wonderful book', 5);
    });

    it('clears the form after a successful submit', async () => {
      renderSection();
      await userEvent.type(textbox(), 'Wonderful');
      await userEvent.click(star(5));
      await userEvent.click(submit());
      await vi.waitFor(() => expect(textbox()).toHaveValue(''));
      expect(screen.getByText(`0/${MAX_REVIEW_LENGTH}`)).toBeInTheDocument();
      expect(submit()).toBeDisabled();
    });

    it('shows Submitting… and disables the button while the request is in flight', async () => {
      let finish: () => void = () => {};
      const onSubmit = vi.fn().mockReturnValue(new Promise<void>((resolve) => (finish = resolve)));
      renderSection({ onSubmit });
      await userEvent.type(textbox(), 'Wonderful');
      await userEvent.click(star(5));
      await userEvent.click(submit());
      expect(screen.getByRole('button', { name: /Submitting…/ })).toBeDisabled();
      finish();
      await vi.waitFor(() => expect(screen.getByRole('button', { name: /Submit/ })).toBeInTheDocument());
    });

    it('shows the service error and keeps what the user typed', async () => {
      const onSubmit = vi.fn().mockRejectedValue(new ApiError('FORBIDDEN', 'Sign in as a customer to leave a review'));
      renderSection({ onSubmit });
      await userEvent.type(textbox(), 'Wonderful');
      await userEvent.click(star(2));
      await userEvent.click(submit());
      expect(await screen.findByRole('alert')).toHaveTextContent('Sign in as a customer to leave a review');
      expect(textbox()).toHaveValue('Wonderful');
      expect(submit()).toBeEnabled();
    });

    it('clears the error on the next attempt', async () => {
      const onSubmit = vi
        .fn()
        .mockRejectedValueOnce(new ApiError('FORBIDDEN', 'Nope'))
        .mockResolvedValueOnce(undefined);
      renderSection({ onSubmit });
      await userEvent.type(textbox(), 'Wonderful');
      await userEvent.click(star(2));
      await userEvent.click(submit());
      await screen.findByRole('alert');
      await userEvent.click(submit());
      await vi.waitFor(() => expect(screen.queryByRole('alert')).toBeNull());
    });

    it('does not submit an invalid form with Enter-style submission', async () => {
      const { onSubmit } = renderSection();
      await userEvent.type(textbox(), 'No rating');
      textbox().closest('form')?.requestSubmit();
      expect(onSubmit).not.toHaveBeenCalled();
    });
  });
});
