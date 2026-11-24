import { useState } from 'react';
import { Button, StarRating } from '../atoms';
import { ReviewCard } from '../molecules';
import type { Review } from '../../types';

interface ReviewSectionProps {
  reviews: Review[];
  onSubmit: (text: string, rating: number) => void;
}

export function ReviewSection({ reviews, onSubmit }: ReviewSectionProps) {
  const [text, setText] = useState('');
  const [rating, setRating] = useState(0);
  const MAX = 100;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim() && rating > 0) {
      onSubmit(text.trim(), rating);
      setText('');
      setRating(0);
    }
  };

  return (
    <section className="mt-8">
      <h2 className="text-base font-semibold text-white mb-4">Reviews</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Write a review */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div className="flex justify-between text-xs text-muted">
            <span>Leave Your Review</span>
            <span>{text.length}/{MAX}</span>
          </div>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value.slice(0, MAX))}
            placeholder="Placeholder text"
            rows={6}
            className="w-full bg-surface-overlay border border-border px-3 py-2 text-sm text-white
                       placeholder-muted resize-none focus:outline-none focus:ring-1 focus:ring-accent-blue transition"
          />
          <div className="flex items-center justify-between">
            <StarRating rating={rating} interactive onChange={setRating} size={20} />
            <Button type="submit" variant="primary" size="md" icon={<ArrowIcon />} disabled={!text.trim() || rating === 0}>
              Submit
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

function ArrowIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
