"use client";

import { useMemo } from "react";
import { Flame, ChartBarBig, Target } from "lucide-react";
import styles from "./StatsGrid.module.css";

const DAYS = 30;

export default function StatsGrid({ levelStats }) {
  const activity = levelStats?.activity || {};

  // ======================================================
  // 📅 Get last 30 days range
  // ======================================================

  const last30Days = useMemo(() => {
    const today = new Date();
    const days = new Set();

    for (let i = 0; i < DAYS; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);

      const iso = d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");

      days.add(iso);
    }

    return days;
  }, []);

  // ======================================================
  // 📊 Filter activity to last 30 days only
  // ======================================================

  const filteredEntries = Object.entries(activity).filter(([date]) => last30Days.has(date));

  let testsTaken = 0;
  let totalQuestions = 0;
  let correctAnswers = 0;

  filteredEntries.forEach(([_, day]) => {
    testsTaken += day?.quizzes || 0;

    const quizzes = day?.quizzesList || [];

    quizzes.forEach((q) => {
      totalQuestions += q.total || 20;
      correctAnswers += q.correct || 0;
    });
  });

  // ======================================================
  // 📈 Derived stats (30-day scoped)
  // ======================================================

  const successRate = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;

  // ======================================================
  // ⚡ Keep streak as-is OR optionally scope it
  // ======================================================

  const streak = levelStats?.streak || 0;

  const stats = [
    {
      label: "Jours consécutifs sur LeQuiz",
      value: `${streak}`,
      icon: (
        <Flame
          size={20}
          color='#f59e0b'
        />
      ),
      color: "orange",
    },
    {
      label: "LeQuiz complétés",
      value: testsTaken,
      icon: (
        <Target
          size={20}
          color='#0070f3'
        />
      ),
      color: "blue",
    },
    {
      label: "Progression",
      value: `${successRate}%`,
      icon: (
        <ChartBarBig
          size={20}
          color='#10b981'
        />
      ),
      color: "green",
    },
  ];

  return (
    <div className={styles.statsList}>
      {stats.map((stat, i) => (
        <div
          key={i}
          className={styles.statItem}
        >
          <div className={`${styles.iconBox} ${styles[stat.color]}`}>
            {stat.icon}
            <span className={styles.statLabel}>{stat.label}</span>
          </div>

          <div className={styles.statText}>
            <span className={styles.statValue}>{stat.value}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
