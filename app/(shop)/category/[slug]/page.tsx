import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import styles from "@/components/search/search.module.css";
import { FilterPanel } from "@/components/search/FilterPanel";
import { SortSelect } from "@/components/search/SortSelect";
import { ProductGrid } from "@/components/product/ProductGrid";
import { ProductCarousel } from "@/components/product/ProductCarousel";
import { Pagination } from "@/components/ui/Pagination";
import { EmptyState } from "@/components/ui/EmptyState";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { searchProducts } from "@/lib/api/products";
import { CATEGORIES, getCategory } from "@/lib/data/categories";
import {
  filtersToQuery,
  hasActiveFilters,
  parseFilters,
  type RawSearchParams,
} from "@/lib/searchQuery";
import { cx } from "@/lib/utils";

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<RawSearchParams>;
}

export function generateStaticParams() {
  return CATEGORIES.map((c) => ({ slug: c.slug }));
}

// All categories are known at build time — unknown slugs 404 at the
// routing layer (a real 404 status, not a streamed 200).
export const dynamicParams = false;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = getCategory(slug);
  // 404 here (before streaming starts) so the response carries a real 404 status.
  if (!category) notFound();
  return {
    title: `${category.name} — Shop online`,
    description: category.description,
    alternates: { canonical: `/category/${category.slug}` },
    openGraph: {
      title: `${category.name} | Shopora`,
      description: category.description,
    },
  };
}

export default async function CategoryPage({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const category = getCategory(slug);
  if (!category) notFound();

  const filters = parseFilters(await searchParams, { category: slug });
  const result = searchProducts(filters);
  const from = (result.page - 1) * result.pageSize + 1;
  const to = Math.min(result.page * result.pageSize, result.total);
  const basePath = `/category/${slug}`;
  const showDealsStrip = result.page === 1 && !hasActiveFilters(filters);
  const deals = showDealsStrip
    ? searchProducts({ category: slug, deals: true, sort: "discount", pageSize: 10 }).items
    : [];

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "/" },
      { "@type": "ListItem", position: 2, name: category.name },
    ],
  };

  return (
    <main className="container" style={{ paddingBottom: 24 }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: category.name }]} />

      <section
        className={styles.categoryBanner}
        style={{
          background: `linear-gradient(100deg, hsl(${category.hue}, 65%, 85%), hsl(${(category.hue + 40) % 360}, 60%, 78%))`,
        }}
      >
        <span className={styles.categoryEmoji} aria-hidden="true">
          {category.emoji}
        </span>
        <div>
          <h1 className={styles.categoryName}>{category.name}</h1>
          <p className={styles.categoryDesc}>{category.description}</p>
        </div>
      </section>

      <div className={styles.subcatChips}>
        {category.subcategories.map((sub) => (
          <Link
            key={sub.slug}
            href={`${basePath}${filtersToQuery(
              {
                ...filters,
                page: undefined,
                subcategory: filters.subcategory === sub.slug ? undefined : sub.slug,
              },
              { omitCategory: true },
            )}`}
            className={cx(
              styles.subcatChip,
              filters.subcategory === sub.slug && styles.subcatChipActive,
            )}
          >
            {sub.name}
          </Link>
        ))}
      </div>

      <div className={styles.layout}>
        <FilterPanel
          basePath={basePath}
          filters={filters}
          brands={result.brands}
          showCategories={false}
        />
        <div>
          <div className={styles.resultsBar}>
            <p className={styles.resultsCount}>
              {from}–{to} of {result.total} results in <strong>{category.name}</strong>
            </p>
            <SortSelect basePath={basePath} filters={filters} omitCategory />
          </div>

          {result.total === 0 ? (
            <EmptyState
              emoji="🗂️"
              title="No products match these filters"
              body="Try removing a filter or two to see more of this department."
              action={
                <Link href={basePath} className="link">
                  Clear filters
                </Link>
              }
            />
          ) : (
            <>
              <ProductGrid products={result.items} />
              <Pagination
                page={result.page}
                totalPages={result.totalPages}
                makeHref={(page) =>
                  `${basePath}${filtersToQuery({ ...filters, page }, { omitCategory: true })}`
                }
              />
            </>
          )}

          {deals.length > 0 && (
            <div style={{ marginTop: 18 }}>
              <ProductCarousel
                title={`Top deals in ${category.name}`}
                products={deals}
                seeAllHref={`${basePath}?deals=1&sort=discount`}
              />
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
