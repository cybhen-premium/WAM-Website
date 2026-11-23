"use client";

import { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import styles from "./Settings.module.css";
import { Save, Radio, Palette, Check } from "lucide-react";

export default function AdminSettings() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  const [liveSettings, setLiveSettings] = useState({
    platform: "YouTube",
    videoId: "",
    isLive: false,
    title: "",
  });

  const [siteSettings, setSiteSettings] = useState({
    churchName: "World Ark Missions",
    brandName: "WORLD ARK MISSIONS",
    tagline: "A place of salvation, transformation & purpose in Afienya.",
    location: "Afienya, Greater Accra, Ghana",
    gps: "GN-1252-6647",
    phone: "+233 30 395 8804",
    contactEmail: "worldarkmission1@gmail.com",
    announcement: "Join us this Sunday at 8:00 AM!",
    announcementEnabled: true,
  });

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  useEffect(() => {
    async function fetchSettings() {
      try {
        const [liveRes, siteRes] = await Promise.all([
          fetch("/api/settings/live"),
          fetch("/api/settings/site")
        ]);
        const liveData = await liveRes.json();
        const siteData = await siteRes.json();
        
        if (liveData && !liveData.error) setLiveSettings(liveData);
        if (siteData && typeof siteData === "object") {
          setSiteSettings((prev) => ({
            ...prev,
            churchName: siteData.churchName || prev.churchName,
            brandName: siteData.brandName || prev.brandName,
            tagline: siteData.tagline || prev.tagline,
            location: siteData.location || prev.location,
            gps: siteData.gps || prev.gps,
            phone: siteData.phone || prev.phone,
            contactEmail: siteData.contactEmail || prev.contactEmail,
            announcement: siteData.announcement !== undefined ? siteData.announcement : prev.announcement,
            announcementEnabled: siteData.announcementEnabled !== undefined ? (siteData.announcementEnabled === "true" || siteData.announcementEnabled === true) : prev.announcementEnabled,
          }));
        }
      } catch (error) {
        console.error("Failed to fetch settings");
      } finally {
        setLoading(false);
      }
    }
    fetchSettings();
  }, []);

  const handleSaveLive = async () => {
    setSaving(true);
    try {
      await fetch("/api/settings/live", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(liveSettings),
      });
      showNotification("Live broadcast settings updated!");
    } catch (error) {
      alert("Failed to save live settings");
    } finally {
      setSaving(false);
    }
  };

  const handleSaveSite = async () => {
    setSaving(true);
    try {
      await fetch("/api/settings/site", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          churchName: siteSettings.churchName,
          brandName: siteSettings.brandName,
          tagline: siteSettings.tagline,
          location: siteSettings.location,
          gps: siteSettings.gps,
          phone: siteSettings.phone,
          contactEmail: siteSettings.contactEmail,
          announcement: siteSettings.announcement,
          announcementEnabled: String(siteSettings.announcementEnabled),
        }),
      });

      // Also update brand in siteSections
      try {
        const sectionsRes = await fetch("/api/sections");
        const sectionsData = await sectionsRes.json();
        if (sectionsData) {
          sectionsData.brand = {
            churchName: siteSettings.churchName,
            shortName: siteSettings.brandName,
            tagline: siteSettings.tagline,
            address: siteSettings.location,
            gps: siteSettings.gps,
            phone: siteSettings.phone,
            email: siteSettings.contactEmail
          };
          await fetch("/api/sections", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(sectionsData),
          });
        }
      } catch {}

      showNotification("Church name & brand identity updated!");
    } catch (error) {
      alert("Failed to save site settings");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={styles.layout}>
      <Sidebar />
      <main className={styles.main}>
        {/* Toast Notification */}
        {notification && (
          <div style={{
            position: "fixed",
            bottom: "2rem",
            right: "2rem",
            background: "#b8d432",
            color: "#121212",
            padding: "0.75rem 1.5rem",
            borderRadius: "8px",
            boxShadow: "0 10px 25px rgba(0,0,0,0.5)",
            zIndex: 100,
            fontSize: "0.9rem",
            fontWeight: 700,
            display: "flex",
            alignItems: "center",
            gap: "0.5rem"
          }}>
            <Check size={18} />
            {notification}
          </div>
        )}

        <header className={styles.header}>
          <div className={styles.headerText}>
            <h1>Church Identity &amp; System Settings</h1>
            <p>Customize church names, brand titles, contact info, and live broadcasts.</p>
          </div>
        </header>

        <div className={styles.settingsGrid}>
          {/* General Branding Section */}
          <section className={styles.card}>
            <div className={styles.cardHeader}>
              <div className={styles.iconBox} style={{ background: 'rgba(184, 212, 50, 0.15)', color: '#b8d432' }}>
                <Palette size={24} />
              </div>
              <div>
                <h3>Church Name &amp; Brand Identity</h3>
                <p>Controls church display names across the Header, Footer, and Meta.</p>
              </div>
            </div>

            <div className={styles.cardBody}>
              <div className={styles.field}>
                <label>Church Full Name</label>
                <input 
                  type="text" 
                  value={siteSettings.churchName}
                  onChange={(e) => setSiteSettings({ ...siteSettings, churchName: e.target.value })}
                  placeholder="e.g. World Ark Missions"
                />
                <small>Displayed in the navigation bar, footer credits, and search titles.</small>
              </div>

              <div className={styles.field}>
                <label>Church Brand / Watermark Name (UPPERCASE)</label>
                <input 
                  type="text" 
                  value={siteSettings.brandName}
                  onChange={(e) => setSiteSettings({ ...siteSettings, brandName: e.target.value })}
                  placeholder="e.g. WORLD ARK MISSIONS"
                />
                <small>Used for the giant watermark background and signature badges.</small>
              </div>

              <div className={styles.field}>
                <label>Official Tagline / Motto</label>
                <input 
                  type="text" 
                  value={siteSettings.tagline}
                  onChange={(e) => setSiteSettings({ ...siteSettings, tagline: e.target.value })}
                  placeholder="A place of salvation, transformation & purpose in Afienya."
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div className={styles.field}>
                  <label>Location / City</label>
                  <input 
                    type="text" 
                    value={siteSettings.location}
                    onChange={(e) => setSiteSettings({ ...siteSettings, location: e.target.value })}
                    placeholder="Afienya, Greater Accra, Ghana"
                  />
                </div>

                <div className={styles.field}>
                  <label>Digital GPS Address</label>
                  <input 
                    type="text" 
                    value={siteSettings.gps}
                    onChange={(e) => setSiteSettings({ ...siteSettings, gps: e.target.value })}
                    placeholder="GN-1252-6647"
                  />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div className={styles.field}>
                  <label>Contact Phone</label>
                  <input 
                    type="text" 
                    value={siteSettings.phone}
                    onChange={(e) => setSiteSettings({ ...siteSettings, phone: e.target.value })}
                    placeholder="+233 30 395 8804"
                  />
                </div>

                <div className={styles.field}>
                  <label>Contact Email</label>
                  <input 
                    type="email" 
                    value={siteSettings.contactEmail}
                    onChange={(e) => setSiteSettings({ ...siteSettings, contactEmail: e.target.value })}
                    placeholder="worldarkmission1@gmail.com"
                  />
                </div>
              </div>

              <div className={styles.toggleRow} style={{ marginTop: '1rem', marginBottom: '1rem' }}>
                <div className={styles.toggleText}>
                  <strong>Enable Announcement Bar</strong>
                  <p>Show the banner alert at the very top of the website.</p>
                </div>
                <label className={styles.switch}>
                  <input 
                    type="checkbox" 
                    checked={siteSettings.announcementEnabled}
                    onChange={(e) => setSiteSettings({ ...siteSettings, announcementEnabled: e.target.checked })}
                  />
                  <span className={styles.slider} style={{ background: siteSettings.announcementEnabled ? '#b8d432' : '#ccc' }}></span>
                </label>
              </div>

              <div className={styles.field}>
                <label>Announcement Bar Text</label>
                <textarea 
                  rows={2}
                  value={siteSettings.announcement}
                  disabled={!siteSettings.announcementEnabled}
                  onChange={(e) => setSiteSettings({ ...siteSettings, announcement: e.target.value })}
                  style={{ opacity: siteSettings.announcementEnabled ? 1 : 0.5 }}
                ></textarea>
              </div>

              <button 
                onClick={handleSaveSite} 
                className={styles.saveBtnSecondary}
                disabled={saving}
                style={{ background: "#b8d432", color: "#121212", fontWeight: 700 }}
              >
                <Save size={18} />
                {saving ? "Saving..." : "Save Church Identity & Settings"}
              </button>
            </div>
          </section>

          {/* Live Stream Section */}
          <section className={styles.card}>
            <div className={styles.cardHeader}>
              <div className={styles.iconBox} style={{ background: '#fef2f2', color: '#ef4444' }}>
                <Radio size={24} />
              </div>
              <div>
                <h3>Live Stream Broadcast Center</h3>
                <p>Control the broadcast status on the homepage.</p>
              </div>
            </div>
            
            <div className={styles.cardBody}>
              <div className={styles.toggleRow}>
                <div className={styles.toggleText}>
                  <strong>Go Live Now</strong>
                  <p>Turn on the &ldquo;LIVE&rdquo; badge and embed player site-wide.</p>
                </div>
                <label className={styles.switch}>
                  <input 
                    type="checkbox" 
                    checked={liveSettings.isLive}
                    onChange={(e) => setLiveSettings({ ...liveSettings, isLive: e.target.checked })}
                  />
                  <span className={styles.slider}></span>
                </label>
              </div>

              <div className={styles.field}>
                <label>YouTube Video ID</label>
                <input 
                  type="text" 
                  value={liveSettings.videoId}
                  onChange={(e) => setLiveSettings({ ...liveSettings, videoId: e.target.value })}
                  placeholder="e.g., dQw4w9WgXcQ"
                />
                <small>The code after &ldquo;v=&rdquo; in the YouTube URL.</small>
              </div>

              <div className={styles.field}>
                <label>Broadcast Title</label>
                <input 
                  type="text" 
                  value={liveSettings.title}
                  onChange={(e) => setLiveSettings({ ...liveSettings, title: e.target.value })}
                  placeholder="e.g., Sunday Transformation Service"
                />
              </div>

              <button 
                onClick={handleSaveLive} 
                className={styles.saveBtn}
                disabled={saving}
              >
                <Save size={18} />
                {saving ? "Saving..." : "Update Live Status"}
              </button>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
