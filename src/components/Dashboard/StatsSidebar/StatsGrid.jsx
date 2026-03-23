"use client";

import { Flame, Trophy, Target } from "lucide-react";
import styles from "./StatsGrid.module.css";

export default function StatsGrid({ levelStats }) {
  // Fallback safety
  const { streak = 0, testsTaken = 0, totalQuestions = 0, correctAnswers = 0 } = levelStats || {};

  const successRate = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;

  const stats = [
    {
      label: "Série",
      value: `${streak} jours`,
      icon: (
        <Flame
          size={20}
          color='#f59e0b'
        />
      ),
      color: "orange",
    },
    {
      label: "Quizs réalisés",
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
      label: "Succès",
      value: `${successRate}%`,
      icon: (
        <Trophy
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
