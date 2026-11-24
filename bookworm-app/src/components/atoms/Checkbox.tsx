import clsx from 'clsx';
import type { InputHTMLAttributes } from 'react';

interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: string;
}

export function Checkbox({ label, className, id, ...rest }: CheckboxProps) {
  const checkId = id ?? `chk-${label.toLowerCase().replace(/\s+/g, '-')}`;
  return (
    <label
      htmlFor={checkId}
      className={clsx('flex items-center gap-2 text-sm text-white cursor-pointer select-none', className)}
    >
      <input
        id={checkId}
        type="checkbox"
        className={clsx(
          'w-4 h-4 border border-helper bg-surface-raised',
          'accent-accent-blue cursor-pointer'
        )}
        {...rest}
      />
      {label}
    </label>
  );
}
