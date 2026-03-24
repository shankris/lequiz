"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { ArrowLeft, CheckCircle2, XCircle, Trophy, RotateCcw } from "lucide-react";

import QuestionGrid from "@/components/QuestionGrid/QuestionGrid";
import { updateStats } from "@/utils/statsService";
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

  const [answers, setAnswers] = useState([]);
  const [statsSaved, setStatsSaved] = useState(false);

  // ----------------- LocalStorage helpers -----------------
  const getUsedQuestionIds = () => {
    if (typeof window === "undefined") return [];
    const used = localStorage.getItem("usedQuestionIds");
    return used ? JSON.parse(used) : [];
  };

  const setUsedQuestionIds = (ids) => {
    if (typeof window === "undefined") return;
    localStorage.setItem("usedQuestionIds", JSON.stringify(ids));
  };
  // -------------------------------------------------------

  const handleJump = (index) => {
    setCurrentIndex(index);
    setSelectedOption(null);
    setHasAnswered(answers[index] !== undefined);
  };

  // ----------------- Load quiz data -----------------
  useEffect(() => {
    async function fetchQuizData() {
      try {
        setLoading(true);

        const data = await import(`@/data/${sectionId}.json`);
        let questionsArray = [];

        if (data.default && Array.isArray(data.default)) questionsArray = data.default;
        else if (data.default && data.default.questions) questionsArray = data.default.questions;
        else if (Array.isArray(data)) questionsArray = data;

        if (questionsArray.length === 0) {
          setError(true);
          return;
        }

        let usedIds = getUsedQuestionIds();

        let normalizedQuestions = questionsArray
          .filter((q) => q.Level === "A1")
          .filter((q) => !usedIds.includes(q.id))
          .map((q) => ({
            id: q.id,
            question: q.Q,
            options: [q.opt1, q.opt2, q.opt3, q.opt4],
            answer: q.ans,
            explanation: `${q.tips || ""} ${q.grammar_rule || ""} ${q.exception || ""}`,
            translation: q.eng,
            complete_answer: q.compAns,
            similar: q.similar,
          }));

        if (normalizedQuestions.length === 0) {
          // Reset if all questions used
          localStorage.removeItem("usedQuestionIds");
          usedIds = [];
          normalizedQuestions = questionsArray
            .filter((q) => q.Level === "A1")
            .map((q) => ({
              id: q.id,
              question: q.Q,
              options: [q.opt1, q.opt2, q.opt3, q.opt4],
              answer: q.ans,
              explanation: `${q.tips || ""} ${q.grammar_rule || ""} ${q.exception || ""}`,
              translation: q.eng,
              complete_answer: q.compAns,
              similar: q.similar,
            }));
        }

        const shuffled = [...normalizedQuestions].sort(() => Math.random() - 0.5).slice(0, 20);
        setUsedQuestionIds([...usedIds, ...shuffled.map((q) => q.id)]);
        setCurrentQuestions(shuffled);
      } catch (err) {
        console.error("Could not find quiz file:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    }

    if (sectionId) fetchQuizData();
  }, [sectionId]);

  // ----------------- Save stats, activity, and progress -----------------
  useEffect(() => {
    if (quizFinished && !statsSaved && currentQuestions.length > 0) {
      updateStats({
        score,
        totalQuestions: currentQuestions.length,
        questions: currentQuestions,
        answers,
        sectionId,
      });

      if (typeof window !== "undefined") {
        // ---------------- ACTIVITY ----------------
        const todayStr = new Date().toISOString().split("T")[0];
        const activity = JSON.parse(localStorage.getItem("activityData") || "{}");
        activity[todayStr] = true;
        localStorage.setItem("activityData", JSON.stringify(activity));

        // ---------------- PROGRESS (NEW) ----------------
        const progress = JSON.parse(localStorage.getItem("quizProgress") || "{}");

        const existingScore = progress[sectionId];

        // ✅ Keep BEST score only
        if (!existingScore || score > existingScore) {
          progress[sectionId] = score;
        }

        localStorage.setItem("quizProgress", JSON.stringify(progress));

        // ---------------- NOTIFY UI ----------------
        window.dispatchEvent(new Event("activityUpdated"));
        window.dispatchEvent(new Event("progressUpdated")); // ✅ IMPORTANT
      }

      setStatsSaved(true);
    }
  }, [quizFinished, statsSaved, currentQuestions, score, answers, sectionId]);

  // ----------------- Loading / Error -----------------
  if (loading) return <div className={styles.status}>Chargement du quiz...</div>;
  if (error || currentQuestions.length === 0) return <div className={styles.status}>Aucune question A1 trouvée pour cette section.</div>;

  const currentQ = currentQuestions[currentIndex];

  // ----------------- Answer handling -----------------
  const handleOptionClick = (option) => {
    if (hasAnswered) return;

    setSelectedOption(option);
    setHasAnswered(true);

    const isCorrect = option === currentQ.answer;
    if (isCorrect) setScore((prev) => prev + 1);

    setAnswers((prev) => {
      const updated = [...prev];
      updated[currentIndex] = isCorrect ? "correct" : "wrong";
      return updated;
    });
  };

  const handleNext = () => {
    const total = currentQuestions.length;
    for (let i = currentIndex + 1; i < total; i++) {
      if (answers[i] === undefined) {
        setCurrentIndex(i);
        setHasAnswered(false);
        setSelectedOption(null);
        return;
      }
    }
    for (let i = 0; i < currentIndex; i++) {
      if (answers[i] === undefined) {
        setCurrentIndex(i);
        setHasAnswered(false);
        setSelectedOption(null);
        return;
      }
    }
    setQuizFinished(true);
  };

  const examples = Array.isArray(currentQ.similar) ? currentQ.similar : [];

  // ----------------- Quiz finished screen -----------------
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

  // ----------------- Main Quiz UI -----------------
  return (
    <div className={styles.quizLayout}>
      <div className={styles.quizContainer}>
        <button
          onClick={() => router.push("/")}
          className={styles.backBtn}
        >
          <ArrowLeft size={18} /> Dashboard
        </button>

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
              <p className={styles.explanation}>{currentQ.explanation}</p>
              {currentQ.complete_answer && (
                <div
                  className={styles.sentenceText}
                  dangerouslySetInnerHTML={{ __html: currentQ.complete_answer }}
                />
              )}

              {examples.map((ex, i) => (
                <div key={i}>
                  <span dangerouslySetInnerHTML={{ __html: ex.french }} /> - {ex.english}
                </div>
              ))}

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

      <QuestionGrid
        questions={currentQuestions}
        answers={answers}
        currentIndex={currentIndex}
        onJump={handleJump}
      />
    </div>
  );
}
