import { getProductById } from "@/lib/data/products";
import { getCategory } from "@/lib/data/categories";
import { hashString } from "@/lib/utils";

/**
 * Locally generated SVG artwork for products and categories — the demo's
 * stand-in for real product photography (no copyrighted imagery is used).
 * `/api/placeholder/<productId|categorySlug>/<1|2|3>`
 */
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string; variant: string }> },
) {
  const { id, variant: variantRaw } = await params;
  const variant = Math.min(Math.max(parseInt(variantRaw, 10) || 1, 1), 3);

  const product = getProductById(id);
  const category = product ? getCategory(product.category) : getCategory(id);
  const emoji = product?.emoji ?? category?.emoji ?? "🛍️";
  const hue = (category?.hue ?? 210) + (variant - 1) * 14;
  const h = hashString(id) + variant * 97;

  const bg1 = `hsl(${hue}, 65%, ${94 - variant * 2}%)`;
  const bg2 = `hsl(${(hue + 40) % 360}, 60%, ${86 - variant * 2}%)`;
  const blob = `hsl(${(hue + 20) % 360}, 55%, 78%)`;
  const angle = (h % 360) * (Math.PI / 180);
  const cx1 = 300 + Math.round(Math.cos(angle) * 170);
  const cy1 = 300 + Math.round(Math.sin(angle) * 170);
  const cx2 = 300 - Math.round(Math.cos(angle) * 210);
  const cy2 = 300 - Math.round(Math.sin(angle) * 210);
  const emojiSize = variant === 2 ? 150 : variant === 3 ? 190 : 230;

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="600" viewBox="0 0 600 600" role="img" aria-label="${emoji} product artwork">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${bg1}"/>
      <stop offset="1" stop-color="${bg2}"/>
    </linearGradient>
  </defs>
  <rect width="600" height="600" fill="url(#bg)"/>
  <circle cx="${cx1}" cy="${cy1}" r="${150 + (h % 60)}" fill="${blob}" opacity="0.35"/>
  <circle cx="${cx2}" cy="${cy2}" r="${90 + (h % 50)}" fill="#ffffff" opacity="0.30"/>
  ${variant === 3 ? `<rect x="60" y="60" width="480" height="480" rx="36" fill="#ffffff" opacity="0.45"/>` : ""}
  ${variant === 2 ? `<circle cx="300" cy="300" r="170" fill="#ffffff" opacity="0.55"/>` : ""}
  <text x="300" y="300" font-size="${emojiSize}" text-anchor="middle" dominant-baseline="central">${emoji}</text>
</svg>`;

  return new Response(svg, {
    headers: {
      "Content-Type": "image/svg+xml",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
