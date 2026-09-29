"use client";

import { useEffect, useState, type FormEvent } from "react";
import styles from "./Header.module.css";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { readJSON, writeJSON } from "@/lib/storage";

interface Location {
  city: string;
  zip: string;
}

const KEY = "shopora.location";
const DEFAULT_LOCATION: Location = { city: "New York", zip: "10001" };

export function DeliverTo({ variant = "desktop" }: { variant?: "desktop" | "mobile" }) {
  const [location, setLocation] = useState<Location>(DEFAULT_LOCATION);
  const [open, setOpen] = useState(false);
  const [city, setCity] = useState("");
  const [zip, setZip] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    setLocation(readJSON<Location>(KEY, DEFAULT_LOCATION));
  }, []);

  const save = (e: FormEvent) => {
    e.preventDefault();
    if (!city.trim() || !/^\d{4,6}$/.test(zip.trim())) {
      setError("Enter a city and a valid postal code (4–6 digits).");
      return;
    }
    const next = { city: city.trim(), zip: zip.trim() };
    setLocation(next);
    writeJSON(KEY, next);
    setOpen(false);
    setError("");
  };

  const trigger = (
    <button
      type="button"
      className={variant === "desktop" ? styles.headerAction : styles.deliverMobileBtn}
      onClick={() => {
        setCity(location.city);
        setZip(location.zip);
        setOpen(true);
      }}
    >
      {variant === "desktop" ? (
        <>
          <span className={styles.actionLine1}>
            <span aria-hidden="true">📍</span> Deliver to
          </span>
          <span className={styles.actionLine2}>
            {location.city} {location.zip}
          </span>
        </>
      ) : (
        <>
          <span aria-hidden="true">📍</span> Deliver to {location.city} {location.zip}
        </>
      )}
    </button>
  );

  return (
    <>
      {trigger}
      <Modal open={open} onClose={() => setOpen(false)} title="Choose your location" width={400}>
        <p className="muted">
          Delivery options and delivery speeds may vary for different locations.
        </p>
        <form onSubmit={save} noValidate>
          <Input
            label="City"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="e.g. Seattle"
          />
          <Input
            label="Postal code"
            value={zip}
            onChange={(e) => setZip(e.target.value)}
            inputMode="numeric"
            placeholder="e.g. 98101"
            error={error}
          />
          <Button type="submit" fullWidth>
            Apply
          </Button>
        </form>
      </Modal>
    </>
  );
}
