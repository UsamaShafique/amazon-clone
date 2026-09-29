"use client";

import type { Address, Order, OrderItem, OrderStatus } from "@/types";
import { addDays, round2 } from "@/lib/utils";
import { readJSON, writeJSON } from "@/lib/storage";
import { DEMO_ORDERS, DEMO_USER } from "@/lib/data/users";

/**
 * Client-side order store: orders created in the demo live in
 * localStorage; the demo account additionally sees a seeded history.
 */

const ordersKey = (userId: string) => `shopora.orders.${userId}`;

export function getOrders(userId: string): Order[] {
  const stored = readJSON<Order[]>(ordersKey(userId), []);
  const seeded = userId === DEMO_USER.id ? DEMO_ORDERS : [];
  return [...stored, ...seeded].sort((a, b) => b.date.localeCompare(a.date));
}

export function getOrder(userId: string, orderId: string): Order | undefined {
  return getOrders(userId).find((o) => o.id === orderId);
}

export const FREE_SHIPPING_THRESHOLD = 35;
export const SHIPPING_FLAT = 5.99;
export const TAX_RATE = 0.08;

export function computeTotals(items: OrderItem[]) {
  const subtotal = round2(items.reduce((sum, i) => sum + i.price * i.quantity, 0));
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD || subtotal === 0 ? 0 : SHIPPING_FLAT;
  const tax = round2(subtotal * TAX_RATE);
  const total = round2(subtotal + shipping + tax);
  return { subtotal, shipping, tax, total };
}

function generateOrderId(): string {
  const digits = () => Math.floor(Math.random() * 10);
  const block = (n: number) => Array.from({ length: n }, digits).join("");
  return `114-${block(7)}-${block(7)}`;
}

export function createOrder(params: {
  userId: string;
  items: OrderItem[];
  shippingAddress: Address;
  payment: { brand: string; last4: string };
}): Order {
  const { subtotal, shipping, tax, total } = computeTotals(params.items);
  const now = new Date();
  const order: Order = {
    id: generateOrderId(),
    userId: params.userId,
    date: now.toISOString(),
    status: "processing",
    items: params.items,
    subtotal,
    shipping,
    tax,
    total,
    shippingAddress: params.shippingAddress,
    payment: params.payment,
    estimatedDelivery: addDays(now, 4).toISOString(),
    trackingId: `SPX${Date.now().toString().slice(-10)}`,
  };
  const key = ordersKey(params.userId);
  writeJSON(key, [order, ...readJSON<Order[]>(key, [])]);
  return order;
}

export const ORDER_STATUS_LABEL: Record<OrderStatus, string> = {
  processing: "Order placed",
  shipped: "Shipped",
  out_for_delivery: "Out for delivery",
  delivered: "Delivered",
  cancelled: "Cancelled",
};
