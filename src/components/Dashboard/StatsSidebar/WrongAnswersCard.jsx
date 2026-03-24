"use client";

import { CircleCheckBig, RotateCcw } from "lucide-react";
import styles from "./WrongAnswersCard.module.css";

export default function WrongAnswersCard({ wrongCount = 0, onStartPractice }) {
  // ✅ Cap display at 40+
  const displayCount = wrongCount > 40 ? "40+" : wrongCount;

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div className={`${styles.iconBox}`}>
          <CircleCheckBig size={20} />
          <span className={styles.statLabel}>Corriger mes fautes</span>
        </div>

        <div className={styles.statText}>
          <span className={styles.statValue}>{displayCount}</span>
        </div>
      </div>
    </div>
  );
}
