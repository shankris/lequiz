/**
 * Handles LocalStorage operations for quiz question tracking.
 * Stores and retrieves IDs of questions already used to avoid repetition.
 * Ensures persistence across sessions in the quiz app.
 */
export const getUsedQuestionIds = () => {
  if (typeof window === "undefined") return [];
  const used = localStorage.getItem("usedQuestionIds");
  return used ? JSON.parse(used) : [];
};

export const setUsedQuestionIds = (ids) => {
  if (typeof window === "undefined") return;
  localStorage.setItem("usedQuestionIds", JSON.stringify(ids));
};
