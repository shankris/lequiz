import { CheckCircle2, XCircle } from "lucide-react";
import styles from "./QuestionCard.module.css";

/**
 * Renders the main quiz question UI.
 * Handles display of question, options, feedback, and examples.
 */
export default function QuestionCard({ question, selectedOption, hasAnswered, onOptionClick, onNext, isLastQuestion }) {
  const examples = Array.isArray(question.similar) ? question.similar : [];

  return (
    <div className={styles.questionCard}>
      <div className={styles.questionSection}>
        <h2 className={styles.questionText}>{question.question}</h2>
        {question.translation && <p className={styles.translationText}>{question.translation}</p>}
      </div>

      <div className={styles.optionsGrid}>
        {question.options.map((opt, i) => {
          const isSelected = selectedOption === opt;
          const isCorrect = opt === question.answer;

          let btnClass = styles.btnOption;

          if (hasAnswered) {
            if (isCorrect) btnClass += ` ${styles.correct}`;
            else if (isSelected) btnClass += ` ${styles.wrong}`;
            else btnClass += ` ${styles.disabled}`;
          }

          return (
            <button
              key={i}
              className={btnClass}
              onClick={() => onOptionClick(opt)}
              disabled={hasAnswered}
            >
              <span>{opt}</span>
              {hasAnswered && isCorrect && <CheckCircle2 size={32} />}
              {hasAnswered && isSelected && !isCorrect && <XCircle size={32} />}
            </button>
          );
        })}
      </div>

      {hasAnswered && (
        <div className={styles.feedbackArea}>
          <p className={styles.explanation}>{question.explanation}</p>

          {question.complete_answer && (
            <div
              className={styles.sentenceText}
              dangerouslySetInnerHTML={{
                __html: question.complete_answer,
              }}
            />
          )}

          {examples.map((ex, i) => (
            <div key={i}>
              <span dangerouslySetInnerHTML={{ __html: ex.french }} /> - {ex.english}
            </div>
          ))}

          <button
            onClick={onNext}
            className={styles.nextBtn}
          >
            {isLastQuestion ? "Voir les résultats" : "Continuer"}
          </button>
        </div>
      )}
    </div>
  );
}
