import { authors, categories, homeSections } from '../data';
import type { AuthorWithBooks, Book, BookDetail, CatalogQuery, HomeFeeds } from '../types';
import { getBookById, getBooks, getOrders, getReviews } from './db';
import { currentUser } from './member';
import { ApiError, LATENCY, respond } from './mock';

const PRICE_FILTERS: Record<string, (price: number) => boolean> = {
  'Under $15': (p) => p < 15,
  '$15–$25': (p) => p >= 15 && p <= 25,
  'Above $25': (p) => p > 25,
};

function pick(books: Book[], ids: readonly string[]): Book[] {
  return ids.flatMap((id) => books.filter((b) => b.id === id));
}

function search(books: Book[], q: CatalogQuery): Book[] {
  let result = [...books];
  if (q.category !== 'All') {
    result = result.filter((b) => b.categories.some((c) => c.toLowerCase() === q.category.toLowerCase()));
  }
  if (q.genre) result = result.filter((b) => b.genres.some((g) => g.slug === q.genre));
  const text = q.query.trim().toLowerCase();
  if (text) {
    result = result.filter(
      (b) =>
        b.title.toLowerCase().includes(text) ||
        b.author.toLowerCase().includes(text) ||
        b.description.toLowerCase().includes(text)
    );
  }
  if (q.language !== 'All') result = result.filter((b) => b.language === q.language);
  if (q.format !== 'All') result = result.filter((b) => b.format === q.format);
  const inRange = PRICE_FILTERS[q.priceRange];
  if (inRange) result = result.filter((b) => inRange(b.price));

  if (q.sortBy === 'Price: Low–High') result.sort((a, b) => a.price - b.price);
  if (q.sortBy === 'Price: High–Low') result.sort((a, b) => b.price - a.price);
  if (q.sortBy === 'Rating') result.sort((a, b) => b.rating - a.rating);
  return result;
}

/** Books by genre the user has bought before, used to personalise "Recommended for You". */
function recommendFor(books: Book[], userId: string): Book[] {
  const purchases = getOrders().filter((o) => o.userId === userId && o.status !== 'CANCELLED');
  if (purchases.length === 0) return [];
  const boughtIds = new Set(purchases.flatMap((o) => o.items.map((i) => i.book.id)));
  const genreSlugs = new Set(purchases.flatMap((o) => o.items.flatMap((i) => i.book.genres.map((g) => g.slug))));
  return books
    .filter((b) => !boughtIds.has(b.id) && b.genres.some((g) => genreSlugs.has(g.slug)))
    .sort((a, b) => b.rating - a.rating);
}

export const catalogService = {
  listCategories: (): Promise<string[]> => respond(LATENCY.read, () => categories),

  getHomeFeeds: (): Promise<HomeFeeds> =>
    respond(LATENCY.read, () => {
      const books = getBooks();
      const personal = recommendFor(books, currentUser().id).slice(0, 3);
      return {
        recommended: personal.length > 0 ? personal : pick(books, homeSections.recommended),
        bestsellers: pick(books, homeSections.bestsellers),
        newLaunches: pick(books, homeSections.newLaunches),
      };
    }),

  searchBooks: (query: CatalogQuery): Promise<Book[]> => respond(LATENCY.read, () => search(getBooks(), query)),

  getBookDetail: (bookId: string): Promise<BookDetail> =>
    respond(LATENCY.read, () => {
      const book = getBookById(bookId);
      if (!book) throw new ApiError('NOT_FOUND', 'Book not found');
      const all = getBooks();
      // Up-sell / cross-sell: same author first, then shared genres, best rated first.
      const related = all
        .filter((b) => b.id !== book.id)
        .map((b) => ({
          book: b,
          score:
            (b.authorId === book.authorId ? 10 : 0) +
            b.genres.filter((g) => book.genres.some((bg) => bg.slug === g.slug)).length,
        }))
        .filter((r) => r.score > 0)
        .sort((a, b) => b.score - a.score || b.book.rating - a.book.rating)
        .slice(0, 3)
        .map((r) => r.book);
      return {
        book,
        author: authors.find((a) => a.id === book.authorId),
        reviews: getReviews(bookId),
        related,
      };
    }),

  /** "My Writers": every author the customer has bought from or wishlisted, with their titles. */
  listAuthors: (): Promise<AuthorWithBooks[]> =>
    respond(LATENCY.read, () => {
      const books = getBooks();
      return authors.map((a) => ({ ...a, books: books.filter((b) => b.authorId === a.id) }));
    }),
};
