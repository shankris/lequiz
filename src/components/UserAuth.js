"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { LogOut, Github, Mail, User } from "lucide-react";
import styles from "./UserAuth.module.css";

export default function UserAuth() {
  const { data: session, status } = useSession();

  // 1. Loading State
  if (status === "loading") {
    return <div className={styles.loader}>Chargement...</div>;
  }

  // 2. Logged In State (Display Profile Info + Logout)
  if (session) {
    return (
      <div className={styles.profileCard}>
        <div className={styles.profileHeader}>
          {session.user.image ? (
            <img
              src={session.user.image}
              alt='Profile'
              className={styles.profilePic}
            />
          ) : (
            <div className={styles.avatarPlaceholder}>
              <User size={24} />
            </div>
          )}
          <div className={styles.userDetails}>
            <span className={styles.userName}>{session.user.name}</span>
            <span className={styles.userEmail}>{session.user.email}</span>
          </div>
        </div>

        <button
          onClick={() => signOut()}
          className={styles.logoutBtn}
        >
          <LogOut size={16} /> Déconnexion
        </button>
      </div>
    );
  }

  // 3. Logged Out State (Login Options)
  return (
    <div className={styles.loginContainer}>
      <h3 className={styles.loginTitle}>Identification</h3>
      <div className={styles.buttonStack}>
        <button
          onClick={() => signIn("google")}
          className={`${styles.authBtn} ${styles.googleBtn}`}
        >
          <img
            src='https://authjs.dev/img/providers/google.svg'
            width='18'
            height='18'
            alt='Google'
          />
          Google
        </button>

        <button
          onClick={() => signIn("github")}
          className={`${styles.authBtn} ${styles.githubBtn}`}
        >
          <Github size={18} /> GitHub
        </button>
      </div>
    </div>
  );
}
