import Link from "next/link";
import { Fragment } from "react";
import styles from "./ui.module.css";

export interface Crumb {
  label: string;
  href?: string;
}

export function Breadcrumb({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className={styles.breadcrumb}>
      <ol className={styles.breadcrumbList}>
        {items.map((item, i) => (
          <Fragment key={`${item.label}-${i}`}>
            {i > 0 && (
              <li aria-hidden="true" className={styles.breadcrumbSep}>
                ›
              </li>
            )}
            <li>
              {item.href ? (
                <Link href={item.href} className={styles.breadcrumbLink}>
                  {item.label}
                </Link>
              ) : (
                <span aria-current="page" className={styles.breadcrumbCurrent}>
                  {item.label}
                </span>
              )}
            </li>
          </Fragment>
        ))}
      </ol>
    </nav>
  );
}
