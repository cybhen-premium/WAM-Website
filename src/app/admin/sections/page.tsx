"use client";

import { useState, useEffect, useRef } from "react";
import Sidebar from "@/components/Sidebar";
import styles from "./Sections.module.css";
import { 
  UploadCloud, Check, RefreshCw, LayoutGrid, User, Compass, 
  Heart, ExternalLink, Image as ImageIcon, Save, Calendar, Users 
} from "lucide-react";
import Link from "next/link";

export default function SectionImagesManager() {
  const [activeTab, setActiveTab] = useState<"hero" | "startHere" | "services" | "founder" | "ministries" | "giving" | "missionBanner">("hero");
  const [sections, setSections] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const uploadCallbackRef = useRef<((url: string) => void) | null>(null);

  const fetchSections = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/sections");
      const data = await res.json();
      setSections(data);
    } catch (err) {
      console.error("Failed to load sections:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSections();
  }, []);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleSaveSections = async (dataToSave: any) => {
    setSaving(true);
    try {
      const res = await fetch("/api/sections", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataToSave),
      });

      if (res.ok) {
        showNotification("All changes saved and live on website!");
        return true;
      } else {
        const errData = await res.json().catch(() => ({}));
        alert(errData.error || "Failed to save changes.");
        return false;
      }
    } catch (err) {
      console.error("Save error:", err);
      alert("Error saving sections.");
      return false;
    } finally {
      setSaving(false);
    }
  };

  const handleFileUpload = async (file: File) => {
    if (!uploadCallbackRef.current) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/admin/media", {
        method: "POST",
        body: formData,
      });

      let data: any = {};
      try {
        data = await res.json();
      } catch {
        // response was not JSON
      }

      if (res.ok && data.success && data.uploaded?.[0]?.url) {
        const uploadedUrl = data.uploaded[0].url;
        uploadCallbackRef.current(uploadedUrl);
      } else {
        alert(data.error || `Upload failed (Status ${res.status}): Please check the image format and file size.`);
      }
    } catch (err) {
      console.error("Upload error:", err);
      alert(err instanceof Error ? err.message : "Failed to upload image. Please check your internet connection.");
    } finally {
      uploadCallbackRef.current = null;
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const triggerUploadFor = (callback: (url: string) => void) => {
    uploadCallbackRef.current = callback;
    fileInputRef.current?.click();
  };

  const handleSaveAll = async () => {
    if (!sections) return;
    await handleSaveSections(sections);
  };

  if (loading || !sections) {
    return (
      <div className={styles.layout}>
        <Sidebar />
        <main className={styles.main} style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ textAlign: "center", color: "#94a3b8" }}>
            <RefreshCw size={28} className="animate-spin" style={{ margin: "0 auto 1rem auto" }} />
            <p>Loading Website Sections &amp; Names...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className={styles.layout}>
      <Sidebar />

      <main className={styles.main}>
        {/* Hidden upload input */}
        <input 
          ref={fileInputRef}
          type="file" 
          accept="image/*" 
          style={{ display: "none" }}
          onChange={(e) => {
            if (e.target.files?.[0]) {
              handleFileUpload(e.target.files[0]);
            }
          }}
        />

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

        {/* Top Header */}
        <header className={styles.header}>
          <div className={styles.headerText}>
            <h1>Website Sections, Names &amp; Headings</h1>
            <p>Directly customize names, headings, texts, and images across all website sections.</p>
          </div>

          <div style={{ display: "flex", gap: "0.75rem" }}>
            <button onClick={handleSaveAll} className={styles.saveBtn} disabled={saving}>
              <Save size={17} />
              {saving ? "Saving..." : "Save All Changes"}
            </button>
          </div>
        </header>

        <div className={styles.container}>
          {/* Navigation Tabs */}
          <div className={styles.navTabs}>
            <button 
              className={`${styles.navTabBtn} ${activeTab === "hero" ? styles.activeTab : ""}`}
              onClick={() => setActiveTab("hero")}
            >
              1. Hero &amp; Brand Name
            </button>
            <button 
              className={`${styles.navTabBtn} ${activeTab === "startHere" ? styles.activeTab : ""}`}
              onClick={() => setActiveTab("startHere")}
            >
              2. Start Here Pathways
            </button>
            <button 
              className={`${styles.navTabBtn} ${activeTab === "services" ? styles.activeTab : ""}`}
              onClick={() => setActiveTab("services")}
            >
              3. Services &amp; Gatherings
            </button>
            <button 
              className={`${styles.navTabBtn} ${activeTab === "founder" ? styles.activeTab : ""}`}
              onClick={() => setActiveTab("founder")}
            >
              4. Founder &amp; Leadership
            </button>
            <button 
              className={`${styles.navTabBtn} ${activeTab === "ministries" ? styles.activeTab : ""}`}
              onClick={() => setActiveTab("ministries")}
            >
              5. Ministries Header
            </button>
            <button 
              className={`${styles.navTabBtn} ${activeTab === "giving" ? styles.activeTab : ""}`}
              onClick={() => setActiveTab("giving")}
            >
              6. Giving Page
            </button>
            <button 
              className={`${styles.navTabBtn} ${activeTab === "missionBanner" ? styles.activeTab : ""}`}
              onClick={() => setActiveTab("missionBanner")}
            >
              7. Mission Banner
            </button>
          </div>

          {/* TAB 1: HERO SECTION */}
          {activeTab === "hero" && (
            <div className={styles.sectionCard}>
              <div className={styles.sectionTitleRow}>
                <div>
                  <h2>Hero Background &amp; Church Name</h2>
                  <p>Customize the church name, main headlines, schedule badge, and backdrop image.</p>
                </div>
                <Link href="/" target="_blank" style={{ color: "#b8d432", fontSize: "0.85rem", textDecoration: "none", display: "flex", alignItems: "center", gap: "0.3rem" }}>
                  View Live Hero <ExternalLink size={13} />
                </Link>
              </div>

              <div className={styles.formGrid}>
                <div className={styles.imageControlCol}>
                  <label>Current Hero Image</label>
                  <div className={styles.imagePreview}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={sections.hero?.image} alt="Hero Background" />
                  </div>

                  <div className={styles.imageActions}>
                    <button 
                      className={styles.uploadImageBtn}
                      onClick={() => triggerUploadFor(async (url) => {
                        const updated = { ...sections, hero: { ...sections.hero, image: url } };
                        setSections(updated);
                        await handleSaveSections(updated);
                      })}
                    >
                      <UploadCloud size={16} />
                      Upload New Hero Photo
                    </button>
                  </div>
                  <input 
                    type="text" 
                    className={styles.textInput} 
                    value={sections.hero?.image || ""} 
                    onChange={(e) => setSections({ ...sections, hero: { ...sections.hero, image: e.target.value } })}
                    onBlur={() => handleSaveSections(sections)}
                    placeholder="Image URL"
                  />
                </div>

                <div className={styles.textControlCol}>
                  <div className={styles.formGroup}>
                    <label>Title Prefix</label>
                    <input 
                      type="text" 
                      className={styles.textInput} 
                      value={sections.hero?.titlePrefix || ""} 
                      onChange={(e) => setSections({ ...sections, hero: { ...sections.hero, titlePrefix: e.target.value } })}
                      placeholder="Sunday at"
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label>Church / Highlighted Name</label>
                    <input 
                      type="text" 
                      className={styles.textInput} 
                      value={sections.hero?.titleHighlight || ""} 
                      onChange={(e) => setSections({ ...sections, hero: { ...sections.hero, titleHighlight: e.target.value } })}
                      placeholder="World Ark Missions"
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label>Subtitle &amp; Tagline</label>
                    <input 
                      type="text" 
                      className={styles.textInput} 
                      value={sections.hero?.subtitle || ""} 
                      onChange={(e) => setSections({ ...sections, hero: { ...sections.hero, subtitle: e.target.value } })}
                      placeholder="A Place of Salvation, Transformation & Purpose · Afienya"
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label>Service Schedule Badge Name</label>
                    <input 
                      type="text" 
                      className={styles.textInput} 
                      value={sections.hero?.serviceTag || ""} 
                      onChange={(e) => setSections({ ...sections, hero: { ...sections.hero, serviceTag: e.target.value } })}
                      placeholder="Sunday Worship"
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label>Service Schedule Heading</label>
                    <input 
                      type="text" 
                      className={styles.textInput} 
                      value={sections.hero?.serviceHeading || ""} 
                      onChange={(e) => setSections({ ...sections, hero: { ...sections.hero, serviceHeading: e.target.value } })}
                      placeholder="Join Us In Worship"
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label>Service Times / Schedule</label>
                    <input 
                      type="text" 
                      className={styles.textInput} 
                      value={sections.hero?.serviceTimes || ""} 
                      onChange={(e) => setSections({ ...sections, hero: { ...sections.hero, serviceTimes: e.target.value } })}
                      placeholder="Sundays at 8:00 AM"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: START HERE PATHWAYS */}
          {activeTab === "startHere" && (
            <div className={styles.sectionCard}>
              <div className={styles.sectionTitleRow}>
                <div>
                  <h2>Start Here Section &amp; Pathway Names</h2>
                  <p>Customize the section heading, subtitle, and the names of all 4 pathway cards.</p>
                </div>
                <Link href="/#start-here" target="_blank" style={{ color: "#b8d432", fontSize: "0.85rem", textDecoration: "none", display: "flex", alignItems: "center", gap: "0.3rem" }}>
                  View Live Pathways <ExternalLink size={13} />
                </Link>
              </div>

              {/* Section Header Controls */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 2fr", gap: "1rem", background: "rgba(255,255,255,0.03)", padding: "1rem", borderRadius: "10px", border: "1px solid rgba(255,255,255,0.06)" }}>
                <div className={styles.formGroup}>
                  <label>Section Title Prefix</label>
                  <input 
                    type="text" 
                    className={styles.textInput} 
                    value={sections.startHereHeader?.titlePrefix || "Start"} 
                    onChange={(e) => setSections({ 
                      ...sections, 
                      startHereHeader: { ...sections.startHereHeader, titlePrefix: e.target.value } 
                    })}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Section Title Highlight</label>
                  <input 
                    type="text" 
                    className={styles.textInput} 
                    value={sections.startHereHeader?.titleHighlight || "here."} 
                    onChange={(e) => setSections({ 
                      ...sections, 
                      startHereHeader: { ...sections.startHereHeader, titleHighlight: e.target.value } 
                    })}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Section Subtitle</label>
                  <input 
                    type="text" 
                    className={styles.textInput} 
                    value={sections.startHereHeader?.subtitle || "Four ways to connect with World Ark Missions."} 
                    onChange={(e) => setSections({ 
                      ...sections, 
                      startHereHeader: { ...sections.startHereHeader, subtitle: e.target.value } 
                    })}
                  />
                </div>
              </div>

              {/* 4 Cards Grid */}
              <div className={styles.pathwaysGrid}>
                {sections.startHere?.map((card: any, idx: number) => (
                  <div key={card.id || idx} className={styles.pathwayCard}>
                    <div className={styles.imagePreview}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={card.image} alt={card.title} />
                    </div>

                    <button 
                      className={styles.uploadImageBtn}
                      style={{ width: "100%", justifyContent: "center" }}
                      onClick={() => triggerUploadFor(async (url) => {
                        const updated = [...sections.startHere];
                        updated[idx].image = url;
                        const newSections = { ...sections, startHere: updated };
                        setSections(newSections);
                        await handleSaveSections(newSections);
                      })}
                    >
                      <UploadCloud size={15} />
                      Change Card Photo
                    </button>
                    <input 
                      type="text" 
                      className={styles.textInput} 
                      style={{ marginTop: "6px" }}
                      value={card.image || ""} 
                      placeholder="Card Image URL"
                      onChange={(e) => {
                        const updated = [...sections.startHere];
                        updated[idx].image = e.target.value;
                        setSections({ ...sections, startHere: updated });
                      }}
                      onBlur={() => handleSaveSections(sections)}
                    />

                    <div className={styles.formGroup}>
                      <label>Badge Tag Name</label>
                      <input 
                        type="text" 
                        className={styles.textInput} 
                        value={card.tag} 
                        onChange={(e) => {
                          const updated = [...sections.startHere];
                          updated[idx].tag = e.target.value;
                          setSections({ ...sections, startHere: updated });
                        }}
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label>Card Title / Name</label>
                      <input 
                        type="text" 
                        className={styles.textInput} 
                        value={card.title} 
                        onChange={(e) => {
                          const updated = [...sections.startHere];
                          updated[idx].title = e.target.value;
                          setSections({ ...sections, startHere: updated });
                        }}
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label>Card Description</label>
                      <input 
                        type="text" 
                        className={styles.textInput} 
                        value={card.desc} 
                        onChange={(e) => {
                          const updated = [...sections.startHere];
                          updated[idx].desc = e.target.value;
                          setSections({ ...sections, startHere: updated });
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: SERVICES & GATHERINGS */}
          {activeTab === "services" && (
            <div className={styles.sectionCard}>
              <div className={styles.sectionTitleRow}>
                <div>
                  <h2>Weekly Services &amp; Gatherings Names</h2>
                  <p>Customize the titles, schedules, and categories of all weekly church gatherings.</p>
                </div>
                <Link href="/#services" target="_blank" style={{ color: "#b8d432", fontSize: "0.85rem", textDecoration: "none", display: "flex", alignItems: "center", gap: "0.3rem" }}>
                  View Live Services <ExternalLink size={13} />
                </Link>
              </div>

              {/* Section Header Controls */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 2fr", gap: "1rem", background: "rgba(255,255,255,0.03)", padding: "1rem", borderRadius: "10px", border: "1px solid rgba(255,255,255,0.06)" }}>
                <div className={styles.formGroup}>
                  <label>Section Title Prefix</label>
                  <input 
                    type="text" 
                    className={styles.textInput} 
                    value={sections.servicesHeader?.titlePrefix || "Services &"} 
                    onChange={(e) => setSections({ 
                      ...sections, 
                      servicesHeader: { ...sections.servicesHeader, titlePrefix: e.target.value } 
                    })}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Section Title Highlight</label>
                  <input 
                    type="text" 
                    className={styles.textInput} 
                    value={sections.servicesHeader?.titleHighlight || "upcoming."} 
                    onChange={(e) => setSections({ 
                      ...sections, 
                      servicesHeader: { ...sections.servicesHeader, titleHighlight: e.target.value } 
                    })}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Section Subtitle</label>
                  <input 
                    type="text" 
                    className={styles.textInput} 
                    value={sections.servicesHeader?.subtitle || "Weekly worship services, scripture discipleship, and prayer encounters."} 
                    onChange={(e) => setSections({ 
                      ...sections, 
                      servicesHeader: { ...sections.servicesHeader, subtitle: e.target.value } 
                    })}
                  />
                </div>
              </div>

              {/* Gatherings List Grid */}
              <div className={styles.gatheringsGrid}>
                {sections.gatherings?.map((item: any, idx: number) => (
                  <div key={item.id || idx} className={styles.gatheringCard}>
                    <div className={styles.cardHeaderRow}>
                      <span className={styles.dayBadge}>{item.dayNum}</span>
                      <span style={{ fontSize: "0.8rem", color: "#94a3b8" }}>Gathering #{idx + 1}</span>
                    </div>

                    <div className={styles.formGroup}>
                      <label>Day Identifier (e.g. SUN, WED, FRI, SAT)</label>
                      <input 
                        type="text" 
                        className={styles.textInput} 
                        value={item.dayNum} 
                        onChange={(e) => {
                          const updated = [...sections.gatherings];
                          updated[idx].dayNum = e.target.value;
                          setSections({ ...sections, gatherings: updated });
                        }}
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label>Category Name</label>
                      <input 
                        type="text" 
                        className={styles.textInput} 
                        value={item.category} 
                        onChange={(e) => {
                          const updated = [...sections.gatherings];
                          updated[idx].category = e.target.value;
                          setSections({ ...sections, gatherings: updated });
                        }}
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label>Service Title / Name</label>
                      <input 
                        type="text" 
                        className={styles.textInput} 
                        value={item.title} 
                        onChange={(e) => {
                          const updated = [...sections.gatherings];
                          updated[idx].title = e.target.value;
                          setSections({ ...sections, gatherings: updated });
                        }}
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label>Time &amp; Description / Location</label>
                      <input 
                        type="text" 
                        className={styles.textInput} 
                        value={item.time} 
                        onChange={(e) => {
                          const updated = [...sections.gatherings];
                          updated[idx].time = e.target.value;
                          setSections({ ...sections, gatherings: updated });
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: FOUNDER & LEADERSHIP */}
          {activeTab === "founder" && (
            <div className={styles.sectionCard}>
              <div className={styles.sectionTitleRow}>
                <div>
                  <h2>Founder &amp; Leadership Details</h2>
                  <p>Customize the founder name, worship family label, story texts, and portrait photos.</p>
                </div>
                <Link href="/#founder" target="_blank" style={{ color: "#b8d432", fontSize: "0.85rem", textDecoration: "none", display: "flex", alignItems: "center", gap: "0.3rem" }}>
                  View Live Section <ExternalLink size={13} />
                </Link>
              </div>

              <div className={styles.formGrid}>
                {/* Founder Photo */}
                <div className={styles.imageControlCol}>
                  <label>1. Founder Portrait</label>
                  <div className={styles.imagePreview} style={{ aspectRatio: "4/5" }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={sections.founder?.founderImage} alt="Rev. Benjamin Adom" />
                  </div>
                  <button 
                    className={styles.uploadImageBtn}
                    onClick={() => triggerUploadFor(async (url) => {
                      const updated = { ...sections, founder: { ...sections.founder, founderImage: url } };
                      setSections(updated);
                      await handleSaveSections(updated);
                    })}
                  >
                    <UploadCloud size={16} />
                    Change Founder Portrait
                  </button>
                  <input 
                    type="text" 
                    className={styles.textInput} 
                    value={sections.founder?.founderImage || ""} 
                    placeholder="Founder Image URL"
                    onChange={(e) => setSections({ ...sections, founder: { ...sections.founder, founderImage: e.target.value } })}
                    onBlur={() => handleSaveSections(sections)}
                  />
                </div>

                {/* Family Photo */}
                <div className={styles.imageControlCol}>
                  <label>2. Worship Family Photo (Offset Image)</label>
                  <div className={styles.imagePreview} style={{ aspectRatio: "4/5" }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={sections.founder?.familyImage} alt="Worship Family" />
                  </div>
                  <button 
                    className={styles.uploadImageBtn}
                    onClick={() => triggerUploadFor(async (url) => {
                      const updated = { ...sections, founder: { ...sections.founder, familyImage: url } };
                      setSections(updated);
                      await handleSaveSections(updated);
                    })}
                  >
                    <UploadCloud size={16} />
                    Change Worship Photo
                  </button>
                  <input 
                    type="text" 
                    className={styles.textInput} 
                    value={sections.founder?.familyImage || ""} 
                    placeholder="Worship Family Image URL"
                    onChange={(e) => setSections({ ...sections, founder: { ...sections.founder, familyImage: e.target.value } })}
                    onBlur={() => handleSaveSections(sections)}
                  />
                </div>
              </div>

              <div className={styles.textControlCol} style={{ marginTop: "1rem" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                  <div className={styles.formGroup}>
                    <label>Founder Display Name</label>
                    <input 
                      type="text" 
                      className={styles.textInput} 
                      value={sections.founder?.founderName || "Rev. Benjamin Adom"} 
                      onChange={(e) => setSections({ ...sections, founder: { ...sections.founder, founderName: e.target.value } })}
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label>Family Photo Display Label</label>
                    <input 
                      type="text" 
                      className={styles.textInput} 
                      value={sections.founder?.familyLabel || "Worship Family"} 
                      onChange={(e) => setSections({ ...sections, founder: { ...sections.founder, familyLabel: e.target.value } })}
                    />
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label>Section Tag Name</label>
                  <input 
                    type="text" 
                    className={styles.textInput} 
                    value={sections.founder?.tag || "Our Vision & Leadership"} 
                    onChange={(e) => setSections({ ...sections, founder: { ...sections.founder, tag: e.target.value } })}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Section Title / Heading</label>
                  <input 
                    type="text" 
                    className={styles.textInput} 
                    value={sections.founder?.title || "Hope that doesn’t fade."} 
                    onChange={(e) => setSections({ ...sections, founder: { ...sections.founder, title: e.target.value } })}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Bio Paragraph 1</label>
                  <textarea 
                    rows={3}
                    className={styles.textarea} 
                    value={sections.founder?.bio1 || ""} 
                    onChange={(e) => setSections({ ...sections, founder: { ...sections.founder, bio1: e.target.value } })}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Bio Paragraph 2</label>
                  <textarea 
                    rows={3}
                    className={styles.textarea} 
                    value={sections.founder?.bio2 || ""} 
                    onChange={(e) => setSections({ ...sections, founder: { ...sections.founder, bio2: e.target.value } })}
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: MINISTRIES HEADER */}
          {activeTab === "ministries" && (
            <div className={styles.sectionCard}>
              <div className={styles.sectionTitleRow}>
                <div>
                  <h2>Ministries Section Header &amp; Names</h2>
                  <p>Customize the header badge, title, and intro subtitle for the Ministries section.</p>
                </div>
                <Link href="/admin/ministries" style={{ color: "#b8d432", fontSize: "0.85rem", textDecoration: "none", display: "flex", alignItems: "center", gap: "0.3rem" }}>
                  Manage Individual Ministries →
                </Link>
              </div>

              <div className={styles.textControlCol}>
                <div className={styles.formGroup}>
                  <label>Section Badge Name</label>
                  <input 
                    type="text" 
                    className={styles.textInput} 
                    value={sections.ministriesHeader?.badge || "Our Ministries"} 
                    onChange={(e) => setSections({ 
                      ...sections, 
                      ministriesHeader: { ...sections.ministriesHeader, badge: e.target.value } 
                    })}
                  />
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                  <div className={styles.formGroup}>
                    <label>Title Prefix</label>
                    <input 
                      type="text" 
                      className={styles.textInput} 
                      value={sections.ministriesHeader?.titlePrefix || "Belong &"} 
                      onChange={(e) => setSections({ 
                        ...sections, 
                        ministriesHeader: { ...sections.ministriesHeader, titlePrefix: e.target.value } 
                      })}
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label>Title Highlight (Italicized)</label>
                    <input 
                      type="text" 
                      className={styles.textInput} 
                      value={sections.ministriesHeader?.titleHighlight || "serve."} 
                      onChange={(e) => setSections({ 
                        ...sections, 
                        ministriesHeader: { ...sections.ministriesHeader, titleHighlight: e.target.value } 
                      })}
                    />
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label>Section Subtitle</label>
                  <textarea 
                    rows={3}
                    className={styles.textarea} 
                    value={sections.ministriesHeader?.subtitle || "Discover communities where you can grow spiritually, build meaningful relationships, and serve God."} 
                    onChange={(e) => setSections({ 
                      ...sections, 
                      ministriesHeader: { ...sections.ministriesHeader, subtitle: e.target.value } 
                    })}
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: GIVING */}
          {activeTab === "giving" && (
            <div className={styles.sectionCard}>
              <div className={styles.sectionTitleRow}>
                <div>
                  <h2>Giving Page Names &amp; Banner</h2>
                  <p>Top banner image and headline on the /giving page.</p>
                </div>
                <Link href="/giving" target="_blank" style={{ color: "#b8d432", fontSize: "0.85rem", textDecoration: "none", display: "flex", alignItems: "center", gap: "0.3rem" }}>
                  View Live Giving Page <ExternalLink size={13} />
                </Link>
              </div>

              <div className={styles.formGrid}>
                <div className={styles.imageControlCol}>
                  <label>Banner Photo</label>
                  <div className={styles.imagePreview}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={sections.giving?.bannerImage} alt="Giving Banner" />
                  </div>
                  <button 
                    className={styles.uploadImageBtn}
                    onClick={() => triggerUploadFor(async (url) => {
                      const updated = { ...sections, giving: { ...sections.giving, bannerImage: url } };
                      setSections(updated);
                      await handleSaveSections(updated);
                    })}
                  >
                    <UploadCloud size={16} />
                    Upload Giving Photo
                  </button>
                  <input 
                    type="text" 
                    className={styles.textInput} 
                    value={sections.giving?.bannerImage || ""} 
                    placeholder="Giving Banner Image URL"
                    onChange={(e) => setSections({ ...sections, giving: { ...sections.giving, bannerImage: e.target.value } })}
                    onBlur={() => handleSaveSections(sections)}
                  />
                </div>

                <div className={styles.textControlCol}>
                  <div className={styles.formGroup}>
                    <label>Page Title Name</label>
                    <input 
                      type="text" 
                      className={styles.textInput} 
                      value={sections.giving?.title || "Give & Partner"} 
                      onChange={(e) => setSections({ ...sections, giving: { ...sections.giving, title: e.target.value } })}
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label>Subtitle &amp; Call to Action</label>
                    <textarea 
                      rows={4}
                      className={styles.textarea} 
                      value={sections.giving?.subtitle || ""} 
                      onChange={(e) => setSections({ ...sections, giving: { ...sections.giving, subtitle: e.target.value } })}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 7: MISSION BANNER */}
          {activeTab === "missionBanner" && (
            <div className={styles.sectionCard}>
              <div className={styles.sectionTitleRow}>
                <div>
                  <h2>Mission &amp; Vision Banner</h2>
                  <p>Customize the full-width church mission banner, background photo, and core declarations.</p>
                </div>
                <Link href="/#services" target="_blank" style={{ color: "#b8d432", fontSize: "0.85rem", textDecoration: "none", display: "flex", alignItems: "center", gap: "0.3rem" }}>
                  View Live Section <ExternalLink size={13} />
                </Link>
              </div>

              <div className={styles.formGrid}>
                <div className={styles.imageControlCol}>
                  <label>Banner Background Photo</label>
                  <div className={styles.imagePreview}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={sections.missionBanner?.image} alt="Mission Banner Background" />
                  </div>
                  <button 
                    className={styles.uploadImageBtn}
                    onClick={() => triggerUploadFor(async (url) => {
                      const updated = { ...sections, missionBanner: { ...sections.missionBanner, image: url } };
                      setSections(updated);
                      await handleSaveSections(updated);
                    })}
                  >
                    <UploadCloud size={16} />
                    Upload Mission Photo
                  </button>
                  <input 
                    type="text" 
                    className={styles.textInput} 
                    value={sections.missionBanner?.image || ""} 
                    placeholder="Mission Banner Image URL"
                    onChange={(e) => setSections({ ...sections, missionBanner: { ...sections.missionBanner, image: e.target.value } })}
                    onBlur={() => handleSaveSections(sections)}
                  />
                </div>

                <div className={styles.textControlCol}>
                  <div className={styles.formGroup}>
                    <label>Title Prefix (White Text)</label>
                    <input 
                      type="text" 
                      className={styles.textInput} 
                      value={sections.missionBanner?.titlePrefix || "A place of salvation,"} 
                      onChange={(e) => setSections({ ...sections, missionBanner: { ...sections.missionBanner, titlePrefix: e.target.value } })}
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label>Title Highlight (Lime Accent Text)</label>
                    <input 
                      type="text" 
                      className={styles.textInput} 
                      value={sections.missionBanner?.titleHighlight || "transformation & purpose."} 
                      onChange={(e) => setSections({ ...sections, missionBanner: { ...sections.missionBanner, titleHighlight: e.target.value } })}
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label>Mission Description Paragraph</label>
                    <textarea 
                      rows={4}
                      className={styles.textarea} 
                      value={sections.missionBanner?.description || ""} 
                      onChange={(e) => setSections({ ...sections, missionBanner: { ...sections.missionBanner, description: e.target.value } })}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
