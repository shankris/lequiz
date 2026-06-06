"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar as CalendarIcon } from "lucide-react";
import styles from "./ActivityCalendar.module.css";

const DAYS = 30;

export default function ActivityCalendar({ activityData = {} }) {
  const today = new Date();

  const todayISO = today.getFullYear() + "-" + String(today.getMonth() + 1).padStart(2, "0") + "-" + String(today.getDate()).padStart(2, "0");

  const [selectedDate, setSelectedDate] = useState(todayISO);
  const [showMeta, setShowMeta] = useState(false);

  useEffect(() => {
    setShowMeta(false);
  }, [selectedDate]);

  const stored = typeof window !== "undefined" ? localStorage.getItem("quiz_stats") : null;

  const parsed = stored ? JSON.parse(stored) : {};
  const stats = parsed?.A1;

  const selectedDayData = selectedDate ? stats?.activity?.[selectedDate] : null;

  const quizzesList = selectedDayData?.quizzesList || [];
  const totalQuizzes = selectedDayData?.quizzes || 0;

  useEffect(() => {
    if (selectedDayData && quizzesList.length === 0) {
      setShowMeta(true);
    }
  }, [selectedDayData, quizzesList.length]);

  // ======================================================
  // 📅 STEP 1: STRICT 30-DAY DATA WINDOW
  // ======================================================

  const dataDays = [];

  for (let i = DAYS - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);

    const iso = d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");

    dataDays.push({
      date: iso,
      isActive: !!activityData?.[iso],
      isData: true,
      isWeekend: d.getDay() === 0 || d.getDay() === 6,
    });
  }

  // ======================================================
  // 📅 STEP 2: MONDAY ALIGNMENT PADDING (visual only)
  // ======================================================

  const startDay = new Date(dataDays[0].date).getDay();
  const pad = (startDay + 6) % 7;

  const paddedDays = [
    ...Array.from({ length: pad }).map(() => ({
      date: null,
      isActive: false,
      isData: false,
      disabled: true,
    })),
    ...dataDays,
  ];

  // ======================================================
  // 📅 STEP 3: SPLIT INTO WEEKS
  // ======================================================

  const weeks = [];

  for (let i = 0; i < paddedDays.length; i += 7) {
    weeks.push(paddedDays.slice(i, i + 7));
  }

  // ======================================================
  // 🎞 ANIMATIONS (unchanged)
  // ======================================================

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: {
      opacity: 0,
      y: 20,
      scale: 0.96,
      filter: "blur(4px)",
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      filter: "blur(0px)",
      transition: {
        duration: 0.4,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  const activityDates = Object.keys(activityData).sort();

  const totalCorrect = quizzesList.reduce((sum, q) => sum + (q.correct || 0), 0);

  const totalQuestions = quizzesList.reduce((sum, q) => sum + (q.total || 20), 0);

  const successPercent = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;

  // ======================================================
  // 🧩 UI
  // ======================================================

  return (
    <div className={styles.calendarCard}>
      <div className={styles.calendarHeader}>
        <CalendarIcon size={20} />
        <span>Activité</span>
      </div>

      <div className={styles.calendarGrid}>
        <div className={styles.weekLabels}>
          {["L", "M", "M", "J", "V", "S", "D"].map((d, i) => (
            <span
              key={i}
              className={styles.weekLabel}
            >
              {d}
            </span>
          ))}
        </div>

        {weeks.map((week, wi) => (
          <div
            key={wi}
            className={styles.weekRow}
          >
            {week.map((d, di) => (
              <div
                key={di}
                onClick={() => {
                  if (!d.isData) return; // 🔥 disable padding clicks
                  setSelectedDate(d.date);
                }}
                className={`
                  ${styles.day}
                  ${d.isActive ? styles.active : ""}
                  ${d.disabled ? styles.disabled : ""}
                  ${selectedDate === d.date ? styles.selected : ""}
                `}
              >
                {d.date && <span className={styles.dateNumber}>{new Date(d.date).getDate()}</span>}
              </div>
            ))}
          </div>
        ))}
      </div>

      <p className={styles.calendarLegend}>Dernière activité : {getLastActive(activityDates)}</p>

      <AnimatePresence mode='wait'>
        {selectedDate && (
          <motion.div
            key={selectedDate}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className={styles.detailsPanel}
          >
            <div className={styles.detailsHeader}>
              <span className={styles.detailsDate}>
                {new Date(selectedDate).toLocaleDateString("fr-FR", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </span>

              {selectedDayData && <span className={styles.detailsQuizCount}>{successPercent}%</span>}
            </div>

            {!selectedDayData ? (
              <p>Aucune activité</p>
            ) : quizzesList.length > 0 ? (
              <motion.div
                className={styles.quizList}
                variants={containerVariants}
                initial='hidden'
                animate='visible'
                onAnimationComplete={() => setShowMeta(true)}
              >
                {[...quizzesList]
                  .sort((a, b) => b.timestamp - a.timestamp)
                  .map((quiz, i) => {
                    const total = quiz.total || 20;
                    const percent = Math.round((quiz.correct / total) * 100);

                    return (
                      <Link
                        key={quiz.timestamp || i}
                        href={`/quiz/${quiz.sectionId}`}
                        className={styles.quizLink}
                      >
                        <motion.span
                          className={styles.quizItem}
                          variants={itemVariants}
                        >
                          <span className={styles.quizName}>{quiz.name}</span>
                          <span className={styles.quizPerCent}>{percent}%</span>
                        </motion.span>
                      </Link>
                    );
                  })}
              </motion.div>
            ) : (
              <p>Aucune activité</p>
            )}

            <AnimatePresence>
              {showMeta && totalQuizzes > 0 && (
                <motion.span className={styles.quizCount}>
                  Total: {totalQuizzes} {totalQuizzes === 1 ? "quiz" : "quizzes"}
                </motion.span>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ======================================================
// 🧠 Helper
// ======================================================

function getLastActive(activityDates) {
  if (!activityDates || activityDates.length === 0) return "Aucune";

  const last = activityDates[activityDates.length - 1];

  const today = new Date();
  const todayStr = today.getFullYear() + "-" + String(today.getMonth() + 1).padStart(2, "0") + "-" + String(today.getDate()).padStart(2, "0");

  if (last === todayStr) return "Aujourd'hui";

  return last;
}
