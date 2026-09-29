import type { Review } from "@/types";
import { clamp, hashString, seededRandom } from "@/lib/utils";
import { getProductById } from "./products";

const AUTHORS = [
  "Ayesha K.", "Daniel R.", "Meera S.", "Tom H.", "Lena M.", "Chris P.",
  "Fatima A.", "Jorge V.", "Nina B.", "Sam T.", "Priya D.", "Omar F.",
  "Grace W.", "Leo N.", "Hana Y.", "Marcus J.",
];

const POSITIVE_TITLES = [
  "Exceeded my expectations",
  "Exactly as described",
  "Worth every penny",
  "Better than pricier alternatives",
  "Buying a second one",
  "Great quality for the price",
];

const NEUTRAL_TITLES = [
  "Good, with a few quirks",
  "Solid but not perfect",
  "Does the job",
];

const NEGATIVE_TITLES = ["Not for me", "Expected more", "Mixed feelings"];

const POSITIVE_BODIES = [
  "I did a lot of research before buying and this was the right call. Setup took minutes, the build quality feels premium, and it has held up to daily use without a single issue.",
  "Arrived a day early and was packaged really well. It works exactly as advertised — honestly the best purchase I've made this year in this category.",
  "I was skeptical about the reviews but they're accurate. Three weeks in and I use it every day. The little details show the designers actually use their own product.",
  "Bought this as a gift and ended up ordering another for myself. Instructions were clear, quality is excellent, and customer support answered my one question within hours.",
  "Replaced a much more expensive brand with this and I genuinely can't tell the difference in quality. Would absolutely recommend to a friend.",
];

const NEUTRAL_BODIES = [
  "Overall happy with it. There's a small learning curve and the manual could be clearer, but once you get used to it, it performs well for the price.",
  "Good value. It's not the premium version and you can tell in a couple of places, but for everyday use it's more than adequate.",
  "Does what it says. Shipping was fast. I'd give it 5 stars if the packaging were sturdier — mine arrived with a dented corner box, though the product was fine.",
];

const NEGATIVE_BODIES = [
  "It works, but the quality didn't quite match my expectations from the photos. Return process was easy at least, and the seller was responsive.",
  "Decent concept but a few rough edges in day-to-day use. I might have gotten a dud — support offered a replacement, which I appreciated.",
];

export function getReviewsForProduct(productId: string): Review[] {
  const product = getProductById(productId);
  if (!product) return [];
  const h = hashString(productId);
  const rand = seededRandom(h);
  const count = 5 + (h % 4);
  const reviews: Review[] = [];
  for (let i = 0; i < count; i++) {
    // Cluster review ratings around the product's average.
    const jitter = rand() * 2.4 - 1.2;
    const rating = clamp(Math.round(product.rating + jitter), 1, 5);
    const [titles, bodies] =
      rating >= 4
        ? [POSITIVE_TITLES, POSITIVE_BODIES]
        : rating === 3
          ? [NEUTRAL_TITLES, NEUTRAL_BODIES]
          : [NEGATIVE_TITLES, NEGATIVE_BODIES];
    const daysAgo = 3 + Math.floor(rand() * 320);
    const date = new Date(Date.UTC(2026, 8, 28));
    date.setUTCDate(date.getUTCDate() - daysAgo);
    reviews.push({
      id: `${productId}-r${i}`,
      productId,
      author: AUTHORS[Math.floor(rand() * AUTHORS.length)],
      rating,
      title: titles[Math.floor(rand() * titles.length)],
      body: bodies[Math.floor(rand() * bodies.length)],
      date: date.toISOString(),
      verified: rand() > 0.15,
      helpfulCount: Math.floor(rand() * 240),
    });
  }
  return reviews.sort((a, b) => b.helpfulCount - a.helpfulCount);
}

/** Synthetic 5→1 star distribution (percentages summing to 100). */
export function getRatingBreakdown(rating: number): number[] {
  const five = clamp(Math.round((rating - 3.05) * 38), 5, 84);
  const four = clamp(Math.round(90 - five - (5 - rating) * 14), 8, 40);
  const three = clamp(Math.round((100 - five - four) * 0.5), 2, 20);
  const two = clamp(Math.round((100 - five - four - three) * 0.55), 1, 12);
  const one = Math.max(100 - five - four - three - two, 0);
  return [five, four, three, two, one];
}
