export type BookFormat = 'Paperback' | 'Hardcover' | 'eBook';

export interface Book {
  id: string;
  title: string;
  author: string;
  authorId: string;
  description: string;
  coverImage: string;
  format: BookFormat;
  genres: { label: string; slug: string }[];
  /** Sidebar categories this book is listed under. */
  categories: string[];
  price: number;
  /** Display string such as "Mon, 21 Jul", computed by the shipping rules. */
  deliveryDate: string;
  /** Units currently available, from the mock inventory. */
  stock: number;
  language: string;
  rating: number;
  soldCount: number;
  publisher?: string;
  backCoverText?: string;
  isbn?: string;
}

/** Catalog fixture shape: a Book before the shipping rules and inventory are applied. */
export type BookRecord = Omit<Book, 'deliveryDate' | 'stock'>;

export interface Author {
  id: string;
  name: string;
  bio: string;
  avatar: string;
}

export interface CartItem {
  book: Book;
  quantity: number;
}

export interface Review {
  id: string;
  bookId: string;
  author: string;
  avatar?: string;
  text: string;
  rating: number;
  date: string;
}

export interface AddressFormData {
  firstName: string;
  lastName: string;
  addressLine: string;
  email: string;
  city: string;
  pin: string;
  phoneCountry: string;
  phone: string;
  state: string;
  country: string;
  useSaved: boolean;
}

export type Address = Omit<AddressFormData, 'useSaved'>;

/* ---------- Member ---------- */

export type Role = 'GUEST' | 'CUSTOMER' | 'STORE_ADMIN' | 'SYSTEM_ADMIN';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  walletBalance: number;
  giftPoints: number;
  savedAddress: Address | null;
}

/* ---------- Order / pricing ---------- */

export interface Coupon {
  code: string;
  description: string;
  type: 'FLAT' | 'PERCENT';
  value: number;
  minOrder: number;
}

export interface CartState {
  items: CartItem[];
  coupon: Coupon | null;
}

export interface CartSnapshot extends CartState {
  quote: Quote;
}

export interface Quote {
  itemCount: number;
  subtotal: number;
  tax: number;
  shipping: number;
  discount: number;
  total: number;
  /** False when a coupon is attached but the order is below its minimum. */
  couponApplied: boolean;
}

export type OrderStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'SHIPPED'
  | 'DELIVERED'
  | 'CANCELLED'
  | 'RETURNED';

/* ---------- Payment ---------- */

export type PaymentMethod = 'CREDIT_CARD' | 'DEBIT_CARD' | 'UPI' | 'WALLET';

export type PaymentRequest =
  | {
      method: 'CREDIT_CARD' | 'DEBIT_CARD';
      cardNumber: string;
      nameOnCard: string;
      cvv: string;
      expiry: string;
    }
  | { method: 'UPI'; vpa: string }
  | { method: 'WALLET' };

export type PaymentStatus = 'SUCCESS' | 'PENDING' | 'FAILED' | 'REFUNDED';

export interface PaymentTransaction {
  id: string;
  method: PaymentMethod;
  transactionRef: string;
  amount: number;
  status: PaymentStatus;
  processedAt: string;
}

/* ---------- Shipping ---------- */

export type ShipmentStatus = 'PROCESSING' | 'IN_TRANSIT' | 'DELIVERED' | 'RETURN_IN_PROGRESS';

export interface Shipment {
  trackingNumber: string;
  carrier: string;
  status: ShipmentStatus;
  estimatedDeliveryDate: string;
  shippingRate: number;
}

export interface Order {
  id: string;
  userId: string;
  status: OrderStatus;
  items: CartItem[];
  address: Address;
  subtotal: number;
  taxAmount: number;
  shippingFee: number;
  discountAmount: number;
  totalAmount: number;
  couponCode?: string;
  pointsEarned: number;
  payment: PaymentTransaction;
  shipment: Shipment;
  placedAt: string;
  /** placedAt + 48 hours */
  cancellationDeadline: string;
  tentativeDeliveryDate: string;
}

/** An order plus the eligibility flags the Order subsystem computes at read time. */
export interface OrderView extends Order {
  canCancel: boolean;
  canReturn: boolean;
  /** Milliseconds left in the 48-hour cancellation window (0 once closed). */
  cancelMsRemaining: number;
}

export interface BookDetail {
  book: Book;
  author: Author | undefined;
  reviews: Review[];
  related: Book[];
}

export interface HomeFeeds {
  recommended: Book[];
  bestsellers: Book[];
  newLaunches: Book[];
}

export interface CatalogQuery {
  query: string;
  category: string;
  /** Genre tag slug such as "self-help", set by clicking a tag. */
  genre: string;
  language: string;
  format: string;
  priceRange: string;
  sortBy: string;
}

export interface AuthorWithBooks extends Author {
  books: Book[];
}
