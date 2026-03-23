"use client";

import styles from "./QuestionGrid.module.css";

export default function QuestionGrid({ questions, answers, currentIndex, onJump }) {
  // ✅ Stats
  const attempted = answers.filter((a) => a !== undefined).length;
  const correct = answers.filter((a) => a === "correct").length;
  const incorrect = answers.filter((a) => a === "wrong").length;

  return (
    <div className={styles.wrapper}>
      {/* ✅ SCORE */}
      <div className={styles.scoreContainer}>
        <div className={styles.attempted}>Attempted {attempted}</div>

        <div className={styles.resultRow}>
          <span className={styles.correctText}>Correct {correct}</span>
          <span className={styles.incorrectText}>Incorrect {incorrect}</span>
        </div>
      </div>

      {/* ✅ GRID */}
      <div className={styles.gridContainer}>
        {questions.map((q, index) => {
          const status = answers[index];

          let boxClass = styles.box;

          if (status === "correct") boxClass += ` ${styles.correct}`;
          else if (status === "wrong") boxClass += ` ${styles.wrong}`;

          if (index === currentIndex) {
            boxClass += ` ${styles.current}`;
          }

          return (
            <div
              key={index}
              className={boxClass}
              onClick={() => onJump(index)} // ✅ CLICK BACK
            >
              {index + 1}
            </div>
          );
        })}
      </div>
    </div>
  );
}
