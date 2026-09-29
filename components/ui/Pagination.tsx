import Link from "next/link";
import styles from "./ui.module.css";
import { cx } from "@/lib/utils";

interface PaginationProps {
  page: number;
  totalPages: number;
  makeHref: (page: number) => string;
}

function pageWindow(page: number, totalPages: number): number[] {
  const pages = new Set<number>([1, totalPages, page - 1, page, page + 1]);
  return [...pages].filter((p) => p >= 1 && p <= totalPages).sort((a, b) => a - b);
}

export function Pagination({ page, totalPages, makeHref }: PaginationProps) {
  if (totalPages <= 1) return null;
  const pages = pageWindow(page, totalPages);
  return (
    <nav aria-label="Pagination" className={styles.pagination}>
      {page > 1 ? (
        <Link className={cx(styles.pageBtn, styles.pageArrow)} href={makeHref(page - 1)}>
          ‹ Previous
        </Link>
      ) : (
        <span className={cx(styles.pageBtn, styles.pageArrow, styles.pageDisabled)}>
          ‹ Previous
        </span>
      )}
      {pages.map((p, i) => (
        <span key={p} className={styles.pageGroup}>
          {i > 0 && pages[i - 1] < p - 1 && <span className={styles.pageEllipsis}>…</span>}
          {p === page ? (
            <span className={cx(styles.pageBtn, styles.pageCurrent)} aria-current="page">
              {p}
            </span>
          ) : (
            <Link className={styles.pageBtn} href={makeHref(p)}>
              {p}
            </Link>
          )}
        </span>
      ))}
      {page < totalPages ? (
        <Link className={cx(styles.pageBtn, styles.pageArrow)} href={makeHref(page + 1)}>
          Next ›
        </Link>
      ) : (
        <span className={cx(styles.pageBtn, styles.pageArrow, styles.pageDisabled)}>Next ›</span>
      )}
    </nav>
  );
}
