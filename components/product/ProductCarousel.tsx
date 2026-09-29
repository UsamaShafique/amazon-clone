"use client";

import { useRef } from "react";
import Link from "next/link";
import type { Product } from "@/types";
import styles from "./product.module.css";
import { ProductCard } from "./ProductCard";

interface ProductCarouselProps {
  title: string;
  products: Product[];
  seeAllHref?: string;
  seeAllLabel?: string;
}

export function ProductCarousel({
  title,
  products,
  seeAllHref,
  seeAllLabel = "See more",
}: ProductCarouselProps) {
  const trackRef = useRef<HTMLDivElement>(null);

  const scrollBy = (direction: 1 | -1) => {
    const track = trackRef.current;
    if (!track) return;
    track.scrollBy({ left: direction * track.clientWidth * 0.8, behavior: "smooth" });
  };

  if (products.length === 0) return null;

  return (
    <section className={styles.carousel} aria-label={title}>
      <div className={styles.carouselHeader}>
        <h2 className={styles.carouselTitle}>{title}</h2>
        {seeAllHref && (
          <Link href={seeAllHref} className="link">
            {seeAllLabel}
          </Link>
        )}
      </div>
      <div className={styles.carouselViewport}>
        <button
          type="button"
          className={`${styles.carouselArrow} ${styles.carouselArrowLeft}`}
          onClick={() => scrollBy(-1)}
          aria-label={`Scroll ${title} left`}
        >
          ‹
        </button>
        <div className={styles.carouselTrack} ref={trackRef} role="list">
          {products.map((p) => (
            <div key={p.id} className={styles.carouselItem} role="listitem">
              <ProductCard product={p} />
            </div>
          ))}
        </div>
        <button
          type="button"
          className={`${styles.carouselArrow} ${styles.carouselArrowRight}`}
          onClick={() => scrollBy(1)}
          aria-label={`Scroll ${title} right`}
        >
          ›
        </button>
      </div>
    </section>
  );
}
