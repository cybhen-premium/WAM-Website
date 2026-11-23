"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquareQuote, X, Send, Heart, CheckCircle2, Copy, Check, Smartphone, Landmark } from "lucide-react";
import { usePathname } from "next/navigation";
import styles from "./PrayerFAB.module.css";

export default function PrayerFAB() {
  const pathname = usePathname();
  const [isPrayerOpen, setIsPrayerOpen] = useState(false);
  const [isGivingOpen, setIsGivingOpen] = useState(false);
  const [givingTab, setGivingTab] = useState<"momo" | "form">("momo");
  const [prayerSubmitted, setPrayerSubmitted] = useState(false);
  const [givingSubmitted, setGivingSubmitted] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const [formData, setFormData] = useState({ name: "", phone: "", request: "" });
  const [givingData, setGivingData] = useState({ name: "", email: "", amount: "50", notes: "" });
  const [loading, setLoading] = useState(false);

  if (pathname?.startsWith("/admin")) return null;

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => {
      setCopiedKey(null);
    }, 2000);
  };

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
        setPrayerSubmitted(true);
      } else {
        alert("Failed to submit request. Please try again.");
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
      await new Promise((resolve) => setTimeout(resolve, 800));
      setGivingSubmitted(true);
    } catch (error) {
      alert("Failed to process donation. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const resetPrayer = () => {
    setIsPrayerOpen(false);
    setPrayerSubmitted(false);
    setFormData({ name: "", phone: "", request: "" });
  };

  const resetGiving = () => {
    setIsGivingOpen(false);
    setGivingSubmitted(false);
    setGivingData({ name: "", email: "", amount: "50", notes: "" });
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
          <button 
            onClick={() => {
              setIsGivingOpen(true);
              setGivingSubmitted(false);
            }} 
            className={styles.givingFab}
            aria-label="Give or Donate"
          >
            <span className={styles.tooltip}>Give / Donate</span>
            <Heart size={22} />
          </button>
          <button 
            onClick={() => {
              setIsPrayerOpen(true);
              setPrayerSubmitted(false);
            }} 
            className={styles.fab}
            aria-label="Submit Prayer Request"
          >
            <span className={styles.tooltip}>Request Prayer</span>
            <MessageSquareQuote size={26} />
          </button>
        </div>
      </motion.div>

      {/* Prayer Request Modal */}
      <AnimatePresence>
        {isPrayerOpen && (
          <div className={styles.modalOverlay} onClick={resetPrayer}>
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 15 }}
              transition={{ duration: 0.2 }}
              className={styles.modal}
              onClick={(e) => e.stopPropagation()}
            >
              <div className={styles.modalHeader}>
                <div className={styles.modalHeaderTitle}>
                  <span className={styles.modalBadge}>Intercession &amp; Care</span>
                  <h3>Submit Prayer Request</h3>
                  <p className={styles.modalSubtitle}>
                    Share your needs with our pastoral prayer team. We stand in faith with you.
                  </p>
                </div>
                <button onClick={resetPrayer} className={styles.closeBtn} aria-label="Close modal">
                  <X size={18} />
                </button>
              </div>

              {prayerSubmitted ? (
                <div className={styles.successMessage}>
                  <div className={styles.successIconWrapper}>
                    <CheckCircle2 size={36} />
                  </div>
                  <h4 className={styles.successTitle}>Request Received</h4>
                  <p className={styles.successDesc}>
                    Thank you, <strong>{formData.name || "Beloved"}</strong>. Our prayer ministers have received your request and will lift you up in prayer.
                  </p>
                  <button onClick={resetPrayer} className={styles.successCloseBtn}>
                    Close
                  </button>
                </div>
              ) : (
                <form className={styles.form} onSubmit={handlePrayerSubmit}>
                  <div className={styles.inputGroup}>
                    <label>Full Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Samuel Mensah"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>

                  <div className={styles.inputGroup}>
                    <label>Phone Number (Optional)</label>
                    <input
                      type="tel"
                      placeholder="e.g. +233 24 123 4567"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>

                  <div className={styles.inputGroup}>
                    <label>Your Prayer Request</label>
                    <textarea
                      placeholder="Share your prayer need, situation, or testimony..."
                      rows={4}
                      required
                      value={formData.request}
                      onChange={(e) => setFormData({ ...formData, request: e.target.value })}
                    ></textarea>
                  </div>

                  <button type="submit" className={styles.submitBtn} disabled={loading}>
                    {loading ? "Submitting..." : "Send Prayer Request"}
                    <Send size={16} />
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Giving / Donate Modal */}
      <AnimatePresence>
        {isGivingOpen && (
          <div className={styles.modalOverlay} onClick={resetGiving}>
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 15 }}
              transition={{ duration: 0.2 }}
              className={styles.modal}
              onClick={(e) => e.stopPropagation()}
            >
              <div className={styles.modalHeader}>
                <div className={styles.modalHeaderTitle}>
                  <span className={styles.modalBadge}>Kingdom Giving</span>
                  <h3>Give &amp; Partner</h3>
                  <p className={styles.modalSubtitle}>
                    Official church Mobile Money accounts &amp; giving channels.
                  </p>
                </div>
                <button onClick={resetGiving} className={styles.closeBtn} aria-label="Close modal">
                  <X size={18} />
                </button>
              </div>

              {/* Tabs for MoMo details vs Pledging */}
              <div className={styles.modalTabs}>
                <button 
                  className={`${styles.modalTabBtn} ${givingTab === "momo" ? styles.activeTab : ""}`}
                  onClick={() => setGivingTab("momo")}
                >
                  <Smartphone size={14} style={{ display: "inline", marginRight: "4px" }} />
                  Mobile Money &amp; Bank
                </button>
                <button 
                  className={`${styles.modalTabBtn} ${givingTab === "form" ? styles.activeTab : ""}`}
                  onClick={() => setGivingTab("form")}
                >
                  <Heart size={14} style={{ display: "inline", marginRight: "4px" }} />
                  Online Seed Form
                </button>
              </div>

              {givingTab === "momo" ? (
                <div className={styles.momoList}>
                  {/* MTN Merchant */}
                  <div className={styles.momoItem}>
                    <div className={styles.momoItemInfo}>
                      <span className={styles.momoItemLabel}>MTN Merchant ID</span>
                      <span className={styles.momoItemValue}>719385</span>
                      <small style={{ color: "#94a3b8", fontSize: "11px" }}>Dial *170# &gt; 2 &gt; MoMoPay</small>
                    </div>
                    <button 
                      onClick={() => copyToClipboard("719385", "modal-mtn-m")}
                      className={`${styles.momoCopyBtn} ${copiedKey === "modal-mtn-m" ? styles.copied : ""}`}
                    >
                      {copiedKey === "modal-mtn-m" ? <Check size={12} /> : <Copy size={12} />}
                      {copiedKey === "modal-mtn-m" ? "Copied" : "Copy"}
                    </button>
                  </div>

                  {/* MTN Phone */}
                  <div className={styles.momoItem}>
                    <div className={styles.momoItemInfo}>
                      <span className={styles.momoItemLabel}>MTN MoMo Number</span>
                      <span className={styles.momoItemValue}>0552963413</span>
                      <small style={{ color: "#94a3b8", fontSize: "11px" }}>World Ark Missions</small>
                    </div>
                    <button 
                      onClick={() => copyToClipboard("0552963413", "modal-mtn-n")}
                      className={`${styles.momoCopyBtn} ${copiedKey === "modal-mtn-n" ? styles.copied : ""}`}
                    >
                      {copiedKey === "modal-mtn-n" ? <Check size={12} /> : <Copy size={12} />}
                      {copiedKey === "modal-mtn-n" ? "Copied" : "Copy"}
                    </button>
                  </div>

                  {/* Telecel / Vodafone */}
                  <div className={styles.momoItem}>
                    <div className={styles.momoItemInfo}>
                      <span className={styles.momoItemLabel}>Telecel / Vodafone Cash</span>
                      <span className={styles.momoItemValue}>0503979378</span>
                      <small style={{ color: "#94a3b8", fontSize: "11px" }}>World Ark Missions</small>
                    </div>
                    <button 
                      onClick={() => copyToClipboard("0503979378", "modal-voda")}
                      className={`${styles.momoCopyBtn} ${copiedKey === "modal-voda" ? styles.copied : ""}`}
                    >
                      {copiedKey === "modal-voda" ? <Check size={12} /> : <Copy size={12} />}
                      {copiedKey === "modal-voda" ? "Copied" : "Copy"}
                    </button>
                  </div>

                  {/* AirtelTigo */}
                  <div className={styles.momoItem}>
                    <div className={styles.momoItemInfo}>
                      <span className={styles.momoItemLabel}>AirtelTigo Money</span>
                      <span className={styles.momoItemValue}>0277729766</span>
                      <small style={{ color: "#94a3b8", fontSize: "11px" }}>World Ark Missions</small>
                    </div>
                    <button 
                      onClick={() => copyToClipboard("0277729766", "modal-at")}
                      className={`${styles.momoCopyBtn} ${copiedKey === "modal-at" ? styles.copied : ""}`}
                    >
                      {copiedKey === "modal-at" ? <Check size={12} /> : <Copy size={12} />}
                      {copiedKey === "modal-at" ? "Copied" : "Copy"}
                    </button>
                  </div>

                  {/* Bank Accounts */}
                  <div className={styles.momoItem}>
                    <div className={styles.momoItemInfo}>
                      <span className={styles.momoItemLabel}>GCB Bank</span>
                      <span className={styles.momoItemValue}>1211180002348</span>
                      <small style={{ color: "#94a3b8", fontSize: "11px" }}>World Ark Missions</small>
                    </div>
                    <button 
                      onClick={() => copyToClipboard("1211180002348", "modal-gcb")}
                      className={`${styles.momoCopyBtn} ${copiedKey === "modal-gcb" ? styles.copied : ""}`}
                    >
                      {copiedKey === "modal-gcb" ? <Check size={12} /> : <Copy size={12} />}
                      {copiedKey === "modal-gcb" ? "Copied" : "Copy"}
                    </button>
                  </div>

                  <div className={styles.momoItem}>
                    <div className={styles.momoItemInfo}>
                      <span className={styles.momoItemLabel}>FBN Bank</span>
                      <span className={styles.momoItemValue}>0032030005142</span>
                      <small style={{ color: "#94a3b8", fontSize: "11px" }}>World Ark Missions</small>
                    </div>
                    <button 
                      onClick={() => copyToClipboard("0032030005142", "modal-fbn")}
                      className={`${styles.momoCopyBtn} ${copiedKey === "modal-fbn" ? styles.copied : ""}`}
                    >
                      {copiedKey === "modal-fbn" ? <Check size={12} /> : <Copy size={12} />}
                      {copiedKey === "modal-fbn" ? "Copied" : "Copy"}
                    </button>
                  </div>
                </div>
              ) : (
                givingSubmitted ? (
                  <div className={styles.successMessage}>
                    <div className={styles.successIconWrapper}>
                      <Heart size={36} />
                    </div>
                    <h4 className={styles.successTitle}>Thank You for Giving!</h4>
                    <p className={styles.successDesc}>
                      Thank you, <strong>{givingData.name || "Partner"}</strong>, for your generous seed of <strong>${givingData.amount}</strong>. May God abundantly bless your seed sown.
                    </p>
                    <button onClick={resetGiving} className={styles.successCloseBtn}>
                      Close
                    </button>
                  </div>
                ) : (
                  <form className={styles.form} onSubmit={handleGivingSubmit}>
                    <div className={styles.inputGroup}>
                      <label>Full Name</label>
                      <input
                        type="text"
                        placeholder="e.g. Grace Amankwah"
                        required
                        value={givingData.name}
                        onChange={(e) => setGivingData({ ...givingData, name: e.target.value })}
                      />
                    </div>

                    <div className={styles.inputGroup}>
                      <label>Email Address</label>
                      <input
                        type="email"
                        placeholder="e.g. grace@example.com"
                        required
                        value={givingData.email}
                        onChange={(e) => setGivingData({ ...givingData, email: e.target.value })}
                      />
                    </div>

                    <div className={styles.inputGroup}>
                      <label>Amount ($)</label>
                      <input
                        type="number"
                        placeholder="Enter custom amount"
                        min="1"
                        required
                        value={givingData.amount}
                        onChange={(e) => setGivingData({ ...givingData, amount: e.target.value })}
                      />
                    </div>

                    <span className={styles.quickAmountsLabel}>Quick Select</span>
                    <div className={styles.quickAmounts}>
                      {["25", "50", "100", "200"].map((preset) => (
                        <button
                          key={preset}
                          type="button"
                          className={`${styles.amountBtn} ${givingData.amount === preset ? styles.activeAmount : ""}`}
                          onClick={() => setGivingData({ ...givingData, amount: preset })}
                        >
                          ${preset}
                        </button>
                      ))}
                    </div>

                    <div className={styles.inputGroup}>
                      <label>Purpose / Notes (Optional)</label>
                      <textarea
                        placeholder="Tithe, offering, mission pledge, or specific prayer note..."
                        rows={3}
                        value={givingData.notes}
                        onChange={(e) => setGivingData({ ...givingData, notes: e.target.value })}
                      ></textarea>
                    </div>

                    <button type="submit" className={styles.submitBtn} disabled={loading}>
                      {loading ? "Processing..." : `Record $${givingData.amount || "0"} Seed`}
                      <Heart size={16} />
                    </button>
                  </form>
                )
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
