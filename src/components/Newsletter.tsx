"use client";

import { useState } from "react";
import styles from "./Newsletter.module.css";
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
    <section className={styles.newsletterSection}>
      <div className="container">
        <div className={styles.newsletterCard}>
          <div className={styles.textContent}>
            <h2>Stay Connected</h2>
            <p>Subscribe to our newsletter to receive weekly inspiration and updates from World Ark Missions.</p>
          </div>
          
          {subscribed ? (
            <div className={styles.success}>
              <strong>Thank you for subscribing!</strong>
              <p>You'll hear from us soon.</p>
            </div>
          ) : (
            <form className={styles.form} onSubmit={handleSubmit}>
              <input 
                type="email" 
                placeholder="Your email address" 
                className={styles.input}
                required 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <button type="submit" className={styles.button} disabled={loading}>
                {loading ? "Subscribing..." : "Subscribe"}
              </button>
            </form>
          )}
          
          <div className={styles.decoration}></div>
        </div>
      </div>
    </section>
  );
}
