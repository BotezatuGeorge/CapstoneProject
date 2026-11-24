import { useState } from 'react';
import { PageLayout, PageMessage, WishlistTemplate } from '../components/templates';
import { useCart } from '../context/cart';
import { useSession } from '../context/session';
import { useAsync } from '../hooks/useAsync';
import { errorMessage, wishlistService } from '../services';

export function WishlistPage() {
  const { user } = useSession();
  const { addToCart } = useCart();
  const wishlist = useAsync(() => wishlistService.list(), [user.id]);
  const [busy, setBusy] = useState(false);
  const [feedback, setFeedback] = useState<{ kind: 'error' | 'success'; message: string } | null>(null);

  const run = async (action: () => Promise<string>) => {
    setBusy(true);
    setFeedback(null);
    try {
      setFeedback({ kind: 'success', message: await action() });
      wishlist.reload();
    } catch (error) {
      setFeedback({ kind: 'error', message: errorMessage(error) });
    } finally {
      setBusy(false);
    }
  };

  if (wishlist.loading && !wishlist.data) {
    return (
      <PageLayout>
        <PageMessage loading>Loading your wishlist…</PageMessage>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <WishlistTemplate
        books={wishlist.data ?? []}
        busy={busy}
        feedback={feedback ?? (wishlist.error ? { kind: 'error', message: errorMessage(wishlist.error) } : null)}
        onRemove={(id) => void run(async () => { await wishlistService.toggle(id); return 'Removed from your wishlist'; })}
        onAddToCart={(id) => void run(async () => { await addToCart(id); return 'Added to your cart'; })}
      />
    </PageLayout>
  );
}
