"use client";

import { useState, useEffect, useRef } from "react";
import Sidebar from "@/components/Sidebar";
import styles from "./MinistriesAdmin.module.css";
import { Plus, Edit2, UploadCloud, ExternalLink, X, Check, RefreshCw, Trash2 } from "lucide-react";
import Link from "next/link";
import { uploadMediaFile } from "@/lib/mediaUploadClient";

interface Ministry {
  slug: string;
  title: string;
  shortDescription: string;
  longDescription: string;
  image: string;
  gallery?: string[];
  iconName?: string;
}

export default function AdminMinistries() {
  const [ministries, setMinistries] = useState<Ministry[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingMinistry, setEditingMinistry] = useState<Ministry | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cardUploadTargetSlug = useRef<string | null>(null);

  const fetchMinistries = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/ministries");
      const data = await res.json();
      if (Array.isArray(data)) {
        setMinistries(data);
      }
    } catch (err) {
      console.error("Failed to fetch ministries:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMinistries();
  }, []);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleOpenEdit = (m: Ministry) => {
    setEditingMinistry({ ...m });
    setIsNew(false);
  };

  const handleOpenNew = () => {
    setEditingMinistry({
      slug: "",
      title: "",
      shortDescription: "",
      longDescription: "",
      image: "/assets/11.jpg",
      gallery: ["/assets/11.jpg"],
      iconName: "Users"
    });
    setIsNew(true);
  };

  // Inline title change handler
  const handleTitleChange = (slug: string, newTitle: string) => {
    setMinistries((prev) =>
      prev.map((m) => (m.slug === slug ? { ...m, title: newTitle } : m))
    );
  };

  // Instant save title handler
  const handleSaveTitle = async (slug: string) => {
    const item = ministries.find((m) => m.slug === slug);
    if (!item) return;

    try {
      const res = await fetch("/api/ministries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(ministries),
      });

      if (res.ok) {
        showNotification(`Ministry name updated to "${item.title}"!`);
      } else {
        alert("Failed to save ministry name.");
      }
    } catch (err) {
      console.error("Save title error:", err);
      alert("Failed to save ministry name.");
    }
  };

  // Delete ministry handler
  const handleDeleteMinistry = async (slug: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return;

    const filtered = ministries.filter((m) => m.slug !== slug);
    setMinistries(filtered);

    try {
      const res = await fetch("/api/ministries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(filtered),
      });

      if (res.ok) {
        showNotification(`"${title}" deleted successfully.`);
        if (editingMinistry?.slug === slug) setEditingMinistry(null);
      } else {
        alert("Failed to delete ministry.");
        fetchMinistries();
      }
    } catch (err) {
      console.error("Delete error:", err);
      alert("Failed to delete ministry.");
      fetchMinistries();
    }
  };

  // Upload image handler
  const handleFileUpload = async (file: File, target: "modal" | "card") => {
    setUploadingImage(true);

    try {
      const uploadedUrl = await uploadMediaFile(file);

      if (target === "modal" && editingMinistry) {
        setEditingMinistry({ ...editingMinistry, image: uploadedUrl });
        showNotification("Image uploaded! Click Save to apply.");
      } else if (target === "card" && cardUploadTargetSlug.current) {
        const slug = cardUploadTargetSlug.current;
        const updated = ministries.map((m) => m.slug === slug ? { ...m, image: uploadedUrl } : m);
        setMinistries(updated);

        // Save to server
        await fetch("/api/ministries", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updated),
        });
        showNotification("Ministry cover image updated!");
      }
    } catch (err) {
      console.error("Upload error:", err);
      alert(err instanceof Error ? err.message : "Failed to upload image. Please check your internet connection.");
    } finally {
      setUploadingImage(false);
      cardUploadTargetSlug.current = null;
    }
  };

  const handleSaveMinistry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMinistry) return;

    setSaving(true);
    try {
      let updatedList: Ministry[];
      if (isNew) {
        const autoSlug = editingMinistry.slug || editingMinistry.title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
        const newMinistry = { ...editingMinistry, slug: autoSlug };
        updatedList = [...ministries, newMinistry];
      } else {
        updatedList = ministries.map((m) => m.slug === editingMinistry.slug ? editingMinistry : m);
      }

      const res = await fetch("/api/ministries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedList),
      });

      if (res.ok) {
        setMinistries(updatedList);
        setEditingMinistry(null);
        showNotification(isNew ? "New ministry created!" : "Ministry details updated!");
      } else {
        alert("Failed to save ministry changes.");
      }
    } catch (err) {
      console.error("Save error:", err);
      alert("An error occurred while saving.");
    } finally {
      setSaving(false);
    }
  };

  const triggerCardImageUpload = (slug: string) => {
    cardUploadTargetSlug.current = slug;
    fileInputRef.current?.click();
  };

  return (
    <div className={styles.layout}>
      <Sidebar />

      <main className={styles.main}>
        {/* Hidden global file input for 1-click card image uploads */}
        <input 
          ref={fileInputRef} 
          type="file" 
          accept="image/*" 
          style={{ display: "none" }} 
          onChange={(e) => {
            if (e.target.files?.[0]) {
              handleFileUpload(e.target.files[0], "card");
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

        <header className={styles.header}>
          <div className={styles.headerText}>
            <h1>Ministries: Names &amp; Visual Content</h1>
            <p>Directly edit ministry names/titles, cover images, and stories displayed across the website.</p>
          </div>

          <div style={{ display: "flex", gap: "0.75rem" }}>
            <button onClick={fetchMinistries} className={styles.addBtn} style={{ background: "rgba(255,255,255,0.08)" }} title="Refresh">
              <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
            </button>
            <button onClick={handleOpenNew} className={styles.addBtn}>
              <Plus size={18} />
              Add Ministry
            </button>
          </div>
        </header>

        <div className={styles.container}>
          <div className={styles.infoBanner}>
            <div>
              <strong style={{ color: "#ffffff", display: "block", marginBottom: "0.2rem" }}>
                Live Website Integration Active
              </strong>
              <p>
                Edit any ministry name directly below and click <strong>&quot;Save Name&quot;</strong> (or press Enter). The update instantly reflects on the homepage <code>#ministries</code> grid and ministry pages.
              </p>
            </div>
            <Link 
              href="/admin/media" 
              style={{
                background: "rgba(184, 212, 50, 0.15)",
                color: "#b8d432",
                border: "1px solid rgba(184, 212, 50, 0.3)",
                padding: "0.5rem 1rem",
                borderRadius: "8px",
                fontSize: "0.85rem",
                fontWeight: 600,
                textDecoration: "none",
                whiteSpace: "nowrap"
              }}
            >
              Open Media Library →
            </Link>
          </div>

          {loading ? (
            <div style={{ textAlign: "center", padding: "4rem", color: "#64748b" }}>
              <RefreshCw size={28} className="animate-spin" style={{ margin: "0 auto 1rem auto" }} />
              <p>Loading ministries...</p>
            </div>
          ) : (
            <div className={styles.ministriesGrid}>
              {ministries.map((m) => (
                <div key={m.slug} className={styles.ministryCard}>
                  <div className={styles.imageBox}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img 
                      src={m.image} 
                      alt={m.title} 
                      className={styles.cardImage} 
                      style={{ width: "100%", height: "100%" }}
                    />

                    {/* Quick Image Change Button Overlay */}
                    <div className={styles.imageOverlay}>
                      <button 
                        className={styles.changeImageOverlayBtn}
                        onClick={() => triggerCardImageUpload(m.slug)}
                        disabled={uploadingImage}
                      >
                        <UploadCloud size={15} />
                        {uploadingImage ? "Uploading..." : "Change Image"}
                      </button>
                    </div>
                  </div>

                  <div className={styles.cardBody}>
                    {/* Direct Editable Name Field */}
                    <div className={styles.nameRow}>
                      <span className={styles.fieldLabel}>Ministry Name / Title</span>
                      <div className={styles.titleInputWrapper}>
                        <input 
                          type="text" 
                          className={styles.cardTitleInput} 
                          value={m.title} 
                          onChange={(e) => handleTitleChange(m.slug, e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              handleSaveTitle(m.slug);
                            }
                          }}
                          placeholder="Ministry Title"
                        />
                        <button 
                          className={styles.saveTitleBtn}
                          onClick={() => handleSaveTitle(m.slug)}
                          title="Save Name"
                        >
                          <Check size={14} />
                          Save Name
                        </button>
                      </div>
                    </div>

                    <p className={styles.cardDesc}>{m.shortDescription}</p>

                    <div className={styles.cardFooter}>
                      <button 
                        className={styles.editBtn} 
                        onClick={() => handleOpenEdit(m)}
                      >
                        <Edit2 size={14} />
                        Full Details
                      </button>

                      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                        <button 
                          className={styles.deleteBtn}
                          onClick={() => handleDeleteMinistry(m.slug, m.title)}
                          title="Delete ministry"
                        >
                          <Trash2 size={13} />
                        </button>

                        <Link 
                          href={`/ministries/${m.slug}`} 
                          target="_blank" 
                          className={styles.viewLink}
                        >
                          <span>View</span>
                          <ExternalLink size={13} />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Edit / Create Ministry Modal */}
        {editingMinistry && (
          <div className={styles.modalBackdrop} onClick={() => setEditingMinistry(null)}>
            <div className={styles.modalCard} onClick={(e) => e.stopPropagation()}>
              <div className={styles.modalHeader}>
                <h3>{isNew ? "Add New Ministry" : `Edit ${editingMinistry.title}`}</h3>
                <button className={styles.closeBtn} onClick={() => setEditingMinistry(null)}>
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSaveMinistry} className={styles.modalForm}>
                <div className={styles.formGroup}>
                  <label>Ministry Name / Title</label>
                  <input 
                    type="text" 
                    className={styles.input} 
                    value={editingMinistry.title} 
                    onChange={(e) => setEditingMinistry({ ...editingMinistry, title: e.target.value })}
                    placeholder="e.g. Men Ministry"
                    required
                  />
                  <small style={{ color: "#94a3b8", marginTop: "0.3rem", display: "block" }}>
                    The display name used on the homepage cards and navigation.
                  </small>
                </div>

                <div className={styles.formGroup}>
                  <label>Cover Image</label>
                  <div className={styles.imagePickerGroup}>
                    <input 
                      type="text" 
                      className={styles.input} 
                      value={editingMinistry.image} 
                      onChange={(e) => setEditingMinistry({ ...editingMinistry, image: e.target.value })}
                      placeholder="/assets/... or /uploads/..."
                      required
                    />
                    <label className={styles.uploadFileBtn}>
                      <UploadCloud size={16} />
                      <span>{uploadingImage ? "Uploading..." : "Upload Photo"}</span>
                      <input 
                        type="file" 
                        accept="image/*" 
                        style={{ display: "none" }}
                        onChange={(e) => {
                          if (e.target.files?.[0]) {
                            handleFileUpload(e.target.files[0], "modal");
                          }
                        }}
                      />
                    </label>
                  </div>

                  {editingMinistry.image && (
                    <div className={styles.imagePreviewThumbnail}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img 
                        src={editingMinistry.image} 
                        alt="Preview" 
                        style={{ width: "100%", height: "100%", objectFit: "cover" }} 
                      />
                    </div>
                  )}
                </div>

                <div className={styles.formGroup}>
                  <label>Short Summary (Displays on Homepage)</label>
                  <input 
                    type="text" 
                    className={styles.input} 
                    value={editingMinistry.shortDescription} 
                    onChange={(e) => setEditingMinistry({ ...editingMinistry, shortDescription: e.target.value })}
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Detailed Story &amp; Vision (Displays on Detail Page)</label>
                  <textarea 
                    rows={4} 
                    className={styles.textarea} 
                    value={editingMinistry.longDescription} 
                    onChange={(e) => setEditingMinistry({ ...editingMinistry, longDescription: e.target.value })}
                    required
                  />
                </div>

                <div className={styles.modalFooter}>
                  <button type="button" className={styles.cancelBtn} onClick={() => setEditingMinistry(null)}>
                    Cancel
                  </button>
                  <button type="submit" className={styles.saveBtn} disabled={saving}>
                    {saving ? "Saving..." : "Save Ministry"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
