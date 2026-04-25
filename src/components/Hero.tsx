"use client";

import Image from "next/image";
import Link from "next/link";
import { Play } from "lucide-react";
import styles from "./Hero.module.css";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

const bgImages = [
  "/assets/10.jpg",
  "/assets/11.jpg",
  "/assets/12.jpg",
  "/assets/13.jpg",
];

export default function Hero() {
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % bgImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section id="home" className={styles.heroSection}>
      <div className={styles.backgroundContainer}>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentImage}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            className={styles.backgroundImageWrapper}
          >
            <Image
              src={bgImages[currentImage]}
              alt="Church Background"
              fill
              className={styles.backgroundImage}
              priority
            />
            <div className={styles.overlay}></div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="container">
        <div className={styles.heroContent}>
          <div className={styles.textContent}>
            <motion.span 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className={styles.badge}
            >
              Welcome Home
            </motion.span>
            
            <motion.h1 className={styles.churchName}>
              {"World Ark Missions".split("").map((letter, index) => (
                <motion.span
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ 
                    duration: 0.5, 
                    delay: 0.2 + (index * 0.05),
                    ease: [0.33, 1, 0.68, 1]
                  }}
                  style={{ display: "inline-block", whiteSpace: letter === " " ? "pre" : "normal" }}
                >
                  {letter}
                </motion.span>
              ))}
            </motion.h1>

            <motion.h2 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className={styles.heroSubTitle}
            >
              A Place of Salvation, Transformation & Purpose
            </motion.h2>

            <motion.p 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="sub-text"
              style={{ maxWidth: "700px", margin: "0 auto" }}
            >
              Join World Ark Missions for an uplifting experience of faith, hope, and community. 
              Discover your true purpose in a place you can call home.
            </motion.p>
          </div>
        </div>
      </div>

      {/* Floating Live Stream Card */}
      <motion.div 
        initial={{ x: "-50%", y: 100, opacity: 0 }}
        animate={{ x: "-50%", y: "50%", opacity: 1 }}
        transition={{ duration: 1, delay: 1 }}
        className={styles.liveCard}
      >
        <div className={styles.liveImage}>
          <Image 
            src="/assets/SUNDAY.jpeg" 
            alt="Sunday Live Stream" 
            fill
          />
        </div>
        <div className={styles.liveInfo}>
          <h3>Join the Sunday Live Stream</h3>
          <p>Every Sunday at 8:00 AM & 10:30 AM</p>
          <div className={styles.liveActions}>
            <Link href="#live" className={styles.joinNow}>
              Join Now
              <Play size={16} fill="currentColor" />
            </Link>
            <Link href="#sermons" className={styles.pastMessages}>
              Past Messages
            </Link>
          </div>
        </div>
      </motion.div>
    </section>
  );
}



