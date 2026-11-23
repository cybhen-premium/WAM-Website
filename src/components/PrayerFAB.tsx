"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquareQuote, X, Send, Heart } from "lucide-react";
import { usePathname } from "next/navigation";
import styles from "./PrayerFAB.module.css";

export default function PrayerFAB() {
  const pathname = usePathname();
  const [isPrayerOpen, setIsPrayerOpen] = useState(false);
  const [isGivingOpen, setIsGivingOpen] = useState(false);
  const [formData, setFormData] = useState({ name: "", phone: "", request: "" });
  const [givingData, setGivingData] = useState({ name: "", email: "", amount: "", notes: "" });
  const [loading, setLoading] = useState(false);

  if (pathname?.startsWith("/admin")) return null;

  const handlePrayerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch("/api/prayer-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        alert("Prayer request submitted. We are praying with you!");
        setIsPrayerOpen(false);
        setFormData({ name: "", phone: "", request: "" });
      }
    } catch (error) {
      alert("Failed to submit request. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGivingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Simulate API call for giving
      await new Promise(resolve => setTimeout(resolve, 1000));
      alert(`Thank you ${givingData.name} for your generous gift of $${givingData.amount}!`);
      setIsGivingOpen(false);
      setGivingData({ name: "", email: "", amount: "", notes: "" });
    } catch (error) {
      alert("Failed to process. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1.2, type: "spring", stiffness: 260, damping: 20 }}
        className={styles.fabContainer}
      >
        <div className={styles.fabWrapper}>
          <button onClick={() => setIsGivingOpen(true)} className={styles.givingFab}>
            <span className={styles.tooltip}>Give / Donate</span>
            <Heart size={24} />
          </button>
          <button onClick={() => setIsPrayerOpen(true)} className={styles.fab}>
            <span className={styles.tooltip}>Request Prayer</span>
            <MessageSquareQuote size={28} />
          </button>
        </div>
      </motion.div>

      {/* Prayer Modal */}
      <AnimatePresence>
        {isPrayerOpen && (
          <div className={styles.modalOverlay}>
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className={styles.modal}
            >
              <div className={styles.modalHeader}>
                <h3>Submit Prayer Request</h3>
                <button onClick={() => setIsPrayerOpen(false)} className={styles.closeBtn}>
                  <X size={20} />
                </button>
              </div>

              <form className={styles.form} onSubmit={handlePrayerSubmit}>
                <div className={styles.inputGroup}>
                  <label>Full Name</label>
                  <input
                    type="text"
                    placeholder="Enter your name"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div className={styles.inputGroup}>
                  <label>Phone Number</label>
                  <input
                    type="tel"
                    placeholder="Enter your phone number"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
                <div className={styles.inputGroup}>
                  <label>Your Prayer Request</label>
                  <textarea
                    placeholder="How can we pray for you?"
                    rows={4}
                    required
                    value={formData.request}
                    onChange={(e) => setFormData({ ...formData, request: e.target.value })}
                  ></textarea>
                </div>
                <button type="submit" className={styles.submitBtn} disabled={loading}>
                  {loading ? "Sending..." : "Send Request"}
                  <Send size={18} />
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Giving Modal */}
      <AnimatePresence>
        {isGivingOpen && (
          <div className={styles.modalOverlay}>
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className={styles.modal}
            >
              <div className={styles.modalHeader}>
                <h3 style={{ color: '#ff7e33' }}>Give / Donate</h3>
                <button onClick={() => setIsGivingOpen(false)} className={styles.closeBtn}>
                  <X size={20} />
                </button>
              </div>

              <form className={styles.form} onSubmit={handleGivingSubmit}>
                <div className={styles.inputGroup}>
                  <label>Full Name</label>
                  <input
                    type="text"
                    placeholder="Enter your name"
                    required
                    value={givingData.name}
                    onChange={(e) => setGivingData({ ...givingData, name: e.target.value })}
                  />
                </div>
                <div className={styles.inputGroup}>
                  <label>Email Address</label>
                  <input
                    type="email"
                    placeholder="Enter your email"
                    required
                    value={givingData.email}
                    onChange={(e) => setGivingData({ ...givingData, email: e.target.value })}
                  />
                </div>
                <div className={styles.inputGroup}>
                  <label>Amount ($)</label>
                  <input
                    type="number"
                    placeholder="Enter amount"
                    min="1"
                    required
                    value={givingData.amount}
                    onChange={(e) => setGivingData({ ...givingData, amount: e.target.value })}
                  />
                </div>
                <div className={styles.quickAmounts}>
                  <button type="button" onClick={() => setGivingData({...givingData, amount: "25"})}>$25</button>
                  <button type="button" onClick={() => setGivingData({...givingData, amount: "50"})}>$50</button>
                  <button type="button" onClick={() => setGivingData({...givingData, amount: "100"})}>$100</button>
                  <button type="button" onClick={() => setGivingData({...givingData, amount: "200"})}>$200</button>
                </div>
                <div className={styles.inputGroup}>
                  <label>Notes (Optional)</label>
                  <textarea
                    placeholder="Add a note or prayer request with your gift..."
                    rows={3}
                    value={givingData.notes}
                    onChange={(e) => setGivingData({ ...givingData, notes: e.target.value })}
                  ></textarea>
                </div>
                <button type="submit" className={`${styles.submitBtn} ${styles.givingBtn}`} disabled={loading}>
                  {loading ? "Processing..." : "Give Now"}
                  <Heart size={18} />
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
