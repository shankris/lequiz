"use client";

// import { useSession, signIn } from "next-auth/react";
import styles from "./page.module.css";
import SubSectionGrid from "@/components/Dashboard/SubSectionGrid";
import StatsSidebar from "@/components/Dashboard/StatsSidebar/StatsSidebar";

export default function Home() {
  /* We are bypassing Auth for now to focus on the Quiz logic.
     When you are ready for Phase 2, uncomment the useSession logic below.
  */

  // const { data: session, status } = useSession();

  // Mock session for development
  const session = {
    user: {
      name: "Apprenant A1",
      image: "https://ui-avatars.com/api/?name=User", // Placeholder avatar
    },
  };
  const status = "authenticated";

  // 1. Handle Loading State
  if (status === "loading") {
    return <div className={styles.loading}>Chargement...</div>;
  }

  // 2. Handle Unauthenticated State (Login Screen)
  if (!session) {
    return (
      <div className={styles.loginWrapper}>
        <h1>Bienvenue sur LeQuiz</h1>
        <p>Connectez-vous pour suivre votre progression en Français A1.</p>
        <button
          className='btn-primary'
          onClick={() => console.log("Sign in clicked - Auth is currently disabled")}
        >
          Se connecter avec Google
        </button>
      </div>
    );
  }

  // 3. Dashboard View
  return (
    <div className={styles.dashboardLayout}>
      <main className={styles.mainContent}>
        <header>
          <h1 className='header'>Accélérons votre apprentissage du français.</h1>
          <div className='subHead'>Choisissez un Quiz pour commencer votre pratique quotidienne.</div>
        </header>
        <SubSectionGrid />
        <span className={styles.dataInfo}>Toutes les données concernent les 30 derniers jours.</span>
      </main>

      <aside className={styles.sidebar}>
        <StatsSidebar user={session.user} />
      </aside>
    </div>
  );
}
