"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import styles from "./AgendaSection.module.css";
import { motion } from "framer-motion";

const defaultGatherings = [
  {
    dayNum: "SUN",
    badge: "WEEKLY",
    category: "Main Worship Service",
    title: "Sunday Celebration Service",
    time: "8:00 AM & 10:30 AM · Main Sanctuary, Afienya",
    link: "#services",
  },
  {
    dayNum: "WED",
    badge: "WEEKLY",
    category: "Spiritual Growth",
    title: "Know Jesus More (KJMC)",
    time: "6:30 PM · Deep Scripture & Discipleship",
    link: "#services",
  },
  {
    dayNum: "FRI",
    badge: "WEEKLY",
    category: "Intercession & Healing",
    title: "Rescue Hour of Prayer",
    time: "6:30 PM · Prayer, Deliverance & Breakthrough",
    link: "#services",
  },
  {
    dayNum: "SAT",
    badge: "WEEKLY",
    category: "Evangelism & Care",
    title: "Community Outreach & Visitation",
    time: "Saturday Morning · Community Impact & Fellowship",
    link: "#services",
  },
];

export default function AgendaSection() {
  const [gatherings, setGatherings] = useState(defaultGatherings);
  const [header, setHeader] = useState({
    titlePrefix: "Services &",
    titleHighlight: "upcoming.",
    subtitle: "Weekly worship services, scripture discipleship, and prayer encounters."
  });

  useEffect(() => {
    fetch("/api/sections")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data?.gatherings) && data.gatherings.length > 0) {
          setGatherings(data.gatherings);
        }
        if (data?.servicesHeader) {
          setHeader((prev) => ({ ...prev, ...data.servicesHeader }));
        }
      })
      .catch(() => {});
  }, []);

  return (
    <section id="services" className={styles.agendaSection}>
      <div className="container">
        <div className={styles.grid}>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className={styles.leftCol}
          >
            <h2 className={styles.title}>
              {header.titlePrefix} <span className="serif-italic text-accent">{header.titleHighlight}</span>
            </h2>
            <p className={styles.subtitle}>
              {header.subtitle}
            </p>
            <Link href="#events" className={`s-btn-outline ${styles.calendarBtn}`}>
              Full calendar
            </Link>
          </motion.div>

          <div className={styles.listContainer}>
            {gatherings.map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
              >
                <Link href={item.link} className={styles.rowItem}>
                  <div className={styles.dateCol}>
                    <span className={styles.dayNumber}>{item.dayNum}</span>
                    <span className={styles.dayBadge}>{item.badge}</span>
                  </div>

                  <div className={styles.detailsCol}>
                    <span className={styles.category}>{item.category}</span>
                    <h3 className={styles.eventTitle}>{item.title}</h3>
                    <span className={styles.eventMeta}>{item.time}</span>
                  </div>

                  <div className={styles.arrowCol}>→</div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
