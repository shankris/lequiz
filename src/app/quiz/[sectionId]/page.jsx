"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { ArrowLeft, CheckCircle2, XCircle, Trophy, RotateCcw } from "lucide-react";
import styles from "./page.module.css";

export default function QuizPage() {
  const { sectionId } = useParams();
  const router = useRouter();

  const [currentQuestions, setCurrentQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const [selectedOption, setSelectedOption] = useState(null);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  useEffect(() => {
    async function fetchQuizData() {
      try {
        setLoading(true);
        const data = await import(`@/data/a1/${sectionId}.json`);

        if (data && data.default.questions) {
          // --- SHUFFLE & SLICE LOGIC ---
          const shuffled = [...data.default.questions]
            .sort(() => Math.random() - 0.5) // Randomize order
            .slice(0, 20); // Pick only the first 20

          setCurrentQuestions(shuffled);
        }
      } catch (err) {
        console.error("Could not find quiz file:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    }
    if (sectionId) fetchQuizData();
  }, [sectionId]);

  const handleOptionClick = (option) => {
    if (hasAnswered) return;
    setSelectedOption(option);
    setHasAnswered(true);
    if (option === currentQuestions[currentIndex].answer) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < currentQuestions.length - 1) {
      setHasAnswered(false);
      setSelectedOption(null);
      setCurrentIndex((prev) => prev + 1);
    } else {
      setQuizFinished(true);
    }
  };

  if (loading) return <div className={styles.status}>Chargement du quiz...</div>;
  if (error || currentQuestions.length === 0) return <div className={styles.status}>Quiz non trouvé.</div>;

  // --- RESULT SCREEN ---
  if (quizFinished) {
    const percentage = Math.round((score / currentQuestions.length) * 100);
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
            <span className={styles.scoreSmall}>/ {currentQuestions.length}</span>
          </div>
          <p className={styles.explanation}>{percentage}% de réussite</p>

          <button
            onClick={() => window.location.reload()}
            className={styles.nextBtn}
            style={{ marginBottom: "10px" }}
          >
            <RotateCcw
              size={18}
              style={{ marginRight: "8px" }}
            />{" "}
            Réessayer
          </button>
          <button
            onClick={() => router.push("/")}
            className={styles.backBtn}
            style={{ margin: "0 auto" }}
          >
            Retour au Dashboard
          </button>
        </div>
      </div>
    );
  }

  const currentQ = currentQuestions[currentIndex];

  return (
    <div className={styles.quizContainer}>
      <button
        onClick={() => router.push("/")}
        className={styles.backBtn}
      >
        <ArrowLeft size={18} /> Dashboard
      </button>

      <div className={styles.progress}>
        <div className={styles.progressText}>
          <span>
            Question {currentIndex + 1} / {currentQuestions.length}
          </span>
          <span>Score: {score}</span>
        </div>
        <div className={styles.progressBarBg}>
          <div
            className={styles.progressFill}
            style={{ width: `${((currentIndex + 1) / currentQuestions.length) * 100}%` }}
          />
        </div>
      </div>

      <div className={styles.questionCard}>
        <p className={styles.instruction}>Choisissez l'article correct pour :</p>

        <div className={styles.questionSection}>
          <h2 className={styles.questionText}>{currentQ.question}</h2>
          <div className={styles.translate}>{currentQ.translation && <span className={styles.translationText}>{currentQ.translation}</span>}</div>{" "}
        </div>
        <div className={styles.optionsGrid}>
          {currentQ.options.map((opt, i) => {
            const isSelected = selectedOption === opt;
            const isCorrect = opt === currentQ.answer;

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
                onClick={() => handleOptionClick(opt)}
                disabled={hasAnswered}
              >
                <span>{opt}</span>
                {hasAnswered && isCorrect && <CheckCircle2 size={18} />}
                {hasAnswered && isSelected && !isCorrect && <XCircle size={18} />}
              </button>
            );
          })}
        </div>

        {hasAnswered && (
          <div className={styles.feedbackArea}>
            <p className={styles.explanation}>{currentQ.explanation}</p>

            <button
              onClick={handleNext}
              className={styles.nextBtn}
            >
              {currentIndex === currentQuestions.length - 1 ? "Voir les résultats" : "Continuer"}
            </button>

            {currentQ.sentence && (
              <div className={styles.sentenceContainer}>
                <span className={styles.exampleLabel}>Exemple :</span>
                <p className={styles.sentenceText}>{currentQ.sentence}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
