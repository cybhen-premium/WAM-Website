"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./LiveSection.module.css";
import { Radio, X, ExternalLink } from "lucide-react";

 type LiveData = {
   isLive: boolean;
   title?: string | null;
   videoId?: string | null;
 };

export default function LiveSection() {
  const [liveData, setLiveData] = useState<LiveData | null>(null);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const fetchLiveStatus = async () => {
      try {
        const res = await fetch("/api/settings/live");
        const data = await res.json();
        if (data.isLive) setLiveData(data);
      } catch (error) {}
    };
    fetchLiveStatus();
  }, []);

  if (!liveData || !isVisible) return null;

  return (
    <AnimatePresence>
      <motion.section 
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: "auto", opacity: 1 }}
        exit={{ height: 0, opacity: 0 }}
        className={styles.liveContainer}
      >
        <div className="container">
          <div className={styles.liveContent}>
            <div className={styles.left}>
              <div className={styles.liveIndicator}>
                <span className={styles.dot}></span>
                LIVE NOW
              </div>
              <div className={styles.text}>
                <h3>{liveData.title || "Join our Live Broadcast"}</h3>
                <p>We are currently broadcasting live from the Sanctuary. Join us now for an uplifting experience!</p>
              </div>
            </div>
            
            <div className={styles.right}>
              <a 
                href={`https://youtube.com/watch?v=${liveData.videoId}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className={styles.joinBtn}
              >
                Join Stream
                <ExternalLink size={18} />
              </a>
              <button onClick={() => setIsVisible(false)} className={styles.closeBtn}>
                <X size={20} />
              </button>
            </div>
          </div>
        </div>
      </motion.section>
    </AnimatePresence>
  );
}
