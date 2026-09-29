"use client";

import { useEffect, useState } from "react";
import styles from "./Header.module.css";
import { readJSON, writeJSON } from "@/lib/storage";
import { cx } from "@/lib/utils";

const LANGUAGES = [
  { code: "EN", label: "English" },
  { code: "ES", label: "Español" },
  { code: "DE", label: "Deutsch" },
  { code: "UR", label: "اردو" },
];

const KEY = "shopora.lang";

export function LanguageMenu() {
  const [lang, setLang] = useState("EN");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setLang(readJSON<string>(KEY, "EN"));
  }, []);

  return (
    <div
      className={cx(styles.menuHover, styles.langMenu)}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        className={styles.headerAction}
        aria-haspopup="true"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <span className={styles.actionLine2}>
          <span aria-hidden="true">🌐</span> {lang}{" "}
          <span className={styles.caret} aria-hidden="true" />
        </span>
      </button>
      {open && (
        <div className={cx(styles.dropdown, styles.dropdownNarrow)}>
          <p className={styles.langNote}>
            Display language (demo — content stays in English)
          </p>
          <ul className={styles.dropdownList} role="listbox" aria-label="Language">
            {LANGUAGES.map((l) => (
              <li key={l.code}>
                <button
                  type="button"
                  role="option"
                  aria-selected={l.code === lang}
                  className={cx(styles.langOption, l.code === lang && styles.langActive)}
                  onClick={() => {
                    setLang(l.code);
                    writeJSON(KEY, l.code);
                    setOpen(false);
                  }}
                >
                  <span className={styles.langRadio} aria-hidden="true" />
                  {l.label} — {l.code}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
