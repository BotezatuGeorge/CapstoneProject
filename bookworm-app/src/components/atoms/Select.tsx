import clsx from 'clsx';
import type { SelectHTMLAttributes } from 'react';
import { ChevronDown } from '@carbon/icons-react';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: { label: string; value: string }[];
  error?: string;
}

export function Select({ label, options, error, className, id, ...rest }: SelectProps) {
  const selectId = id ?? label?.toLowerCase().replace(/\s+/g, '-');
  return (
    <div className="flex flex-col gap-1 w-full">
      {label && (
        <label htmlFor={selectId} className="text-xs text-muted">
          {label}
        </label>
      )}
      <div className="relative w-full">
        <select
          id={selectId}
          className={clsx(
            'input-base appearance-none pr-10 cursor-pointer',
            error && 'border-red-500 focus:outline-red-500',
            className
          )}
          {...rest}
        >
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <ChevronDown
          size={14}
          className="absolute right-2 top-1/2 -translate-y-1/2 text-muted pointer-events-none"
        />
      </div>
      {error && <span className="text-xs text-[#ff8389]">{error}</span>}
    </div>
  );
}
