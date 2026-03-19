"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useSession, signIn } from "next-auth/react";
import { ArrowLeft, CheckCircle2, XCircle, Trophy, RotateCcw, Lock } from "lucide-react";

import QuestionGrid from "@/components/QuestionGrid/QuestionGrid";

import styles from "./page.module.css";

export default function QuizPage() {
  const { sectionId } = useParams();
  const router = useRouter();
  const { data: session, status } = useSession();

  const [currentQuestions, setCurrentQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const [selectedOption, setSelectedOption] = useState(null);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  const [answers, setAnswers] = useState([]);

  const handleJump = (index) => {
    setCurrentIndex(index);
    setHasAnswered(false);
    setSelectedOption(null);
  };

  useEffect(() => {
    if (status === "authenticated") {
      async function fetchQuizData() {
        try {
          setLoading(true);
          const data = await import(`@/data/${sectionId}.json`);

          if (data && data.default.questions) {
            // ✅ Normalize new JSON format → old UI format
            const normalizedQuestions = data.default.questions
              .filter((q) => q.Level === "A1")
              .map((q) => ({
                id: q.id,
                question: q.Question,
                options: [q.options1, q.options2, q.options3, q.options4],
                answer: q.answer,
                explanation: `${q.tips || ""} ${q.grammar_rule || ""} ${q.exception || ""}`,
                translation: q.english_translation,
                complete_answer: q.complete_answer,
                similar_examples: q.similar_examples,
              }));

            // Shuffle + limit
            const shuffled = [...normalizedQuestions].sort(() => Math.random() - 0.5).slice(0, 20);

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

  if (status === "loading" || (status === "authenticated" && loading)) {
    return <div className={styles.status}>Chargement du quiz...</div>;
  }

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
            Veuillez vous connecter pour accéder aux exercices.
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

        <QuestionGrid
          questions={currentQuestions}
          answers={answers}
          currentIndex={currentIndex}
          onJump={handleJump}
        />
      </div>
    );
  }

  if (error || currentQuestions.length === 0) {
    return <div className={styles.status}>Aucune question A1 trouvée dans cette section.</div>;
  }

  const currentQ = currentQuestions[currentIndex];

  const handleOptionClick = (option) => {
    if (hasAnswered) return;

    setSelectedOption(option);
    setHasAnswered(true);

    const isCorrect = option === currentQ.answer;

    if (isCorrect) {
      setScore((prev) => prev + 1);
    }

    setAnswers((prev) => {
      const updated = [...prev];
      updated[currentIndex] = isCorrect ? "correct" : "wrong";
      return updated;
    });
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
            style={{
              width: `${((currentIndex + 1) / currentQuestions.length) * 100}%`,
            }}
          />
        </div>
      </div>

      <div className={styles.questionCard}>
        <p className={styles.instruction}>Choisissez la bonne réponse :</p>

        <div className={styles.questionSection}>
          <h2 className={styles.questionText}>{currentQ.question}</h2>

          {currentQ.translation && <p className={styles.translationText}>{currentQ.translation}</p>}
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

                {hasAnswered && isCorrect && <CheckCircle2 size={32} />}
                {hasAnswered && isSelected && !isCorrect && <XCircle size={32} />}
              </button>
            );
          })}
        </div>

        {hasAnswered && (
          <div className={styles.feedbackArea}>
            {/* Explanation */}
            <p className={styles.explanation}>{currentQ.explanation}</p>

            {/* Correct Answer */}
            {currentQ.complete_answer && (
              <div
                className={styles.sentenceText}
                dangerouslySetInnerHTML={{
                  __html: currentQ.complete_answer,
                }}
              />
            )}

            {/* Similar Examples */}
            {currentQ.similar_examples && (
              <div className={styles.examples}>
                {JSON.parse(currentQ.similar_examples).map((ex, i) => (
                  <div key={i}>
                    <span
                      dangerouslySetInnerHTML={{
                        __html: ex.french,
                      }}
                    />{" "}
                    - {ex.english}
                  </div>
                ))}
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
