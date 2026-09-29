"use client";

import { useRouter } from "next/navigation";
import type { SearchFilters, SortKey } from "@/types";
import styles from "./search.module.css";
import { SORT_OPTIONS, filtersToQuery } from "@/lib/searchQuery";

interface SortSelectProps {
  basePath: string;
  filters: SearchFilters;
  omitCategory?: boolean;
}

export function SortSelect({ basePath, filters, omitCategory = false }: SortSelectProps) {
  const router = useRouter();
  return (
    <label className={styles.sortWrap}>
      <span className={styles.sortLabel}>Sort by:</span>
      <select
        className={styles.sortSelect}
        value={filters.sort ?? "featured"}
        onChange={(e) =>
          router.push(
            `${basePath}${filtersToQuery(
              { ...filters, sort: e.target.value as SortKey, page: undefined },
              { omitCategory },
            )}`,
          )
        }
      >
        {SORT_OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}
