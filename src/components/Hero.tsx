"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./Hero.module.css";
import { motion } from "framer-motion";

export default function Hero() {
  const [heroData, setHeroData] = useState({
    image: "/assets/SUNDAY.jpeg",
    titlePrefix: "Sunday at",
    titleHighlight: "World Ark Missions",
    subtitle: "A Place of Salvation, Transformation & Purpose · Afienya",
    serviceTag: "Sunday Worship",
    serviceHeading: "Now two services",
    serviceTimes: "Sundays 8:00 AM · 10:30 AM",
  });

  useEffect(() => {
    fetch("/api/sections")
      .then((res) => res.json())
      .then((data) => {
        if (data?.hero?.image) {
          setHeroData((prev) => ({ ...prev, ...data.hero }));
        }
      })
      .catch(() => {});
  }, []);

  return (
    <section className={styles.heroSection}>
      <Image 
        src={heroData.image} 
        alt="World Ark Missions Sanctuary Worship" 
        fill
        sizes="100vw"
        priority
        className={styles.heroBackground}
      />
      <div className={styles.heroOverlay}></div>

      <div className={`container ${styles.heroContent}`}>
        <div className={styles.heroGrid}>
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className={styles.mainCol}
          >
            <h1 className={styles.heroTitle}>
              {heroData.titlePrefix}<br />
              <span className="text-accent">{heroData.titleHighlight}</span>
            </h1>
            <p className={styles.heroSubtitle}>
              {heroData.subtitle}
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className={styles.serviceCard}
          >
            <p className={styles.cardTag}>{heroData.serviceTag}</p>
            <p className={styles.cardHeading}>
              {heroData.serviceHeading}
            </p>
            <p className={styles.cardTime}>
              {heroData.serviceTimes}
            </p>
            <a href="#services" className="s-btn-pill">
              View Schedule
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
