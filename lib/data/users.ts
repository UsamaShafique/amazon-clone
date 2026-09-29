import type { Address, Order, OrderItem, PaymentMethod, User } from "@/types";
import { round2 } from "@/lib/utils";
import { getProductById } from "./products";

/**
 * Demo account available out of the box. The password is intentionally
 * public — this is a mock auth system for a demo storefront.
 */
export const DEMO_USER: User = {
  id: "u-demo",
  name: "Demo Shopper",
  email: "demo@shopora.com",
  createdAt: "2024-03-14T10:00:00.000Z",
};

export const DEMO_PASSWORD = "demo1234";

export const DEMO_ADDRESSES: Address[] = [
  {
    id: "addr-demo-1",
    fullName: "Demo Shopper",
    line1: "1420 Maple Grove Avenue",
    line2: "Apt 8B",
    city: "Seattle",
    state: "WA",
    postalCode: "98101",
    country: "United States",
    phone: "+1 (206) 555-0184",
    isDefault: true,
  },
  {
    id: "addr-demo-2",
    fullName: "Demo Shopper (Office)",
    line1: "77 Harbor Point Plaza, Suite 300",
    city: "Seattle",
    state: "WA",
    postalCode: "98104",
    country: "United States",
    phone: "+1 (206) 555-0139",
    isDefault: false,
  },
];

export const DEMO_PAYMENT_METHODS: PaymentMethod[] = [
  {
    id: "pm-demo-1",
    brand: "Visa",
    last4: "4242",
    expiry: "09/28",
    holder: "Demo Shopper",
    isDefault: true,
  },
  {
    id: "pm-demo-2",
    brand: "Mastercard",
    last4: "5119",
    expiry: "01/27",
    holder: "Demo Shopper",
    isDefault: false,
  },
];

function items(entries: Array<[string, number]>): OrderItem[] {
  return entries.flatMap(([productId, quantity]) => {
    const p = getProductById(productId);
    if (!p) return [];
    return [{ productId, title: p.title, image: p.images[0], price: p.price, quantity }];
  });
}

function order(
  id: string,
  date: string,
  status: Order["status"],
  entries: Array<[string, number]>,
  extra: Partial<Order> = {},
): Order {
  const orderItems = items(entries);
  const subtotal = round2(orderItems.reduce((sum, i) => sum + i.price * i.quantity, 0));
  const shipping = subtotal >= 35 ? 0 : 5.99;
  const tax = round2(subtotal * 0.08);
  return {
    id,
    userId: DEMO_USER.id,
    date,
    status,
    items: orderItems,
    subtotal,
    shipping,
    tax,
    total: round2(subtotal + shipping + tax),
    shippingAddress: DEMO_ADDRESSES[0],
    payment: { brand: "Visa", last4: "4242" },
    estimatedDelivery: date,
    trackingId: `SPX${id.replace(/\D/g, "").slice(0, 10)}`,
    ...extra,
  };
}

/** Seeded order history for the demo account. */
export const DEMO_ORDERS: Order[] = [
  order(
    "114-3921083-7742611",
    "2026-09-24T16:22:00.000Z",
    "shipped",
    [
      ["aurix-pro-anc-headphones", 1],
      ["hydrapeak-32oz-bottle", 2],
    ],
    { estimatedDelivery: "2026-10-01T00:00:00.000Z" },
  ),
  order(
    "114-8812945-1130268",
    "2026-09-26T09:05:00.000Z",
    "processing",
    [["crispair-6qt-air-fryer", 1]],
    { estimatedDelivery: "2026-10-03T00:00:00.000Z" },
  ),
  order(
    "113-4470912-8891037",
    "2026-08-30T13:47:00.000Z",
    "delivered",
    [
      ["flexflow-yoga-mat", 1],
      ["deep-focus-attention", 1],
      ["lumiere-vitc-serum", 1],
    ],
    {
      estimatedDelivery: "2026-09-03T00:00:00.000Z",
      deliveredOn: "2026-09-02T18:12:00.000Z",
    },
  ),
  order(
    "112-0037164-5518420",
    "2026-07-11T20:31:00.000Z",
    "delivered",
    [
      ["buildcore-galaxy-explorer", 1],
      ["puzzlecraft-1000-mountains", 2],
    ],
    {
      estimatedDelivery: "2026-07-16T00:00:00.000Z",
      deliveredOn: "2026-07-15T15:40:00.000Z",
    },
  ),
];
