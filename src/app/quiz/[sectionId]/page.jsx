"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { ArrowLeft, CheckCircle2, XCircle, Trophy, RotateCcw } from "lucide-react";

import QuestionGrid from "@/components/QuestionGrid/QuestionGrid";
import { prepareQuestions } from "@/utils/quizHelpers";
import { useQuizData } from "@/hooks/useQuizData";
import QuizFinished from "@/components/Quiz/QuizFinished";
import QuestionCard from "@/components/Quiz/QuestionCard";
import { useQuizStats } from "@/hooks/useQuizStats";

import { updateStats } from "@/utils/statsService";
import styles from "./page.module.css";

export default function QuizPage() {
  const { sectionId } = useParams();
  const router = useRouter();

  const [currentIndex, setCurrentIndex] = useState(0);

  const [selectedOption, setSelectedOption] = useState(null);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  const [answers, setAnswers] = useState([]);

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

  const { currentQuestions, loading, error, quizMeta } = useQuizData(sectionId);

  // ----------------- Save stats, activity, and progress -----------------
  useQuizStats({
    quizFinished,
    currentQuestions,
    score,
    answers,
    sectionId,
    quizMeta,
  });

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

  if (quizFinished) {
    return (
      <QuizFinished
        score={score}
        total={currentQuestions.length}
        onRetry={() => window.location.reload()}
      />
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

        {/* Quiz Title */}
        {quizMeta.title && <h1 className={styles.quizTitle}>{quizMeta.title}</h1>}
        {quizMeta.instruction && <p className={styles.instruction}>{quizMeta.instruction}</p>}

        <QuestionCard
          question={currentQ}
          selectedOption={selectedOption}
          hasAnswered={hasAnswered}
          onOptionClick={handleOptionClick}
          onNext={handleNext}
          isLastQuestion={currentIndex === currentQuestions.length - 1}
        />
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
