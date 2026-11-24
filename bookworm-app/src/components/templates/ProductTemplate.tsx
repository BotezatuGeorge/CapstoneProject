import { Link } from 'react-router-dom';
import { Button, Notice, PriceDisplay, StarRating, Tag } from '../atoms';
import { BreadcrumbNav } from '../molecules';
import { RelatedBookCard } from '../molecules';
import { AuthorBio, ReviewSection } from '../organisms';
import { ShoppingCart, Bookmark, BookmarkFilled } from '@carbon/icons-react';
import type { Book, Author, Review } from '../../types';

interface ProductTemplateProps {
  book: Book;
  author: Author | undefined;
  relatedBooks: Book[];
  reviews: Review[];
  inWishlist: boolean;
  busy: boolean;
  /** Result of the last cart/wishlist action, shown under the buttons. */
  feedback: { kind: 'error' | 'success'; message: string } | null;
  onAddToCart: () => void;
  onToggleWishlist: () => void;
  onSubmitReview: (text: string, rating: number) => Promise<void>;
}

export function ProductTemplate({
  book,
  author,
  relatedBooks,
  reviews,
  inWishlist,
  busy,
  feedback,
  onAddToCart,
  onToggleWishlist,
  onSubmitReview,
}: ProductTemplateProps) {
  const outOfStock = book.stock === 0;
  const crumbs = [
    { label: 'Home', href: '/' },
    ...(book.genres[0] ? [{ label: book.genres[0].label, href: `/catalog?genre=${book.genres[0].slug}` }] : []),
    { label: book.genres[1]?.label ?? '' },
  ].filter((c) => c.label);

  return (
    <div className="py-4">
      <BreadcrumbNav crumbs={crumbs} />

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left: book detail */}
        <div className="flex-1 min-w-0">
          {/* Book cover + info */}
          <div className="flex flex-col sm:flex-row gap-6 mb-8">
            {/* Covers */}
            <div className="flex gap-3 flex-shrink-0">
              <img
                src={book.coverImage}
                alt={book.title}
                className="w-32 sm:w-40 h-48 sm:h-60 object-cover"
              />
              {book.backCoverText && (
                <div className="hidden sm:flex w-32 sm:w-40 h-48 sm:h-60 bg-[#f1c21b] flex-col p-3 overflow-hidden">
                  <p className="text-[9px] text-gray-700 leading-relaxed line-clamp-[18]">
                    {book.backCoverText}
                  </p>
                  {book.isbn && (
                    <p className="text-[8px] text-gray-500 mt-auto">{book.isbn}</p>
                  )}
                </div>
              )}
            </div>

            {/* Meta */}
            <div className="flex flex-col gap-2 min-w-0">
              <h1 className="text-xl font-bold text-white leading-snug">{book.title}</h1>
              <Link to={`/author/${book.authorId}`} className="text-sm text-link hover:underline">
                by {book.author}
              </Link>
              <p className="text-sm text-muted">{book.description}</p>
              {book.publisher && (
                <p className="text-sm text-muted">
                  Published by:{' '}
                  <span className="text-link">{book.publisher}</span>
                </p>
              )}
              <span className="text-sm text-muted mt-1">{book.format}</span>
              <div className="flex flex-wrap gap-1">
                {book.genres.map((g) => (
                  <Tag key={g.slug} label={g.label} href={`/catalog?genre=${g.slug}`} />
                ))}
              </div>
              <PriceDisplay amount={book.price} size="lg" className="mt-2" />
              <p className="text-xs text-muted">
                Delivery by <span className="text-white font-medium">{book.deliveryDate}</span>
              </p>

              {book.stock > 0 && book.stock <= 5 && (
                <p className="text-xs text-[#f1c21b]">Only {book.stock} left in stock</p>
              )}
              {outOfStock && <p className="text-xs text-[#ff8389]">Out of stock</p>}

              {/* CTA buttons */}
              <div className="flex flex-wrap gap-3 mt-3">
                <Button
                  variant="primary"
                  size="md"
                  icon={<ShoppingCart size={16} />}
                  onClick={onAddToCart}
                  disabled={busy || outOfStock}
                >
                  Add to Cart
                </Button>
                <Button
                  variant="secondary"
                  size="md"
                  icon={inWishlist ? <BookmarkFilled size={16} /> : <Bookmark size={16} />}
                  onClick={onToggleWishlist}
                  disabled={busy}
                >
                  {inWishlist ? 'In Wishlist' : 'Add to Wishlist'}
                </Button>
              </div>
              {feedback && <Notice kind={feedback.kind} className="mt-2">{feedback.message}</Notice>}

              {/* Stats row */}
              <div className="flex flex-wrap gap-6 mt-4 pt-4 border-t border-border">
                <div className="flex flex-col gap-1">
                  <span className="text-xs text-muted flex items-center gap-1">
                    <span>Rₐ</span> Language
                  </span>
                  <span className="text-sm text-link">{book.language}</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-xs text-muted flex items-center gap-1">
                    <span>☆</span> Rating
                  </span>
                  <StarRating rating={book.rating} size={16} />
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-xs text-muted flex items-center gap-1">
                    <span>$</span> Sells
                  </span>
                  <span className="text-sm text-white">{book.soldCount} copies sold</span>
                </div>
              </div>
            </div>
          </div>

          {/* Author bio */}
          {author && <AuthorBio author={author} />}

          {/* Reviews */}
          <ReviewSection reviews={reviews} onSubmit={onSubmitReview} />
        </div>

        {/* Right: related reads */}
        <aside className="w-full lg:w-72 xl:w-80 flex-shrink-0">
          <h2 className="text-base font-semibold text-white mb-3">Related Reads</h2>
          <div className="flex flex-col gap-3">
            {relatedBooks.map((rb) => (
              <RelatedBookCard key={rb.id} book={rb} />
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
}
