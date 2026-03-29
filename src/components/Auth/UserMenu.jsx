"use client";

import { CircleUser } from "lucide-react";
import { useSession, signIn, signOut } from "next-auth/react";
import styles from "./UserMenu.module.css";

export default function UserMenu() {
  const { data: session, status } = useSession();

  if (status === "loading") return <div className={styles.loader}>...</div>;

  if (!session) {
    return (
      <>
        <button
          className={styles.authButton}
          onClick={() => signIn()}
        >
          <CircleUser size={26} />
          Connectez-vous pour enregistrer votre progression
        </button>
      </>
    );
  }

  return (
    <div className={styles.userMenu}>
      {/* Profile Picture */}
      {session.user?.image && (
        <img
          src={session.user.image}
          alt='Profile'
          className={styles.avatar}
        />
      )}

      {/* Name and Email */}
      <div className={styles.userInfo}>
        <span className={styles.userName}>{session.user?.name}</span>
        <span className={styles.userEmail}>{session.user?.email}</span>
      </div>

      <button
        className={styles.logoutButton}
        onClick={() => signOut()}
      >
        Logout
      </button>
    </div>
  );
}
