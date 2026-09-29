"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from "./cart.module.css";
import { useCart } from "@/components/providers/CartProvider";
import { useWishlist } from "@/components/providers/WishlistProvider";
import { useAuth } from "@/components/providers/AuthProvider";
import { useToast } from "@/components/providers/ToastProvider";
import { getProductById } from "@/lib/data/products";
import { getDeals } from "@/lib/api/products";
import { FREE_SHIPPING_THRESHOLD } from "@/lib/api/orders";
import { QuantitySelect } from "@/components/ui/QuantitySelect";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { Skeleton } from "@/components/ui/Skeleton";
import { Price } from "@/components/ui/Price";
import { ProductCarousel } from "@/components/product/ProductCarousel";
import { formatPrice } from "@/lib/utils";

export function CartPageClient() {
  const cart = useCart();
  const { has, toggle } = useWishlist();
  const { status } = useAuth();
  const { showToast } = useToast();
  const router = useRouter();

  if (!cart.hydrated) {
    return (
      <div aria-busy="true">
        <Skeleton height={34} width="30%" />
        <div style={{ height: 14 }} />
        <Skeleton height={220} />
      </div>
    );
  }

  const items = cart.items
    .map((item) => ({ item, product: getProductById(item.productId) }))
    .filter((x): x is { item: (typeof cart.items)[number]; product: NonNullable<ReturnType<typeof getProductById>> } =>
      Boolean(x.product),
    );
  const saved = cart.saved
    .map((item) => ({ item, product: getProductById(item.productId) }))
    .filter((x) => Boolean(x.product));

  const remaining = FREE_SHIPPING_THRESHOLD - cart.subtotal;

  if (items.length === 0 && saved.length === 0) {
    return (
      <>
        <EmptyState
          emoji="🛒"
          title="Your Shopora Cart is empty"
          body="Your shopping cart is waiting. Give it purpose — fill it with deals, gadgets, books and more."
          action={
            <>
              <Button onClick={() => router.push("/search?deals=1&sort=discount")}>
                Shop today&apos;s deals
              </Button>
              {status === "guest" && (
                <Button variant="outline" onClick={() => router.push("/signin")}>
                  Sign in to your account
                </Button>
              )}
            </>
          }
        />
        <div style={{ marginTop: 18 }}>
          <ProductCarousel title="Recommended for you" products={getDeals(10)} />
        </div>
      </>
    );
  }

  return (
    <div className={styles.layout}>
      <div className={styles.main}>
        <section className={styles.itemsCard} aria-label="Shopping cart items">
          <div className={styles.itemsHeader}>
            <h1 className={styles.title}>Shopping Cart</h1>
            <span className={`muted ${styles.priceCol}`}>Price</span>
          </div>
          {items.length === 0 ? (
            <p className="muted" style={{ padding: "18px 0" }}>
              No items in your cart — check your saved items below.
            </p>
          ) : (
            <ul className={styles.itemList}>
              {items.map(({ item, product }) => (
                <li key={item.productId} className={styles.item}>
                  <Link href={`/product/${product.id}`} className={styles.itemImage}>
                    <img src={product.images[0]} alt={product.title} width={150} height={150} />
                  </Link>
                  <div className={styles.itemBody}>
                    <Link href={`/product/${product.id}`} className={styles.itemTitle}>
                      {product.title}
                    </Link>
                    {product.availability === "out_of_stock" ? (
                      <p className={styles.itemOut}>Currently unavailable</p>
                    ) : product.availability === "low_stock" ? (
                      <p className={styles.itemLow}>Only {product.stockCount} left in stock</p>
                    ) : (
                      <p className={styles.itemStock}>In Stock</p>
                    )}
                    {product.deliveryInfo.freeShipping && (
                      <p className="muted" style={{ fontSize: 12.5, margin: 0 }}>
                        Eligible for FREE Shipping
                      </p>
                    )}
                    <div className={styles.itemActions}>
                      <QuantitySelect
                        value={item.quantity}
                        onChange={(q) => cart.setQuantity(item.productId, q)}
                        allowZero
                      />
                      <span className={styles.actionSep} aria-hidden="true" />
                      <button
                        type="button"
                        className={styles.itemAction}
                        onClick={() => {
                          cart.removeItem(item.productId);
                          showToast("Removed from cart", "info");
                        }}
                      >
                        Delete
                      </button>
                      <span className={styles.actionSep} aria-hidden="true" />
                      <button
                        type="button"
                        className={styles.itemAction}
                        onClick={() => cart.saveForLater(item.productId)}
                      >
                        Save for later
                      </button>
                      <span className={styles.actionSep} aria-hidden="true" />
                      <button
                        type="button"
                        className={styles.itemAction}
                        onClick={() => {
                          const added = toggle(product.id);
                          showToast(
                            added ? "Added to your wishlist" : "Removed from your wishlist",
                            "info",
                          );
                        }}
                      >
                        {has(product.id) ? "Remove from wishlist" : "Add to wishlist"}
                      </button>
                    </div>
                  </div>
                  <div className={styles.itemPrice}>
                    <Price value={product.price * item.quantity} size="sm" />
                    {item.quantity > 1 && (
                      <span className="muted" style={{ fontSize: 12 }}>
                        {formatPrice(product.price)} each
                      </span>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
          <p className={styles.subtotalLine}>
            Subtotal ({cart.count} item{cart.count === 1 ? "" : "s"}):{" "}
            <strong>{formatPrice(cart.subtotal)}</strong>
          </p>
        </section>

        {saved.length > 0 && (
          <section className={styles.itemsCard} aria-label="Saved for later">
            <h2 className={styles.savedTitle}>
              Saved for later ({saved.length} item{saved.length === 1 ? "" : "s"})
            </h2>
            <div className={styles.savedGrid}>
              {saved.map(({ item, product }) =>
                product ? (
                  <div key={item.productId} className={styles.savedCard}>
                    <Link href={`/product/${product.id}`}>
                      <img src={product.images[0]} alt={product.title} width={140} height={140} />
                    </Link>
                    <Link href={`/product/${product.id}`} className={styles.savedName}>
                      {product.title}
                    </Link>
                    <Price value={product.price} size="sm" />
                    <Button size="sm" onClick={() => cart.moveToCart(item.productId)}>
                      Move to cart
                    </Button>
                    <button
                      type="button"
                      className={styles.itemAction}
                      onClick={() => cart.removeSaved(item.productId)}
                    >
                      Delete
                    </button>
                  </div>
                ) : null,
              )}
            </div>
          </section>
        )}

        <ProductCarousel
          title="Customers also considered"
          products={getDeals(10).filter((p) => !cart.items.some((i) => i.productId === p.id))}
          seeAllHref="/search?deals=1&sort=discount"
        />
      </div>

      <aside className={styles.summary} aria-label="Order summary">
        {remaining > 0 && cart.subtotal > 0 ? (
          <p className={styles.shippingNote}>
            Add <strong>{formatPrice(remaining)}</strong> of eligible items to qualify for{" "}
            <span className={styles.freeShip}>FREE Shipping</span>.
          </p>
        ) : cart.subtotal > 0 ? (
          <p className={styles.shippingNote}>
            <span aria-hidden="true">✅</span> Your order qualifies for{" "}
            <span className={styles.freeShip}>FREE Shipping</span>.
          </p>
        ) : null}
        <p className={styles.summarySubtotal}>
          Subtotal ({cart.count} item{cart.count === 1 ? "" : "s"}):{" "}
          <strong>{formatPrice(cart.subtotal)}</strong>
        </p>
        <Button
          fullWidth
          disabled={items.length === 0}
          onClick={() => router.push("/checkout")}
        >
          Proceed to checkout
        </Button>
        {status === "guest" && (
          <p className="muted" style={{ fontSize: 12, marginTop: 10, marginBottom: 0 }}>
            You&apos;ll be asked to sign in before checkout.
          </p>
        )}
      </aside>
    </div>
  );
}
