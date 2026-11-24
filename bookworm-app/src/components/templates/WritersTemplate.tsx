import { Link } from 'react-router-dom';
import { BreadcrumbNav, RelatedBookCard } from '../molecules';
import type { AuthorWithBooks } from '../../types';

interface WritersTemplateProps {
  authors: AuthorWithBooks[];
  /** When set, only this writer is shown (the /author/:id view). */
  selectedId?: string;
}

export function WritersTemplate({ authors, selectedId }: WritersTemplateProps) {
  const shown = selectedId ? authors.filter((a) => a.id === selectedId) : authors;
  return (
    <div className="py-4">
      <BreadcrumbNav
        crumbs={[
          { label: 'Home', href: '/' },
          ...(selectedId ? [{ label: 'My Writers', href: '/writers' }, { label: shown[0]?.name ?? 'Writer' }] : [{ label: 'My Writers' }]),
        ]}
      />
      <h1 className="text-xl font-light text-[#f4f4f4] mb-4">{selectedId ? shown[0]?.name ?? 'Writer not found' : 'My Writers'}</h1>

      <div className="flex flex-col gap-6">
        {shown.map((author) => (
          <section key={author.id} className="card p-5">
            <div className="flex gap-4 items-start mb-4">
              <img src={author.avatar} alt={author.name} className="w-16 h-16 rounded-full object-cover flex-shrink-0" />
              <div className="min-w-0">
                <Link to={`/author/${author.id}`} className="text-base font-semibold text-white hover:text-link">{author.name}</Link>
                <p className="text-sm text-muted leading-relaxed whitespace-pre-line">{author.bio}</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-2">
              {author.books.map((book) => (
                <RelatedBookCard key={book.id} book={book} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
