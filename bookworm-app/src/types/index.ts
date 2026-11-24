export interface Book {
  id: string;
  title: string;
  author: string;
  authorId: string;
  description: string;
  coverImage: string;
  format: 'Paperback' | 'Hardcover' | 'eBook';
  genres: { label: string; slug: string }[];
  price: number;
  deliveryDate: string;
  language: string;
  rating: number;
  soldCount: number;
  publisher?: string;
  backCoverText?: string;
  isbn?: string;
}

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
