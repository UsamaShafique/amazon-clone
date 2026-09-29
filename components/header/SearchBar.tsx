"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from "./Header.module.css";
import { CATEGORIES } from "@/lib/data/categories";
import { PRODUCTS } from "@/lib/data/products";
import { cx } from "@/lib/utils";

interface Suggestion {
  label: string;
  href: string;
  kind: "search" | "product";
}

export function SearchBar() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const wrapRef = useRef<HTMLDivElement>(null);

  const suggestions = useMemo<Suggestion[]>(() => {
    const q = query.trim().toLowerCase();
    if (q.length < 2) return [];
    const matches = PRODUCTS.filter(
      (p) =>
        (category === "all" || p.category === category) &&
        `${p.title} ${p.brand}`.toLowerCase().includes(q),
    ).slice(0, 6);
    const searchHref = `/search?q=${encodeURIComponent(query.trim())}${
      category !== "all" ? `&category=${category}` : ""
    }`;
    return [
      { label: `Search for “${query.trim()}”`, href: searchHref, kind: "search" as const },
      ...matches.map((p) => ({
        label: p.title.length > 64 ? `${p.title.slice(0, 64)}…` : p.title,
        href: `/product/${p.id}`,
        kind: "product" as const,
      })),
    ];
  }, [query, category]);

  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  const submit = () => {
    const q = query.trim();
    if (!q) return;
    setOpen(false);
    router.push(
      `/search?q=${encodeURIComponent(q)}${category !== "all" ? `&category=${category}` : ""}`,
    );
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (!open || suggestions.length === 0) {
      if (e.key === "Enter") {
        e.preventDefault();
        submit();
      }
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => (i + 1) % suggestions.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => (i <= 0 ? suggestions.length - 1 : i - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (activeIndex >= 0) {
        setOpen(false);
        router.push(suggestions[activeIndex].href);
      } else {
        submit();
      }
    } else if (e.key === "Escape") {
      setOpen(false);
      setActiveIndex(-1);
    }
  };

  return (
    <div className={styles.searchWrap} ref={wrapRef} role="search">
      <label className="visually-hidden" htmlFor="site-search-category">
        Search in category
      </label>
      <select
        id="site-search-category"
        className={styles.searchCategory}
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      >
        <option value="all">All</option>
        {CATEGORIES.map((c) => (
          <option key={c.slug} value={c.slug}>
            {c.name}
          </option>
        ))}
      </select>
      <label className="visually-hidden" htmlFor="site-search">
        Search Shopora
      </label>
      <input
        id="site-search"
        className={styles.searchInput}
        placeholder="Search Shopora"
        value={query}
        autoComplete="off"
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
          setActiveIndex(-1);
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={onKeyDown}
        aria-expanded={open && suggestions.length > 0}
        aria-controls="search-suggestions"
        aria-autocomplete="list"
        role="combobox"
      />
      <button
        type="button"
        className={styles.searchButton}
        onClick={submit}
        aria-label="Search"
      >
        <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
          <circle cx="10.5" cy="10.5" r="6.5" fill="none" stroke="#131921" strokeWidth="2.2" />
          <path d="m15.5 15.5 5 5" stroke="#131921" strokeWidth="2.4" strokeLinecap="round" />
        </svg>
      </button>
      {open && suggestions.length > 0 && (
        <ul className={styles.suggestions} id="search-suggestions" role="listbox">
          {suggestions.map((sug, i) => (
            <li key={sug.href} role="option" aria-selected={i === activeIndex}>
              <Link
                href={sug.href}
                className={cx(
                  styles.suggestion,
                  i === activeIndex && styles.suggestionActive,
                  sug.kind === "search" && styles.suggestionSearch,
                )}
                onClick={() => setOpen(false)}
              >
                <span aria-hidden="true" className={styles.suggestionIcon}>
                  {sug.kind === "search" ? "🔍" : "🛍️"}
                </span>
                {sug.label}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
