import type { Review } from '../types';
import { addReview, getBookById, getReviews } from './db';
import { currentUser } from './member';
import { ApiError, LATENCY, newId, respond } from './mock';

export const MAX_REVIEW_LENGTH = 100;

export const reviewService = {
  submit: (bookId: string, text: string, rating: number): Promise<Review[]> =>
    respond(LATENCY.write, () => {
      const user = currentUser();
      if (user.role === 'GUEST') throw new ApiError('FORBIDDEN', 'Switch to a customer account to leave a review');
      if (!getBookById(bookId)) throw new ApiError('NOT_FOUND', 'Book not found');
      const trimmed = text.trim();
      if (!trimmed || trimmed.length > MAX_REVIEW_LENGTH) {
        throw new ApiError('VALIDATION', `Reviews must be 1–${MAX_REVIEW_LENGTH} characters`);
      }
      if (rating < 1 || rating > 5) throw new ApiError('VALIDATION', 'Pick a star rating from 1 to 5');
      addReview({
        id: newId('REV'),
        bookId,
        author: user.name,
        text: trimmed,
        rating,
        date: new Date().toISOString().slice(0, 10),
      });
      return getReviews(bookId);
    }),
};
