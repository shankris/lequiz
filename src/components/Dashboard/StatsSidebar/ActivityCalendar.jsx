"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar as CalendarIcon } from "lucide-react";
import styles from "./ActivityCalendar.module.css";

export default function ActivityCalendar({ activityData = {} }) {
  const currentDate = new Date();

  const todayISO = currentDate.getFullYear() + "-" + String(currentDate.getMonth() + 1).padStart(2, "0") + "-" + String(currentDate.getDate()).padStart(2, "0");

  const [selectedDate, setSelectedDate] = useState(todayISO);

  const stored = typeof window !== "undefined" ? localStorage.getItem("quiz_stats") : null;

  const parsed = stored ? JSON.parse(stored) : {};
  const stats = parsed?.A1;

  const selectedDayData = selectedDate ? stats?.activity?.[selectedDate] : null;

  const quizzesList = selectedDayData?.quizzesList || [];
  const totalQuizzes = selectedDayData?.quizzes || 0;

  const today = new Date();

  const activityDates = Object.keys(activityData).sort();

  const firstActivityDate = activityDates.length ? new Date(activityDates[0]) : new Date(today);

  const start = new Date(firstActivityDate);
  const day = start.getDay();
  start.setDate(start.getDate() - ((day + 6) % 7));

  const days = [];
  let current = new Date(start);

  while (current <= today) {
    const iso = current.getFullYear() + "-" + String(current.getMonth() + 1).padStart(2, "0") + "-" + String(current.getDate()).padStart(2, "0");

    const dayData = activityData[iso];

    days.push({
      date: iso,
      isActive: !!dayData,
      isWeekend: current.getDay() === 0 || current.getDay() === 6,
      isFuture: current > today,
    });

    current.setDate(current.getDate() + 1);
  }

  const remainder = days.length % 7;
  if (remainder !== 0) {
    const missing = 7 - remainder;
    for (let i = 0; i < missing; i++) {
      const date = new Date(current);
      date.setDate(current.getDate() + i);

      const iso = date.getFullYear() + "-" + String(date.getMonth() + 1).padStart(2, "0") + "-" + String(date.getDate()).padStart(2, "0");

      days.push({
        date: iso,
        isActive: false,
        isWeekend: date.getDay() === 0 || date.getDay() === 6,
        isFuture: true,
      });
    }
  }

  const weeks = [];
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7));
  }

  // ✅ Animation Variants
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

  const totalCorrect = quizzesList.reduce((sum, q) => sum + (q.correct || 0), 0);
  const totalQuestions = quizzesList.reduce((sum, q) => sum + (q.total || 20), 0);

  const successPercent = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;

  return (
    <div className={styles.calendarCard}>
      <div className={styles.calendarHeader}>
        <CalendarIcon size={20} />
        <h4>Activité</h4>
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
                onClick={() => !d.isFuture && setSelectedDate(d.date)}
                className={`
                  ${styles.day}
                  ${d.isActive ? styles.active : ""}
                  ${d.isWeekend ? styles.weekend : ""}
                  ${d.isFuture ? styles.future : ""}
                  ${selectedDate === d.date ? styles.selected : ""}
                `}
              >
                <span className={styles.dateNumber}>{new Date(d.date).getDate()}</span>
              </div>
            ))}
          </div>
        ))}
      </div>
      <p className={styles.calendarLegend}>Dernière activité : {getLastActive(activityDates)}</p>
      {/* ✅ AnimatePresence FIX */}
      <AnimatePresence mode='wait'>
        {selectedDate && (
          <motion.div
            key={selectedDate}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.25 }}
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

              {/* {selectedDayData && (
                <span className={styles.detailsQuizCount}>
                  {totalQuizzes} {totalQuizzes === 1 ? "quiz" : "quizzes"}
                </span>
              )} */}
            </div>

            {!selectedDayData ? (
              <p>Aucune activité</p>
            ) : (
              quizzesList.length > 0 && (
                <motion.div
                  className={styles.quizList}
                  variants={containerVariants}
                  initial='hidden'
                  animate='visible'
                >
                  {[...quizzesList]
                    .sort((a, b) => b.timestamp - a.timestamp)
                    .map((quiz, i) => {
                      const total = quiz.total || 20;
                      const percent = Math.round((quiz.correct / total) * 100);

                      return (
                        <motion.span
                          className={styles.quizItem}
                          key={quiz.timestamp || i}
                          variants={itemVariants}
                        >
                          <span className={styles.quizName}>{quiz.name}</span>
                          <span className={styles.quizPerCent}>{percent}%</span>
                        </motion.span>
                      );
                    })}
                </motion.div>
              )
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {totalQuizzes > 0 && (
        <motion.span
          className={styles.quizCount}
          initial={{ opacity: 0, y: -10 }} // start hidden and slightly up
          animate={{ opacity: 1, y: 0 }} // animate to visible and original position
          transition={{ delay: 2, duration: 0.4 }} // delay in seconds
        >
          Total: {totalQuizzes} {totalQuizzes === 1 ? "quiz" : "quizzes"}
        </motion.span>
      )}
    </div>
  );
}

// ✅ Helper
function getLastActive(activityDates) {
  if (!activityDates || activityDates.length === 0) return "Aucune";

  const last = activityDates[activityDates.length - 1];

  const today = new Date();
  const todayStr = today.getFullYear() + "-" + String(today.getMonth() + 1).padStart(2, "0") + "-" + String(today.getDate()).padStart(2, "0");

  if (last === todayStr) return "Aujourd'hui";

  return last;
}
