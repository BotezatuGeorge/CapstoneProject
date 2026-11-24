import clsx from 'clsx';

interface CategorySidebarProps {
  categories: string[];
  selected: string;
  onSelect: (cat: string) => void;
}

export function CategorySidebar({ categories, selected, onSelect }: CategorySidebarProps) {
  return (
    <aside className="w-full md:w-44 lg:w-52 flex-shrink-0">
      {/* Mobile: horizontal scroll */}
      <div className="md:hidden flex gap-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => onSelect(cat)}
            className={clsx(
              'flex-shrink-0 px-4 py-2 text-sm transition-colors whitespace-nowrap',
              selected === cat
                ? 'bg-surface-overlay text-white font-semibold'
                : 'bg-surface-raised text-muted hover:bg-surface-overlay hover:text-white'
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Desktop: vertical list */}
      <ul className="hidden md:flex flex-col">
        {categories.map((cat) => (
          <li key={cat}>
            <button
              onClick={() => onSelect(cat)}
              className={clsx(
                'w-full text-left px-4 py-2 text-sm font-semibold transition-colors',
                selected === cat
                  ? 'bg-surface-overlay text-white'
                  : 'text-muted hover:bg-surface-raised hover:text-white'
              )}
            >
              {cat}
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
}
