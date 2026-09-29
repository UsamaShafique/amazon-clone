"use client";

import { useState } from "react";
import type { SearchFilters } from "@/types";
import styles from "./search.module.css";
import { FiltersSidebar } from "./FiltersSidebar";
import { cx } from "@/lib/utils";

interface FilterPanelProps {
  basePath: string;
  filters: SearchFilters;
  brands: string[];
  showCategories: boolean;
}

/** Desktop: always-visible rail. Mobile: toggleable filter sheet. */
export function FilterPanel(props: FilterPanelProps) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        type="button"
        className={styles.mobileFilterToggle}
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        <span aria-hidden="true">⚙</span> Filters {open ? "▲" : "▼"}
      </button>
      <aside
        className={cx(styles.sidebarWrap, open && styles.sidebarOpen)}
        aria-label="Filters"
      >
        <FiltersSidebar {...props} />
      </aside>
    </>
  );
}
