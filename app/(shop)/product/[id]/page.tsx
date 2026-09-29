import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import styles from "@/components/product/pdp.module.css";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Rating } from "@/components/ui/Rating";
import { Price } from "@/components/ui/Price";
import { Badge } from "@/components/ui/Badge";
import { Gallery } from "@/components/product/Gallery";
import { BuyBox } from "@/components/product/BuyBox";
import { FrequentlyBought } from "@/components/product/FrequentlyBought";
import { ReviewsSection } from "@/components/product/ReviewsSection";
import { RecentTracker } from "@/components/product/RecentTracker";
import { ProductCarousel } from "@/components/product/ProductCarousel";
import { RecentlyViewedSection } from "@/components/home/RecentlyViewedSection";
import {
  getFrequentlyBoughtTogether,
  getProductById,
  getRelatedProducts,
} from "@/lib/api/products";
import { getCategory } from "@/lib/data/categories";
import { getRatingBreakdown, getReviewsForProduct } from "@/lib/data/reviews";
import { PRODUCTS } from "@/lib/data/products";

interface PageProps {
  params: Promise<{ id: string }>;
}

export function generateStaticParams() {
  return PRODUCTS.map((p) => ({ id: p.id }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const product = getProductById(id);
  if (!product) return { title: "Product not found" };
  return {
    title: product.title.length > 55 ? `${product.title.slice(0, 55)}…` : product.title,
    description: product.description.slice(0, 158),
    alternates: { canonical: `/product/${product.id}` },
    openGraph: {
      title: product.title,
      description: product.description.slice(0, 158),
      images: [{ url: product.images[0], width: 600, height: 600 }],
      type: "website",
    },
  };
}

export default async function ProductPage({ params }: PageProps) {
  const { id } = await params;
  const product = getProductById(id);
  if (!product) notFound();

  const category = getCategory(product.category);
  const subcategory = category?.subcategories.find((s) => s.slug === product.subcategory);
  const related = getRelatedProducts(product, 10);
  const companions = getFrequentlyBoughtTogether(product);
  const reviews = getReviewsForProduct(product.id);
  const breakdown = getRatingBreakdown(product.rating);

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    image: product.images,
    description: product.description,
    sku: product.id,
    brand: { "@type": "Brand", name: product.brand },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: product.rating,
      reviewCount: product.reviewCount,
    },
    offers: {
      "@type": "Offer",
      priceCurrency: "USD",
      price: product.price,
      availability:
        product.availability === "out_of_stock"
          ? "https://schema.org/OutOfStock"
          : "https://schema.org/InStock",
      url: `/product/${product.id}`,
    },
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "/" },
      {
        "@type": "ListItem",
        position: 2,
        name: category?.name ?? product.category,
        item: `/category/${product.category}`,
      },
      { "@type": "ListItem", position: 3, name: product.title },
    ],
  };

  return (
    <main className="container" style={{ paddingBottom: 24 }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <RecentTracker productId={product.id} />

      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: category?.name ?? product.category, href: `/category/${product.category}` },
          ...(subcategory
            ? [
                {
                  label: subcategory.name,
                  href: `/category/${product.category}?sub=${subcategory.slug}`,
                },
              ]
            : []),
          { label: product.title.split(",")[0] },
        ]}
      />

      <div className={styles.pdpGrid}>
        <Gallery product={product} />

        <div className={styles.info}>
          {product.badges.length > 0 && (
            <p style={{ marginBottom: 6 }}>
              {product.badges.map((b) => (
                <span key={b} style={{ marginRight: 6 }}>
                  <Badge type={b} />
                </span>
              ))}
            </p>
          )}
          <h1 className={styles.pdpTitle}>{product.title}</h1>
          <Link
            href={`/search?q=${encodeURIComponent(product.brand)}`}
            className={`link ${styles.brandLink}`}
          >
            Visit the {product.brand} Store
          </Link>
          <div className={styles.ratingRow}>
            <Rating value={product.rating} showValue />
            <Link href="#reviews" className="link">
              {product.reviewCount.toLocaleString("en-US")} ratings
            </Link>
          </div>
          <div className={styles.infoPriceRow}>
            <Price
              value={product.price}
              originalPrice={product.originalPrice}
              discount={product.discount}
              showDiscountBadge={Boolean(product.discount)}
              size="lg"
            />
          </div>

          <h2 className={styles.aboutHeading}>About this item</h2>
          <ul className={styles.featureList}>
            {product.features.map((f) => (
              <li key={f}>{f}</li>
            ))}
          </ul>

          <p className={styles.description}>{product.description}</p>
        </div>

        <BuyBox product={product} />
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 18, marginTop: 18 }}>
        <FrequentlyBought product={product} companions={companions} />

        <section className={styles.specs} aria-label="Product information">
          <h2 className={styles.sectionTitle}>Product information</h2>
          <table className={styles.specsTable}>
            <tbody>
              {Object.entries(product.specifications).map(([key, value]) => (
                <tr key={key}>
                  <th scope="row">{key}</th>
                  <td>{value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <ReviewsSection product={product} reviews={reviews} breakdown={breakdown} />

        <ProductCarousel
          title={`More in ${category?.name ?? "this category"}`}
          products={related}
          seeAllHref={`/category/${product.category}`}
        />

        <RecentlyViewedSection excludeId={product.id} />
      </div>
    </main>
  );
}
