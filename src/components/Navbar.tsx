"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import styles from "./Navbar.module.css";
import { clsx } from "clsx";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLive, setIsLive] = useState(false);
  const [churchName, setChurchName] = useState("World Ark Missions");

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    fetch("/api/sections")
      .then((res) => res.json())
      .then((data) => {
        if (data?.brand?.churchName) {
          setChurchName(data.brand.churchName);
        } else if (data?.hero?.titleHighlight) {
          setChurchName(data.hero.titleHighlight);
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const checkLive = async () => {
      try {
        const res = await fetch("/api/settings/live");
        const data = await res.json();
        if (data.isLive) setIsLive(true);
      } catch {}
    };
    checkLive();
  }, []);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [mobileMenuOpen]);

  return (
    <>
      <header className={clsx(styles.header, scrolled && styles.headerScrolled)}>
        <div className={styles.headerContainer}>
          <Link href="/" className={styles.logoLink} aria-label={`${churchName} Home`}>
            <Image 
              src="/assets/logo.png" 
              alt={`${churchName} Logo`} 
              width={34} 
              height={34} 
              className={styles.logoImage}
              priority
            />
            <span className={styles.logoText}>{churchName}</span>
          </Link>

          <nav className={styles.nav} aria-label="Main Navigation">
            <Link href="/#start-here" className={styles.navLink}>Start Here</Link>
            <Link href="/#services" className={styles.navLink}>Services</Link>
            <Link href="/#ministries" className={styles.navLink}>Ministries</Link>
            <Link href="/#sermons" className={styles.navLink}>Messages</Link>
            <Link href="/#events" className={styles.navLink}>Events</Link>
            <Link href="/about" className={styles.navLink}>About</Link>
            <Link href="/giving" className={styles.navLink}>Giving</Link>
            <Link href="/contact" className={styles.navLink}>Contact</Link>
            {isLive && (
              <Link href="#live" className={styles.liveTag}>
                <span className={styles.liveDot}></span>
                Live Now
              </Link>
            )}
          </nav>

          <div className={styles.actions}>
            <Link href="/#services" className="s-btn" style={{ padding: "12px 22px", fontSize: "14px" }}>
              Start here
            </Link>
            <button 
              className={styles.menuButton} 
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open Navigation Menu"
            >
              <div className={styles.menuLines}>
                <span className={styles.menuLine}></span>
                <span className={styles.menuLine}></span>
              </div>
              Menu
            </button>
          </div>
        </div>
      </header>

      {/* Fullscreen Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className={styles.mobileOverlay}>
          <div className={styles.mobileHeader}>
            <Link href="/" className={styles.logoLink} onClick={() => setMobileMenuOpen(false)}>
              <Image 
                src="/assets/logo.png" 
                alt="World Ark Missions Logo" 
                width={32} 
                height={32} 
                className={styles.logoImage}
              />
              <span className={styles.logoText}>World Ark Missions</span>
            </Link>
            <button 
              className={styles.closeBtn} 
              onClick={() => setMobileMenuOpen(false)}
              aria-label="Close Navigation Menu"
            >
              Close ✕
            </button>
          </div>

          <div className={styles.mobileLinks}>
            <Link href="/#start-here" className={styles.mobileNavLink} onClick={() => setMobileMenuOpen(false)}>
              Start Here
            </Link>
            <Link href="/#services" className={styles.mobileNavLink} onClick={() => setMobileMenuOpen(false)}>
              Services
            </Link>
            <Link href="/#ministries" className={styles.mobileNavLink} onClick={() => setMobileMenuOpen(false)}>
              Ministries
            </Link>
            <Link href="/#sermons" className={styles.mobileNavLink} onClick={() => setMobileMenuOpen(false)}>
              Messages
            </Link>
            <Link href="/#events" className={styles.mobileNavLink} onClick={() => setMobileMenuOpen(false)}>
              Events
            </Link>
            <Link href="/about" className={styles.mobileNavLink} onClick={() => setMobileMenuOpen(false)}>
              About Us
            </Link>
            <Link href="/giving" className={styles.mobileNavLink} onClick={() => setMobileMenuOpen(false)}>
              Giving
            </Link>
            <Link href="/contact" className={styles.mobileNavLink} onClick={() => setMobileMenuOpen(false)}>
              Contact
            </Link>
          </div>

          <div className={styles.mobileFooter}>
            <p className={styles.mobileInfo}>
              <strong>Afienya, Greater Accra, Ghana</strong><br />
              Sundays: 8:00 AM · 10:30 AM | Wednesday: 6:30 PM | Friday: 6:30 PM
            </p>
            <div className={styles.mobileSocials}>
              <a href="https://facebook.com" target="_blank" rel="noreferrer" className={styles.mobileSocialLink}>Facebook</a>
              <a href="https://youtube.com" target="_blank" rel="noreferrer" className={styles.mobileSocialLink}>YouTube</a>
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className={styles.mobileSocialLink}>Instagram</a>
              <a href="https://tiktok.com" target="_blank" rel="noreferrer" className={styles.mobileSocialLink}>TikTok</a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
