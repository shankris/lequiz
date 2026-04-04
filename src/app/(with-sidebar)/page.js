"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useSidebar } from "@/context/SidebarContext";

import styles from "./page.module.css";
import SubSectionGrid from "@/components/Dashboard/SubSectionGrid";
import StatsSidebar from "@/components/Dashboard/StatsSidebar/StatsSidebar";

export default function Home() {
  const { isSidebarOpen, setIsSidebarOpen } = useSidebar();

  // Mock session
  const session = {
    user: {
      name: "Apprenant A1",
      image: "https://ui-avatars.com/api/?name=User",
    },
  };

  const status = "authenticated";

  if (status === "loading") {
    return <div className={styles.loading}>Chargement...</div>;
  }

  if (!session) {
    return (
      <div className={styles.loginWrapper}>
        <h1>Bienvenue sur LeQuiz</h1>
        <p>Connectez-vous pour suivre votre progression en Français A1.</p>
        <button className='btn-primary'>Se connecter avec Google</button>
      </div>
    );
  }

  return (
    <main className={styles.mainContent}>
      <div>
        <h1 className='header'>Accélérons votre apprentissage du français.</h1>
        <div className='subHead'>Choisissez un Quiz pour commencer votre pratique quotidienne.</div>
        <span className={styles.dataInfo}>Toutes les données concernent les 30 derniers jours.</span>
      </div>

      <SubSectionGrid />
    </main>
  );
}
