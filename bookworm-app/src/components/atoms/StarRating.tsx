import { Star, StarFilled } from '@carbon/icons-react';
import clsx from 'clsx';

interface StarRatingProps {
  rating: number;         // 0–5
  max?: number;
  size?: number;
  interactive?: boolean;
  onChange?: (rating: number) => void;
  className?: string;
}

export function StarRating({
  rating,
  max = 5,
  size = 16,
  interactive = false,
  onChange,
  className,
}: StarRatingProps) {
  return (
    <span className={clsx('flex items-center gap-0.5', className)}>
      {Array.from({ length: max }, (_, i) => {
        const filled = i < Math.round(rating);
        return (
          <button
            key={i}
            type="button"
            disabled={!interactive}
            onClick={() => interactive && onChange?.(i + 1)}
            className={clsx(
              'transition-colors',
              interactive ? 'cursor-pointer hover:scale-110' : 'cursor-default',
              filled ? 'text-[#f1c21b]' : 'text-muted'
            )}
            aria-label={`${i + 1} star`}
          >
            {filled ? <StarFilled size={size} /> : <Star size={size} />}
          </button>
        );
      })}
    </span>
  );
}
