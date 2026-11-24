import { useParams } from 'react-router-dom';
import { useState } from 'react';
import { PageLayout, PageMessage, ProductTemplate } from '../components/templates';
import { useCart } from '../context/cart';
import { useSession } from '../context/session';
import { useAsync } from '../hooks/useAsync';
import { catalogService, errorMessage, reviewService, wishlistService } from '../services';

interface Feedback {
  kind: 'error' | 'success';
  message: string;
}

export function ProductDetailsPage() {
  const { id = '' } = useParams<{ id: string }>();
  const { addToCart } = useCart();
  const { user } = useSession();
  const [busy, setBusy] = useState(false);
  const [feedback, setFeedback] = useState<Feedback | null>(null);

  const detail = useAsync(() => catalogService.getBookDetail(id), [id, user.id]);
  const wishlist = useAsync(() => wishlistService.ids(), [user.id]);

  if (detail.loading && !detail.data) {
    return (
      <PageLayout>
        <PageMessage loading>Loading book…</PageMessage>
      </PageLayout>
    );
  }
  if (!detail.data) {
    return (
      <PageLayout>
        <PageMessage>{detail.error ? errorMessage(detail.error) : 'Book not found.'}</PageMessage>
      </PageLayout>
    );
  }

  const { book, author, reviews, related } = detail.data;

  const handleAddToCart = async () => {
    setBusy(true);
    setFeedback(null);
    try {
      await addToCart(book.id);
      setFeedback({ kind: 'success', message: `Added “${book.title}” to your cart` });
    } catch (error) {
      setFeedback({ kind: 'error', message: errorMessage(error) });
      detail.reload();
    } finally {
      setBusy(false);
    }
  };

  const handleToggleWishlist = async () => {
    setBusy(true);
    setFeedback(null);
    try {
      const added = await wishlistService.toggle(book.id);
      wishlist.reload();
      setFeedback({ kind: 'success', message: added ? 'Added to your wishlist' : 'Removed from your wishlist' });
    } catch (error) {
      setFeedback({ kind: 'error', message: errorMessage(error) });
    } finally {
      setBusy(false);
    }
  };

  const handleSubmitReview = async (text: string, rating: number) => {
    await reviewService.submit(book.id, text, rating);
    detail.reload();
  };

  return (
    <PageLayout>
      <ProductTemplate
        book={book}
        author={author}
        relatedBooks={related}
        reviews={reviews}
        inWishlist={wishlist.data?.includes(book.id) ?? false}
        busy={busy}
        feedback={feedback}
        onAddToCart={() => void handleAddToCart()}
        onToggleWishlist={() => void handleToggleWishlist()}
        onSubmitReview={handleSubmitReview}
      />
    </PageLayout>
  );
}
