import clsx from 'clsx';

interface PriceDisplayProps {
  amount: number;
  currency?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeMap = {
  sm: 'text-sm font-semibold',
  md: 'text-xl font-bold',
  lg: 'text-3xl font-bold',
};

export function PriceDisplay({
  amount,
  currency = '₹',
  size = 'md',
  className,
}: PriceDisplayProps) {
  return (
    <span className={clsx('text-white', sizeMap[size], className)}>
      {currency}{amount.toLocaleString('en-IN')}
    </span>
  );
}
