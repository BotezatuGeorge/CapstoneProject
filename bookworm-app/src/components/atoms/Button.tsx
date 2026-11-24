import clsx from 'clsx';
import type { ButtonHTMLAttributes } from 'react';

type Variant = 'primary' | 'secondary' | 'ghost';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
}

const variantStyles: Record<Variant, string> = {
  primary: 'bg-accent-blue hover:bg-accent-blue-hover text-white',
  secondary: 'bg-surface-overlay hover:bg-[#4c4c4c] text-white',
  ghost: 'bg-transparent hover:bg-surface-overlay text-white',
};

const sizeStyles: Record<Size, string> = {
  sm: 'px-4 py-2 text-xs',
  md: 'px-4 py-3 text-sm',
  lg: 'px-4 py-4 text-base',
};

export function Button({
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'right',
  fullWidth = false,
  children,
  className,
  disabled,
  ...rest
}: ButtonProps) {
  return (
    <button
      {...rest}
      disabled={disabled}
      className={clsx(
        'inline-flex items-center justify-between gap-8 transition-colors',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        variantStyles[variant],
        sizeStyles[size],
        fullWidth && 'w-full',
        className
      )}
    >
      {icon && iconPosition === 'left' && icon}
      {children}
      {icon && iconPosition === 'right' && icon}
    </button>
  );
}
