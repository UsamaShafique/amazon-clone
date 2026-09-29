"use client";

import { useEffect, useState } from "react";
import styles from "./account.module.css";
import { useAuth } from "@/components/providers/AuthProvider";
import { useToast } from "@/components/providers/ToastProvider";
import { readJSON, writeJSON } from "@/lib/storage";
import { cx } from "@/lib/utils";

interface Prefs {
  dealAlerts: boolean;
  orderUpdates: boolean;
  recommendations: boolean;
  smsUpdates: boolean;
}

const DEFAULTS: Prefs = {
  dealAlerts: true,
  orderUpdates: true,
  recommendations: false,
  smsUpdates: false,
};

const ROWS: Array<{ key: keyof Prefs; label: string; desc: string }> = [
  {
    key: "dealAlerts",
    label: "Deal alerts",
    desc: "Occasional emails about limited-time deals in departments you browse.",
  },
  {
    key: "orderUpdates",
    label: "Order updates",
    desc: "Shipping, delivery and return notifications for your orders.",
  },
  {
    key: "recommendations",
    label: "Personalised recommendations",
    desc: "Product picks based on your recently viewed items.",
  },
  {
    key: "smsUpdates",
    label: "SMS delivery updates",
    desc: "Text messages when a package is out for delivery.",
  },
];

export function PreferencesClient() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [prefs, setPrefs] = useState<Prefs>(DEFAULTS);
  const key = user ? `shopora.prefs.${user.id}` : null;

  useEffect(() => {
    if (key) setPrefs(readJSON<Prefs>(key, DEFAULTS));
  }, [key]);

  if (!user) return null;

  const toggle = (name: keyof Prefs) => {
    const next = { ...prefs, [name]: !prefs[name] };
    setPrefs(next);
    if (key) writeJSON(key, next);
    showToast("Preference saved");
  };

  return (
    <div className={styles.sectionCard}>
      <p className="muted" style={{ fontSize: 13 }}>
        These control pretend communications — nothing is actually sent in the demo.
      </p>
      {ROWS.map((row) => (
        <div key={row.key} className={styles.prefRow}>
          <div>
            <p className={styles.prefLabel}>{row.label}</p>
            <p className={styles.prefDesc}>{row.desc}</p>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={prefs[row.key]}
            aria-label={row.label}
            className={cx(styles.switch, prefs[row.key] && styles.switchOn)}
            onClick={() => toggle(row.key)}
          >
            <span className={styles.switchKnob} />
          </button>
        </div>
      ))}
    </div>
  );
}
