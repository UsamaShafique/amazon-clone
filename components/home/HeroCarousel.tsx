"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import styles from "./home.module.css";
import { cx } from "@/lib/utils";

interface Slide {
  id: string;
  eyebrow: string;
  title: string;
  cta: { label: string; href: string };
  hue: number;
  emojis: [string, string, string];
}

const SLIDES: Slide[] = [
  {
    id: "deals",
    eyebrow: "Today's Deals",
    title: "Up to 40% off customer favourites",
    cta: { label: "Shop all deals", href: "/search?deals=1&sort=discount" },
    hue: 12,
    emojis: ["🏷️", "⏰", "🛍️"],
  },
  {
    id: "electronics",
    eyebrow: "Electronics",
    title: "Level up your sound, sight and smart home",
    cta: { label: "Shop electronics", href: "/category/electronics" },
    hue: 210,
    emojis: ["🎧", "📷", "💡"],
  },
  {
    id: "home",
    eyebrow: "Home & Kitchen",
    title: "Shop kitchen must-haves for fall",
    cta: { label: "Explore the kitchen store", href: "/category/home-kitchen" },
    hue: 28,
    emojis: ["☕", "🍳", "🧊"],
  },
  {
    id: "fashion",
    eyebrow: "Fashion",
    title: "Start looking sharp — new season styles",
    cta: { label: "Shop new arrivals", href: "/category/fashion" },
    hue: 330,
    emojis: ["👗", "👟", "⌚"],
  },
  {
    id: "toys",
    eyebrow: "Toys & Games",
    title: "Toys for little ones (and big ones too)",
    cta: { label: "Browse toys & games", href: "/category/toys-games" },
    hue: 45,
    emojis: ["🧸", "🚀", "🎲"],
  },
];

const INTERVAL_MS = 6000;

export function HeroCarousel() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const go = useCallback((next: number) => {
    setIndex((next + SLIDES.length) % SLIDES.length);
  }, []);

  useEffect(() => {
    if (paused) return;
    timerRef.current = setInterval(() => {
      setIndex((i) => (i + 1) % SLIDES.length);
    }, INTERVAL_MS);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [paused]);

  return (
    <section
      className={styles.hero}
      aria-roledescription="carousel"
      aria-label="Featured promotions"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      {SLIDES.map((slide, i) => (
        <div
          key={slide.id}
          className={cx(styles.heroSlide, i === index && styles.heroSlideActive)}
          style={{
            background: `linear-gradient(110deg, hsl(${slide.hue}, 75%, 93%) 0%, hsl(${(slide.hue + 45) % 360}, 65%, 86%) 100%)`,
          }}
          role="group"
          aria-roledescription="slide"
          aria-label={`${i + 1} of ${SLIDES.length}: ${slide.title}`}
          aria-hidden={i !== index}
        >
          <div className={styles.heroContent}>
            <p className={styles.heroEyebrow}>{slide.eyebrow}</p>
            <h2 className={styles.heroTitle}>{slide.title}</h2>
            <Link
              href={slide.cta.href}
              className={styles.heroCta}
              tabIndex={i === index ? 0 : -1}
            >
              {slide.cta.label}
            </Link>
          </div>
          <div className={styles.heroArt} aria-hidden="true">
            {slide.emojis.map((e, j) => (
              <span key={j} className={styles.heroEmoji}>
                {e}
              </span>
            ))}
          </div>
        </div>
      ))}

      <button
        type="button"
        className={cx(styles.heroArrow, styles.heroArrowLeft)}
        onClick={() => go(index - 1)}
        aria-label="Previous slide"
      >
        ‹
      </button>
      <button
        type="button"
        className={cx(styles.heroArrow, styles.heroArrowRight)}
        onClick={() => go(index + 1)}
        aria-label="Next slide"
      >
        ›
      </button>

      <div className={styles.heroDots} role="tablist" aria-label="Choose slide">
        {SLIDES.map((s, i) => (
          <button
            key={s.id}
            type="button"
            role="tab"
            aria-selected={i === index}
            aria-label={`Slide ${i + 1}`}
            className={cx(styles.heroDot, i === index && styles.heroDotActive)}
            onClick={() => go(i)}
          />
        ))}
      </div>
    </section>
  );
}
