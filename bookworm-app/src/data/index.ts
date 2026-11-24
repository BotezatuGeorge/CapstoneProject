import type { Author, BookRecord, Coupon, Review, User } from '../types';
import { makeAvatar, makeCover } from './covers';

/* ------------------------------------------------------------------ */
/* Store policy (Store subsystem)                                      */
/* ------------------------------------------------------------------ */

export const storePolicy = {
  currency: 'USD',
  taxRate: 0.12,
  cancellationWindowHours: 48,
  returnWindowDays: 14,
  expressShippingFee: 5,
  /** Gift points earned per $10 spent. */
  pointsPerTenDollars: 1,
} as const;

/* ------------------------------------------------------------------ */
/* Authors                                                             */
/* ------------------------------------------------------------------ */

export const authors: Author[] = [
  {
    id: 'arjun-patel',
    name: 'Arjun Patel',
    avatar: makeAvatar('Arjun Patel', '#0f62fe'),
    bio: 'Arjun Patel is a productivity expert and bestselling author known for his practical frameworks on focus and efficiency.',
  },
  {
    id: 'daniel-reed',
    name: 'Daniel Reed',
    avatar: makeAvatar('Daniel Reed', '#0e6b73'),
    bio: 'Daniel Reed is a writer, minimalist, and productivity coach based in San Francisco. With a passion for intentional living, Daniel has dedicated his career to helping individuals simplify their lives — one habit, one space, and one thought at a time.\n\nHe is the author of The Joy of Minimalism, an acclaimed guide to decluttering both physically and mentally. His other works include Less, But Better and The Focus Reset, which have helped thousands rethink consumerism, prioritize what truly matters, and build sustainable systems for personal growth.',
  },
  {
    id: 'raj-patel',
    name: 'Raj Patel',
    avatar: makeAvatar('Raj Patel', '#a2191f'),
    bio: 'Raj Patel is a learning scientist who has spent two decades researching how humans absorb and retain information.',
  },
  {
    id: 'james-wright',
    name: 'James Wright',
    avatar: makeAvatar('James Wright', '#0e6027'),
    bio: 'James Wright is a motivational author and entrepreneur who writes about achieving goals with clarity and confidence.',
  },
  {
    id: 'james-adams',
    name: 'James Adams',
    avatar: makeAvatar('James Adams', '#491d8b'),
    bio: 'James Adams is a novelist known for his gripping thriller narratives set in atmospheric, noir-inspired cities.',
  },
  {
    id: 'jessica-martin',
    name: 'Jessica Martin',
    avatar: makeAvatar('Jessica Martin', '#9f1853'),
    bio: 'Jessica Martin writes heartwarming romance novels about connection, identity, and the unexpected paths love takes.',
  },
  {
    id: 'laura-mitchell',
    name: 'Laura Mitchell',
    avatar: makeAvatar('Laura Mitchell', '#00539a'),
    bio: 'Laura Mitchell is a science fiction author fascinated by the cosmos, artificial intelligence, and human potential.',
  },
  {
    id: 'clara-nelson',
    name: 'Clara Nelson',
    avatar: makeAvatar('Clara Nelson', '#005d5d'),
    bio: 'Clara Nelson crafts atmospheric mystery novels with intricate plots and richly drawn small-town settings.',
  },
  {
    id: 'emilly-parker',
    name: 'Emilly Parker',
    avatar: makeAvatar('Emilly Parker', '#8a3800'),
    bio: "Emilly Parker is a beloved children's author whose stories celebrate curiosity, friendship, and the natural world.",
  },
];

/* ------------------------------------------------------------------ */
/* Catalog                                                             */
/* ------------------------------------------------------------------ */

export const categories: string[] = [
  'All',
  'Romance',
  'Mystery',
  'Science Fiction',
  'Fantasy',
  'Historical',
  'Biography',
  'Self-help',
  'Memoir',
  'Travel',
  'Cooking',
  "Children's",
  'Young Adult',
  'Comics & Graphic Novels',
  'Poetry',
  'Drama',
  'Science',
  'Philosophy',
  'Religion',
  'Language Learning',
];

