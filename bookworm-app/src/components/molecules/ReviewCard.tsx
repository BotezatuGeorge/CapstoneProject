import { StarRating } from '../atoms';
import type { Review } from '../../types';

interface ReviewCardProps {
  review: Review;
}

export function ReviewCard({ review }: ReviewCardProps) {
  return (
    <div className="flex flex-col gap-2">
      <h4 className="text-sm font-semibold text-white">{review.author}</h4>
      <p className="text-sm text-muted leading-relaxed">{review.text}</p>
      <StarRating rating={review.rating} size={16} />
    </div>
  );
}
