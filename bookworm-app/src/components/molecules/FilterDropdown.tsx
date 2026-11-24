import { ChevronDown } from '@carbon/icons-react';

interface FilterDropdownProps {
  label: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export function FilterDropdown({
  label,
  options,
  value,
  onChange,
  className,
}: FilterDropdownProps) {
  return (
    <div className={`flex flex-col gap-1 ${className ?? ''}`}>
      <span className="text-xs text-muted">{label}</span>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full appearance-none bg-surface-overlay border border-border px-3 py-2 text-sm text-white
                     focus:outline-none focus:ring-1 focus:ring-accent-blue transition pr-8 cursor-pointer"
        >
          {options.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
        <ChevronDown
          size={14}
          className="absolute right-2 top-1/2 -translate-y-1/2 text-muted pointer-events-none"
        />
      </div>
    </div>
  );
}
