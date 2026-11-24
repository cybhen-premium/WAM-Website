"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import defaultMinistries from "@/data/ministries.json";
import { MinistryData } from "@/data/ministriesData";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Users, UserCircle, Crown, Baby, Cross } from "lucide-react";
import styles from "./MinistryDetails.module.css";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function MinistryPage() {
  const { slug } = useParams();
  const [ministries, setMinistries] = useState<MinistryData[]>(defaultMinistries as unknown as MinistryData[]);

  useEffect(() => {
    fetch(`/api/ministries?t=${Date.now()}`, { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setMinistries(data);
        }
      })
      .catch(() => {});
  }, []);
  
  const ministry = ministries.find((m) => m.slug === slug);

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
          <Image src={ministry.image} alt={ministry.title} fill sizes="100vw" className={styles.bgImage} priority />
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
            <h1 className={styles.title}>{ministry.title}</h1>
            <p className={styles.tagline}>{ministry.shortDescription}</p>
          </motion.div>
        </div>
      </section>

      <section className={styles.details}>
        <div className="container">
          <div className={styles.grid}>
            <div className={styles.mainContent}>
              <h2>About the Ministry</h2>
              <p>{ministry.longDescription}</p>
            </div>
            
            <div className={styles.sidebar}>
              <div className={styles.joinCard}>
                <h3>Get Involved</h3>
                <p>Ready to connect, grow, and serve with {ministry.title}?</p>
                <Link href="/contact" className={styles.joinButton}>
                  Join this Ministry
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {ministry.gallery && ministry.gallery.length > 0 && (
        <section className={styles.gallery}>
          <div className="container">
            <h2>Life in {ministry.title}</h2>
            <div className={styles.galleryGrid}>
              {ministry.gallery.map((img, idx) => (
                <div key={idx} className={styles.galleryItem}>
                  <Image src={img} alt={`${ministry.title} photo ${idx + 1}`} fill sizes="(min-width: 768px) 33vw, 100vw" />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer />
    </main>
  );
}
