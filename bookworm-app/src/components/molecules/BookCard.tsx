import { Link } from 'react-router-dom';
import { Tag, PriceDisplay } from '../atoms';
import type { Book } from '../../types';

interface BookCardProps {
  book: Book;
}

/** The title link is stretched over the card (after:inset-0) so the card is clickable without nesting <a> tags. */
export function BookCard({ book }: BookCardProps) {
  return (
    <div className="relative flex gap-4 group hover:bg-surface-overlay p-2 transition-colors">
      <img
        src={book.coverImage}
        alt={book.title}
        className="w-24 sm:w-28 h-36 sm:h-40 object-cover flex-shrink-0"
      />
      <div className="flex flex-col gap-1 min-w-0">
        <h3 className="text-sm font-semibold text-white leading-snug line-clamp-2 group-hover:text-link transition-colors">
          <Link to={`/book/${book.id}`} className="after:absolute after:inset-0">
            {book.title}
          </Link>
        </h3>
        <Link to={`/author/${book.authorId}`} className="relative z-10 text-xs text-link hover:underline self-start">
          by {book.author}
        </Link>
        <p className="text-xs text-muted line-clamp-2 mt-0.5">{book.description}</p>
        <span className="text-xs text-muted mt-1">{book.format}</span>
        <div className="flex flex-wrap gap-1">
          {book.genres.map((g) => (
            <Tag key={g.slug} label={g.label} href={`/catalog?genre=${g.slug}`} className="relative z-10" />
          ))}
        </div>
        <PriceDisplay amount={book.price} size="sm" className="mt-1" />
        <span className="text-xs text-muted">
          Delivery by <span className="text-white font-medium">{book.deliveryDate}</span>
        </span>
      </div>
    </div>
  );
}
