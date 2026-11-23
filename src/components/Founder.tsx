"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./Founder.module.css";
import { motion } from "framer-motion";

export default function Founder() {
  const [founderData, setFounderData] = useState({
    founderImage: "/assets/rev.jpeg",
    familyImage: "/assets/11.jpg",
    tag: "Our Vision & Leadership",
    title: "Hope that doesn’t fade.",
    founderName: "Rev. Benjamin Adom",
    familyLabel: "Worship Family",
    bio1: "Rev. Benjamin Eturu Adom is the visionary founder of World Ark Missions, a ministry birthed out of a deep passion for God and a divine mandate to touch lives through the power of salvation and transformation.",
    bio2: "From humble beginnings in Afienya, Rev. Adom dedicated his life to prayer, deep scripture teaching, and raising a family of believers whose lives impact society. At World Ark Missions, everyone discovers a genuine home where they can encounter Christ and unlock their God-given destiny.",
  });

  useEffect(() => {
    fetch("/api/sections")
      .then((res) => res.json())
      .then((data) => {
        if (data?.founder) {
          setFounderData((prev) => ({ ...prev, ...data.founder }));
        }
      })
      .catch(() => {});
  }, []);

  return (
    <section id="founder" className={styles.section}>
      <div className="container">
        <div className={styles.grid}>
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className={styles.contentCol}
          >
            <p className={styles.tag}>{founderData.tag}</p>
            <h2 className={styles.title}>
              {founderData.title}
            </h2>
            <div className={styles.bio}>
              <p>{founderData.bio1}</p>
              <p>{founderData.bio2}</p>
            </div>
            <div className={styles.actions}>
              <Link href="/about" className="s-btn">
                Our story & history →
              </Link>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className={styles.imagesCol}
          >
            <div className={`s-zoom ${styles.imageWrapper}`}>
              <Image 
                src={founderData.founderImage} 
                alt={`${founderData.founderName || "Founder"}`} 
                fill
                sizes="(min-width: 992px) 25vw, 50vw"
                className={styles.image}
              />
              <div className={styles.imageLabel}>{founderData.founderName || "Rev. Benjamin Adom"}</div>
            </div>

            <div className={`s-zoom ${styles.imageWrapper} ${styles.offsetImage}`}>
              <Image 
                src={founderData.familyImage} 
                alt={`${founderData.familyLabel || "Worship Family"}`} 
                fill
                sizes="(min-width: 992px) 25vw, 50vw"
                className={styles.image}
              />
              <div className={styles.imageLabel}>{founderData.familyLabel || "Worship Family"}</div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
