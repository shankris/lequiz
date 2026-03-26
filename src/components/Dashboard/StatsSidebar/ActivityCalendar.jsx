"use client";

import { Calendar as CalendarIcon } from "lucide-react";
import styles from "./ActivityCalendar.module.css";

export default function ActivityCalendar({ activityData = {} }) {
  const today = new Date();

  // ✅ Convert object → sorted date array
  const activityDates = Object.keys(activityData).sort();

  // 👉 Get earliest activity date
  const firstActivityDate = activityDates.length ? new Date(activityDates[0]) : new Date(today);

  // 👉 Start from beginning of that week (Monday)
  const start = new Date(firstActivityDate);
  const day = start.getDay(); // 0 = Sunday, 1 = Monday...
  start.setDate(start.getDate() - ((day + 6) % 7)); // shift to Monday

  // 👉 Build days until today
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

  // 👉 Fill last week to complete 7 days
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

  // 👉 Split into weeks
  const weeks = [];
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7));
  }

  return (
    <div className={styles.calendarCard}>
      <div className={styles.calendarHeader}>
        <CalendarIcon size={20} />
        <h4>Activité</h4>
      </div>

      <div className={styles.calendarGrid}>
        {/* Week labels (Monday first, French convention) */}
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

        {/* Weeks */}
        {weeks.map((week, wi) => (
          <div
            key={wi}
            className={styles.weekRow}
          >
            {week.map((d, di) => (
              <div
                key={di}
                className={`
                  ${styles.day}
                  ${d.isActive ? styles.active : ""}
                  ${d.isWeekend ? styles.weekend : ""}
                  ${d.isFuture ? styles.future : ""}
                `}
                title={(() => {
                  const stored = localStorage.getItem("quiz_stats");
                  const parsed = stored ? JSON.parse(stored) : {};
                  const stats = parsed?.A1;

                  const dayData = stats?.activity?.[d.date];

                  if (!dayData) return d.date;

                  const quizzes = Array.isArray(dayData.quizzesList) ? dayData.quizzesList : [];

                  if (quizzes.length === 0) {
                    return `${d.date} - ${dayData.quizzes || 0} quiz(es)`;
                  }

                  const recentFirst = [...quizzes].reverse();
                  const visible = recentFirst.slice(0, 4);
                  const remaining = recentFirst.length - visible.length;

                  let tooltip = `${d.date} - ${dayData.quizzes || 0} quiz(es)\n`;

                  tooltip += visible.join("\n");

                  if (remaining > 0) {
                    tooltip += `\n+${remaining} more`;
                  }

                  return tooltip;
                })()}
              >
                <span className={styles.dateNumber}>{new Date(d.date).getDate()}</span>
              </div>
            ))}
          </div>
        ))}
      </div>

      <p className={styles.calendarLegend}>Dernière activité : {getLastActive(activityDates)}</p>
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
