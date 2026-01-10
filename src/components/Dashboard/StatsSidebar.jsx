import { Flame, Trophy, Calendar as CalendarIcon, Target } from "lucide-react";
import styles from "./StatsSidebar.module.css";

export default function StatsSidebar({ user }) {
  // Mock data - in Phase 2, this will come from Firebase
  const stats = [
    {
      label: "Série",
      value: "7 jours",
      icon: (
        <Flame
          size={20}
          color='#f59e0b'
        />
      ),
      color: "orange",
    },
    {
      label: "Tests",
      value: "24",
      icon: (
        <Target
          size={20}
          color='#0070f3'
        />
      ),
      color: "blue",
    },
    {
      label: "Points",
      value: "1,250",
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
    <div className={styles.sidebarContainer}>
      {/* User Profile Section */}
      <div className={styles.profileCard}>
        <img
          src={user?.image}
          alt={user?.name}
          className={styles.avatar}
        />
        <div className={styles.userInfo}>
          <h3>{user?.name}</h3>
          <p>Niveau A1 - Débutant</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className={styles.statsList}>
        {stats.map((stat, i) => (
          <div
            key={i}
            className={styles.statItem}
          >
            <div className={`${styles.iconBox} ${styles[stat.color]}`}>{stat.icon}</div>
            <div className={styles.statText}>
              <span className={styles.statLabel}>{stat.label}</span>
              <span className={styles.statValue}>{stat.value}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Monthly Activity Calendar Placeholder */}
      <div className={styles.calendarCard}>
        <div className={styles.calendarHeader}>
          <CalendarIcon size={18} />
          <h4>Activité de Janvier</h4>
        </div>
        <div className={styles.calendarGrid}>
          {/* Simple loop for 31 days */}
          {Array.from({ length: 31 }).map((_, i) => (
            <div
              key={i}
              className={`${styles.day} ${i < 10 ? styles.active : ""}`}
              title={`Janvier ${i + 1}`}
            />
          ))}
        </div>
        <p className={styles.calendarLegend}>Dernière activité : Aujourd'hui</p>
      </div>
    </div>
  );
}
