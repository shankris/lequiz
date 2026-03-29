"use client";

import React, { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import styles from "./SubSectionGrid.module.css";
import sectionData from "@/data/a1/sections.json";

const KEY = "quiz_stats";
const LEVEL = "A1";

// ✅ Last 30 days helper
function getLastNDaysActivity(activity, days = 30) {
  const result = {};
  const today = new Date();

  for (let i = 0; i < days; i++) {
    const d = new Date();
    d.setDate(today.getDate() - i);

    const iso = d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");

    if (activity?.[iso]) {
      result[iso] = activity[iso];
    }
  }

  return result;
}

export default function SubSectionGrid() {
  const [mounted, setMounted] = useState(false);
  const [stats, setStats] = useState(null);

  // ✅ Fix hydration
  useEffect(() => {
    setMounted(true);

    const stored = localStorage.getItem(KEY);
    const parsed = stored ? JSON.parse(stored) : {};
    setStats(parsed[LEVEL] || null);
  }, []);

  // ✅ Last 30 days activity
  const recentActivity = useMemo(() => {
    return stats ? getLastNDaysActivity(stats.activity, 30) : {};
  }, [stats]);

  // ✅ Progress map
  const sectionProgress = useMemo(() => {
    const map = {};

    Object.values(recentActivity).forEach((day) => {
      day.quizzesList?.forEach((quiz) => {
        const key = quiz.sectionId;
        if (!key) return;

        if (!map[key]) {
          map[key] = { correct: 0, total: 0 };
        }

        map[key].correct += quiz.correct;
        map[key].total += quiz.total || 20;
      });
    });

    return map;
  }, [recentActivity]);

  // ✅ Last played
  const lastPlayedMap = useMemo(() => {
    const map = {};

    Object.values(recentActivity).forEach((day) => {
      day.quizzesList?.forEach((quiz) => {
        if (!quiz.sectionId || !quiz.timestamp) return;

        if (!map[quiz.sectionId] || quiz.timestamp > map[quiz.sectionId]) {
          map[quiz.sectionId] = quiz.timestamp;
        }
      });
    });

    return map;
  }, [recentActivity]);

  // ✅ Number of attempts in last 30 days per section
  const attemptsMap = useMemo(() => {
    const map = {};

    Object.values(recentActivity).forEach((day) => {
      day.quizzesList?.forEach((quiz) => {
        if (!quiz.sectionId) return;
        map[quiz.sectionId] = (map[quiz.sectionId] || 0) + 1;
      });
    });

    return map;
  }, [recentActivity]);

  function getRelativeDateLabel(timestamp) {
    if (!timestamp) return null;

    const now = new Date();
    const date = new Date(timestamp);

    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const target = new Date(date.getFullYear(), date.getMonth(), date.getDate());

    const diffDays = Math.floor((today - target) / (1000 * 60 * 60 * 24));

    // ✅ Same day / yesterday
    if (diffDays === 0) return "Aujourd’hui";
    if (diffDays === 1) return "Il y a 1 jour";

    // ✅ 2–6 days
    if (diffDays < 7) return `Il y a ${diffDays} jours`;

    // ✅ Weeks (7–30 days)
    const weeks = Math.floor(diffDays / 7);
    if (diffDays <= 30) {
      return weeks === 1 ? "Il y a 1 semaine" : `Il y a ${weeks} semaines`;
    }

    // ✅ More than a month
    return "Il y a plus d’un mois";
  }

  function getProgressColor(percent) {
    if (percent <= 20) return "#ef4444";
    if (percent <= 40) return "#f97316";
    if (percent <= 60) return "#f59e0b";
    if (percent <= 80) return "#84cc16";
    return "#22c55e";
  }

  const groupedSections = sectionData.reduce((acc, item) => {
    if (!acc[item.section]) acc[item.section] = [];
    acc[item.section].push(item);
    return acc;
  }, {});

  const sectionTitles = {
    basic: "Les Bases",
    conjugation: "La conjugaison française",
  };

  const sectionOrder = ["basic", "conjugation"];

  return (
    <div className={styles.container}>
      {sectionOrder.map((sectionName) => {
        const items = groupedSections[sectionName];
        if (!items) return null;

        return (
          <div
            key={sectionName}
            className={styles.sectionBlock}
          >
            <h2 className={styles.sectionTitle}>{sectionTitles[sectionName] || sectionName}</h2>

            <div className={styles.grid}>
              {items.map((section) => {
                const attempts = attemptsMap[section.id] || 0;
                const lastPlayed = lastPlayedMap[section.id];
                const relativeDate = getRelativeDateLabel(lastPlayed);
                const progressData = sectionProgress[section.id];

                const percent = progressData ? Math.round((progressData.correct / progressData.total) * 100) : 0;

                const color = getProgressColor(percent);

                return (
                  <Link
                    href={`/quiz/${section.id}`}
                    key={section.id}
                    className={styles.link}
                  >
                    <motion.div
                      className={styles.cardWrapper}
                      whileHover={{ y: -5 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className={styles.card}>
                        <div className={styles.textContainer}>
                          <h3 className={styles.title}>{section.title}</h3>

                          {section.subtitle && <p className={styles.subtitle}>{section.subtitle}</p>}

                          {mounted && <span className={styles.lastPlayed}>Tentatives: {attempts}</span>}

                          {/* ✅ Hydration-safe */}
                          <span className={styles.lastActive}>{mounted ? `Dernière activité : ${relativeDate || "Pas encore utilisé"}` : ""}</span>
                        </div>

                        {/* ✅ Animated Progress Bar */}
                        <div className={styles.progressBar}>
                          <motion.div
                            className={styles.progressFill}
                            initial={{ width: 0 }}
                            animate={{
                              width: mounted ? `${percent}%` : "0%",
                            }}
                            transition={{
                              duration: 0.8,
                              ease: [0.22, 1, 0.36, 1],
                            }}
                            style={{
                              backgroundColor: color,
                            }}
                          />
                        </div>

                        {percent > 0 && (
                          <motion.span
                            className={styles.progressText}
                            style={{ color }}
                            initial={{ opacity: 0, y: 5 }}
                            animate={{
                              opacity: mounted ? 0.2 : 0,
                              y: mounted ? 0 : 5,
                            }}
                            transition={{ delay: 0.4 }}
                          >
                            {percent}
                            <span className={styles.progressPercent}>%</span>
                          </motion.span>
                        )}
                      </div>
                    </motion.div>
                  </Link>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
