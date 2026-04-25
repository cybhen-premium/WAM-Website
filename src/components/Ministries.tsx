"use client";

import styles from "./Ministries.module.css";
import { Users, UserCircle, Crown, Baby, Cross } from "lucide-react";
import Image from "next/image";
import { motion } from "framer-motion";
import Link from "next/link";
import { ministriesData } from "@/data/ministriesData";

export default function Ministries() {
  return (
    <section id="ministries" className={styles.ministriesSection}>
      <div className="container">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className={styles.header}
        >
          <span className={styles.badge}>Get Involved</span>
          <h2 className={styles.title}>Our Ministries</h2>
          <p className={styles.subText}>Find your place in our family and serve with your unique gifts.</p>
        </motion.div>
        
        <div className={styles.grid}>
          {ministriesData.map((m, index) => {
            const Icon = { Users, UserCircle, Crown, Baby, Cross }[m.iconName] || Users;
            
            return (
              <motion.div 
                key={m.slug} 
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ 
                  y: -10, 
                  scale: 1.02,
                  transition: { duration: 0.3 }
                }}
                className={styles.card}
              >
                <div className={styles.imageOverlay}>
                  <Image src={m.image} alt={m.title} fill className={styles.bgImage} />
                </div>
                <div className={styles.cardContent}>
                  <div className={styles.iconWrapper}><Icon size={32} /></div>
                  <h3>{m.title}</h3>
                  <p>{m.shortDescription}</p>
                  <Link href={`/ministries/${m.slug}`} className={styles.learnMore}>
                    Learn More
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
