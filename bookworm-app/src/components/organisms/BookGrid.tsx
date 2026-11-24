import { BookCard } from '../molecules';
import type { Book } from '../../types';

interface BookGridProps {
  title: string;
  books: Book[];
}

export function BookGrid({ title, books }: BookGridProps) {
  if (books.length === 0) return null;

  return (
    <section className="mb-8">
      <h2 className="text-base font-semibold text-white mb-3">{title}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
        {books.map((book) => (
          <BookCard key={book.id} book={book} />
        ))}
      </div>
    </section>
  );
}
