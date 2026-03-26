import { Trophy, RotateCcw } from "lucide-react";
import styles from "@/app/quiz/[sectionId]/page.module.css";

/**
 * Displays the final quiz results screen.
 * Shows score, percentage, and allows user to retry the quiz.
 */
export default function QuizFinished({ score, total, onRetry }) {
  const percentage = Math.round((score / total) * 100);

  return (
    <div className={styles.quizContainer}>
      <div
        className={styles.questionCard}
        style={{ textAlign: "center" }}
      >
        <Trophy
          size={64}
          className={styles.trophyIcon}
        />
        <h2 className={styles.questionText}>Quiz Terminé !</h2>

        <div className={styles.scoreCircle}>
          <span className={styles.scoreBig}>{score}</span>
          <span className={styles.scoreSmall}>/ {total}</span>
        </div>

        <p className={styles.explanation}>{percentage}% de réussite</p>

        <button
          onClick={onRetry}
          className={styles.nextBtn}
        >
          <RotateCcw
            size={18}
            style={{ marginRight: "8px" }}
          />
          Réessayer
        </button>
      </div>
    </div>
  );
}
