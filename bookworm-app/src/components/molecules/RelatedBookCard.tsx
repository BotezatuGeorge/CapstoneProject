import { Link } from 'react-router-dom';
import { Tag, PriceDisplay } from '../atoms';
import type { Book } from '../../types';

interface RelatedBookCardProps {
  book: Book;
}

export function RelatedBookCard({ book }: RelatedBookCardProps) {
  return (
    <Link
      to={`/book/${book.id}`}
      className="flex gap-3 group hover:bg-surface-overlay p-2 transition-colors"
    >
      <img
        src={book.coverImage}
        alt={book.title}
        className="w-16 h-24 object-cover flex-shrink-0"
      />
      <div className="flex flex-col gap-1 min-w-0">
        <h4 className="text-sm font-semibold text-white line-clamp-2 group-hover:text-link transition-colors leading-snug">
          {book.title}
        </h4>
        <span className="text-xs text-link">by {book.author}</span>
        <p className="text-xs text-muted line-clamp-2">{book.description}</p>
        <span className="text-xs text-muted">{book.format}</span>
        <div className="flex flex-wrap gap-1">
          {book.genres.map((g) => (
            <Tag key={g.slug} label={g.label} href={`/catalog?genre=${g.slug}`} />
          ))}
        </div>
        <PriceDisplay amount={book.price} size="sm" className="mt-1" />
        <span className="text-xs text-muted">
          Delivery by <span className="text-white font-medium">{book.deliveryDate}</span>
        </span>
      </div>
    </Link>
  );
}
