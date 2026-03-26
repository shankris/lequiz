const KEY = "quiz_stats";
const LEVEL = "A1";

// ✅ Get LOCAL date (fixes timezone bug)
function getLocalDate() {
  const now = new Date();
  return now.getFullYear() + "-" + String(now.getMonth() + 1).padStart(2, "0") + "-" + String(now.getDate()).padStart(2, "0");
}

export function updateStats({
  score,
  totalQuestions,
  questions,
  answers,
  sectionId,
  quizName, // ✅ NEW (optional)
}) {
  const stored = localStorage.getItem(KEY);
  const parsed = stored ? JSON.parse(stored) : {};

  // ✅ Initialize level if not present
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
      quizzesList: [], // ✅ NEW
    };
  }

  const dayData = stats.activity[today];

  // 🛠 Backward compatibility (old data fix)
  if (!Array.isArray(dayData.quizzesList)) {
    dayData.quizzesList = [];
  }

  // ✅ Count attempts
  dayData.quizzes += 1;
  dayData.correct += score;
  dayData.total += totalQuestions;
  dayData.wrong += totalQuestions - score;

  // ✅ Store quiz name (duplicates allowed = multiple attempts)
  const name = quizName || sectionId || "Quiz";
  dayData.quizzesList.push(name);

  // =========================
  // ❌ Wrong Answers
  // =========================
  questions.forEach((q, index) => {
    const result = answers[index];
    const today = getLocalDate();

    let existing = stats.wrongAnswers.find((w) => w.id === q.id);

    if (result === "wrong") {
      if (!existing) {
        stats.wrongAnswers.push({
          id: q.id,
          question: q.question,
          section: sectionId,
          correctDates: [],
        });
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
  const activitySet = new Set(Object.keys(stats.activity));

  let streak = 0;
  let currentDate = new Date();
  const todayStr = getLocalDate();

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
