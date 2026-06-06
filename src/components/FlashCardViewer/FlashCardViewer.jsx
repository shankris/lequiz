"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import styles from "./FlashCardViewer.module.css";

export default function FlashcardViewer({ cards = [] }) {
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  if (!cards.length) {
    return <div>No flashcards found</div>;
  }

  const nextCard = useCallback(() => {
    setFlipped(false);
    setIndex((prev) => (prev + 1) % cards.length);
  }, [cards.length]);

  const prevCard = useCallback(() => {
    setFlipped(false);
    setIndex((prev) => (prev - 1 + cards.length) % cards.length);
  }, [cards.length]);

  const flipCard = useCallback(() => {
    setFlipped((f) => !f);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowRight") nextCard();
      if (e.key === "ArrowLeft") prevCard();
      if (e.key === "ArrowUp") flipCard();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [nextCard, prevCard, flipCard]);

  const card = cards[index];

  return (
    <div className={styles.wrapper}>
      {/* SINGLE FLIPPING CARD */}
      <div className={styles.perspective}>
        <motion.div
          className={styles.card}
          animate={{ rotateY: flipped ? 180 : 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          style={{ transformStyle: "preserve-3d" }}
        >
          {/* FRONT */}
          <div
            className={styles.face}
            style={{
              backfaceVisibility: "hidden",
              position: "absolute",
              inset: 0,
            }}
          >
            <h2 className={styles.word}>{card.front}</h2>
            <hr className={styles.divider} />

            {card.back?.sentences?.[0]?.fr && <p className={styles.frontSentence}>{card.back.sentences[0].fr}</p>}
          </div>

          {/* BACK */}
          <div
            className={styles.face}
            style={{
              transform: "rotateY(180deg)",
              backfaceVisibility: "hidden",
              position: "absolute",
              inset: 0,
            }}
          >
            <p className={styles.meaning}>{card.back?.meaning}</p>

            {card.back?.sentences?.length > 0 && (
              <div className={styles.sentences}>
                {card.back.sentences.map((s, i) => (
                  <div
                    key={i}
                    className={styles.sentence}
                  >
                    <p className={styles.fr}>{s.fr}</p>
                    <p className={styles.en}>{s.en}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* CONTROLS */}
      <div className={styles.controls}>
        <button onClick={prevCard}>← Prev</button>
        <span className={styles.counter}>
          {index + 1} / {cards.length}
        </span>
        <button onClick={nextCard}>Next →</button>
      </div>
    </div>
  );
}
