import clsx from 'clsx';
import { formatMoney } from '../../lib/money';

interface PriceDisplayProps {
  amount: number;
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
  size = 'md',
  className,
}: PriceDisplayProps) {
  return (
    <span className={clsx('text-white', sizeMap[size], className)}>
      {formatMoney(amount)}
    </span>
  );
}
