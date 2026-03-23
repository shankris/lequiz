"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import styles from "./SubSectionGrid.module.css";
import sectionData from "@/data/a1/sections.json";

export default function SubSectionGrid() {
  // ✅ Group by section
  const groupedSections = sectionData.reduce((acc, item) => {
    if (!acc[item.section]) {
      acc[item.section] = [];
    }
    acc[item.section].push(item);
    return acc;
  }, {});

  // ✅ Optional: prettier section titles
  const sectionTitles = {
    basic: "Les Bases",
    conjugation: "La conjugaison française",
  };

  // ✅ Optional: control order
  const sectionOrder = ["basic", "conjugation"];

  return (
    <div className={styles.container}>
      {sectionOrder.map((sectionName) => {
        const items = groupedSections[sectionName];

        // Skip if no items in that section
        if (!items) return null;

        return (
          <div
            key={sectionName}
            className={styles.sectionBlock}
          >
            {/* SECTION TITLE */}
            <h2 className={styles.sectionTitle}>{sectionTitles[sectionName] || sectionName}</h2>

            {/* CARDS GRID */}
            <div className={styles.grid}>
              {items.map((section) => (
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
                      <div className={styles.textContainer}>
                        <h3 className={styles.title}>{section.title}</h3>

                        {section.subtitle && <p className={styles.subtitle}>{section.subtitle}</p>}
                      </div>

                      <div className={styles.progressBar}>
                        <div
                          className={styles.progressFill}
                          style={{ width: "0%" }}
                        ></div>
                      </div>
                    </div>
                  </motion.div>
                </Link>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
