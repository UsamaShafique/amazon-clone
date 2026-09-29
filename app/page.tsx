import { CATEGORIES } from "@/lib/data/categories";
import { PRODUCTS } from "@/lib/data/products";

// Temporary boot page — replaced by the full marketplace homepage.
export default function HomePage() {
  return (
    <main className="container" style={{ padding: "40px 16px" }}>
      <h1>Shopora — build in progress</h1>
      <p className="muted">
        Catalog loaded: {PRODUCTS.length} products across {CATEGORIES.length} categories.
      </p>
      <ul style={{ listStyle: "none", display: "grid", gap: 8, marginTop: 16 }}>
        {CATEGORIES.map((c) => (
          <li key={c.slug} className="card">
            {c.emoji} {c.name} —{" "}
            <span className="muted">
              {PRODUCTS.filter((p) => p.category === c.slug).length} products
            </span>
          </li>
        ))}
      </ul>
    </main>
  );
}
