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

const LEVEL = "A1"; // for now
const activityData = JSON.parse(localStorage.getItem("activityData") || "{}");

export default function StatsSidebar() {
  const router = useRouter();
  const { data: session, status } = useSession();

  const [levelStats, setLevelStats] = useState(getEmptyStats());

  // 📦 Load stats from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("quiz_stats");

    if (stored) {
      const parsed = JSON.parse(stored);

      // Ensure level exists
      if (!parsed[LEVEL]) {
        parsed[LEVEL] = getEmptyStats();
        localStorage.setItem("quiz_stats", JSON.stringify(parsed));
      }

      setLevelStats(parsed[LEVEL]);
    } else {
      const initial = {
        [LEVEL]: getEmptyStats(),
      };

      localStorage.setItem("quiz_stats", JSON.stringify(initial));
      setLevelStats(initial[LEVEL]);
    }
  }, []);

  // ⏳ Optional: avoid flicker while session loads
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
        <ActivityCalendar activityData={activityData} />
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
    activity: {}, // ✅ IMPORTANT (object, not array)
    wrongAnswers: [],
  };
}
