import { useState, useMemo } from 'react';
import { PageLayout } from '../components/templates';
import { CatalogTemplate } from '../components/templates';
import { books, categories, recommended, bestsellers, newLaunches } from '../data';

export function CatalogPage() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [language, setLanguage] = useState('All');
  const [format, setFormat] = useState('All');
  const [priceRange, setPriceRange] = useState('All');
  const [sortBy, setSortBy] = useState('Relevance');

  const isFiltered =
    selectedCategory !== 'All' ||
    searchQuery.trim() !== '' ||
    language !== 'All' ||
    format !== 'All' ||
    priceRange !== 'All';

  const filtered = useMemo(() => {
    let result = [...books];

    if (selectedCategory !== 'All') {
      result = result.filter((b) =>
        b.genres.some((g) => g.label.toLowerCase() === selectedCategory.toLowerCase())
      );
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (b) =>
          b.title.toLowerCase().includes(q) ||
          b.author.toLowerCase().includes(q) ||
          b.description.toLowerCase().includes(q)
      );
    }
    if (language !== 'All') {
      result = result.filter((b) => b.language === language);
    }
    if (format !== 'All') {
      result = result.filter((b) => b.format === format);
    }
    if (priceRange === 'Under ₹200') result = result.filter((b) => b.price < 200);
    if (priceRange === '₹200–₹400') result = result.filter((b) => b.price >= 200 && b.price <= 400);
    if (priceRange === 'Above ₹400') result = result.filter((b) => b.price > 400);

    if (sortBy === 'Price: Low–High') result.sort((a, b) => a.price - b.price);
    if (sortBy === 'Price: High–Low') result.sort((a, b) => b.price - a.price);
    if (sortBy === 'Rating') result.sort((a, b) => b.rating - a.rating);

    return result;
  }, [selectedCategory, searchQuery, language, format, priceRange, sortBy]);

  return (
    <PageLayout>
      <CatalogTemplate
        categories={categories}
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
        recommended={recommended}
        bestsellers={bestsellers}
        newLaunches={newLaunches}
        filtered={filtered}
        isFiltered={isFiltered}
      />
    </PageLayout>
  );
}
