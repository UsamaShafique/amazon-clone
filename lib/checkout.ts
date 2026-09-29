"use client";

import type { Address } from "@/types";
import { readSessionJSON, removeSessionKey, writeSessionJSON } from "@/lib/storage";

/** Checkout draft — survives refresh within the tab, cleared on completion. */

export interface CheckoutDraft {
  address?: Address;
  payment?: { brand: string; last4: string; holder: string; expiry: string };
}

const KEY = "shopora.checkout";

export function getCheckoutDraft(): CheckoutDraft {
  return readSessionJSON<CheckoutDraft>(KEY, {});
}

export function updateCheckoutDraft(patch: Partial<CheckoutDraft>): CheckoutDraft {
  const next = { ...getCheckoutDraft(), ...patch };
  writeSessionJSON(KEY, next);
  return next;
}

export function clearCheckoutDraft(): void {
  removeSessionKey(KEY);
}
