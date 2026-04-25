"use client";

import Image from "next/image";
import styles from "./Founder.module.css";
import { motion } from "framer-motion";

export default function Founder() {
  return (
    <section id="founder" className={styles.founderSection}>
      <div className="container">
        <div className={styles.grid}>
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className={styles.imageSide}
          >
            <div className={styles.imageWrapper}>
              <Image 
                src="/assets/rev.jpeg" 
                alt="Rev. Benjamin Eturu Adom" 
                fill
                className={styles.founderImage}
                priority
              />
            </div>
            <div className={styles.nameCard}>
              <h3>Rev. Benjamin Eturu Adom</h3>
              <p>Visionary Founder</p>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            className={styles.contentSide}
          >
            <span className={styles.badge}>Our Founder</span>
            <h2 className="highlight-text">Meet Rev. Benjamin Eturu Adom</h2>
            <div className={styles.bio}>
              <p>
                Rev. Benjamin Eturu Adom is the visionary founder of World Ark Mission, 
                a ministry birthed out of a deep passion for God and a calling to impact 
                lives through the message of salvation and transformation.
              </p>
              <p>
                From humble beginnings, Rev. Adom demonstrated an unwavering commitment 
                to the work of God, dedicating his life to prayer, teaching, and spreading 
                the Gospel. Through divine direction and a strong burden for souls, he 
                established World Ark Mission as a place where people can encounter God, 
                grow spiritually, and discover their purpose.
              </p>
              <p>
                His ministry is marked by powerful teachings, a strong emphasis on the 
                Word of God, and a passion for raising believers who live impactful and 
                Christ-centered lives. Under his leadership, World Ark Mission continues 
                to grow, touching lives and communities with the love and power of God.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
