"use client";

import { useState } from "react";
import type { Product } from "@/types";
import { Button } from "@/components/ui/Button";
import { useCart } from "@/components/providers/CartProvider";
import { useToast } from "@/components/providers/ToastProvider";

interface AddToCartButtonProps {
  product: Product;
  quantity?: number;
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
  label?: string;
}

export function AddToCartButton({
  product,
  quantity = 1,
  size = "sm",
  fullWidth = false,
  label = "Add to cart",
}: AddToCartButtonProps) {
  const { addItem } = useCart();
  const { showToast } = useToast();
  const [busy, setBusy] = useState(false);
  const outOfStock = product.availability === "out_of_stock";

  const onClick = () => {
    setBusy(true);
    // Tiny delay so the pressed/loading state is perceivable.
    setTimeout(() => {
      addItem(product.id, quantity);
      showToast(`Added to cart: ${product.title.slice(0, 40)}…`);
      setBusy(false);
    }, 250);
  };

  return (
    <Button
      size={size}
      fullWidth={fullWidth}
      loading={busy}
      disabled={outOfStock}
      onClick={onClick}
      aria-label={`Add ${product.title} to cart`}
    >
      {outOfStock ? "Out of stock" : label}
    </Button>
  );
}
