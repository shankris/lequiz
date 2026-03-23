"use client";

import styles from "./UserProfileCard.module.css";

export default function UserProfileCard({ user, level = "A1" }) {
  const isGuest = !user;

  const displayName = user?.name || `Apprenant ${level}`;
  const initials = getInitials(displayName, level);

  return (
    <div className={styles.profileCard}>
      {/* Avatar */}
      {user?.image ? (
        <img
          src={user.image}
          alt={displayName}
          className={styles.avatar}
        />
      ) : (
        <div className={styles.avatarFallback}>{initials}</div>
      )}

      {/* User Info */}
      <div className={styles.userInfo}>
        <h3 className={styles.userName}>{displayName}</h3>

        <p className={styles.userLevel}>
          Niveau {level} - {getLevelLabel(level)}
        </p>
      </div>

      {/* Guest tag (optional subtle indicator) */}
      {isGuest && <span className={styles.guestTag}>Local</span>}
    </div>
  );
}

// Helpers
function getLevelLabel(level) {
  switch (level) {
    case "A1":
      return "Débutant";
    case "A2":
      return "Élémentaire";
    case "B1":
      return "Intermédiaire";
    case "B2":
      return "Avancé";
    default:
      return "";
  }
}

function getInitials(name, level) {
  if (!name) return level;

  const parts = name.split(" ");
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();

  return parts[0].charAt(0).toUpperCase() + parts[1].charAt(0).toUpperCase();
}
