import { ProductCardSkeleton, Skeleton } from "@/components/ui/Skeleton";

export default function ShopLoading() {
  return (
    <div className="container" style={{ padding: "20px 16px" }} aria-busy="true">
      <p className="visually-hidden">Loading…</p>
      <Skeleton height={36} width="34%" />
      <div style={{ height: 16 }} />
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(210px, 1fr))",
          gap: 14,
        }}
      >
        {Array.from({ length: 8 }, (_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
