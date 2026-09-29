import Link from "next/link";
import styles from "./home.module.css";

export interface TileLink {
  label: string;
  href: string;
  image: string;
}

interface CategoryTileCardProps {
  title: string;
  links: TileLink[];
  footerHref: string;
  footerLabel?: string;
}

/** Amazon-style homepage card: title, 2×2 image links, see-more footer. */
export function CategoryTileCard({
  title,
  links,
  footerHref,
  footerLabel = "See more",
}: CategoryTileCardProps) {
  return (
    <section className={styles.tileCard} aria-label={title}>
      <div className={styles.tileHeader}>
        <h2 className={styles.tileTitle}>{title}</h2>
        <Link href={footerHref} className={styles.tileHeaderArrow} aria-label={`${footerLabel}: ${title}`}>
          ›
        </Link>
      </div>
      <div className={styles.tileGrid}>
        {links.slice(0, 4).map((l) => (
          <Link key={`${l.label}-${l.href}`} href={l.href} className={styles.tileLink}>
            <img src={l.image} alt="" loading="lazy" width={160} height={120} className={styles.tileImage} />
            <span className={styles.tileCaption}>{l.label}</span>
          </Link>
        ))}
      </div>
      <Link href={footerHref} className={`link ${styles.tileFooter}`}>
        {footerLabel}
      </Link>
    </section>
  );
}
