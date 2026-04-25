"use client";

import { useState } from "react";
import { Phone, Mail, MapPin, Navigation, Clock, Send, CheckCircle } from "lucide-react";
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
        <section className={styles.hero}>
          <div className={styles.heroBg}>
            <Image 
              src="/assets/7.jpeg" 
              alt="Contact Us" 
              fill 
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
              <h1 className={styles.title}>Get in Touch</h1>
              <p className={styles.subTitle}>
                Have questions or want to visit? We'd love to hear from you. 
                Our doors are always open to everyone.
              </p>
            </motion.div>
          </div>
        </section>

        <section className={styles.content}>
          <div className="container">
            <div className={styles.grid}>
              {/* Contact Info */}
              <div className={styles.infoSide}>
                <motion.div 
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className={styles.card}
                >
                  <h2>Contact Information</h2>
                  <div className={styles.details}>
                    <div className={styles.item}>
                      <div className={styles.iconWrapper}><MapPin size={24} /></div>
                      <div>
                        <h3>Our Location</h3>
                        <p>Afienya - Mataheko, 18up junction adjacent Stephen Block Factory, off the Tema - Akosombo High way.</p>
                      </div>
                    </div>
                    <div className={styles.item}>
                      <div className={styles.iconWrapper}><Navigation size={24} /></div>
                      <div>
                        <h3>GPS Address</h3>
                        <p>GN-1252-6647</p>
                      </div>
                    </div>
                    <div className={styles.item}>
                      <div className={styles.iconWrapper}><Phone size={24} /></div>
                      <div>
                        <h3>Phone Numbers</h3>
                        <p>+233 30 395 8804</p>
                        <p>0208721598</p>
                      </div>
                    </div>
                    <div className={styles.item}>
                      <div className={styles.iconWrapper}><Mail size={24} /></div>
                      <div>
                        <h3>Email</h3>
                        <p>worldarkmission1@gmail.com</p>
                      </div>
                    </div>
                  </div>
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className={styles.card}
                >
                  <h2>Service Times</h2>
                  <div className={styles.details}>
                    <div className={styles.item}>
                      <div className={styles.iconWrapper}><Clock size={24} /></div>
                      <div>
                        <h3>Sunday Service</h3>
                        <p>8:00 AM - 11:30 AM</p>
                      </div>
                    </div>
                    <div className={styles.item}>
                      <div className={styles.iconWrapper}><Clock size={24} /></div>
                      <div>
                        <h3>Wednesday Service</h3>
                        <p>6:30 PM - 8:30 PM</p>
                      </div>
                    </div>
                    <div className={styles.item}>
                      <div className={styles.iconWrapper}><Clock size={24} /></div>
                      <div>
                        <h3>Friday Rescue Hour</h3>
                        <p>6:30 PM - 9:00 PM</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Map & Form */}
              <div className={styles.mapSide}>
                <motion.div 
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className={styles.mapWrapper}
                >
                  <iframe 
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3969.566370483861!2d0.0076!3d5.8078!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNcKwNDgnMjguMSJOIDDCsDAwJzI3LjQiRQ!5e0!3m2!1sen!2sgh!4v1713880000000!5m2!1sen!2sgh" 
                    width="100%" 
                    height="100%" 
                    style={{ border: 0 }} 
                    allowFullScreen 
                    loading="lazy" 
                    referrerPolicy="no-referrer-when-downgrade"
                  ></iframe>
                </motion.div>
                
                <motion.div 
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className={styles.formCard}
                >
                  <h2>Send us a Message</h2>
                  {sent ? (
                    <div className={styles.successMsg}>
                      <div className={styles.successIcon}><CheckCircle size={48} /></div>
                      <h3>Message Sent!</h3>
                      <p>Thank you for reaching out. We have received your message and will get back to you shortly.</p>
                      <button onClick={() => setSent(false)} className={styles.newMsgBtn}>Send another message</button>
                    </div>
                  ) : (
                    <form className={styles.form} onSubmit={handleSubmit}>
                      <div className={styles.row}>
                        <input 
                          type="text" 
                          placeholder="Your Name" 
                          required 
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                        <input 
                          type="email" 
                          placeholder="Email Address" 
                          required 
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                      </div>
                      <input 
                        type="text" 
                        placeholder="Subject" 
                        required 
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      />
                      <textarea 
                        placeholder="Your Message" 
                        rows={5} 
                        required
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      ></textarea>
                      <button type="submit" className={styles.submitBtn} disabled={loading}>
                        {loading ? "Sending..." : "Send Message"}
                        <Send size={18} />
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
