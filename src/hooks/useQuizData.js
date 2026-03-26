import { useEffect, useState } from "react";
import { getUsedQuestionIds, setUsedQuestionIds } from "@/utils/quizStorage";
import { prepareQuestions } from "@/utils/quizHelpers";

/**
 * Custom hook to load and prepare quiz data.
 * Handles fetching JSON, filtering questions, shuffling, and tracking used questions.
 * Returns quiz state including questions, loading, error, and metadata.
 */
export function useQuizData(sectionId) {
  const [currentQuestions, setCurrentQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [quizMeta, setQuizMeta] = useState({ title: "", instruction: "" });

  useEffect(() => {
    async function fetchQuizData() {
      try {
        setLoading(true);

        const data = await import(`@/data/${sectionId}.json`);
        let questionsArray = [];

        if (data.default && data.default.questions) {
          questionsArray = data.default.questions;
          setQuizMeta({
            title: data.default.meta?.title || "",
            instruction: data.default.meta?.instruction || "",
          });
        } else {
          questionsArray = Array.isArray(data.default) ? data.default : [];
          setQuizMeta({ title: "", instruction: "" });
        }

        if (questionsArray.length === 0) {
          setError(true);
          return;
        }

        let usedIds = getUsedQuestionIds();

        const { normalizedQuestions, resetUsedIds } = prepareQuestions(questionsArray, usedIds, "A1");

        if (resetUsedIds) {
          localStorage.removeItem("usedQuestionIds");
          usedIds = [];
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

  return { currentQuestions, loading, error, quizMeta };
}
