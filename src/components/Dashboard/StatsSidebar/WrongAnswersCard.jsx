"use client";

import { AlertCircle, RotateCcw } from "lucide-react";
import styles from "./WrongAnswersCard.module.css";

export default function WrongAnswersCard({ wrongCount = 0, onStartPractice }) {
  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <AlertCircle size={18} />
        <h4>Réviser vos erreurs</h4>
      </div>

      <p className={styles.description}>
        Vous avez {wrongCount} question{wrongCount > 1 ? "s" : ""} à revoir.
      </p>

      <button
        className={styles.button}
        onClick={onStartPractice}
        disabled={wrongCount === 0}
      >
        <RotateCcw size={16} />
        Reprendre les erreurs
      </button>

      {wrongCount === 0 && <p className={styles.empty}>🎉 Aucune erreur ! Continuez comme ça.</p>}
    </div>
  );
}
