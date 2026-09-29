"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { SearchFilters } from "@/types";
import styles from "./search.module.css";
import { CATEGORIES } from "@/lib/data/categories";
import { getCategory } from "@/lib/data/categories";
import { filtersToQuery, hasActiveFilters } from "@/lib/searchQuery";
import { cx } from "@/lib/utils";

interface FiltersSidebarProps {
  basePath: string;
  filters: SearchFilters;
  brands: string[];
  /** Show the category tree (search page); category pages show subcategories. */
  showCategories: boolean;
}

const PRICE_BUCKETS: Array<{ label: string; min?: number; max?: number }> = [
  { label: "Under $25", max: 25 },
  { label: "$25 to $50", min: 25, max: 50 },
  { label: "$50 to $100", min: 50, max: 100 },
  { label: "$100 to $200", min: 100, max: 200 },
  { label: "$200 & above", min: 200 },
];

export function FiltersSidebar({ basePath, filters, brands, showCategories }: FiltersSidebarProps) {
  const router = useRouter();
  const omitCategory = !showCategories;
  const [minInput, setMinInput] = useState(filters.minPrice?.toString() ?? "");
  const [maxInput, setMaxInput] = useState(filters.maxPrice?.toString() ?? "");

  const href = (patch: Partial<SearchFilters>) =>
    `${basePath}${filtersToQuery({ ...filters, page: undefined, ...patch }, { omitCategory })}`;

  const toggleBrand = (brand: string) => {
    const current = filters.brands ?? [];
    const next = current.includes(brand)
      ? current.filter((b) => b !== brand)
      : [...current, brand];
    router.push(href({ brands: next.length ? next : undefined }));
  };

  const applyCustomPrice = (e: FormEvent) => {
    e.preventDefault();
    const min = minInput ? Number(minInput) : undefined;
    const max = maxInput ? Number(maxInput) : undefined;
    router.push(
      href({
        minPrice: Number.isFinite(min!) && min! >= 0 ? min : undefined,
        maxPrice: Number.isFinite(max!) && max! >= 0 ? max : undefined,
      }),
    );
  };

  const activeCategory = filters.category ? getCategory(filters.category) : undefined;

  return (
    <div className={styles.sidebar}>
      {hasActiveFilters(filters) && (
        <Link
          className={cx("link", styles.clearAll)}
          href={`${basePath}${filtersToQuery(
            {
              q: filters.q,
              category: filters.category,
              sort: filters.sort,
            },
            { omitCategory },
          )}`}
        >
          ✕ Clear all filters
        </Link>
      )}

      {showCategories && (
        <section className={styles.filterGroup}>
          <h3 className={styles.filterHeading}>Department</h3>
          <ul className={styles.filterList}>
            <li>
              <Link
                className={cx(styles.filterLink, !filters.category && styles.filterActive)}
                href={href({ category: undefined, subcategory: undefined })}
              >
                All Departments
              </Link>
            </li>
            {CATEGORIES.map((c) => (
              <li key={c.slug}>
                <Link
                  className={cx(
                    styles.filterLink,
                    filters.category === c.slug && styles.filterActive,
                  )}
                  href={href({ category: c.slug, subcategory: undefined, brands: undefined })}
                >
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {!showCategories && activeCategory && (
        <section className={styles.filterGroup}>
          <h3 className={styles.filterHeading}>Subcategory</h3>
          <ul className={styles.filterList}>
            <li>
              <Link
                className={cx(styles.filterLink, !filters.subcategory && styles.filterActive)}
                href={href({ subcategory: undefined })}
              >
                All {activeCategory.name}
              </Link>
            </li>
            {activeCategory.subcategories.map((s) => (
              <li key={s.slug}>
                <Link
                  className={cx(
                    styles.filterLink,
                    filters.subcategory === s.slug && styles.filterActive,
                  )}
                  href={href({ subcategory: s.slug })}
                >
                  {s.name}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className={styles.filterGroup}>
        <h3 className={styles.filterHeading}>Customer Reviews</h3>
        <ul className={styles.filterList}>
          {[4, 3, 2, 1].map((stars) => (
            <li key={stars}>
              <Link
                className={cx(
                  styles.filterLink,
                  filters.minRating === stars && styles.filterActive,
                )}
                href={href({ minRating: filters.minRating === stars ? undefined : stars })}
              >
                <span className={styles.starsInline} aria-hidden="true">
                  {"★".repeat(stars)}
                  {"☆".repeat(5 - stars)}
                </span>{" "}
                & Up
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className={styles.filterGroup}>
        <h3 className={styles.filterHeading}>Price</h3>
        <ul className={styles.filterList}>
          {PRICE_BUCKETS.map((bucket) => {
            const active = filters.minPrice === bucket.min && filters.maxPrice === bucket.max;
            return (
              <li key={bucket.label}>
                <Link
                  className={cx(styles.filterLink, active && styles.filterActive)}
                  href={href(
                    active
                      ? { minPrice: undefined, maxPrice: undefined }
                      : { minPrice: bucket.min, maxPrice: bucket.max },
                  )}
                >
                  {bucket.label}
                </Link>
              </li>
            );
          })}
        </ul>
        <form className={styles.priceForm} onSubmit={applyCustomPrice}>
          <label className="visually-hidden" htmlFor="price-min">
            Minimum price
          </label>
          <input
            id="price-min"
            className={styles.priceInput}
            placeholder="$ Min"
            inputMode="numeric"
            value={minInput}
            onChange={(e) => setMinInput(e.target.value.replace(/[^\d.]/g, ""))}
          />
          <label className="visually-hidden" htmlFor="price-max">
            Maximum price
          </label>
          <input
            id="price-max"
            className={styles.priceInput}
            placeholder="$ Max"
            inputMode="numeric"
            value={maxInput}
            onChange={(e) => setMaxInput(e.target.value.replace(/[^\d.]/g, ""))}
          />
          <button type="submit" className={styles.priceGo}>
            Go
          </button>
        </form>
      </section>

      {brands.length > 1 && (
        <section className={styles.filterGroup}>
          <h3 className={styles.filterHeading}>Brands</h3>
          <ul className={styles.filterList}>
            {brands.map((brand) => (
              <li key={brand}>
                <label className={styles.checkboxRow}>
                  <input
                    type="checkbox"
                    checked={filters.brands?.includes(brand) ?? false}
                    onChange={() => toggleBrand(brand)}
                  />
                  {brand}
                </label>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className={styles.filterGroup}>
        <h3 className={styles.filterHeading}>Deals & Availability</h3>
        <ul className={styles.filterList}>
          <li>
            <label className={styles.checkboxRow}>
              <input
                type="checkbox"
                checked={filters.deals ?? false}
                onChange={() => router.push(href({ deals: filters.deals ? undefined : true }))}
              />
              Today&apos;s Deals
            </label>
          </li>
          <li>
            <label className={styles.checkboxRow}>
              <input
                type="checkbox"
                checked={filters.inStock ?? false}
                onChange={() =>
                  router.push(href({ inStock: filters.inStock ? undefined : true }))
                }
              />
              In stock only
            </label>
          </li>
        </ul>
      </section>
    </div>
  );
}
