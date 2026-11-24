"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Heart, Landmark, Smartphone, Copy, Check, ExternalLink } from "lucide-react";
import styles from "./Giving.module.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import defaultSections from "@/data/siteSections.json";

export default function GivingPage() {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [givingData, setGivingData] = useState((defaultSections as any).giving || {
    bannerImage: "https://res.cloudinary.com/dm5bp1efp/image/upload/v1795477248/world-ark-missions/momo-details.jpg",
    title: "Give & Partner",
    subtitle: "Your tithes, offerings, and sacrificial giving empower us to transform lives, preach the unadulterated gospel of Christ, and support community outreaches in Afienya and beyond."
  });

  useEffect(() => {
    fetch(`/api/sections?t=${Date.now()}`, { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        if (data?.giving) {
          setGivingData((prev: any) => ({ ...prev, ...data.giving }));
        }
      })
      .catch(() => {});
  }, []);

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => {
      setCopiedKey(null);
    }, 2000);
  };

  return (
    <>
      <Navbar />
      <main className={styles.givingPage}>
        <section className={styles.hero}>
          <div className="container">
            <div className={styles.heroContent}>
              <div className={styles.heroBadge}>
                <Heart size={14} />
                <span>Kingdom Giving &amp; Partnership</span>
              </div>
              <h1>{givingData.title || "Give & Partner"}</h1>
              <p>
                {givingData.subtitle || "Your tithes, offerings, and sacrificial giving empower us to transform lives, preach the unadulterated gospel of Christ, and support community outreaches in Afienya and beyond."}
              </p>
            </div>
          </div>
        </section>

        <section className={styles.methods}>
          <div className="container">
            <div className={styles.sectionHeader}>
              <h2>Official Giving Channels</h2>
              <p>
                Give conveniently via Mobile Money across all Ghanaian networks or direct bank deposit into World Ark Missions official accounts.
              </p>
            </div>

            <div className={styles.grid}>
              {/* 1. MTN Mobile Money */}
              <div className={styles.card}>
                <div className={styles.cardHeaderRow}>
                  <div>
                    <h3>MTN Mobile Money</h3>
                    <p className={styles.cardDesc}>Primary church MoMo channel &amp; Merchant ID</p>
                  </div>
                  <span className={`${styles.providerPill} ${styles.mtnPill}`}>MTN MoMo</span>
                </div>

                <div className={styles.paymentInfo}>
                  <div className={styles.infoRow}>
                    <span className={styles.infoLabel}>Account Name</span>
                    <strong style={{ color: "#ffffff" }}>World Ark Missions</strong>
                  </div>

                  <div className={styles.infoRow}>
                    <span className={styles.infoLabel}>Merchant ID</span>
                    <div className={styles.infoValueGroup}>
                      <span className={styles.infoValue}>719385</span>
                      <button 
                        onClick={() => copyToClipboard("719385", "mtn-merchant")} 
                        className={`${styles.copyBtn} ${copiedKey === "mtn-merchant" ? styles.copied : ""}`}
                        title="Copy Merchant ID"
                      >
                        {copiedKey === "mtn-merchant" ? <Check size={13} /> : <Copy size={13} />}
                        <span>{copiedKey === "mtn-merchant" ? "Copied" : "Copy"}</span>
                      </button>
                    </div>
                  </div>

                  <div className={styles.infoRow}>
                    <span className={styles.infoLabel}>MoMo Number</span>
                    <div className={styles.infoValueGroup}>
                      <span className={styles.infoValue}>0552963413</span>
                      <button 
                        onClick={() => copyToClipboard("0552963413", "mtn-number")} 
                        className={`${styles.copyBtn} ${copiedKey === "mtn-number" ? styles.copied : ""}`}
                        title="Copy Phone Number"
                      >
                        {copiedKey === "mtn-number" ? <Check size={13} /> : <Copy size={13} />}
                        <span>{copiedKey === "mtn-number" ? "Copied" : "Copy"}</span>
                      </button>
                    </div>
                  </div>
                </div>

                <div className={styles.instruction}>
                  <p>
                    Dial <strong>*170#</strong> &rarr; Select <strong>2 (MoMoPay)</strong> &rarr; Enter Merchant ID <strong>719385</strong>, or send directly to <strong>0552963413</strong>.
                  </p>
                </div>
              </div>

              {/* 2. Vodafone / Telecel Cash */}
              <div className={styles.card}>
                <div className={styles.cardHeaderRow}>
                  <div>
                    <h3>Telecel / Vodafone Cash</h3>
                    <p className={styles.cardDesc}>Dedicated Telecel Cash giving line</p>
                  </div>
                  <span className={`${styles.providerPill} ${styles.telecelPill}`}>Telecel Cash</span>
                </div>

                <div className={styles.paymentInfo}>
                  <div className={styles.infoRow}>
                    <span className={styles.infoLabel}>Account Name</span>
                    <strong style={{ color: "#ffffff" }}>World Ark Missions</strong>
                  </div>

                  <div className={styles.infoRow}>
                    <span className={styles.infoLabel}>Vodafone Cash Number</span>
                    <div className={styles.infoValueGroup}>
                      <span className={styles.infoValue}>0503979378</span>
                      <button 
                        onClick={() => copyToClipboard("0503979378", "voda-number")} 
                        className={`${styles.copyBtn} ${copiedKey === "voda-number" ? styles.copied : ""}`}
                        title="Copy Number"
                      >
                        {copiedKey === "voda-number" ? <Check size={13} /> : <Copy size={13} />}
                        <span>{copiedKey === "voda-number" ? "Copied" : "Copy"}</span>
                      </button>
                    </div>
                  </div>
                </div>

                <div className={styles.instruction}>
                  <p>
                    Dial <strong>*110#</strong> &rarr; Select <strong>1 (Send Money)</strong> &rarr; Enter <strong>0503979378</strong> &amp; specify your reference (Tithe / Offering).
                  </p>
                </div>
              </div>

              {/* 3. AirtelTigo Money */}
              <div className={styles.card}>
                <div className={styles.cardHeaderRow}>
                  <div>
                    <h3>AirtelTigo Money</h3>
                    <p className={styles.cardDesc}>AirtelTigo payment channel</p>
                  </div>
                  <span className={`${styles.providerPill} ${styles.airteltigoPill}`}>AirtelTigo</span>
                </div>

                <div className={styles.paymentInfo}>
                  <div className={styles.infoRow}>
                    <span className={styles.infoLabel}>Account Name</span>
                    <strong style={{ color: "#ffffff" }}>World Ark Missions</strong>
                  </div>

                  <div className={styles.infoRow}>
                    <span className={styles.infoLabel}>AirtelTigo Number</span>
                    <div className={styles.infoValueGroup}>
                      <span className={styles.infoValue}>0277729766</span>
                      <button 
                        onClick={() => copyToClipboard("0277729766", "at-number")} 
                        className={`${styles.copyBtn} ${copiedKey === "at-number" ? styles.copied : ""}`}
                        title="Copy Number"
                      >
                        {copiedKey === "at-number" ? <Check size={13} /> : <Copy size={13} />}
                        <span>{copiedKey === "at-number" ? "Copied" : "Copy"}</span>
                      </button>
                    </div>
                  </div>
                </div>

                <div className={styles.instruction}>
                  <p>
                    Dial <strong>*110#</strong> &rarr; Select <strong>Send Money</strong> &rarr; Enter <strong>0277729766</strong> &amp; confirm recipient as World Ark Missions.
                  </p>
                </div>
              </div>

              {/* 4. Bank Transfer Accounts */}
              <div className={styles.card}>
                <div className={styles.cardHeaderRow}>
                  <div>
                    <h3>Official Bank Accounts</h3>
                    <p className={styles.cardDesc}>Direct deposits &amp; online wire transfers</p>
                  </div>
                  <span className={`${styles.providerPill} ${styles.bankPill}`}>Banks</span>
                </div>

                <div className={styles.paymentInfo}>
                  <div className={styles.infoRow}>
                    <span className={styles.infoLabel}>Account Name</span>
                    <strong style={{ color: "#ffffff" }}>World Ark Missions</strong>
                  </div>

                  {/* GCB Bank */}
                  <div className={styles.infoRow}>
                    <span className={styles.infoLabel}>GCB Bank</span>
                    <div className={styles.infoValueGroup}>
                      <span className={styles.infoValue}>1211180002348</span>
                      <button 
                        onClick={() => copyToClipboard("1211180002348", "gcb-acc")} 
                        className={`${styles.copyBtn} ${copiedKey === "gcb-acc" ? styles.copied : ""}`}
                        title="Copy GCB Account"
                      >
                        {copiedKey === "gcb-acc" ? <Check size={13} /> : <Copy size={13} />}
                        <span>{copiedKey === "gcb-acc" ? "Copied" : "Copy"}</span>
                      </button>
                    </div>
                  </div>

                  {/* FBN Bank */}
                  <div className={styles.infoRow}>
                    <span className={styles.infoLabel}>FBN Bank</span>
                    <div className={styles.infoValueGroup}>
                      <span className={styles.infoValue}>0032030005142</span>
                      <button 
                        onClick={() => copyToClipboard("0032030005142", "fbn-acc")} 
                        className={`${styles.copyBtn} ${copiedKey === "fbn-acc" ? styles.copied : ""}`}
                        title="Copy FBN Account"
                      >
                        {copiedKey === "fbn-acc" ? <Check size={13} /> : <Copy size={13} />}
                        <span>{copiedKey === "fbn-acc" ? "Copied" : "Copy"}</span>
                      </button>
                    </div>
                  </div>
                </div>

                <div className={styles.instruction}>
                  <p>
                    Reference your transfer with <strong>&quot;Tithe&quot;</strong>, <strong>&quot;Offering&quot;</strong>, or <strong>&quot;Missions&quot;</strong>.
                  </p>
                </div>
              </div>
            </div>

            {/* Official Church Flyer Section */}
            <div className={styles.flyerCard}>
              <div>
                <span className={styles.heroBadge} style={{ margin: "0 auto 12px auto" }}>
                  Verified Details
                </span>
                <h3 style={{ fontSize: "22px", margin: "0 0 6px 0" }}>Official Church Giving Flyer</h3>
                <p style={{ color: "#94a3b8", fontSize: "14px", margin: 0 }}>
                  You can save or screenshot these payment instructions for your records.
                </p>
              </div>

              <div className={styles.flyerImageWrapper}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src={givingData.bannerImage || "https://res.cloudinary.com/dm5bp1efp/image/upload/v1795477248/world-ark-missions/momo-details.jpg"} 
                  alt="World Ark Missions Mobile Money & Bank Accounts" 
                  className={styles.flyerImage} 
                />
              </div>
            </div>

            <div className={styles.verse}>
              <blockquote>
                &ldquo;Each of you should give what you have decided in your heart to give, 
                not reluctantly or under compulsion, for God loves a cheerful giver.&rdquo;
              </blockquote>
              <cite>— 2 Corinthians 9:7</cite>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
