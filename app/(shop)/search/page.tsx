import type { Metadata } from "next";
import styles from "@/components/search/search.module.css";
import { FilterPanel } from "@/components/search/FilterPanel";
import { SortSelect } from "@/components/search/SortSelect";
import { ProductGrid } from "@/components/product/ProductGrid";
import { Pagination } from "@/components/ui/Pagination";
import { EmptyState } from "@/components/ui/EmptyState";
import { searchProducts } from "@/lib/api/products";
import { filtersToQuery, parseFilters, type RawSearchParams } from "@/lib/searchQuery";
import Link from "next/link";

interface PageProps {
  searchParams: Promise<RawSearchParams>;
}

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const filters = parseFilters(await searchParams);
  const title = filters.q
    ? `${filters.q} — Search results`
    : filters.deals
      ? "Today's Deals"
      : "Search";
  return {
    title,
    description: filters.q
      ? `Shopora search results for "${filters.q}" — compare prices, ratings and delivery options.`
      : "Search the Shopora demo catalog across all departments.",
    robots: { index: false },
  };
}

export default async function SearchPage({ searchParams }: PageProps) {
  const filters = parseFilters(await searchParams);
  const result = searchProducts(filters);
  const from = (result.page - 1) * result.pageSize + 1;
  const to = Math.min(result.page * result.pageSize, result.total);

  const heading = filters.q
    ? `results for "${filters.q}"`
    : filters.deals
      ? "deals available today"
      : "results";

  return (
    <main className="container" style={{ paddingBottom: 24 }}>
      <h1 className="visually-hidden">Search results</h1>
      <div className={styles.layout}>
        <FilterPanel
          basePath="/search"
          filters={filters}
          brands={result.brands}
          showCategories
        />
        <div>
          <div className={styles.resultsBar}>
            <p className={styles.resultsCount}>
              {result.total === 0 ? (
                <>
                  No {heading}
                </>
              ) : (
                <>
                  {from}–{to} of {result.total} <strong>{heading}</strong>
                </>
              )}
            </p>
            <SortSelect basePath="/search" filters={filters} />
          </div>

          {result.total === 0 ? (
            <EmptyState
              emoji="🔎"
              title="No results found"
              body="Try checking your spelling, using fewer words, or removing filters."
              action={
                <Link href="/search" className="link">
                  Clear search and filters
                </Link>
              }
            />
          ) : (
            <>
              <ProductGrid products={result.items} />
              <Pagination
                page={result.page}
                totalPages={result.totalPages}
                makeHref={(page) => `/search${filtersToQuery({ ...filters, page })}`}
              />
            </>
          )}
        </div>
      </div>
    </main>
  );
}
