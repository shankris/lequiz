/**
 * Manages quiz statistics and user progress using LocalStorage.
 */

const KEY = "quiz_stats";
const LEVEL = "A1";

// ✅ Get LOCAL date (fixes timezone bug)
function getLocalDate() {
  const now = new Date();
  return now.getFullYear() + "-" + String(now.getMonth() + 1).padStart(2, "0") + "-" + String(now.getDate()).padStart(2, "0");
}

export function updateStats({ score, totalQuestions, questions, answers, sectionId, quizName }) {
  const stored = localStorage.getItem(KEY);
  const parsed = stored ? JSON.parse(stored) : {};

  // ✅ Init level
  if (!parsed[LEVEL]) {
    parsed[LEVEL] = {
      testsTaken: 0,
      totalQuestions: 0,
      correctAnswers: 0,
      activity: {},
      wrongAnswers: [],
      streak: 0,
    };
  }

  const stats = parsed[LEVEL];

  // =========================
  // 📊 Overall Stats
  // =========================
  stats.testsTaken += 1;
  stats.totalQuestions += totalQuestions;
  stats.correctAnswers += score;

  // =========================
  // 📅 Daily Activity
  // =========================
  const today = getLocalDate();

  if (!stats.activity[today]) {
    stats.activity[today] = {
      quizzes: 0,
      correct: 0,
      total: 0,
      wrong: 0,
      quizzesList: [],
    };
  }

  const dayData = stats.activity[today];

  // ✅ Count attempts
  dayData.quizzes += 1;
  dayData.correct += score;
  dayData.total += totalQuestions;
  dayData.wrong += totalQuestions - score;

  // ✅ Store quiz result (🔥 improved structure)
  dayData.quizzesList.push({
    name: quizName || sectionId || "Quiz",
    sectionId, // 🔥 critical for mapping
    correct: score,
    total: totalQuestions, // 🔥 future-proof
    timestamp: Date.now(),
  });

  // =========================
  // ❌ Wrong Answers
  // =========================
  questions.forEach((q, index) => {
    const result = answers[index];

    let existing = stats.wrongAnswers.find((w) => w.id === q.id);

    if (result === "wrong") {
      if (!existing) {
        stats.wrongAnswers.push({
          id: q.id,
          section: sectionId,
          wrongDate: today,
          correctDates: [],
        });
      } else {
        // ✅ overwrite latest wrong date
        existing.wrongDate = today;

        // 🔥 RESET progress (important)
        existing.correctDates = [];
      }
    }

    if (result === "correct" && existing) {
      if (!existing.correctDates.includes(today)) {
        existing.correctDates.push(today);
      }
    }

    if (result === "correct" && existing) {
      if (!existing.correctDates.includes(today)) {
        existing.correctDates.push(today);
      }
    }
  });

  // =========================
  // 🔥 Streak Calculation
  // =========================
  const activityDates = Object.keys(stats.activity);
  const activitySet = new Set(activityDates);

  let streak = 0;
  let currentDate = new Date();

  if (!activitySet.has(today)) {
    currentDate.setDate(currentDate.getDate() - 1);
  }

  while (true) {
    const dateStr = currentDate.getFullYear() + "-" + String(currentDate.getMonth() + 1).padStart(2, "0") + "-" + String(currentDate.getDate()).padStart(2, "0");

    if (activitySet.has(dateStr)) {
      streak++;
      currentDate.setDate(currentDate.getDate() - 1);
    } else {
      break;
    }
  }

  stats.streak = streak;

  // =========================
  // 💾 Save
  // =========================
  localStorage.setItem(KEY, JSON.stringify(parsed));
}
