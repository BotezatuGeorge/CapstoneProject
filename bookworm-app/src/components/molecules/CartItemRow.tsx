import { Link } from 'react-router-dom';
import { Tag, PriceDisplay } from '../atoms';
import { QuantitySelector } from './QuantitySelector';
import type { CartItem } from '../../types';

interface CartItemRowProps {
  item: CartItem;
  onQuantityChange: (bookId: string, qty: number) => void;
}

export function CartItemRow({ item, onQuantityChange }: CartItemRowProps) {
  const { book, quantity } = item;
  return (
    <div className="flex gap-4 p-4">
      <Link to={`/book/${book.id}`} className="flex-shrink-0">
        <img
          src={book.coverImage}
          alt={book.title}
          className="w-24 sm:w-28 h-36 sm:h-40 object-cover"
        />
      </Link>
      <div className="flex flex-col gap-1 min-w-0 flex-1">
        <h3 className="text-base font-semibold text-white leading-snug">{book.title}</h3>
        <Link to={`/author/${book.authorId}`} className="text-sm text-link hover:underline">
          by {book.author}
        </Link>
        <p className="text-xs text-muted line-clamp-2">{book.description}</p>
        <span className="text-xs text-muted">{book.format}</span>
        <div className="flex flex-wrap gap-1 mt-0.5">
          {book.genres.map((g) => (
            <Tag key={g.slug} label={g.label} href={`/catalog?genre=${g.slug}`} />
          ))}
        </div>
        <PriceDisplay amount={book.price} size="md" className="mt-1" />
        <p className="text-xs text-muted">
          Delivery by <span className="text-white font-medium">{book.deliveryDate}</span>
        </p>
        <div className="mt-2">
          <QuantitySelector
            value={quantity}
            onChange={(q) => onQuantityChange(book.id, q)}
          />
        </div>
      </div>
    </div>
  );
}
