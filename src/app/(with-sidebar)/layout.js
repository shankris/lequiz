"use client";

import { SidebarProvider, useSidebar } from "@/context/SidebarContext";
import { motion, AnimatePresence } from "framer-motion";
import StatsSidebar from "@/components/Dashboard/StatsSidebar/StatsSidebar";
import Header from "@/components/Header/Header";

export default function WithSidebarLayout({ children }) {
  return (
    <SidebarProvider>
      <LayoutContent>{children}</LayoutContent>
    </SidebarProvider>
  );
}

function LayoutContent({ children }) {
  const { isSidebarOpen, setIsSidebarOpen } = useSidebar();

  const user = {
    name: "Apprenant A1",
    image: "https://ui-avatars.com/api/?name=User",
  };

  return (
    <>
      <Header />
      <div className='dashboardLayout'>
        {/* ✅ Main Content */}
        <main>{children}</main>

        {/* ✅ Desktop Sidebar */}
        <aside className='desktopSidebar'>
          <StatsSidebar user={user} />
        </aside>
      </div>

      {/* ✅ Mobile Sidebar */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            <motion.div
              onClick={() => setIsSidebarOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{
                position: "fixed",
                inset: 0,
                background: "rgba(0,0,0,0.3)",
              }}
            />

            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.3 }}
              style={{
                position: "fixed",
                right: 0,
                top: 0,
                height: "100%",
                width: "360px",
                background: "white",
              }}
            >
              <StatsSidebar user={user} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
