"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import styles from "./Events.module.css";
import { motion } from "framer-motion";

const events = [
  {
    id: 1,
    title: "Global Missions & Purpose Summit",
    type: "Conference",
    time: "Annual Gathering · Afienya",
    image: "/assets/grayscale-shot-old-building-interior-surrounded-by-lights_181624-11774.jpg",
  },
  {
    id: 2,
    title: "Youth Awakening Fire Retreat",
    type: "Youth Retreat",
    time: "Weekend Encounter",
    image: "/assets/YOUTH.jpeg",
  },
  {
    id: 3,
    title: "Community Outreach & Visitation",
    type: "Evangelism & Care",
    time: "Monthly Saturday Outreach",
    image: "/assets/COM.jpeg",
  },
];

export default function Events() {
  return (
    <section id="events" className={styles.eventsSection}>
      <div className="container">
        <div className={styles.headerRow}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="s-badge">Special Gatherings</span>
            <h2 className={styles.title}>
              Upcoming <span className="serif-italic text-accent">events.</span>
            </h2>
          </motion.div>
          <p className={styles.subtitle}>
            Opportunities to connect with the body of Christ, experience renewal, and impact the community.
          </p>
        </div>

        <div className={styles.grid}>
          {events.map((event, idx) => (
            <motion.div 
              key={event.id} 
              className={`s-zoom ${styles.eventCard}`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
            >
              <div className={styles.imageWrapper}>
                <Image 
                  src={event.image} 
                  alt={event.title} 
                  fill
                  sizes="(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw"
                  className={styles.image}
                />
              </div>
              <div className={styles.info}>
                <div className={styles.text}>
                  <p className={styles.eventType}>{event.type}</p>
                  <h3 className={styles.eventTitle}>{event.title}</h3>
                  <p className={styles.eventTime}>{event.time}</p>
                </div>
                <Link href="/contact" className={styles.iconLink} aria-label={`Details for ${event.title}`}>
                  <ArrowUpRight size={22} />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
