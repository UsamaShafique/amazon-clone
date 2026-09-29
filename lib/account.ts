"use client";

import type { Address, PaymentMethod } from "@/types";
import { readJSON, writeJSON } from "@/lib/storage";
import { DEMO_ADDRESSES, DEMO_PAYMENT_METHODS, DEMO_USER } from "@/lib/data/users";

/** Per-user addresses & payment methods, persisted locally for the demo. */

const addressesKey = (userId: string) => `shopora.addresses.${userId}`;
const paymentsKey = (userId: string) => `shopora.payments.${userId}`;

function seedIfNeeded<T>(key: string, userId: string, seed: T[]): T[] {
  const existing = readJSON<T[] | null>(key, null);
  if (existing) return existing;
  const initial = userId === DEMO_USER.id ? seed : [];
  writeJSON(key, initial);
  return initial;
}

export function getAddresses(userId: string): Address[] {
  return seedIfNeeded(addressesKey(userId), userId, DEMO_ADDRESSES);
}

export function saveAddress(userId: string, address: Address): Address[] {
  let list = getAddresses(userId);
  const exists = list.some((a) => a.id === address.id);
  list = exists ? list.map((a) => (a.id === address.id ? address : a)) : [...list, address];
  if (address.isDefault || list.length === 1) {
    list = list.map((a) => ({ ...a, isDefault: a.id === address.id }));
  }
  writeJSON(addressesKey(userId), list);
  return list;
}

export function deleteAddress(userId: string, addressId: string): Address[] {
  let list = getAddresses(userId).filter((a) => a.id !== addressId);
  if (list.length > 0 && !list.some((a) => a.isDefault)) {
    list = list.map((a, i) => ({ ...a, isDefault: i === 0 }));
  }
  writeJSON(addressesKey(userId), list);
  return list;
}

export function getPaymentMethods(userId: string): PaymentMethod[] {
  return seedIfNeeded(paymentsKey(userId), userId, DEMO_PAYMENT_METHODS);
}

export function savePaymentMethod(userId: string, method: PaymentMethod): PaymentMethod[] {
  let list = getPaymentMethods(userId);
  const exists = list.some((m) => m.id === method.id);
  list = exists ? list.map((m) => (m.id === method.id ? method : m)) : [...list, method];
  if (method.isDefault || list.length === 1) {
    list = list.map((m) => ({ ...m, isDefault: m.id === method.id }));
  }
  writeJSON(paymentsKey(userId), list);
  return list;
}

export function deletePaymentMethod(userId: string, methodId: string): PaymentMethod[] {
  let list = getPaymentMethods(userId).filter((m) => m.id !== methodId);
  if (list.length > 0 && !list.some((m) => m.isDefault)) {
    list = list.map((m, i) => ({ ...m, isDefault: i === 0 }));
  }
  writeJSON(paymentsKey(userId), list);
  return list;
}
