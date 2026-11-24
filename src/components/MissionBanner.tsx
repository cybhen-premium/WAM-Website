"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./MissionBanner.module.css";
import { motion } from "framer-motion";
import defaultSections from "@/data/siteSections.json";

export default function MissionBanner() {
  const [data, setData] = useState(
    (defaultSections as any).missionBanner || {
      image: "https://res.cloudinary.com/dm5bp1efp/image/upload/v1795477218/world-ark-missions/7.jpg",
      titlePrefix: "A place of salvation,",
      titleHighlight: "transformation & purpose.",
      description:
        "We are dedicated to proclaiming the uncompromised Word of God, healing broken lives, and equipping believers to walk in spiritual authority, character, and divine destiny.",
    }
  );

  useEffect(() => {
    fetch(`/api/sections?t=${Date.now()}`, { cache: "no-store" })
      .then((res) => res.json())
      .then((resData) => {
        if (resData?.missionBanner) {
          setData(resData.missionBanner);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <section className={styles.bannerSection}>
      <Image 
        src={data.image} 
        alt="World Ark Missions Sanctuary Gathering" 
        fill
        sizes="100vw"
        className={styles.backgroundImage}
      />
      <div className={styles.overlay}></div>

      <div className={`container ${styles.content}`}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          style={{ display: "flex", flexDirection: "column", gap: "22px" }}
        >
          <h2 className={styles.title}>
            <span>{data.titlePrefix}</span>
            <span className="text-accent">{data.titleHighlight}</span>
          </h2>

          <p className={styles.description}>
            {data.description}
          </p>

          <div className={styles.buttons}>
            <Link href="#services" className="s-btn">
              Plan your visit
            </Link>
            <Link href="/giving" className="s-btn-outline">
              Partner with the mission
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
