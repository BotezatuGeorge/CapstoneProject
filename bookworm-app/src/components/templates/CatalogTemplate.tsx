import { CategorySidebar, BookGrid } from '../organisms';
import { SearchBar, FilterDropdown } from '../molecules';
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
}: CatalogTemplateProps) {
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
              options={['All', 'Under ₹200', '₹200–₹400', 'Above ₹400']}
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
        {isFiltered ? (
          <BookGrid title={`Results for "${searchQuery || selectedCategory}"`} books={filtered} />
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
