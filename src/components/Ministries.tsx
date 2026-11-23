"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./Ministries.module.css";
import { ministriesData, MinistryData } from "@/data/ministriesData";
import { motion } from "framer-motion";

export default function Ministries() {
  const [list, setList] = useState<MinistryData[]>(ministriesData);
  const [header, setHeader] = useState({
    badge: "Our Ministries",
    titlePrefix: "Belong &",
    titleHighlight: "serve.",
    subtitle: "Discover communities where you can grow spiritually, build meaningful relationships, and serve God."
  });

  useEffect(() => {
    fetch("/api/ministries")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setList(data);
        }
      })
      .catch(() => {});

    fetch("/api/sections")
      .then((res) => res.json())
      .then((data) => {
        if (data?.ministriesHeader) {
          setHeader((prev) => ({ ...prev, ...data.ministriesHeader }));
        }
      })
      .catch(() => {});
  }, []);

  return (
    <section id="ministries" className={styles.section}>
      <div className="container">
        <div className={styles.headerRow}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="s-badge">{header.badge}</span>
            <h2 className={styles.title}>
              {header.titlePrefix} <span className="serif-italic text-accent">{header.titleHighlight}</span>
            </h2>
          </motion.div>
          <p className={styles.subtitle}>
            {header.subtitle}
          </p>
        </div>

        <div className={styles.grid}>
          {list.slice(0, 6).map((m, idx) => (
            <motion.div
              key={m.slug}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.08 }}
              className="s-zoom"
            >
              <Link href={`/ministries/${m.slug}`} className={styles.card}>
                <Image 
                  src={m.image} 
                  alt={m.title} 
                  fill
                  sizes="(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw"
                  className={styles.cardImage}
                />
                <div className={styles.cardOverlay}></div>

                <div className={styles.content}>
                  <h3 className={styles.cardTitle}>{m.title}</h3>
                  <p className={styles.cardDesc}>{m.shortDescription}</p>
                  <span className={styles.learnMore}>
                    Learn more →
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
