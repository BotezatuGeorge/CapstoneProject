import { useState } from 'react';
import { ArrowRight } from '@carbon/icons-react';
import { Button, Notice, StarRating } from '../atoms';
import { ReviewCard } from '../molecules';
import { MAX_REVIEW_LENGTH, errorMessage } from '../../services';
import type { Review } from '../../types';

interface ReviewSectionProps {
  reviews: Review[];
  /** Rejects with an ApiError when the review is refused (guest, invalid text, ...). */
  onSubmit: (text: string, rating: number) => Promise<void>;
}

export function ReviewSection({ reviews, onSubmit }: ReviewSectionProps) {
  const [text, setText] = useState('');
  const [rating, setRating] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || rating === 0) return;
    setSubmitting(true);
    setError(null);
    try {
      await onSubmit(text.trim(), rating);
      setText('');
      setRating(0);
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="mt-8">
      <h2 className="text-base font-semibold text-white mb-4">Reviews</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Write a review */}
        <form onSubmit={(e) => void handleSubmit(e)} className="flex flex-col gap-3">
          <div className="flex justify-between text-xs text-muted">
            <span>Leave Your Review</span>
            <span>{text.length}/{MAX_REVIEW_LENGTH}</span>
          </div>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value.slice(0, MAX_REVIEW_LENGTH))}
            placeholder="Placeholder text"
            rows={6}
            aria-label="Leave Your Review"
            className="input-base resize-none"
          />
          {error && <Notice kind="error">{error}</Notice>}
          <div className="flex items-center justify-between">
            <StarRating rating={rating} interactive onChange={setRating} size={20} />
            <Button
              type="submit"
              variant="primary"
              size="md"
              icon={<ArrowRight size={16} />}
              disabled={submitting || !text.trim() || rating === 0}
            >
              {submitting ? 'Submitting…' : 'Submit'}
            </Button>
          </div>
        </form>

        {/* Existing reviews */}
        <div className="flex flex-col gap-5">
          {reviews.map((r) => (
            <ReviewCard key={r.id} review={r} />
          ))}
        </div>
      </div>
    </section>
  );
}
