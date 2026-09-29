import type { SearchFilters, SortKey } from "@/types";

export const SORT_OPTIONS: Array<{ value: SortKey; label: string }> = [
  { value: "featured", label: "Featured" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "rating", label: "Avg. Customer Review" },
  { value: "reviews", label: "Most Reviewed" },
  { value: "newest", label: "Newest Arrivals" },
  { value: "discount", label: "Biggest Discount" },
];

const SORT_KEYS = SORT_OPTIONS.map((o) => o.value);

export type RawSearchParams = Record<string, string | string[] | undefined>;

/** Parse URL search params into typed filters. */
export function parseFilters(sp: RawSearchParams, base: Partial<SearchFilters> = {}): SearchFilters {
  const get = (key: string): string | undefined => {
    const v = sp[key];
    return Array.isArray(v) ? v[0] : v;
  };
  const num = (key: string): number | undefined => {
    const v = get(key);
    if (!v) return undefined;
    const n = Number(v);
    return Number.isFinite(n) && n >= 0 ? n : undefined;
  };
  const sortRaw = get("sort");
  return {
    q: get("q")?.trim() || undefined,
    category: base.category ?? (get("category") || undefined),
    subcategory: get("sub") || undefined,
    brands: get("brands")?.split(",").filter(Boolean),
    minPrice: num("min"),
    maxPrice: num("max"),
    minRating: num("rating"),
    deals: get("deals") === "1" ? true : undefined,
    inStock: get("instock") === "1" ? true : undefined,
    sort: sortRaw && (SORT_KEYS as string[]).includes(sortRaw) ? (sortRaw as SortKey) : undefined,
    page: num("page"),
  };
}

/** Serialise filters back to a query string (page omitted when 1). */
export function filtersToQuery(
  filters: SearchFilters,
  options: { omitCategory?: boolean } = {},
): string {
  const params = new URLSearchParams();
  if (filters.q) params.set("q", filters.q);
  if (filters.category && !options.omitCategory) params.set("category", filters.category);
  if (filters.subcategory) params.set("sub", filters.subcategory);
  if (filters.brands?.length) params.set("brands", filters.brands.join(","));
  if (filters.minPrice !== undefined) params.set("min", String(filters.minPrice));
  if (filters.maxPrice !== undefined) params.set("max", String(filters.maxPrice));
  if (filters.minRating !== undefined) params.set("rating", String(filters.minRating));
  if (filters.deals) params.set("deals", "1");
  if (filters.inStock) params.set("instock", "1");
  if (filters.sort && filters.sort !== "featured") params.set("sort", filters.sort);
  if (filters.page && filters.page > 1) params.set("page", String(filters.page));
  const qs = params.toString();
  return qs ? `?${qs}` : "";
}

export function hasActiveFilters(filters: SearchFilters): boolean {
  return Boolean(
    filters.brands?.length ||
      filters.minPrice !== undefined ||
      filters.maxPrice !== undefined ||
      filters.minRating !== undefined ||
      filters.deals ||
      filters.inStock ||
      filters.subcategory,
  );
}
