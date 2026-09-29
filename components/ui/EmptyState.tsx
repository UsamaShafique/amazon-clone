import type { ReactNode } from "react";
import styles from "./ui.module.css";

interface EmptyStateProps {
  emoji: string;
  title: string;
  body?: string;
  action?: ReactNode;
}

export function EmptyState({ emoji, title, body, action }: EmptyStateProps) {
  return (
    <div className={styles.empty}>
      <div className={styles.emptyEmoji} aria-hidden="true">
        {emoji}
      </div>
      <h2 className={styles.emptyTitle}>{title}</h2>
      {body && <p className={styles.emptyBody}>{body}</p>}
      {action && <div className={styles.emptyAction}>{action}</div>}
    </div>
  );
}
