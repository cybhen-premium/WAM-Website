"use client";

import Link from "next/link";
import { ArrowUpRight, Phone, Mail, MapPin, Navigation } from "lucide-react";
import styles from "./Contact.module.css";
import { motion } from "framer-motion";

export default function Contact() {
  return (
    <section id="contact" className={styles.contactSection}>
      <div className="container">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className={styles.card}
        >
          <div className={styles.content}>
            <span className={styles.badge}>Get in Touch</span>
            <h2 className="highlight-text">Plan Your Visit Today</h2>
            <p className="sub-text">
              We are excited to meet you! Join us for a transformative experience.
            </p>
            
            <div className={styles.details}>
              <div className={styles.detailItem}>
                <MapPin size={24} />
                <div>
                  <strong>Location</strong>
                  <p>Afienya - Mataheko, 18up junction adjacent Stephen Block Factory, off the Tema - Akosombo High way.</p>
                </div>
              </div>
              <div className={styles.detailItem}>
                <Navigation size={24} />
                <div>
                  <strong>GPS Address</strong>
                  <p>GN-1252-6647</p>
                </div>
              </div>
              <div className={styles.detailItem}>
                <Phone size={24} />
                <div>
                  <strong>Phone</strong>
                  <p>+233 30 395 8804 / 0208721598</p>
                </div>
              </div>
              <div className={styles.detailItem}>
                <Mail size={24} />
                <div>
                  <strong>Email</strong>
                  <p>worldarkmission1@gmail.com</p>
                </div>
              </div>
            </div>

            <Link href="mailto:worldarkmission1@gmail.com" className="primary-button">
              Contact Us
              <ArrowUpRight size={20} />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
