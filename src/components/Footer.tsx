import Link from "next/link";
import styles from "./Footer.module.css";
import sectionsData from "@/data/siteSections.json";

export default function Footer() {
  const brand = sectionsData.brand || {
    churchName: "World Ark Missions",
    shortName: "WORLD ARK MISSIONS",
    tagline: "A place of salvation, transformation & purpose in Afienya.",
    address: "Afienya, Greater Accra, Ghana",
    gps: "GN-1252-6647",
    phone: "+233 30 395 8804",
    email: "worldarkmission1@gmail.com"
  };

  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className={styles.topGrid}>
          <div className={styles.brandCol}>
            <p className={styles.brandTagline}>
              {brand.tagline}
            </p>
            <Link href="#services" className="s-btn">
              Start here
            </Link>
          </div>

          <div className={styles.col}>
            <p className={styles.colHeading}>Visit</p>
            <p className={styles.colText}>
              {brand.address}<br />
              GPS: {brand.gps}<br />
              Sundays 8:00 AM
            </p>
          </div>

          <div className={styles.col}>
            <p className={styles.colHeading}>Explore</p>
            <Link href="#services" className={styles.colLink}>Start here</Link>
            <Link href="/giving" className={styles.colLink}>Give</Link>
            <Link href="#sermons" className={styles.colLink}>Messages</Link>
            <Link href="#events" className={styles.colLink}>Events</Link>
            <Link href="/about" className={styles.colLink}>About</Link>
            <Link href="/contact" className={styles.colLink}>Contact</Link>
          </div>

          <div className={styles.col}>
            <p className={styles.colHeading}>Connect</p>
            <Link href={`mailto:${brand.email}`} className={styles.colLink}>
              {brand.email}
            </Link>
            <Link href={`tel:${brand.phone?.replace(/[^0-9+]/g, '')}`} className={styles.colLink}>
              {brand.phone}
            </Link>
            <a href="https://facebook.com" target="_blank" rel="noreferrer" className={styles.colLink}>
              Facebook
            </a>
            <a href="https://youtube.com" target="_blank" rel="noreferrer" className={styles.colLink}>
              YouTube
            </a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer" className={styles.colLink}>
              Instagram
            </a>
            <a href="https://tiktok.com" target="_blank" rel="noreferrer" className={styles.colLink}>
              TikTok
            </a>
          </div>
        </div>

        <div className={styles.bottomRow}>
          <p>© {new Date().getFullYear()} {brand.churchName}. All rights reserved.</p>
          <p>{brand.address}</p>
        </div>
      </div>

      {/* Giant signature watermark from Renew */}
      <p aria-hidden="true" className={styles.watermark}>
        {brand.shortName}
      </p>
    </footer>
  );
}
