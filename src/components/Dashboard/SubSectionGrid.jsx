"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import * as Icons from "lucide-react"; // Import all icons
import styles from "./SubSectionGrid.module.css";
import sectionData from "@/data/a1/sections.json"; // Import the new JSON

export default function SubSectionGrid() {
  return (
    <div className={styles.container}>
      <div className={styles.grid}>
        {sectionData.map((section) => {
          // Dynamic icon selection based on the string in JSON
          const IconComponent = Icons[section.icon] || Icons.HelpCircle;

          return (
            <Link
              href={`/quiz/${section.id}`}
              key={section.id}
              className={styles.link}
            >
              <motion.div
                className={styles.cardWrapper}
                whileHover={{ y: -5 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className={styles.card}>
                  <div className={styles.iconContainer}>
                    <IconComponent size={24} />
                  </div>
                  <div className={styles.progressBar}>
                    <div
                      className={styles.progressFill}
                      style={{ width: "0%" }}
                    ></div>
                  </div>
                </div>
                <span className={styles.label}>{section.title}</span>
              </motion.div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
