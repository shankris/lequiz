const KEY = "quiz_stats";
const LEVEL = "A1";

// ✅ Get LOCAL date (fixes timezone bug)
function getLocalDate() {
  const now = new Date();
  return now.getFullYear() + "-" + String(now.getMonth() + 1).padStart(2, "0") + "-" + String(now.getDate()).padStart(2, "0");
}

export function updateStats({ score, totalQuestions, questions, answers, sectionId }) {
  const stored = localStorage.getItem(KEY);
  const parsed = stored ? JSON.parse(stored) : {};

  // ✅ Initialize level if not present
  if (!parsed[LEVEL]) {
    parsed[LEVEL] = {
      testsTaken: 0,
      totalQuestions: 0,
      correctAnswers: 0,
      activity: {}, // { "2026-03-22": { quizzes, correct, total, wrong } }
      wrongAnswers: [],
      streak: 0,
    };
  }

  const stats = parsed[LEVEL];

  // 🛠 Fix old/broken activity structure
  if (!stats.activity || Array.isArray(stats.activity)) {
    stats.activity = {};
  }

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
    };
  }

  stats.activity[today].quizzes += 1;
  stats.activity[today].correct += score;
  stats.activity[today].total += totalQuestions;
  stats.activity[today].wrong += totalQuestions - score;

  // =========================
  // ❌ Wrong Answers (Spaced Repetition Ready)
  // =========================
  questions.forEach((q, index) => {
    const result = answers[index];
    const today = getLocalDate();

    let existing = stats.wrongAnswers.find((w) => w.id === q.id);

    // ❌ If WRONG → add if not exists
    if (result === "wrong") {
      if (!existing) {
        stats.wrongAnswers.push({
          id: q.id,
          question: q.question,
          section: sectionId,
          correctDates: [], // for future spaced repetition
        });
      }
    }

    // ✅ If CORRECT → track spaced learning (future use)
    if (result === "correct" && existing) {
      if (!existing.correctDates.includes(today)) {
        existing.correctDates.push(today);
      }

      // 🔒 NOTE:
      // We are NOT removing yet (as per your decision)
      // Future:
      // if (existing.correctDates.length >= 3) remove
    }
  });

  function getLocalDateFromDate(date) {
    return date.getFullYear() + "-" + String(date.getMonth() + 1).padStart(2, "0") + "-" + String(date.getDate()).padStart(2, "0");
  }

  // =========================
  // 🔥 Streak Calculation (LOCAL SAFE)
  // =========================
  const activitySet = new Set(Object.keys(stats.activity));

  let streak = 0;
  let currentDate = new Date();

  const todayStr = getLocalDate();

  // Start from yesterday if today has no activity
  if (!activitySet.has(todayStr)) {
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
