"use client";

import { useParams, useRouter } from "next/navigation";
import { ministriesData } from "@/data/ministriesData";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Users, UserCircle, Crown, Baby, Cross } from "lucide-react";
import styles from "./MinistryDetails.module.css";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function MinistryPage() {
  const { slug } = useParams();
  const router = useRouter();
  
  const ministry = ministriesData.find((m) => m.slug === slug);

  if (!ministry) {
    return (
      <div className={styles.notFound}>
        <h1>Ministry not found</h1>
        <Link href="/#ministries">Go back</Link>
      </div>
    );
  }

  const Icon = { Users, UserCircle, Crown, Baby, Cross }[ministry.iconName] || Users;

  return (
    <main className={styles.page}>
      <Navbar />
      
      <section className={styles.hero}>
        <div className={styles.heroBg}>
          <Image src={ministry.image} alt={ministry.title} fill className={styles.bgImage} priority />
          <div className={styles.overlay}></div>
        </div>
        
        <div className="container">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className={styles.heroContent}
          >
            <Link href="/#ministries" className={styles.backButton}>
              <ArrowLeft size={20} />
              Back to Ministries
            </Link>
            <div className={styles.iconWrapper}>
              <Icon size={48} />
            </div>
            <h1>{ministry.title}</h1>
            <p>{ministry.shortDescription}</p>
          </motion.div>
        </div>
      </section>

      <section className={styles.detailsSection}>
        <div className="container">
          <div className={styles.detailsGrid}>
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className={styles.textContent}
            >
              <h2 className="highlight-text">About this Ministry</h2>
              <p>{ministry.longDescription}</p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className={styles.galleryGrid}
            >
              {ministry.gallery.map((img, i) => (
                <div key={i} className={styles.galleryItem}>
                  <Image src={img} alt={`${ministry.title} gallery ${i}`} fill />
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