export const bookRecords: BookRecord[] = [
  {
    id: 'joy-of-minimalism',
    title: 'Joy of Minimalism',
    author: 'Daniel Reed',
    authorId: 'daniel-reed',
    description: 'Declutter your life to uncover peace, clarity, and joy.',
    coverImage: makeCover({ title: 'The Joy of Minimalism', author: 'Daniel Reed', bg: '#fdd116', fg: '#161616', accent: '#161616' }),
    format: 'Paperback',
    genres: [
      { label: 'Non-fiction', slug: 'non-fiction' },
      { label: 'Self Help', slug: 'self-help' },
    ],
    categories: ['Self-help'],
    price: 12.99,
    language: 'English',
    rating: 4,
    soldCount: 145,
    publisher: 'ABC Publishers',
    backCoverText:
      '"A refreshing path to clarity in a cluttered world."\n\nDiscover how less can truly be more.\n\nIn The Joy of Minimalism, Daniel Reed guides you through practical strategies to declutter your mind, space, and schedule. Whether you\'re overwhelmed, over-committed, or just over it—this book offers a calm, mindful approach to building a simpler, more fulfilling life.',
    isbn: 'ISBN 978-0-123456-78-9',
  },
  {
    id: 'art-of-focus',
    title: 'The Art of Focus',
    author: 'Arjun Patel',
    authorId: 'arjun-patel',
    description: 'Practical guide to mastering focus & boosting productivity every day.',
    coverImage: makeCover({ title: 'The Art of Focus', author: 'Arjun Patel', bg: '#f2ede4', fg: '#161616', accent: '#da1e28' }),
    format: 'Paperback',
    genres: [
      { label: 'Non-fiction', slug: 'non-fiction' },
      { label: 'Self Help', slug: 'self-help' },
    ],
    categories: ['Self-help'],
    price: 24.99,
    language: 'English',
    rating: 5,
    soldCount: 320,
    publisher: 'Focus Press',
  },
  {
    id: 'art-of-learning',
    title: 'The Art of Learning',
    author: 'Raj Patel',
    authorId: 'raj-patel',
    description: 'Master the mindset and methods for effective lifelong learning.',
    coverImage: makeCover({ title: 'The Art of Learning', author: 'Raj Patel', bg: '#d12a1d', fg: '#ffffff', accent: '#f1c21b' }),
    format: 'Paperback',
    genres: [
      { label: 'Non-fiction', slug: 'non-fiction' },
      { label: 'Self Help', slug: 'self-help' },
    ],
    categories: ['Self-help'],
    price: 16.99,
    language: 'English',
    rating: 4,
    soldCount: 210,
  },
  {
    id: 'path-to-success',
    title: 'The Path to Success',
    author: 'James Wright',
    authorId: 'james-wright',
    description: 'A practical guide to achieving goals with clarity and confidence.',
    coverImage: makeCover({ title: 'The Path to Success', author: 'James Wright', bg: '#0e6b73', fg: '#f1c21b', accent: '#f1c21b' }),
    format: 'Paperback',
    genres: [
      { label: 'Non-fiction', slug: 'non-fiction' },
      { label: 'Self Help', slug: 'self-help' },
    ],
    categories: ['Self-help'],
    price: 19.99,
    language: 'English',
    rating: 4,
    soldCount: 180,
  },
  {
    id: 'midnight-hour',
    title: 'The Midnight Hour',
    author: 'James Adams',
    authorId: 'james-adams',
    description: "Haunting tale of a man's journey & the shadows of a forgotten past.",
    coverImage: makeCover({ title: 'The Midnight Hour', author: 'James Adams', bg: '#10302f', fg: '#d9c58a', accent: '#d9a441' }),
    format: 'Paperback',
    genres: [
      { label: 'Fiction', slug: 'fiction' },
      { label: 'Thriller', slug: 'thriller' },
      { label: 'Horror', slug: 'horror' },
    ],
    categories: ['Mystery'],
    price: 17.99,
    language: 'English',
    rating: 4,
    soldCount: 450,
  },
  {
    id: 'beneath-the-stars',
    title: 'Beneath the Stars',
    author: 'Jessica Martin',
    authorId: 'jessica-martin',
    description: 'A heartwarming tale, where two souls discover who you need.',
    coverImage: makeCover({ title: 'Beneath the Stars', author: 'Jessica Martin', bg: '#7a2f4a', fg: '#f4d9b8', accent: '#ef8a4c' }),
    format: 'Hardcover',
    genres: [
      { label: 'Fiction', slug: 'fiction' },
      { label: 'Love', slug: 'love' },
      { label: 'Drama', slug: 'drama' },
    ],
    categories: ['Romance', 'Drama'],
    price: 27.99,
    language: 'English',
    rating: 5,
    soldCount: 320,
  },
  {
    id: 'final-frontier',
    title: 'The Final Frontier',
    author: 'Laura Mitchell',
    authorId: 'laura-mitchell',
    description: 'A mission to space secrets to change humanity forever.',
    coverImage: makeCover({ title: 'The Final Frontier', author: 'Laura Mitchell', bg: '#0b3b5b', fg: '#f4f4f4', accent: '#e56b3a' }),
    format: 'Paperback',
    genres: [
      { label: 'Fiction', slug: 'fiction' },
      { label: 'Thriller', slug: 'thriller' },
    ],
    categories: ['Science Fiction'],
    price: 19.99,
    language: 'English',
    rating: 4,
    soldCount: 265,
  },
  {
    id: 'vanishing-house',
    title: 'The Vanishing House',
    author: 'Clara Nelson',
    authorId: 'clara-nelson',
    description: 'A chilling mystery unfolds within a house that disappears.',
    coverImage: makeCover({ title: 'The Vanishing House', author: 'Clara Nelson', bg: '#17343a', fg: '#cfd8cf', accent: '#e9cf86' }),
    format: 'eBook',
    genres: [
      { label: 'Fiction', slug: 'fiction' },
      { label: 'Horror', slug: 'horror' },
    ],
    categories: ['Mystery'],
    price: 8.99,
    language: 'English',
    rating: 3,
    soldCount: 190,
  },
  {
    id: 'lost-kitten',
    title: 'The Lost Kitten',
    author: 'Emilly Parker',
    authorId: 'emilly-parker',
    description: 'A heartwarming tale of courage, friendship, and feline adventure.',
    coverImage: makeCover({ title: 'The Lost Kitten', author: 'Emilly Parker', bg: '#f58220', fg: '#fff4c2', accent: '#fff4c2' }),
    format: 'Hardcover',
    genres: [
      { label: 'Fiction', slug: 'fiction' },
      { label: 'Children', slug: 'children' },
    ],
    categories: ["Children's"],
    price: 18.99,
    language: 'English',
    rating: 5,
    soldCount: 500,
  },
];

