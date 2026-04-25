"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import styles from "./Navbar.module.css";
import { useEffect, useState } from "react";
import { clsx } from "clsx";
import { motion } from "framer-motion";
import Image from "next/image";
import Magnetic from "./Magnetic";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [isLive, setIsLive] = useState(false);

  useEffect(() => {
    const checkLive = async () => {
      try {
        const res = await fetch("/api/settings/live");
        const data = await res.json();
        if (data.isLive) setIsLive(true);
      } catch (error) {}
    };
    checkLive();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!mobileMenuOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileMenuOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [mobileMenuOpen]);

  const [announcement, setAnnouncement] = useState("");
  const [announcementEnabled, setAnnouncementEnabled] = useState(false);

  useEffect(() => {
    const fetchSiteSettings = async () => {
      try {
        const res = await fetch("/api/settings/site");
        const data = await res.json();
        if (data.announcement) setAnnouncement(data.announcement);
        if (data.announcementEnabled === "true" || data.announcementEnabled === true) {
          setAnnouncementEnabled(true);
        } else {
          setAnnouncementEnabled(false);
        }
      } catch (error) {}
    };
    fetchSiteSettings();
  }, []);

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8 }}
      className={clsx(styles.navWrapper, scrolled && styles.navScrolled)}
    >
      {(announcement && announcementEnabled) && (
        <div className={styles.topBar}>
          <p>{announcement}</p>
        </div>
      )}
      <div className={styles.navContainer}>
        <Link href="/" className={styles.logoWrapper}>
          <Image 
            src="/assets/logo.png" 
            alt="World Ark Missions Logo" 
            width={40} 
            height={40} 
            className={styles.logo}
            priority
          />
          <span className={styles.logoText}>World Ark Missions</span>
        </Link>

        <div className={styles.links}>
          <Link href="/#home" className={styles.link}>Home</Link>
          {isLive && (
            <Link href="/live" className={styles.liveBadge}>
              <span className={styles.liveDot}></span>
              Live Now
            </Link>
          )}
          <Link href="/about" className={styles.link}>About</Link>
          <Link href="/#ministries" className={styles.link}>Ministries</Link>
          <Link href="/#services" className={styles.link}>Services</Link>
          <Link href="/#sermons" className={styles.link}>Sermons</Link>
          <Link href="/giving" className={styles.link}>Giving</Link>
          <Link href="/contact" className={styles.link}>Contact</Link>
        </div>

        <div className={styles.actions}>
          <Magnetic>
            <Link href="/contact" className={styles.ctaButton}>
              Plan a Visit
            </Link>
          </Magnetic>

          <button
            className={styles.mobileMenuToggle}
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Open menu"
            aria-expanded={mobileMenuOpen}
          >
            <Menu size={24} />
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className={styles.mobileMenuRoot}>
          <button
            className={styles.mobileMenuBackdrop}
            onClick={() => setMobileMenuOpen(false)}
            aria-label="Close menu"
          />
          <div className={styles.mobileMenuPanel}>
            <div className={styles.mobileMenuHeader}>
              <span className={styles.mobileMenuTitle}>Menu</span>
              <button
                className={styles.mobileMenuClose}
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Close menu"
              >
                <X size={22} />
              </button>
            </div>

            <div className={styles.mobileMenuLinks}>
              <Link href="/#home" className={styles.mobileMenuLink} onClick={() => setMobileMenuOpen(false)}>Home</Link>
              {isLive && (
                <Link href="/live" className={styles.mobileMenuLink} onClick={() => setMobileMenuOpen(false)}>Live Now</Link>
              )}
              <Link href="/about" className={styles.mobileMenuLink} onClick={() => setMobileMenuOpen(false)}>About</Link>
              <Link href="/#ministries" className={styles.mobileMenuLink} onClick={() => setMobileMenuOpen(false)}>Ministries</Link>
              <Link href="/#services" className={styles.mobileMenuLink} onClick={() => setMobileMenuOpen(false)}>Services</Link>
              <Link href="/#sermons" className={styles.mobileMenuLink} onClick={() => setMobileMenuOpen(false)}>Sermons</Link>
              <Link href="/giving" className={styles.mobileMenuLink} onClick={() => setMobileMenuOpen(false)}>Giving</Link>
              <Link href="/contact" className={styles.mobileMenuLink} onClick={() => setMobileMenuOpen(false)}>Contact</Link>
            </div>

            <Link href="/contact" className={styles.mobileMenuCta} onClick={() => setMobileMenuOpen(false)}>
              Plan a Visit
            </Link>
          </div>
        </div>
      )}
    </motion.nav>
  );
}
