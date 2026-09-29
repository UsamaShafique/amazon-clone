import type { Product, SearchFilters, SearchResult, SortKey } from "@/types";
import { hashString } from "@/lib/utils";
import { PRODUCTS, getProductById, getProductsByIds } from "@/lib/data/products";
import { CATEGORIES, getCategory } from "@/lib/data/categories";

export { PRODUCTS, getProductById, getProductsByIds, CATEGORIES, getCategory };

export const SEARCH_PAGE_SIZE = 16;

function matchesQuery(product: Product, q: string): boolean {
  const haystack = `${product.title} ${product.brand} ${product.category} ${product.subcategory}`
    .toLowerCase();
  return q
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .every((term) => haystack.includes(term));
}

function sortProducts(items: Product[], sort: SortKey): Product[] {
  const list = [...items];
  switch (sort) {
    case "price_asc":
      return list.sort((a, b) => a.price - b.price);
    case "price_desc":
      return list.sort((a, b) => b.price - a.price);
    case "rating":
      return list.sort((a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount);
    case "reviews":
      return list.sort((a, b) => b.reviewCount - a.reviewCount);
    case "discount":
      return list.sort((a, b) => (b.discount ?? 0) - (a.discount ?? 0));
    case "newest":
      return list.sort((a, b) => b.listedAt.localeCompare(a.listedAt));
    case "featured":
    default:
      // Featured: badges first, then popularity-weighted rating.
      return list.sort(
        (a, b) =>
          b.badges.length - a.badges.length ||
          b.rating * Math.log10(b.reviewCount + 1) - a.rating * Math.log10(a.reviewCount + 1),
      );
  }
}

export function searchProducts(filters: SearchFilters): SearchResult {
  const pageSize = filters.pageSize ?? SEARCH_PAGE_SIZE;
  let items = PRODUCTS;

  if (filters.q) items = items.filter((p) => matchesQuery(p, filters.q!));
  if (filters.category) items = items.filter((p) => p.category === filters.category);
  if (filters.subcategory) items = items.filter((p) => p.subcategory === filters.subcategory);

  // Facets reflect everything except the brand/price/rating narrowing itself,
  // so the sidebar keeps showing sibling options.
  const facetBase = items;
  const brands = [...new Set(facetBase.map((p) => p.brand))].sort();
  const prices = facetBase.map((p) => p.price);
  const priceRange: [number, number] =
    prices.length > 0 ? [Math.min(...prices), Math.max(...prices)] : [0, 0];

  if (filters.brands?.length) items = items.filter((p) => filters.brands!.includes(p.brand));
  if (filters.minPrice !== undefined) items = items.filter((p) => p.price >= filters.minPrice!);
  if (filters.maxPrice !== undefined) items = items.filter((p) => p.price <= filters.maxPrice!);
  if (filters.minRating !== undefined)
    items = items.filter((p) => p.rating >= filters.minRating!);
  if (filters.deals) items = items.filter((p) => (p.discount ?? 0) > 0);
  if (filters.inStock) items = items.filter((p) => p.availability !== "out_of_stock");

  items = sortProducts(items, filters.sort ?? "featured");

  const total = items.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const page = Math.min(Math.max(1, filters.page ?? 1), totalPages);
  const start = (page - 1) * pageSize;

  return {
    items: items.slice(start, start + pageSize),
    total,
    page,
    pageSize,
    totalPages,
    brands,
    priceRange,
  };
}

export function getDeals(limit = 12): Product[] {
  return sortProducts(
    PRODUCTS.filter((p) => (p.discount ?? 0) >= 15),
    "discount",
  ).slice(0, limit);
}

export function getBestsellers(category?: string, limit = 12): Product[] {
  const pool = category ? PRODUCTS.filter((p) => p.category === category) : PRODUCTS;
  return sortProducts(pool, "reviews").slice(0, limit);
}

export function getTopRated(category?: string, limit = 12): Product[] {
  const pool = category ? PRODUCTS.filter((p) => p.category === category) : PRODUCTS;
  return sortProducts(pool, "rating").slice(0, limit);
}

export function getNewArrivals(limit = 12): Product[] {
  return sortProducts(PRODUCTS, "newest").slice(0, limit);
}

export function getRelatedProducts(product: Product, limit = 8): Product[] {
  const siblings = PRODUCTS.filter((p) => p.id !== product.id && p.category === product.category);
  // Same subcategory first, then the rest of the category.
  return [
    ...siblings.filter((p) => p.subcategory === product.subcategory),
    ...siblings.filter((p) => p.subcategory !== product.subcategory),
  ].slice(0, limit);
}

/** Two deterministic companions for the "Frequently bought together" module. */
export function getFrequentlyBoughtTogether(product: Product): Product[] {
  const pool = PRODUCTS.filter(
    (p) => p.id !== product.id && p.category === product.category && p.availability !== "out_of_stock",
  );
  if (pool.length === 0) return [];
  const h = hashString(product.id);
  const first = pool[h % pool.length];
  const rest = pool.filter((p) => p.id !== first.id);
  const second = rest.length > 0 ? rest[(h >> 4) % rest.length] : undefined;
  return second ? [first, second] : [first];
}

export function getProductsByCategory(category: string): Product[] {
  return PRODUCTS.filter((p) => p.category === category);
}
