import type { Metadata } from "next";
import Link from "next/link";
import styles from "@/components/home/home.module.css";
import { HeroCarousel } from "@/components/home/HeroCarousel";
import { CategoryTileCard, type TileLink } from "@/components/home/CategoryTileCard";
import { SignInCard } from "@/components/home/SignInCard";
import { RecentlyViewedSection } from "@/components/home/RecentlyViewedSection";
import { ProductCarousel } from "@/components/product/ProductCarousel";
import {
  getBestsellers,
  getDeals,
  getNewArrivals,
  getProductsByCategory,
  getTopRated,
} from "@/lib/api/products";
import { getCategory } from "@/lib/data/categories";

export const metadata: Metadata = {
  title: "Shopora — Shop everything, delivered fast",
  description:
    "Deals, bestsellers and new arrivals across electronics, computers, home, fashion, beauty, toys, sports and books. Demo marketplace project.",
  alternates: { canonical: "/" },
};

/** 2×2 tile links for a category card, driven by subcategories. */
function categoryTiles(slug: string): TileLink[] {
  const category = getCategory(slug);
  if (!category) return [];
  return category.subcategories.slice(0, 4).map((sub) => {
    const sample = getProductsByCategory(slug).find((p) => p.subcategory === sub.slug);
    return {
      label: sub.name,
      href: `/category/${slug}?sub=${sub.slug}`,
      image: sample?.images[0] ?? `/api/placeholder/${slug}/1`,
    };
  });
}

function productTiles(slug: string, filter?: (price: number) => boolean): TileLink[] {
  return getProductsByCategory(slug)
    .filter((p) => (filter ? filter(p.price) : true))
    .slice(0, 4)
    .map((p) => ({
      label: p.title.split(",")[0],
      href: `/product/${p.id}`,
      image: p.images[0],
    }));
}

export default function HomePage() {
  const deals = getDeals(12);
  const electronicsBestsellers = getBestsellers("electronics", 10);
  const newArrivals = getNewArrivals(10);
  const homePicks = getTopRated("home-kitchen", 10);
  const sportsBestsellers = getBestsellers("sports-outdoors", 10);

  return (
    <main>
      <h1 className="visually-hidden">Shopora — online marketplace</h1>
      <HeroCarousel />

      <div className={`container ${styles.homeMain}`}>
        <div className={styles.tileRow}>
          <CategoryTileCard
            title="Plug in with our electronics"
            links={categoryTiles("electronics")}
            footerHref="/category/electronics"
            footerLabel="See more in Electronics"
          />
          <CategoryTileCard
            title="Score the top PCs & accessories"
            links={categoryTiles("computers")}
            footerHref="/category/computers"
            footerLabel="Shop all Computers"
          />
          <CategoryTileCard
            title="Gear up to get fit"
            links={categoryTiles("sports-outdoors")}
            footerHref="/category/sports-outdoors"
            footerLabel="Explore Sports & Outdoors"
          />
          <CategoryTileCard
            title="Fashion finds under $75"
            links={productTiles("fashion", (price) => price < 75)}
            footerHref="/category/fashion"
            footerLabel="See all Fashion"
          />
        </div>

        <ProductCarousel
          title="Today's Deals"
          products={deals}
          seeAllHref="/search?deals=1&sort=discount"
          seeAllLabel="See all deals"
        />

        <ProductCarousel
          title="Best Sellers in Electronics"
          products={electronicsBestsellers}
          seeAllHref="/category/electronics?sort=reviews"
        />

        <div className={styles.tileRow}>
          <CategoryTileCard
            title="Shop kitchen must-haves"
            links={categoryTiles("home-kitchen")}
            footerHref="/category/home-kitchen"
            footerLabel="Explore Home & Kitchen"
          />
          <CategoryTileCard
            title="Shop all things beauty"
            links={categoryTiles("beauty")}
            footerHref="/category/beauty"
            footerLabel="See more in Beauty"
          />
          <CategoryTileCard
            title="Toys for little ones"
            links={categoryTiles("toys-games")}
            footerHref="/category/toys-games"
            footerLabel="Browse Toys & Games"
          />
          <CategoryTileCard
            title="Stories to get lost in"
            links={productTiles("books")}
            footerHref="/category/books"
            footerLabel="Visit the Book Store"
          />
        </div>

        <SignInCard />

        <ProductCarousel
          title="New arrivals across Shopora"
          products={newArrivals}
          seeAllHref="/search?sort=newest"
        />

        <ProductCarousel
          title="Top-rated in Home & Kitchen"
          products={homePicks}
          seeAllHref="/category/home-kitchen?sort=rating"
        />

        <section className={styles.promoBanner} aria-label="Shopora Plus">
          <div>
            <h2 className={styles.promoTitle}>
              Try <em>shopora plus</em>
            </h2>
            <p className={styles.promoText}>
              Fast, FREE delivery on eligible items, exclusive deals and more — part of the
              demo experience.
            </p>
          </div>
          <Link href="/signup" className={styles.promoCta}>
            Join for free
          </Link>
        </section>

        <ProductCarousel
          title="Popular in Sports & Outdoors"
          products={sportsBestsellers}
          seeAllHref="/category/sports-outdoors"
        />

        <RecentlyViewedSection />
      </div>
    </main>
  );
}
