"use client";

import { useState } from "react";
import { Phone, Mail, MapPin, Navigation, Clock, Send, CheckCircle, ExternalLink } from "lucide-react";
import styles from "./Contact.module.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import Image from "next/image";

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        setSent(true);
        setFormData({ name: "", email: "", subject: "", message: "" });
      } else {
        alert("Failed to send message. Please try again.");
      }
    } catch (error) {
      alert("Failed to send message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <main className={styles.contactPage}>
        {/* Hero Section */}
        <section className={styles.hero}>
          <div className={styles.heroBg}>
            <Image 
              src="/assets/7.jpeg" 
              alt="World Ark Missions Sanctuary" 
              fill 
              sizes="100vw"
              className={styles.bgImage}
              priority
            />
            <div className={styles.overlay}></div>
          </div>
          <div className="container">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className={styles.heroContent}
            >
              <span className="s-badge">Reach Out · Afienya Sanctuary</span>
              <h1 className={styles.heroTitle}>
                Get in <span className="serif-italic text-accent">touch.</span>
              </h1>
              <p className={styles.heroSubTitle}>
                Have questions, need prayer, or planning your first visit? We would love to connect with you. 
                Our doors and hearts are always open to everyone.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Content Section */}
        <section className={styles.contentSection}>
          <div className="container">
            <div className={styles.mainGrid}>
              
              {/* Left Column: Contact Details & Schedule */}
              <div className={styles.leftCol}>
                
                {/* Contact Information Card */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                  className={styles.card}
                >
                  <div className={styles.cardHeader}>
                    <span className="s-badge" style={{ marginBottom: 4 }}>Headquarters & Office</span>
                    <h2 className={styles.cardTitle}>Contact Details</h2>
                  </div>

                  <div className={styles.contactList}>
                    {/* Location */}
                    <div className={styles.contactItem}>
                      <div className={styles.iconBox}>
                        <MapPin size={22} />
                      </div>
                      <div className={styles.itemBody}>
                        <p className={styles.itemLabel}>Our Physical Location</p>
                        <p className={styles.itemText}>
                          Afienya - Mataheko, 18up junction adjacent Stephen Block Factory, off the Tema - Akosombo Highway.
                        </p>
                      </div>
                    </div>

                    {/* GPS */}
                    <div className={styles.contactItem}>
                      <div className={styles.iconBox}>
                        <Navigation size={22} />
                      </div>
                      <div className={styles.itemBody}>
                        <p className={styles.itemLabel}>GPS Digital Address</p>
                        <div className={styles.codeBadge}>GN-1252-6647</div>
                      </div>
                    </div>

                    {/* Phones */}
                    <div className={styles.contactItem}>
                      <div className={styles.iconBox}>
                        <Phone size={22} />
                      </div>
                      <div className={styles.itemBody}>
                        <p className={styles.itemLabel}>Phone Inquiries</p>
                        <p className={styles.itemText}>
                          <a href="tel:+233303958804" className={styles.itemLink}>+233 30 395 8804</a>
                          {" · "}
                          <a href="tel:0208721598" className={styles.itemLink}>020 872 1598</a>
                        </p>
                      </div>
                    </div>

                    {/* Email */}
                    <div className={styles.contactItem}>
                      <div className={styles.iconBox}>
                        <Mail size={22} />
                      </div>
                      <div className={styles.itemBody}>
                        <p className={styles.itemLabel}>Official Email</p>
                        <p className={styles.itemText}>
                          <a href="mailto:worldarkmission1@gmail.com" className={styles.itemLink}>
                            worldarkmission1@gmail.com
                          </a>
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Service Schedule Card */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className={styles.card}
                >
                  <div className={styles.cardHeader}>
                    <span className="s-badge" style={{ marginBottom: 4 }}>Weekly Gatherings</span>
                    <h2 className={styles.cardTitle}>Service Times</h2>
                  </div>

                  <div className={styles.serviceList}>
                    <div className={styles.serviceRow}>
                      <div className={styles.serviceInfo}>
                        <h3 className={styles.serviceName}>Sunday Service</h3>
                        <p className={styles.serviceSub}>Worship, Word & Communion</p>
                      </div>
                      <span className={styles.serviceBadge}>8:00 AM – 11:30 AM</span>
                    </div>

                    <div className={styles.serviceRow}>
                      <div className={styles.serviceInfo}>
                        <h3 className={styles.serviceName}>Wednesday Encounter</h3>
                        <p className={styles.serviceSub}>Midweek Bible Study & Prayer</p>
                      </div>
                      <span className={styles.serviceBadge}>6:30 PM – 8:30 PM</span>
                    </div>

                    <div className={styles.serviceRow}>
                      <div className={styles.serviceInfo}>
                        <h3 className={styles.serviceName}>Friday Rescue Hour</h3>
                        <p className={styles.serviceSub}>Prophetic Intercession & Power</p>
                      </div>
                      <span className={styles.serviceBadge}>6:30 PM – 9:00 PM</span>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Right Column: Interactive Map & Message Form */}
              <div className={styles.rightCol}>
                
                {/* Map Card */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                  className={styles.mapCard}
                >
                  <div className={styles.mapHeader}>
                    <h3 className={styles.mapHeaderTitle}>Afienya Sanctuary Map</h3>
                    <a 
                      href="https://maps.google.com/?q=5.8078,0.0076" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className={styles.mapExternalLink}
                    >
                      Open in Maps <ExternalLink size={14} />
                    </a>
                  </div>
                  <div className={styles.mapContainer}>
                    <iframe 
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3969.566370483861!2d0.0076!3d5.8078!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNcKwNDgnMjguMSJOIDDCsDAwJzI3LjQiRQ!5e0!3m2!1sen!2sgh!4v1713880000000!5m2!1sen!2sgh" 
                      title="World Ark Missions Location"
                      allowFullScreen 
                      loading="lazy" 
                      referrerPolicy="no-referrer-when-downgrade"
                    ></iframe>
                  </div>
                </motion.div>

                {/* Form Card */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className={styles.formCard}
                >
                  <div className={styles.cardHeader}>
                    <span className="s-badge" style={{ marginBottom: 4 }}>Direct Inquiry</span>
                    <h2 className={styles.cardTitle}>Send us a message</h2>
                  </div>
                  
                  <p className={styles.formCardDesc}>
                    Leave your contact details and message below. Our leadership team will respond promptly.
                  </p>

                  {sent ? (
                    <div className={styles.successMsg}>
                      <div className={styles.successIcon}>
                        <CheckCircle size={44} />
                      </div>
                      <h3 className={styles.successTitle}>Message Received</h3>
                      <p className={styles.successDesc}>
                        Thank you for reaching out to World Ark Missions. We have received your inquiry and will be in touch shortly.
                      </p>
                      <button onClick={() => setSent(false)} className={styles.newMsgBtn}>
                        Send another message
                      </button>
                    </div>
                  ) : (
                    <form className={styles.form} onSubmit={handleSubmit}>
                      <div className={styles.formRow}>
                        <div className={styles.formGroup}>
                          <label className={styles.formLabel}>Your Name</label>
                          <input 
                            type="text" 
                            className={styles.input}
                            placeholder="e.g. John Doe" 
                            required 
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          />
                        </div>
                        <div className={styles.formGroup}>
                          <label className={styles.formLabel}>Email Address</label>
                          <input 
                            type="email" 
                            className={styles.input}
                            placeholder="e.g. john@example.com" 
                            required 
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          />
                        </div>
                      </div>

                      <div className={styles.formGroup}>
                        <label className={styles.formLabel}>Subject</label>
                        <input 
                          type="text" 
                          className={styles.input}
                          placeholder="e.g. Planning a Visit / Prayer Request / General Inquiry" 
                          required 
                          value={formData.subject}
                          onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        />
                      </div>

                      <div className={styles.formGroup}>
                        <label className={styles.formLabel}>Your Message</label>
                        <textarea 
                          className={styles.textarea}
                          placeholder="How can we assist or pray for you today?" 
                          rows={5} 
                          required
                          value={formData.message}
                          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        ></textarea>
                      </div>

                      <button type="submit" className={styles.submitBtn} disabled={loading}>
                        {loading ? "Sending..." : "Send Message"}
                        <Send size={16} />
                      </button>
                    </form>
                  )}
                </motion.div>
              </div>

            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
