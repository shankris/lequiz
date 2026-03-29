"use client";

import { motion } from "framer-motion";
import styles from "./MenuToggle.module.css";

export default function MenuToggle({ isOpen, onToggle }) {
  return (
    <button
      onClick={onToggle}
      className={styles.menuButton}
      aria-label='Toggle Menu'
    >
      <svg
        width='24'
        height='24'
        viewBox='0 0 24 24'
      >
        {/* Top line */}
        <motion.line
          x1='3'
          y1='6'
          x2='21'
          y2='6'
          stroke='currentColor'
          strokeWidth='2'
          strokeLinecap='round'
          animate={isOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
          transition={{ duration: 0.2 }}
          style={{ transformOrigin: "center" }}
        />

        {/* Middle line */}
        <motion.line
          x1='3'
          y1='12'
          x2='21'
          y2='12'
          stroke='currentColor'
          strokeWidth='2'
          strokeLinecap='round'
          animate={isOpen ? { opacity: 0 } : { opacity: 1 }}
          transition={{ duration: 0.2 }}
        />

        {/* Bottom line */}
        <motion.line
          x1='3'
          y1='18'
          x2='21'
          y2='18'
          stroke='currentColor'
          strokeWidth='2'
          strokeLinecap='round'
          animate={isOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
          transition={{ duration: 0.2 }}
          style={{ transformOrigin: "center" }}
        />
      </svg>
    </button>
  );
}
