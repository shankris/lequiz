/**
 * Processes raw quiz data into usable questions for the quiz app.
 * Filters by level, removes previously used questions, and normalizes structure.
 * Resets used questions when all have been exhausted.
 */
export function prepareQuestions(questionsArray, usedIds, level = "A1") {
  let normalizedQuestions = questionsArray
    .filter((q) => q.Level === level)
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

  let resetUsedIds = false;

  // ✅ Reset if all questions used
  if (normalizedQuestions.length === 0) {
    normalizedQuestions = questionsArray
      .filter((q) => q.Level === level)
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

    resetUsedIds = true;
  }

  return { normalizedQuestions, resetUsedIds };
}
