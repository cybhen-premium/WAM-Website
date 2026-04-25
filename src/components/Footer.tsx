import Link from "next/link";
import Image from "next/image";
import styles from "./Footer.module.css";
import { FacebookIcon, YoutubeIcon, InstagramIcon, TiktokIcon } from "./SocialIcons";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className={styles.top}>
          <div className={styles.brand}>
            <div className={styles.footerLogoWrapper}>
              <Image 
                src="/assets/logo.png" 
                alt="World Ark Missions Logo" 
                width={40} 
                height={40} 
                className={styles.footerLogo} 
              />
              <h3 className={styles.footerBrandName}>World Ark Missions</h3>
            </div>
            <p>A Place of Salvation, Transformation & Purpose</p>
            <div className={styles.socialLinks}>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                <FacebookIcon size={20} />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" aria-label="YouTube">
                <YoutubeIcon size={20} />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <InstagramIcon size={20} />
              </a>
              <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer" aria-label="TikTok">
                <TiktokIcon size={20} />
              </a>
            </div>
          </div>
          
          <div className={styles.linksGrid}>
            <div className={styles.linkGroup}>
              <h3>Navigation</h3>
              <Link href="/#home">Home</Link>
              <Link href="/about">About</Link>
              <Link href="/#services">Services</Link>
              <Link href="/#sermons">Sermons</Link>
            </div>
            <div className={styles.linkGroup}>
              <h3>Resources</h3>
              <Link href="/#events">Events</Link>
              <Link href="/#faq">FAQ</Link>
              <Link href="/contact">Contact</Link>
            </div>
            <div className={styles.linkGroup}>
              <h3>Connect</h3>
              <Link href="mailto:worldarkmission1@gmail.com">Email</Link>
              <Link href="tel:+233303958804">Phone: +233 30 395 8804</Link>
              <Link href="#">GPS: GN-1252-6647</Link>
            </div>
          </div>
        </div>

        <div className={styles.bottom}>
          <p>© 2026 World Ark Missions. All rights reserved.</p>
          <div className={styles.legal}>
            <Link href="#">Privacy Policy</Link>
            <Link href="#">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
