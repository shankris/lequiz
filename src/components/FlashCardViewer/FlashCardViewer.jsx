"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./FlashCardViewer.module.css";

export default function FlashcardViewer({ cards = [] }) {
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [sentenceIndex, setSentenceIndex] = useState(0);

  if (!cards.length) return <div>No flashcards found</div>;

  const card = cards[index];
  const sentences = card.back?.sentences || [];
  const sentenceCount = sentences.length;

  // Audio Playback Effect
  useEffect(() => {
    if (!flipped) {
      const audio = new Audio(`/de_Audio/${card.front}.mp3`);
      audio.play().catch((err) => console.warn("Autoplay blocked:", err));
      return () => {
        audio.pause();
        audio.currentTime = 0;
      };
    }
  }, [index, flipped, card.front]);

  useEffect(() => {
    setSentenceIndex(0);
    setFlipped(false);
  }, [index]);

  const nextCard = useCallback(() => {
    setFlipped(false);
    setIndex((prev) => (prev + 1) % cards.length);
  }, [cards.length]);

  const prevCard = useCallback(() => {
    setFlipped(false);
    setIndex((prev) => (prev - 1 + cards.length) % cards.length);
  }, [cards.length]);

  const flipCard = useCallback(() => setFlipped((f) => !f), []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowRight") nextCard();
      if (e.key === "ArrowLeft") prevCard();
      if (e.key === "ArrowUp") flipCard();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [nextCard, prevCard, flipCard]);

  useEffect(() => {
    if (flipped) return;
    if (sentenceCount <= 1) return;

    const id = setInterval(() => {
      setSentenceIndex((prev) => (prev + 1) % sentenceCount);
    }, 5000);
    return () => clearInterval(id);
  }, [flipped, sentenceCount]);

  return (
    <div className={styles.wrapper}>
      <div className={styles.perspective}>
        <motion.div
          className={styles.card}
          animate={{ rotateY: flipped ? 180 : 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          style={{ transformStyle: "preserve-3d" }}
        >
          <div
            className={styles.face}
            style={{ backfaceVisibility: "hidden", position: "absolute", inset: 0 }}
          >
            <motion.div
              key={index}
              className={styles.wordWrapper}
              initial={{ opacity: 0, y: 10, filter: "blur(6px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              <div>
                <h2 className={styles.word}>{card.front}</h2>
                {card.back?.meaning && (
                  <motion.p
                    className={styles.meaningFront}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 0.5, y: 0 }}
                    transition={{ duration: 0.6, delay: 2, ease: [0.22, 1, 0.36, 1] }}
                  >
                    {card.back.meaning}
                  </motion.p>
                )}
              </div>
            </motion.div>

            <hr className={styles.divider} />

            <div className={styles.sentenceBox}>
              <AnimatePresence mode='wait'>
                {sentences[sentenceIndex] && (
                  <motion.div
                    key={`${index}-${sentenceIndex}`}
                    initial={{ opacity: 0, x: 100, filter: "blur(4px)" }}
                    animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                    exit={{ opacity: 0, x: -100, filter: "blur(4px)" }}
                    transition={{
                      duration: 0.5,
                      delay: sentenceIndex === 0 ? 6 : 0,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                  >
                    <p className={styles.frontSentence}>{sentences[sentenceIndex].fr}</p>
                    <p className={styles.frontSentenceEng}>{sentences[sentenceIndex].en}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <div
            className={styles.face}
            style={{ transform: "rotateY(180deg)", backfaceVisibility: "hidden", position: "absolute", inset: 0 }}
          >
            <p className={styles.meaning}>{card.back?.meaning}</p>
            {sentences.length > 0 && (
              <div className={styles.sentences}>
                {sentences.map((s, i) => (
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
