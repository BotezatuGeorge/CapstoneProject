import type { AddressFormData, Author, Book, CartItem, Coupon, Quote, Review, User } from '../types';

export function makeBook(overrides: Partial<Book> = {}): Book {
  return {
    id: 'joy-of-minimalism',
    title: 'Joy of Minimalism',
    author: 'Daniel Reed',
    authorId: 'daniel-reed',
    description: 'Declutter your life to uncover peace, clarity, and joy.',
    coverImage: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg"/>',
    format: 'Paperback',
    genres: [
      { label: 'Non-fiction', slug: 'non-fiction' },
      { label: 'Self Help', slug: 'self-help' },
    ],
    categories: ['Self Help'],
    price: 12.99,
    deliveryDate: 'Mon, 21 Jul',
    stock: 50,
    language: 'English',
    rating: 4,
    soldCount: 145,
    ...overrides,
  };
}

export function makeCartItem(overrides: Partial<CartItem> = {}): CartItem {
  return { book: makeBook(), quantity: 2, ...overrides };
}

export function makeReview(overrides: Partial<Review> = {}): Review {
  return {
    id: 'r1',
    bookId: 'joy-of-minimalism',
    author: 'Maya Lin',
    text: 'A calm, practical read.',
    rating: 4,
    date: '2024-06-01',
    ...overrides,
  };
}

export function makeUser(overrides: Partial<User> = {}): User {
  return {
    id: 'aarav',
    name: 'Aarav Mehta',
    email: 'aarav@example.com',
    role: 'CUSTOMER',
    walletBalance: 100,
    giftPoints: 320,
    savedAddress: null,
    ...overrides,
  };
}

export function makeQuote(overrides: Partial<Quote> = {}): Quote {
  return {
    itemCount: 2,
    subtotal: 25.98,
    tax: 3.12,
    shipping: 0,
    discount: 0,
    pointsRedeemed: 0,
    pointsDiscount: 0,
    total: 29.1,
    couponApplied: false,
    ...overrides,
  };
}

export function makeAuthor(overrides: Partial<Author> = {}): Author {
  return {
    id: 'daniel-reed',
    name: 'Daniel Reed',
    bio: 'First paragraph about Daniel.\n\nSecond paragraph about his books.',
    avatar: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg"/>',
    ...overrides,
  };
}

export function makeAddressForm(overrides: Partial<AddressFormData> = {}): AddressFormData {
  return {
    firstName: '',
    lastName: '',
    addressLine: '',
    email: '',
    city: '',
    pin: '',
    phoneCountry: '+91',
    phone: '',
    state: '',
    country: 'India',
    useSaved: false,
    ...overrides,
  };
}

export function makeCoupon(overrides: Partial<Coupon> = {}): Coupon {
  return {
    code: 'READ5',
    description: '$5 off orders of $20 or more',
    type: 'FLAT',
    value: 5,
    minOrder: 20,
    ...overrides,
  };
}
