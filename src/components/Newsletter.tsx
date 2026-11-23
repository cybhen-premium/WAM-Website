"use client";

import { useState } from "react";
import styles from "./Newsletter.module.css";
import { motion } from "framer-motion";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (response.ok) {
        setSubscribed(true);
        setEmail("");
      }
    } catch (error) {
      console.error("Subscription failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className={styles.section}>
      <div className="container">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className={styles.box}
        >
          <div className={styles.textSide}>
            <span className="s-badge">Newsletter</span>
            <h2 className={styles.title}>Stay connected with us</h2>
            <p className={styles.description}>
              Receive weekly devotional thoughts, sermon summaries, and upcoming ministry updates directly in your inbox.
            </p>
          </div>
          
          {subscribed ? (
            <div className={styles.successMsg}>
              <strong>Thank you for subscribing!</strong> You will hear from us soon.
            </div>
          ) : (
            <form className={styles.form} onSubmit={handleSubmit}>
              <input 
                type="email" 
                placeholder="Enter your email address" 
                className={styles.input}
                required 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <button type="submit" className={styles.submitBtn} disabled={loading}>
                {loading ? "Joining..." : "Subscribe"}
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </section>
  );
}
