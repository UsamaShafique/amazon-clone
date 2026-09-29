"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import styles from "./wishlist.module.css";
import { useWishlist } from "@/components/providers/WishlistProvider";
import { useToast } from "@/components/providers/ToastProvider";
import { getProductsByIds } from "@/lib/data/products";
import { getBestsellers } from "@/lib/api/products";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import { Price } from "@/components/ui/Price";
import { Rating } from "@/components/ui/Rating";
import { AddToCartButton } from "@/components/product/AddToCartButton";
import { ProductCarousel } from "@/components/product/ProductCarousel";

export function WishlistPageClient() {
  const { ids, remove, hydrated } = useWishlist();
  const { showToast } = useToast();
  const router = useRouter();

  if (!hydrated) {
    return (
      <div aria-busy="true">
        <Skeleton height={34} width="30%" />
        <div style={{ height: 14 }} />
        <Skeleton height={220} />
      </div>
    );
  }

  const products = getProductsByIds(ids);

  if (products.length === 0) {
    return (
      <>
        <EmptyState
          emoji="♡"
          title="Your wishlist is empty"
          body="Tap “Add to wishlist” on any product to keep track of things you love."
          action={<Button onClick={() => router.push("/")}>Continue shopping</Button>}
        />
        <div style={{ marginTop: 18 }}>
          <ProductCarousel title="Ideas to get you started" products={getBestsellers(undefined, 10)} />
        </div>
      </>
    );
  }

  return (
    <section aria-label="Wishlist items">
      <p className="muted">
        {products.length} item{products.length === 1 ? "" : "s"} · Private list · Saved locally
        for this demo
      </p>
      <ul className={styles.grid}>
        {products.map((product) => (
          <li key={product.id} className={styles.card}>
            <Link href={`/product/${product.id}`} className={styles.image}>
              <img src={product.images[0]} alt={product.title} width={200} height={200} />
            </Link>
            <Link href={`/product/${product.id}`} className={styles.name}>
              {product.title}
            </Link>
            <Rating value={product.rating} count={product.reviewCount} />
            <Price value={product.price} originalPrice={product.originalPrice} size="sm" />
            <div className={styles.actions}>
              <AddToCartButton product={product} fullWidth />
              <Button
                variant="outline"
                size="sm"
                fullWidth
                onClick={() => {
                  remove(product.id);
                  showToast("Removed from your wishlist", "info");
                }}
              >
                Remove
              </Button>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
