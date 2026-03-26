import { useEffect, useState } from "react";
import { updateStats } from "@/utils/statsService";

/**
 * Handles saving quiz results, progress, activity tracking, and streak updates.
 * Runs when quiz is finished and ensures stats are saved only once.
 */
export function useQuizStats({ quizFinished, currentQuestions, score, answers, sectionId, quizMeta }) {
  const [statsSaved, setStatsSaved] = useState(false);

  useEffect(() => {
    if (quizFinished && !statsSaved && currentQuestions.length > 0) {
      updateStats({
        score,
        totalQuestions: currentQuestions.length,
        questions: currentQuestions,
        answers,
        sectionId,
        quizName: quizMeta?.title,
      });

      if (typeof window !== "undefined") {
        // ---------------- PROGRESS ----------------
        const progress = JSON.parse(localStorage.getItem("quizProgress") || "{}");

        const existingScore = progress[sectionId];

        if (!existingScore || score > existingScore) {
          progress[sectionId] = score;
        }

        localStorage.setItem("quizProgress", JSON.stringify(progress));

        // ---------------- ACTIVITY ----------------
        const today = new Date();
        const todayStr = today.getFullYear() + "-" + String(today.getMonth() + 1).padStart(2, "0") + "-" + String(today.getDate()).padStart(2, "0");

        const activity = JSON.parse(localStorage.getItem("activityData") || "{}");

        const quizName = quizMeta?.title || sectionId || "Quiz";

        if (!activity[todayStr]) {
          activity[todayStr] = {
            count: 0,
            quizzes: [],
          };
        }

        activity[todayStr].count += 1;
        activity[todayStr].quizzes.push(quizName);

        localStorage.setItem("activityData", JSON.stringify(activity));

        // ---------------- EVENTS ----------------
        window.dispatchEvent(new Event("progressUpdated"));
        window.dispatchEvent(new Event("statsUpdated"));
        window.dispatchEvent(new Event("activityUpdated"));
      }

      setStatsSaved(true);
    }
  }, [quizFinished, statsSaved, currentQuestions, score, answers, sectionId, quizMeta]);
}
