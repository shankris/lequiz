"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useSession, signIn } from "next-auth/react"; // Import hooks
import { ArrowLeft, CheckCircle2, XCircle, Trophy, RotateCcw, Lock } from "lucide-react";
import styles from "./page.module.css";

export default function QuizPage() {
  const { sectionId } = useParams();
  const router = useRouter();
  const { data: session, status } = useSession(); // Access auth state

  console.log("Current User Session:", session);

  const [currentQuestions, setCurrentQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const [selectedOption, setSelectedOption] = useState(null);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  useEffect(() => {
    // Only fetch data if the user is authenticated
    if (status === "authenticated") {
      async function fetchQuizData() {
        try {
          setLoading(true);
          const data = await import(`@/data/a1/${sectionId}.json`);

          if (data && data.default.questions) {
            const shuffled = [...data.default.questions].sort(() => Math.random() - 0.5).slice(0, 20);
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
    }
  }, [sectionId, status]);

  // --- LOADING STATE ---
  if (status === "loading" || (status === "authenticated" && loading)) {
    return <div className={styles.status}>Chargement du quiz...</div>;
  }

  // --- UNAUTHENTICATED STATE (The Login Gate) ---
  if (status === "unauthenticated") {
    return (
      <div className={styles.quizContainer}>
        <div
          className={styles.questionCard}
          style={{ textAlign: "center", padding: "40px" }}
        >
          <Lock
            size={48}
            style={{ margin: "0 auto 20px", color: "#666" }}
          />
          <h2 className={styles.questionText}>Contenu Protégé</h2>
          <p
            className={styles.explanation}
            style={{ marginBottom: "20px" }}
          >
            Veuillez vous connecter pour accéder aux exercices et enregistrer votre progression.
          </p>
          <button
            onClick={() => signIn("github")}
            className={styles.nextBtn}
          >
            Se connecter avec GitHub
          </button>
          <button
            onClick={() => router.push("/")}
            className={styles.backBtn}
            style={{ marginTop: "20px" }}
          >
            Retour au Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (error || (status === "authenticated" && currentQuestions.length === 0)) {
    return <div className={styles.status}>Quiz non trouvé.</div>;
  }

  const currentQ = currentQuestions[currentIndex];

  const getOptionText = (opt) => (typeof opt === "object" ? opt.text : opt);

  const handleOptionClick = (option) => {
    if (hasAnswered) return;
    setSelectedOption(option);
    setHasAnswered(true);

    const optionText = getOptionText(option);
    if (optionText === currentQ.answer) {
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
          <p style={{ fontSize: "0.9rem", color: "#666", marginBottom: "20px" }}>Bravo {session?.user?.name} !</p>
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

  // --- QUIZ ACTIVE SCREEN ---
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
        <p className={styles.instruction}>Choisissez la bonne réponse :</p>

        <div className={styles.questionSection}>
          <h2 className={styles.questionText}>{currentQ.question}</h2>
          <div className={styles.translate}>{currentQ.translation && <span className={styles.translationText}>{currentQ.translation}</span>}</div>
        </div>

        <div className={styles.optionsGrid}>
          {currentQ.options.map((opt, i) => {
            const optText = getOptionText(opt);
            const isSelected = selectedOption === opt;
            const isCorrect = optText === currentQ.answer;

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
                <span>{optText}</span>
                {hasAnswered && isCorrect && <CheckCircle2 size={18} />}
                {hasAnswered && isSelected && !isCorrect && <XCircle size={18} />}
              </button>
            );
          })}
        </div>

        {hasAnswered && (
          <div className={styles.feedbackArea}>
            {selectedOption?.rationale && (
              <div className={styles.rationaleBox}>
                <p className={styles.rationaleText}>
                  <strong>Note :</strong> {selectedOption.rationale}
                </p>
              </div>
            )}

            <p className={styles.explanation}>{currentQ.explanation}</p>

            {currentQ.sentence && (
              <div className={styles.sentenceContainer}>
                <span className={styles.exampleLabel}>Exemple :</span>
                <p className={styles.sentenceText}>{currentQ.sentence}</p>
              </div>
            )}

            <button
              onClick={handleNext}
              className={styles.nextBtn}
            >
              {currentIndex === currentQuestions.length - 1 ? "Voir les résultats" : "Continuer"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
