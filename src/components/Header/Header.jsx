"use client";

import Image from "next/image";
import styles from "./Header.module.css";
import ThemeToggle from "./ThemeToggle";
import NotificationBell from "../Notification/NotificationBell";
import MenuToggle from "@/components/MenuToggle/MenuToggle";
import { useSidebar } from "@/context/SidebarContext";

import SearchInput from "./Search/SearchInput";

const notifications = [
  {
    id: 1,
    title: "New Bookmarks Added",
    description: "Lorem ipsum dolor, sit amet consectetur adipisicing elit.",
    time: "2 min ago",
    read: false,
  },
  {
    id: 2,
    title: "Bookmarks Summary",
    description: "Your bookmarks summary is ready",
    time: "6 hours ago",
    read: true,
  },
  {
    id: 3,
    title: "Weekly Sales Report",
    description: "The weekly report is now available.",
    time: "1 day ago",
    read: true,
  },
];

export default function Header() {
  // ✅ FIX: Move hook INSIDE component
  const { isSidebarOpen, setIsSidebarOpen } = useSidebar();

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <div className={styles.logo}>
          <Image
            src='/flagFrance.svg'
            alt='Le Quiz App Logo'
            width={45}
            height={28}
            priority
          />
          <div>
            Le<span>Quiz</span>
          </div>
        </div>

        {/* <SearchInput /> */}

        <div className={styles.rightIcons}>
          <ThemeToggle />

          <NotificationBell
            notifications={notifications}
            onItemClick={(item) => console.log("Clicked", item)}
            onViewAll={() => console.log("Go to notifications")}
          />

          <MenuToggle
            isOpen={isSidebarOpen}
            onToggle={() => setIsSidebarOpen((prev) => !prev)}
          />
        </div>
      </div>
    </header>
  );
}
