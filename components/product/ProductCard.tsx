import Link from "next/link";
import type { Product } from "@/types";
import styles from "./product.module.css";
import { Rating } from "@/components/ui/Rating";
import { Price } from "@/components/ui/Price";
import { Badge } from "@/components/ui/Badge";
import { AddToCartButton } from "./AddToCartButton";
import { deliveryEstimate } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
  showAddToCart?: boolean;
}

export function ProductCard({ product, showAddToCart = true }: ProductCardProps) {
  const href = `/product/${product.id}`;
  return (
    <article className={styles.card}>
      <Link href={href} className={styles.cardImageLink} tabIndex={-1} aria-hidden="true">
        {/* Locally generated SVG art — plain img is intentional (see next.config) */}
        <img
          src={product.images[0]}
          alt=""
          className={styles.cardImage}
          loading="lazy"
          width={220}
          height={220}
        />
      </Link>
      <div className={styles.cardBody}>
        {product.badges.length > 0 && (
          <div className={styles.cardBadges}>
            <Badge type={product.badges[0]} />
          </div>
        )}
        <h3 className={styles.cardTitle}>
          <Link href={href} className={styles.cardTitleLink}>
            {product.title}
          </Link>
        </h3>
        <Link href={`${href}#reviews`} className={styles.cardRating}>
          <Rating value={product.rating} count={product.reviewCount} />
        </Link>
        <Price
          value={product.price}
          originalPrice={product.originalPrice}
          discount={product.discount}
          showDiscountBadge={(product.discount ?? 0) >= 15}
          size="sm"
        />
        <p className={styles.cardDelivery}>
          {product.deliveryInfo.express && (
            <strong className={styles.expressTag}>⚡ plus</strong>
          )}
          {product.deliveryInfo.freeShipping ? (
            <>
              FREE delivery{" "}
              <strong>
                {deliveryEstimate(
                  product.deliveryInfo.estimatedDaysMin,
                  product.deliveryInfo.estimatedDaysMax,
                )}
              </strong>
            </>
          ) : (
            "+ $5.99 shipping"
          )}
        </p>
        {product.availability === "low_stock" && (
          <p className={styles.cardStockWarning}>
            Only {product.stockCount} left in stock — order soon.
          </p>
        )}
        {product.availability === "out_of_stock" && (
          <p className={styles.cardUnavailable}>Currently unavailable</p>
        )}
        {showAddToCart && (
          <div className={styles.cardActions}>
            <AddToCartButton product={product} />
          </div>
        )}
      </div>
    </article>
  );
}
