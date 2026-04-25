"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquareQuote, X, Send } from "lucide-react";
import { usePathname } from "next/navigation";
import styles from "./PrayerFAB.module.css";

export default function PrayerFAB() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({ name: "", phone: "", request: "" });
  const [loading, setLoading] = useState(false);

  if (pathname?.startsWith("/admin")) return null;

  const handleSubmit = async (e: React.FormEvent) => {
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
        setIsOpen(false);
        setFormData({ name: "", phone: "", request: "" });
      }
    } catch (error) {
      alert("Failed to submit request. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <motion.div 
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1.5, type: "spring", stiffness: 260, damping: 20 }}
        className={styles.fabContainer}
      >
        <button onClick={() => setIsOpen(true)} className={styles.fab}>
          <span className={styles.tooltip}>Request Prayer</span>
          <MessageSquareQuote size={28} />
        </button>
      </motion.div>

      <AnimatePresence>
        {isOpen && (
          <div className={styles.modalOverlay}>
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className={styles.modal}
            >
              <div className={styles.modalHeader}>
                <h3>Submit Prayer Request</h3>
                <button onClick={() => setIsOpen(false)} className={styles.closeBtn}>
                  <X size={20} />
                </button>
              </div>

              <form className={styles.form} onSubmit={handleSubmit}>
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
    </>
  );
}
