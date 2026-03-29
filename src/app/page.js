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
    <div className={styles.dashboardLayout}>
      <main className={styles.mainContent}>
        <header>
          <h1 className='header'>Accélérons votre apprentissage du français.</h1>
          <div className='subHead'>Choisissez un Quiz pour commencer votre pratique quotidienne.</div>
        </header>

        <SubSectionGrid />

        <span className={styles.dataInfo}>Toutes les données concernent les 30 derniers jours.</span>
      </main>

      {/* ✅ Desktop Sidebar (unchanged) */}
      <aside className={styles.sidebar}>
        <StatsSidebar user={session.user} />
      </aside>

      {/* ✅ Mobile Sidebar (Animated) */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            {/* Overlay */}
            <motion.div
              className={styles.overlay}
              onClick={() => setIsSidebarOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />

            {/* Sliding Sidebar */}
            <motion.aside
              className={styles.mobileSidebar}
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.3 }}
            >
              <StatsSidebar user={session.user} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
