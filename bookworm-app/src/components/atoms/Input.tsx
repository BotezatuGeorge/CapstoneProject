import clsx from 'clsx';
import type { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Input({ label, error, className, id, ...rest }: InputProps) {
  const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-');
  return (
    <div className="flex flex-col gap-1 w-full">
      {label && (
        <label htmlFor={inputId} className="text-xs text-muted">
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={clsx(
          'input-base',
          error && 'border-red-500 focus:outline-red-500',
          className
        )}
        {...rest}
      />
      {error && <span className="text-xs text-[#ff8389]">{error}</span>}
    </div>
  );
}
