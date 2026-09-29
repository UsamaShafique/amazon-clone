import type { Product, Review } from "@/types";
import styles from "./pdp.module.css";
import { Rating } from "@/components/ui/Rating";
import { HelpfulActions } from "./HelpfulActions";
import { formatDate } from "@/lib/utils";

interface ReviewsSectionProps {
  product: Product;
  reviews: Review[];
  breakdown: number[];
}

export function ReviewsSection({ product, reviews, breakdown }: ReviewsSectionProps) {
  return (
    <section className={styles.reviews} id="reviews" aria-label="Customer reviews">
      <div className={styles.reviewsSummary}>
        <h2 className={styles.sectionTitle}>Customer reviews</h2>
        <div className={styles.reviewsAvg}>
          <Rating value={product.rating} size="md" showValue />
          <span className="muted">out of 5</span>
        </div>
        <p className="muted">
          {product.reviewCount.toLocaleString("en-US")} global ratings
        </p>
        <div className={styles.histogram}>
          {breakdown.map((pct, i) => (
            <div key={i} className={styles.histogramRow}>
              <span className={styles.histogramLabel}>{5 - i} star</span>
              <span
                className={styles.histogramBar}
                role="img"
                aria-label={`${5 - i} star: ${pct}%`}
              >
                <span className={styles.histogramFill} style={{ width: `${pct}%` }} />
              </span>
              <span className={styles.histogramPct}>{pct}%</span>
            </div>
          ))}
        </div>
        <p className={styles.reviewsHow}>
          Ratings are synthetic demo data, clustered around each product&apos;s average
          score.
        </p>
      </div>

      <div className={styles.reviewsList}>
        <h3 className={styles.reviewsListTitle}>Top reviews</h3>
        {reviews.map((review) => (
          <article key={review.id} className={styles.review}>
            <header className={styles.reviewHeader}>
              <span className={styles.reviewAvatar} aria-hidden="true">
                {review.author[0]}
              </span>
              <span className={styles.reviewAuthor}>{review.author}</span>
            </header>
            <div className={styles.reviewTitleRow}>
              <Rating value={review.rating} />
              <strong>{review.title}</strong>
            </div>
            <p className={styles.reviewMeta}>
              Reviewed on {formatDate(review.date)}
              {review.verified && (
                <span className={styles.verified}> · Verified Purchase</span>
              )}
            </p>
            <p className={styles.reviewBody}>{review.body}</p>
            <HelpfulActions initialCount={review.helpfulCount} />
          </article>
        ))}
      </div>
    </section>
  );
}
