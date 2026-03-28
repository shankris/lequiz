"use client";

import React, { useMemo } from "react";
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
  // ✅ Load stats
  const stats = useMemo(() => {
    if (typeof window === "undefined") return null;

    const stored = localStorage.getItem(KEY);
    const parsed = stored ? JSON.parse(stored) : {};
    return parsed[LEVEL] || null;
  }, []);

  // ✅ Last 30 days activity
  const recentActivity = useMemo(() => {
    return stats ? getLastNDaysActivity(stats.activity, 30) : {};
  }, [stats]);

  // ✅ 🔥 Build progress map using sectionId
  const sectionProgress = useMemo(() => {
    const map = {};

    Object.values(recentActivity).forEach((day) => {
      day.quizzesList?.forEach((quiz) => {
        const key = quiz.sectionId; // 🔥 THIS is the key you were looking for

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

  // ✅ Group sections
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
                const progressData = sectionProgress[section.id];

                const percent = progressData ? Math.round((progressData.correct / progressData.total) * 100) : 0;

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
                        </div>

                        {/* ✅ Progress bar */}
                        <div className={styles.progressBar}>
                          <div
                            className={styles.progressFill}
                            style={{ width: `${percent}%` }}
                          />
                        </div>

                        {/* ✅ Optional text */}
                        {percent > 0 && <span className={styles.progressText}>{percent}%</span>}
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
