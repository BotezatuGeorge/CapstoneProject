import { CategorySidebar, BookGrid } from '../organisms';
import { SearchBar, FilterDropdown } from '../molecules';
import { Notice } from '../atoms';
import { PageMessage } from './PageMessage';
import type { Book } from '../../types';

interface CatalogTemplateProps {
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (c: string) => void;
  searchQuery: string;
  onSearch: (q: string) => void;
  language: string;
  onLanguageChange: (v: string) => void;
  format: string;
  onFormatChange: (v: string) => void;
  priceRange: string;
  onPriceRangeChange: (v: string) => void;
  sortBy: string;
  onSortByChange: (v: string) => void;
  recommended: Book[];
  bestsellers: Book[];
  newLaunches: Book[];
  filtered: Book[];
  isFiltered: boolean;
  /** Genre tag slug from a clicked tag, e.g. "self-help"; empty when none. */
  genre: string;
  loading: boolean;
  error: string | null;
}

export function CatalogTemplate({
  categories,
  selectedCategory,
  onSelectCategory,
  searchQuery,
  onSearch,
  language,
  onLanguageChange,
  format,
  onFormatChange,
  priceRange,
  onPriceRangeChange,
  sortBy,
  onSortByChange,
  recommended,
  bestsellers,
  newLaunches,
  filtered,
  isFiltered,
  genre,
  loading,
  error,
}: CatalogTemplateProps) {
  const genreLabel = genre
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
  return (
    <div className="flex flex-col md:flex-row gap-6 py-4">
      {/* Sidebar */}
      <CategorySidebar
        categories={categories}
        selected={selectedCategory}
        onSelect={onSelectCategory}
      />

      {/* Main content */}
      <div className="flex-1 min-w-0">
        {/* Filter bar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <SearchBar
            placeholder="Search you want to read here"
            onSearch={onSearch}
            className="flex-1"
          />
          <div className="flex flex-wrap gap-2">
            <FilterDropdown
              label="Language"
              options={['All', 'English', 'Hindi', 'Spanish']}
              value={language}
              onChange={onLanguageChange}
              className="min-w-[110px]"
            />
            <FilterDropdown
              label="Format (Paperback, ebook etc)"
              options={['All', 'Paperback', 'Hardcover', 'eBook']}
              value={format}
              onChange={onFormatChange}
              className="min-w-[140px]"
            />
            <FilterDropdown
              label="Price Range"
              options={['All', 'Under $15', '$15–$25', 'Above $25']}
              value={priceRange}
              onChange={onPriceRangeChange}
              className="min-w-[110px]"
            />
            <FilterDropdown
              label="Sort by"
              options={['Relevance', 'Price: Low–High', 'Price: High–Low', 'Rating']}
              value={sortBy}
              onChange={onSortByChange}
              className="min-w-[110px]"
            />
          </div>
        </div>

        {/* Book sections */}
        {error && <Notice kind="error" className="mb-4">{error}</Notice>}
        {loading ? (
          <PageMessage loading>Loading books…</PageMessage>
        ) : isFiltered ? (
          filtered.length === 0 ? (
            <Notice kind="info">No books match your search. Try clearing a filter.</Notice>
          ) : (
            <BookGrid title={`Results for "${searchQuery || genreLabel || selectedCategory}"`} books={filtered} />
          )
        ) : (
          <>
            <BookGrid title="Recommended for You" books={recommended} />
            <BookGrid title="Bestsellers this Month" books={bestsellers} />
            <BookGrid title="New Launches" books={newLaunches} />
          </>
        )}
      </div>
    </div>
  );
}
