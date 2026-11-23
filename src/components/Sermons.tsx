"use client";

import Image from "next/image";
import Link from "next/link";
import styles from "./Sermons.module.css";
import { motion } from "framer-motion";

const sermons = [
  {
    id: 1,
    title: "Living with Divine Purpose",
    speaker: "Rev. Benjamin Eturu Adom",
    date: "Sunday Service",
    category: "Sunday Word",
    image: "https://res.cloudinary.com/dm5bp1efp/image/upload/v1795477258/world-ark-missions/SUNDAY.jpg",
  },
  {
    id: 2,
    title: "The Power of Persistent Prayer",
    speaker: "Rev. Benjamin Eturu Adom",
    date: "Friday Night",
    category: "Rescue Hour",
    image: "https://res.cloudinary.com/dm5bp1efp/image/upload/v1795477251/world-ark-missions/rescue.jpg",
  },
  {
    id: 3,
    title: "Walking in Undiluted Grace",
    speaker: "Rev. Benjamin Eturu Adom",
    date: "Wednesday Word",
    category: "Know Jesus More",
    image: "https://res.cloudinary.com/dm5bp1efp/image/upload/v1795477238/world-ark-missions/KJMC.jpg",
  },
];

export default function Sermons() {
  return (
    <section id="sermons" className={styles.section}>
      <div className="container">
        <div className={styles.headerRow}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="s-badge">Media &amp; Teachings</span>
            <h2 className={styles.title}>
              Recent <span className="serif-italic text-accent">messages.</span>
            </h2>
          </motion.div>
          <p className={styles.subtitle}>
            Encounter life-transforming biblical teaching, sermons, and prayer encounters anywhere, anytime.
          </p>
        </div>

        <div className={styles.grid}>
          {sermons.map((sermon, idx) => (
            <motion.article 
              key={sermon.id} 
              className={`s-zoom ${styles.card}`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
            >
              <div className={styles.imageWrapper}>
                <Image 
                  src={sermon.image} 
                  alt={sermon.title} 
                  fill
                  sizes="(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw"
                  className={styles.image}
                />
                <span className={styles.categoryBadge}>{sermon.category}</span>
              </div>

              <div className={styles.body}>
                <h3 className={styles.cardTitle}>{sermon.title}</h3>
                <div className={styles.meta}>
                  <span>{sermon.speaker}</span>
                  <span>{sermon.date}</span>
                </div>
                <Link href="#live" className={styles.watchLink}>
                  Watch message →
                </Link>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
