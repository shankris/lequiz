"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

import UserProfileCard from "./UserProfileCard";
import StatsGrid from "./StatsGrid";
import ActivityCalendar from "./ActivityCalendar";
import WrongAnswersCard from "./WrongAnswersCard";
import UserMenu from "@/components/Auth/UserMenu";

import styles from "./StatsSidebar.module.css";

const LEVEL = "A1";

export default function StatsSidebar() {
  const router = useRouter();
  const { data: session, status } = useSession();

  const [levelStats, setLevelStats] = useState(getEmptyStats());

  // 📦 Load stats from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("quiz_stats");

    if (stored) {
      const parsed = JSON.parse(stored);

      // 🛠 Fix broken old data
      if (!parsed[LEVEL]) {
        parsed[LEVEL] = getEmptyStats();
      }

      if (!parsed[LEVEL].activity || Array.isArray(parsed[LEVEL].activity)) {
        parsed[LEVEL].activity = {};
      }

      setLevelStats(parsed[LEVEL]);
      localStorage.setItem("quiz_stats", JSON.stringify(parsed));
    } else {
      const initial = {
        [LEVEL]: getEmptyStats(),
      };

      localStorage.setItem("quiz_stats", JSON.stringify(initial));
      setLevelStats(initial[LEVEL]);
    }
  }, []);

  // ⏳ Avoid flicker while session loads
  if (status === "loading") return null;

  return (
    <div className={styles.sidebarContainer}>
      <div>
        {/* 👤 Profile */}
        <UserProfileCard
          user={session?.user}
          level={LEVEL}
        />

        {/* 📊 Stats */}
        <StatsGrid levelStats={levelStats} />

        {/* ❌ Wrong Answers */}
        <WrongAnswersCard
          wrongCount={levelStats.wrongAnswers.length}
          onStartPractice={() => router.push(`/quiz/wrong?level=${LEVEL}`)}
        />

        {/* 📅 Calendar */}
        <ActivityCalendar activityData={levelStats.activity} />
      </div>

      <UserMenu />
    </div>
  );
}

// ✅ Helper: clean default state
function getEmptyStats() {
  return {
    streak: 0,
    testsTaken: 0,
    totalQuestions: 0,
    correctAnswers: 0,
    activity: {}, // ✅ must be object
    wrongAnswers: [],
  };
}
