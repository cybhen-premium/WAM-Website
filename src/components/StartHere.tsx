"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./StartHere.module.css";
import { motion } from "framer-motion";
import defaultSections from "@/data/siteSections.json";

const defaultPathways = defaultSections.startHere || [
  {
    tag: "New?",
    title: "Start here",
    desc: "Times, directions to Afienya, and what to expect.",
    href: "#services",
    image: "https://res.cloudinary.com/dm5bp1efp/image/upload/v1795477258/world-ark-missions/SUNDAY.jpg",
  },
  {
    tag: "Online",
    title: "Watch",
    desc: "Every message and service, live and on demand.",
    href: "#sermons",
    image: "https://res.cloudinary.com/dm5bp1efp/image/upload/v1795477240/world-ark-missions/holy-week-celebration-vivid-colors_23-2151195211.jpg",
  },
  {
    tag: "Community",
    title: "Belong",
    desc: "Ministries and fellowship groups for every generation.",
    href: "#ministries",
    image: "https://res.cloudinary.com/dm5bp1efp/image/upload/v1795477208/world-ark-missions/11.jpg",
  },
  {
    tag: "Partner",
    title: "Give",
    desc: "Partner with us in Kingdom expansion and community outreach.",
    href: "/giving",
    image: "https://res.cloudinary.com/dm5bp1efp/image/upload/v1795477218/world-ark-missions/7.jpg",
  },
];

export default function StartHere() {
  const [pathways, setPathways] = useState(defaultPathways);
  const [header, setHeader] = useState(defaultSections.startHereHeader || {
    titlePrefix: "Start",
    titleHighlight: "here.",
    subtitle: "Four ways to connect with World Ark Missions."
  });

  useEffect(() => {
    fetch("/api/sections")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data?.startHere) && data.startHere.length > 0) {
          setPathways(data.startHere);
        }
        if (data?.startHereHeader) {
          setHeader((prev) => ({ ...prev, ...data.startHereHeader }));
        }
      })
      .catch(() => {});
  }, []);

  return (
    <section id="start-here" className={styles.section}>
      <div className="container">
        <div className={styles.headerRow}>
          <h2 className={styles.title}>
            {header.titlePrefix} <span className="serif-italic text-accent">{header.titleHighlight}</span>
          </h2>
          <p className={styles.subtitle}>
            {header.subtitle}
          </p>
        </div>

        <div className={styles.cardsGrid}>
          {pathways.map((p, idx) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="s-zoom"
            >
              <Link href={p.href} className={styles.card}>
                <Image 
                  src={p.image} 
                  alt={p.title} 
                  fill 
                  sizes="(min-width: 1200px) 25vw, (min-width: 768px) 50vw, 100vw"
                  className={styles.cardImage}
                />
                <div className={styles.cardOverlay}></div>

                <p className={styles.cardTag}>{p.tag}</p>
                <div className={styles.cardBottom}>
                  <h3 className={styles.cardTitle}>{p.title}</h3>
                  <p className={styles.cardDesc}>{p.desc}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
