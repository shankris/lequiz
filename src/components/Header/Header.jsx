"use client";

import Image from "next/image";
import styles from "./Header.module.css";
import ThemeToggle from "./ThemeToggle";
import NotificationBell from "../Notification/NotificationBell";
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

        {/* <div>
          <SearchInput />
        </div> */}

        {/* Right side of header */}
        <div className={styles.rightIcons}>
          <ThemeToggle />

          <NotificationBell
            notifications={notifications}
            onItemClick={(item) => console.log("Clicked", item)}
            onViewAll={() => router.push("/notifications")}
          />
        </div>
      </div>
    </header>
  );
}
