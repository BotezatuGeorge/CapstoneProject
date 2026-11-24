import type { Book } from '../types';
import { getBookById, getWishlistIds, saveWishlistIds } from './db';
import { currentUser } from './member';
import { ApiError, LATENCY, respond } from './mock';

function listBooks(userId: string): Book[] {
  return getWishlistIds(userId).flatMap((id) => {
    const book = getBookById(id);
    return book ? [book] : [];
  });
}

export const wishlistService = {
  list: (): Promise<Book[]> => respond(LATENCY.read, () => listBooks(currentUser().id)),

  ids: (): Promise<string[]> => respond(LATENCY.cart, () => getWishlistIds(currentUser().id)),

  /** Toggles a book; returns the new membership state. */
  toggle: (bookId: string): Promise<boolean> =>
    respond(LATENCY.cart, () => {
      const user = currentUser();
      if (!getBookById(bookId)) throw new ApiError('NOT_FOUND', 'Book not found');
      const ids = getWishlistIds(user.id);
      const next = ids.includes(bookId) ? ids.filter((id) => id !== bookId) : [...ids, bookId];
      saveWishlistIds(user.id, next);
      return next.includes(bookId);
    }),
};
