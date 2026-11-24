import { Search } from '@carbon/icons-react';
import { useState } from 'react';

interface SearchBarProps {
  placeholder?: string;
  onSearch?: (query: string) => void;
  className?: string;
}

export function SearchBar({ placeholder = 'Search', onSearch, className }: SearchBarProps) {
  const [value, setValue] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch?.(value);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`relative flex items-center w-full ${className ?? ''}`}
    >
      <input
        type="search"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-surface-overlay border border-border px-4 py-2 text-sm text-white placeholder-muted pr-10
                   focus:outline-none focus:ring-1 focus:ring-accent-blue transition"
      />
      <button
        type="submit"
        className="absolute right-2 top-1/2 -translate-y-1/2 text-muted hover:text-white transition-colors"
        aria-label="Search"
      >
        <Search size={16} />
      </button>
    </form>
  );
}
