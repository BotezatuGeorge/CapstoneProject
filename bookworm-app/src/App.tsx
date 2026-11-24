import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { SessionProvider } from './context/SessionProvider';
import { CartProvider } from './context/CartProvider';
import { CatalogPage } from './pages/CatalogPage';
import { ProductDetailsPage } from './pages/ProductDetailsPage';
import { CartPage } from './pages/CartPage';
import { PaymentPage } from './pages/PaymentPage';
import { ConfirmationPage } from './pages/ConfirmationPage';
import { OrdersPage } from './pages/OrdersPage';
import { WishlistPage } from './pages/WishlistPage';
import { WritersPage } from './pages/WritersPage';

export function App() {
  return (
    <BrowserRouter>
      <SessionProvider>
        <CartProvider>
          <Routes>
            <Route path="/" element={<CatalogPage />} />
            <Route path="/catalog" element={<CatalogPage />} />
            <Route path="/book/:id" element={<ProductDetailsPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/payment" element={<PaymentPage />} />
            <Route path="/confirmation/:orderId" element={<ConfirmationPage />} />
            <Route path="/orders" element={<OrdersPage />} />
            <Route path="/wishlist" element={<WishlistPage />} />
            <Route path="/writers" element={<WritersPage />} />
            <Route path="/author/:id" element={<WritersPage />} />
            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </CartProvider>
      </SessionProvider>
    </BrowserRouter>
  );
}
