export type BadgeType = "bestseller" | "choice" | "deal" | "new" | "limited";

export type Availability = "in_stock" | "low_stock" | "out_of_stock";

export interface Seller {
  id: string;
  name: string;
  rating: number;
  ratingCount: number;
}

export interface DeliveryInfo {
  freeShipping: boolean;
  /** Shopora Plus expedited delivery eligibility */
  express: boolean;
  estimatedDaysMin: number;
  estimatedDaysMax: number;
}

export interface Product {
  id: string;
  title: string;
  brand: string;
  description: string;
  price: number;
  originalPrice?: number;
  /** Percentage off vs. originalPrice, when discounted */
  discount?: number;
  rating: number;
  reviewCount: number;
  images: string[];
  category: string;
  subcategory: string;
  badges: BadgeType[];
  availability: Availability;
  stockCount: number;
  seller: Seller;
  deliveryInfo: DeliveryInfo;
  features: string[];
  specifications: Record<string, string>;
  /** Drives the locally generated placeholder artwork */
  emoji: string;
  /** ISO date the listing was added — used by "newest" sorting */
  listedAt: string;
}

export interface Subcategory {
  slug: string;
  name: string;
}

export interface Category {
  slug: string;
  name: string;
  description: string;
  emoji: string;
  hue: number;
  subcategories: Subcategory[];
}

export interface Review {
  id: string;
  productId: string;
  author: string;
  rating: number;
  title: string;
  body: string;
  date: string;
  verified: boolean;
  helpfulCount: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

export interface Address {
  id: string;
  fullName: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone: string;
  isDefault: boolean;
}

export type CardBrand = "Visa" | "Mastercard" | "Amex" | "Shopora Card";

export interface PaymentMethod {
  id: string;
  brand: CardBrand;
  last4: string;
  expiry: string;
  holder: string;
  isDefault: boolean;
}

export interface CartItem {
  productId: string;
  quantity: number;
  addedAt: number;
}

export type OrderStatus =
  | "processing"
  | "shipped"
  | "out_for_delivery"
  | "delivered"
  | "cancelled";

export interface OrderItem {
  productId: string;
  title: string;
  image: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: string;
  userId: string;
  date: string;
  status: OrderStatus;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  shippingAddress: Address;
  payment: { brand: string; last4: string };
  estimatedDelivery: string;
  deliveredOn?: string;
  trackingId: string;
}

export type SortKey =
  | "featured"
  | "price_asc"
  | "price_desc"
  | "rating"
  | "reviews"
  | "discount"
  | "newest";

export interface SearchFilters {
  q?: string;
  category?: string;
  subcategory?: string;
  brands?: string[];
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  deals?: boolean;
  inStock?: boolean;
  sort?: SortKey;
  page?: number;
  pageSize?: number;
}

export interface SearchResult {
  items: Product[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  /** Facets computed from the pre-pagination result set */
  brands: string[];
  priceRange: [number, number];
}
