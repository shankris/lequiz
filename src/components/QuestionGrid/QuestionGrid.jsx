"use client";

import styles from "./QuestionGrid.module.css";

export default function QuestionGrid({ questions, answers, currentIndex, onJump }) {
  return (
    <div className={styles.gridContainer}>
      {questions.map((q, index) => {
        const status = answers[index]; // correct | wrong | undefined

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
            onClick={() => onJump(index)}
          >
            {index + 1}
          </div>
        );
      })}
    </div>
  );
}