/** Warehouse data: opening stock and extra handling days added to the shipping ETA. */
export const inventory: Record<string, { stock: number; deliveryLeadDays: number }> = {
  'joy-of-minimalism': { stock: 40, deliveryLeadDays: 0 },
  'art-of-focus': { stock: 25, deliveryLeadDays: 0 },
  'art-of-learning': { stock: 30, deliveryLeadDays: 0 },
  'path-to-success': { stock: 18, deliveryLeadDays: 0 },
  'midnight-hour': { stock: 60, deliveryLeadDays: 0 },
  'beneath-the-stars': { stock: 12, deliveryLeadDays: 1 },
  'final-frontier': { stock: 35, deliveryLeadDays: 0 },
  'vanishing-house': { stock: 200, deliveryLeadDays: 0 },
  'lost-kitten': { stock: 3, deliveryLeadDays: 1 },
};

/** Curated home feeds, matching the catalog mockup. */
export const homeSections = {
  recommended: ['art-of-focus', 'art-of-learning', 'path-to-success'],
  bestsellers: ['midnight-hour', 'beneath-the-stars', 'final-frontier'],
  newLaunches: ['joy-of-minimalism', 'vanishing-house', 'lost-kitten'],
} as const;

export const seedReviews: Review[] = [
  {
    id: 'seed-1',
    bookId: 'joy-of-minimalism',
    author: 'John Smith',
    text: 'The accordion component delivers large amounts of content in a small space through progressive disclosure. The user gets key details about the underlying content and can choose to expand that content within the constraints of the accordion.',
    rating: 5,
    date: '2024-06-01',
  },
  {
    id: 'seed-2',
    bookId: 'joy-of-minimalism',
    author: 'Sarah Connor',
    text: 'A genuinely transformative read. I picked this up expecting another self-help cliché and was pleasantly surprised by the depth and practicality of the advice given throughout.',
    rating: 4,
    date: '2024-05-20',
  },
];

/* ------------------------------------------------------------------ */
/* Promotions & members                                                */
/* ------------------------------------------------------------------ */

export const coupons: Coupon[] = [
  { code: 'BOOKWORM10', description: '$10 off orders of $30 or more', type: 'FLAT', value: 10, minOrder: 30 },
  { code: 'WELCOME10', description: '10% off your order', type: 'PERCENT', value: 10, minOrder: 0 },
  { code: 'READ5', description: '$5 off orders of $20 or more', type: 'FLAT', value: 5, minOrder: 20 },
];

export const personas: User[] = [
  {
    id: 'guest',
    name: 'Guest',
    email: '',
    role: 'GUEST',
    walletBalance: 0,
    giftPoints: 0,
    savedAddress: null,
  },
  {
    id: 'aarav',
    name: 'Aarav Mehta',
    email: 'aarav.mehta@example.com',
    role: 'CUSTOMER',
    walletBalance: 100,
    giftPoints: 320,
    savedAddress: {
      firstName: 'Aarav',
      lastName: 'Mehta',
      addressLine: '12 MG Road',
      email: 'aarav.mehta@example.com',
      city: 'Bengaluru',
      pin: '560001',
      phoneCountry: '+91',
      phone: '9876543210',
      state: 'Karnataka',
      country: 'India',
    },
  },
  {
    id: 'priya',
    name: 'Priya Sharma',
    email: 'priya.sharma@example.com',
    role: 'CUSTOMER',
    walletBalance: 5,
    giftPoints: 40,
    savedAddress: {
      firstName: 'Priya',
      lastName: 'Sharma',
      addressLine: '45 Marine Drive',
      email: 'priya.sharma@example.com',
      city: 'Mumbai',
      pin: '400020',
      phoneCountry: '+91',
      phone: '9123456780',
      state: 'Maharashtra',
      country: 'India',
    },
  },
];
