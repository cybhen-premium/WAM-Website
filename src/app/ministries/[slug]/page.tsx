"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import defaultMinistries from "@/data/ministries.json";
import { MinistryData } from "@/data/ministriesData";
import Image from "next/image";
import Link from "next/link";
import { 
  ArrowLeft, ArrowRight, Users, UserCircle, Crown, Baby, Cross, 
  Calendar, MapPin, Heart, Sparkles, ShieldCheck 
} from "lucide-react";
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
      <main className={styles.page}>
        <Navbar />
        <div className="container" style={{ padding: "140px 0 100px 0", textAlign: "center" }}>
          <h1 style={{ fontFamily: "var(--font-heading)", fontSize: "2.5rem", marginBottom: "1rem" }}>Ministry Not Found</h1>
          <p style={{ color: "var(--text-muted)", marginBottom: "2rem" }}>The ministry you are looking for does not exist or has been moved.</p>
          <Link href="/#ministries" className={styles.joinButton} style={{ display: "inline-flex", width: "auto" }}>
            <ArrowLeft size={18} />
            Back to Ministries
          </Link>
        </div>
        <Footer />
      </main>
    );
  }

  const Icon = { Users, UserCircle, Crown, Baby, Cross }[ministry.iconName] || Users;

  return (
    <main className={styles.page}>
      <Navbar />
      
      {/* HERO BANNER */}
      <section className={styles.hero}>
        <div className={styles.heroBg}>
          <Image 
            src={ministry.image} 
            alt={ministry.title} 
            fill 
            sizes="100vw" 
            className={styles.bgImage} 
            priority 
          />
          <div className={styles.overlay}></div>
        </div>
        
        <div className="container">
          <motion.div 
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className={styles.heroContent}
          >
            <Link href="/#ministries" className={styles.backButton}>
              <ArrowLeft size={16} />
              Back to All Ministries
            </Link>

            <div className={styles.iconWrapper}>
              <Icon size={32} />
            </div>

            <h1 className={styles.title}>{ministry.title}</h1>
            <p className={styles.tagline}>{ministry.shortDescription}</p>
          </motion.div>
        </div>
      </section>

      {/* ABOUT & DETAILS */}
      <section className={styles.detailsSection}>
        <div className="container">
          <div className={styles.detailsGrid}>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className={styles.textContent}
            >
              <div>
                <span className={styles.badge}>Our Heart &amp; Calling</span>
                <h2 className={styles.sectionHeading}>About the Ministry</h2>
              </div>

              <p className={styles.descriptionParagraph}>
                {ministry.longDescription}
              </p>

              {/* Ministry Pillars */}
              <div className={styles.pillarsGrid}>
                <div className={styles.pillarCard}>
                  <h4>
                    <Sparkles size={18} color="var(--color-accent)" />
                    Spiritual Growth
                  </h4>
                  <p>Equipping members with biblical wisdom, spiritual authority, and rooted faith.</p>
                </div>

                <div className={styles.pillarCard}>
                  <h4>
                    <Heart size={18} color="var(--color-accent)" />
                    Warm Sisterhood &amp; Family
                  </h4>
                  <p>Building genuine bonds of love, support, prayer, and accountability.</p>
                </div>

                <div className={styles.pillarCard}>
                  <h4>
                    <ShieldCheck size={18} color="var(--color-accent)" />
                    Kingdom Purpose
                  </h4>
                  <p>Discovering your God-given calling and making an eternal impact in church and society.</p>
                </div>
              </div>
            </motion.div>
            
            {/* STICKY SIDEBAR */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className={styles.sidebar}
            >
              <div className={styles.joinCard}>
                <div className={styles.joinHeader}>
                  <h3>Get Involved</h3>
                  <p>Ready to connect, grow, and serve with {ministry.title}?</p>
                </div>

                <div className={styles.joinDetailsList}>
                  <div className={styles.joinDetailItem}>
                    <MapPin size={18} className={styles.joinDetailIcon} />
                    <span>World Ark Missions Sanctuary, Afienya</span>
                  </div>
                  <div className={styles.joinDetailItem}>
                    <Calendar size={18} className={styles.joinDetailIcon} />
                    <span>Every Sunday &amp; Mid-week Gatherings</span>
                  </div>
                  <div className={styles.joinDetailItem}>
                    <Users size={18} className={styles.joinDetailIcon} />
                    <span>Open to all church members &amp; visitors</span>
                  </div>
                </div>

                <Link href="/contact" className={styles.joinButton}>
                  Join this Ministry
                  <ArrowRight size={18} />
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* GALLERY SECTION */}
      {ministry.gallery && ministry.gallery.length > 0 && (
        <section className={styles.gallerySection}>
          <div className="container">
            <div className={styles.galleryHeader}>
              <span className={styles.badge}>Moments &amp; Fellowship</span>
              <h2>Life in {ministry.title}</h2>
              <p>Highlights of fellowship, service, and growth together in Christ.</p>
            </div>

            <div className={styles.galleryGrid}>
              {ministry.gallery.map((img, idx) => (
                <div key={idx} className={styles.galleryItem}>
                  <Image 
                    src={img} 
                    alt={`${ministry.title} moment ${idx + 1}`} 
                    fill 
                    sizes="(min-width: 992px) 33vw, (min-width: 640px) 50vw, 100vw" 
                  />
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
