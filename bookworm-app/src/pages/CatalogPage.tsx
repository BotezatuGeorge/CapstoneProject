import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { PageLayout, CatalogTemplate } from '../components/templates';
import { useAsync } from '../hooks/useAsync';
import { catalogService, errorMessage } from '../services';

export function CatalogPage() {
  const [params] = useSearchParams();
  const genre = params.get('genre') ?? '';
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [language, setLanguage] = useState('All');
  const [format, setFormat] = useState('All');
  const [priceRange, setPriceRange] = useState('All');
  const [sortBy, setSortBy] = useState('Relevance');

  const isFiltered =
    genre !== '' ||
    selectedCategory !== 'All' ||
    searchQuery.trim() !== '' ||
    language !== 'All' ||
    format !== 'All' ||
    priceRange !== 'All';

  const categories = useAsync(() => catalogService.listCategories(), []);
  const feeds = useAsync(() => catalogService.getHomeFeeds(), []);
  const results = useAsync(
    () => catalogService.searchBooks({ query: searchQuery, category: selectedCategory, genre, language, format, priceRange, sortBy }),
    [searchQuery, selectedCategory, genre, language, format, priceRange, sortBy]
  );

  const error = categories.error ?? feeds.error ?? results.error;

  return (
    <PageLayout>
      <CatalogTemplate
        categories={categories.data ?? ['All']}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        searchQuery={searchQuery}
        onSearch={setSearchQuery}
        language={language}
        onLanguageChange={setLanguage}
        format={format}
        onFormatChange={setFormat}
        priceRange={priceRange}
        onPriceRangeChange={setPriceRange}
        sortBy={sortBy}
        onSortByChange={setSortBy}
        recommended={feeds.data?.recommended ?? []}
        bestsellers={feeds.data?.bestsellers ?? []}
        newLaunches={feeds.data?.newLaunches ?? []}
        filtered={results.data ?? []}
        isFiltered={isFiltered}
        genre={genre}
        loading={isFiltered ? results.loading : feeds.loading}
        error={error ? errorMessage(error) : null}
      />
    </PageLayout>
  );
}
