import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { PageLayout } from '../components/templates';
import { ProductTemplate } from '../components/templates';
import { books, authors, reviews as defaultReviews } from '../data';
import { useCart } from '../context/CartContext';
import type { Review } from '../types';

export function ProductDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [reviews, setReviews] = useState<Review[]>(defaultReviews);

  const book = books.find((b) => b.id === id);
  if (!book) {
    return (
      <PageLayout>
        <div className="py-20 text-center text-muted">Book not found.</div>
      </PageLayout>
    );
  }

  const author = authors.find((a) => a.id === book.authorId);
  const relatedBooks = books.filter((b) => b.id !== book.id).slice(0, 3);

  const handleAddToCart = () => {
    addToCart(book);
    navigate('/cart');
  };

  const handleSubmitReview = (text: string, rating: number) => {
    const newReview: Review = {
      id: String(Date.now()),
      author: 'You',
      text,
      rating,
      date: new Date().toISOString().slice(0, 10),
    };
    setReviews((prev) => [newReview, ...prev]);
  };

  return (
    <PageLayout>
      <ProductTemplate
        book={book}
        author={author}
        relatedBooks={relatedBooks}
        reviews={reviews}
        onAddToCart={handleAddToCart}
        onAddToWishlist={() => {}}
        onSubmitReview={handleSubmitReview}
      />
    </PageLayout>
  );
}
