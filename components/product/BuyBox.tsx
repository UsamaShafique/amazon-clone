"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { Product } from "@/types";
import styles from "./pdp.module.css";
import { Price } from "@/components/ui/Price";
import { Button } from "@/components/ui/Button";
import { QuantitySelect } from "@/components/ui/QuantitySelect";
import { AddToCartButton } from "./AddToCartButton";
import { WishlistButton } from "./WishlistButton";
import { useCart } from "@/components/providers/CartProvider";
import { deliveryEstimate } from "@/lib/utils";

export function BuyBox({ product }: { product: Product }) {
  const [quantity, setQuantity] = useState(1);
  const [buying, setBuying] = useState(false);
  const { addItem } = useCart();
  const router = useRouter();
  const outOfStock = product.availability === "out_of_stock";

  const buyNow = () => {
    setBuying(true);
    addItem(product.id, quantity);
    router.push("/checkout");
  };

  return (
    <aside className={styles.buyBox} aria-label="Purchase options">
      <Price
        value={product.price}
        originalPrice={product.originalPrice}
        discount={product.discount}
        showDiscountBadge={Boolean(product.discount)}
        size="lg"
      />

      <p className={styles.buyBoxDelivery}>
        {product.deliveryInfo.freeShipping ? (
          <>
            <strong>FREE delivery</strong>{" "}
            {deliveryEstimate(
              product.deliveryInfo.estimatedDaysMin,
              product.deliveryInfo.estimatedDaysMax,
            )}
          </>
        ) : (
          <>
            <strong>$5.99 delivery</strong>{" "}
            {deliveryEstimate(
              product.deliveryInfo.estimatedDaysMin,
              product.deliveryInfo.estimatedDaysMax,
            )}
          </>
        )}
        {product.deliveryInfo.express && (
          <span className={styles.expressNote}>
            <span className={styles.expressTagLarge}>⚡ plus</span> Faster delivery available
          </span>
        )}
      </p>

      {outOfStock ? (
        <p className={styles.stockOut}>Currently unavailable.</p>
      ) : product.availability === "low_stock" ? (
        <p className={styles.stockLow}>Only {product.stockCount} left in stock — order soon.</p>
      ) : (
        <p className={styles.stockIn}>In Stock</p>
      )}

      {!outOfStock && (
        <div className={styles.buyBoxQty}>
          <QuantitySelect value={quantity} onChange={setQuantity} />
        </div>
      )}

      <div className={styles.buyBoxActions}>
        <AddToCartButton product={product} quantity={quantity} size="md" fullWidth />
        <Button
          variant="accent"
          size="md"
          fullWidth
          disabled={outOfStock}
          loading={buying}
          onClick={buyNow}
        >
          Buy Now
        </Button>
      </div>

      <p className={styles.secureNote}>
        <span aria-hidden="true">🔒</span> Secure transaction (demo)
      </p>

      <dl className={styles.sellerInfo}>
        <div>
          <dt>Ships from</dt>
          <dd>Shopora Fulfilment</dd>
        </div>
        <div>
          <dt>Sold by</dt>
          <dd>
            <Link
              href={`/search?q=${encodeURIComponent(product.seller.name)}`}
              className="link"
            >
              {product.seller.name}
            </Link>{" "}
            <span className="muted">
              ({product.seller.rating.toFixed(1)}★,{" "}
              {product.seller.ratingCount.toLocaleString("en-US")} ratings)
            </span>
          </dd>
        </div>
        <div>
          <dt>Returns</dt>
          <dd>30-day refund / replacement</dd>
        </div>
      </dl>

      <WishlistButton product={product} />
    </aside>
  );
}
