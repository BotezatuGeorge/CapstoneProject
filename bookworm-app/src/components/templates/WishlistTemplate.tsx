import { Link } from 'react-router-dom';
import { Button, Notice, PriceDisplay } from '../atoms';
import { BreadcrumbNav } from '../molecules';
import type { Book } from '../../types';

interface WishlistTemplateProps {
  books: Book[];
  busy: boolean;
  feedback: { kind: 'error' | 'success'; message: string } | null;
  onRemove: (bookId: string) => void;
  onAddToCart: (bookId: string) => void;
}

export function WishlistTemplate({ books, busy, feedback, onRemove, onAddToCart }: WishlistTemplateProps) {
  return (
    <div className="py-4">
      <BreadcrumbNav crumbs={[{ label: 'Home', href: '/' }, { label: 'My Wishlist' }]} />
      <h1 className="text-xl font-light text-[#f4f4f4] mb-4">My Wishlist</h1>

      {feedback && <Notice kind={feedback.kind} className="mb-4">{feedback.message}</Notice>}

      {books.length === 0 ? (
        <div className="card p-10 text-center text-muted">
          <p>Your wishlist is empty. Use “Add to Wishlist” on any book.</p>
          <Link to="/" className="text-link hover:underline text-sm mt-3 inline-block">Browse books</Link>
        </div>
      ) : (
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {books.map((book) => (
            <li key={book.id} className="card p-4 flex gap-4">
              <Link to={`/book/${book.id}`} className="flex-shrink-0">
                <img src={book.coverImage} alt={book.title} className="w-24 h-36 object-cover" />
              </Link>
              <div className="flex flex-col gap-1 min-w-0">
                <Link to={`/book/${book.id}`} className="text-base font-semibold text-white hover:text-link">{book.title}</Link>
                <span className="text-sm text-link">by {book.author}</span>
                <span className="text-xs text-muted">{book.format}</span>
                <PriceDisplay amount={book.price} size="sm" className="mt-1" />
                <span className="text-xs text-muted">Delivery by <span className="text-white">{book.deliveryDate}</span></span>
                <div className="flex flex-wrap gap-2 mt-2">
                  <Button variant="primary" size="sm" disabled={busy || book.stock === 0} onClick={() => onAddToCart(book.id)}>
                    {book.stock === 0 ? 'Out of stock' : 'Add to Cart'}
                  </Button>
                  <Button variant="secondary" size="sm" disabled={busy} onClick={() => onRemove(book.id)}>Remove</Button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
