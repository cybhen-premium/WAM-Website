"use client";

import { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import styles from "./Settings.module.css";
import { Save, Radio, Globe, Shield, Bell, Palette } from "lucide-react";

export default function AdminSettings() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [liveSettings, setLiveSettings] = useState({
    platform: "YouTube",
    videoId: "",
    isLive: false,
    title: "",
  });
  const [siteSettings, setSiteSettings] = useState({
    siteName: "World Ark Missions",
    announcement: "Join us this Sunday at 8:00 AM!",
    announcementEnabled: true,
    contactEmail: "info@worldarkmissions.org",
  });

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
        // ... map site settings if needed
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
      alert("Live stream settings updated!");
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
          announcement: siteSettings.announcement,
          announcementEnabled: siteSettings.announcementEnabled,
          contactEmail: siteSettings.contactEmail
        }),
      });
      alert("Branding settings updated!");
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
        <header className={styles.header}>
          <div className={styles.headerText}>
            <h1>System Settings</h1>
            <p>Configure your website's global behavior and live streams.</p>
          </div>
        </header>

        <div className={styles.settingsGrid}>
          {/* Live Stream Section */}
          <section className={styles.card}>
            <div className={styles.cardHeader}>
              <div className={styles.iconBox} style={{ background: '#fef2f2', color: '#ef4444' }}>
                <Radio size={24} />
              </div>
              <div>
                <h3>Live Stream Command Center</h3>
                <p>Control the broadcast status on the homepage.</p>
              </div>
            </div>
            
            <div className={styles.cardBody}>
              <div className={styles.toggleRow}>
                <div className={styles.toggleText}>
                  <strong>Go Live Now</strong>
                  <p>Turn on the "LIVE" badge and embed player site-wide.</p>
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
                <small>The code after "v=" in the YouTube URL.</small>
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

          {/* General Branding Section */}
          <section className={styles.card}>
            <div className={styles.cardHeader}>
              <div className={styles.iconBox} style={{ background: '#f0f9ff', color: '#0ea5e9' }}>
                <Palette size={24} />
              </div>
              <div>
                <h3>Branding & Announcements</h3>
                <p>Update site-wide alerts and information.</p>
              </div>
            </div>

            <div className={styles.cardBody}>
              <div className={styles.toggleRow} style={{ marginBottom: '1.5rem' }}>
                <div className={styles.toggleText}>
                  <strong>Enable Announcement Bar</strong>
                  <p>Show the banner at the top of the website.</p>
                </div>
                <label className={styles.switch}>
                  <input 
                    type="checkbox" 
                    checked={siteSettings.announcementEnabled}
                    onChange={(e) => setSiteSettings({ ...siteSettings, announcementEnabled: e.target.checked })}
                  />
                  <span className={styles.slider} style={{ background: siteSettings.announcementEnabled ? '#0ea5e9' : '#ccc' }}></span>
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

              <div className={styles.field}>
                <label>Contact Email</label>
                <input 
                  type="email" 
                  value={siteSettings.contactEmail}
                  onChange={(e) => setSiteSettings({ ...siteSettings, contactEmail: e.target.value })}
                />
              </div>

              <button 
                onClick={handleSaveSite} 
                className={styles.saveBtnSecondary}
                disabled={saving}
              >
                <Save size={18} />
                {saving ? "Saving..." : "Save Branding"}
              </button>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
