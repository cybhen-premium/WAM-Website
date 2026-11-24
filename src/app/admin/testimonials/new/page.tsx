"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import styles from "../../sermons/new/NewSermon.module.css";
import { ArrowLeft, Save, UploadCloud, Check, User } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { uploadMediaFile } from "@/lib/mediaUploadClient";

export default function NewTestimonial() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    role: "Church Family",
    content: "",
    imageUrl: "",
  });

  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const uploadedUrl = await uploadMediaFile(file);
      setFormData((prev) => ({ ...prev, imageUrl: uploadedUrl }));
    } catch (err) {
      console.error("Image upload failed:", err);
      alert(err instanceof Error ? err.message : "Failed to upload photo. Please check your connection.");
    } finally {
      setUploadingImage(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.content.trim()) {
      alert("Please provide both a member name and the testimony content.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/testimonials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const resData = await response.json();
      if (response.ok && resData.success) {
        router.push("/admin/testimonials");
      } else {
        alert(resData.error || "Failed to create testimonial.");
      }
    } catch (error) {
      console.error("Failed to create testimonial:", error);
      alert("Failed to save testimonial. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.layout}>
      <Sidebar />
      <main className={styles.main}>
        <header className={styles.header}>
          <Link href="/admin/testimonials" className={styles.backBtn}>
            <ArrowLeft size={20} />
            Back to Testimonials
          </Link>
          <h1>Add New Testimonial</h1>
        </header>

        <form onSubmit={handleSubmit} className={styles.formCard}>
          <div className={styles.formGrid}>
            <div className={styles.field}>
              <label>Member Name *</label>
              <input 
                type="text" 
                required 
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Sister Abigail Serwaa"
              />
            </div>

            <div className={styles.field}>
              <label>Role / Fellowship Group</label>
              <input 
                type="text" 
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                placeholder="e.g., Women of Grace Member, Youth Leader, Church Family"
              />
            </div>

            <div className={styles.fieldFull}>
              <label>Member Photo (Optional)</label>
              <div style={{ display: "flex", alignItems: "center", gap: "1.25rem", marginTop: "0.5rem" }}>
                <div style={{ 
                  width: 64, 
                  height: 64, 
                  borderRadius: "50%", 
                  overflow: "hidden", 
                  position: "relative", 
                  background: "rgba(255,255,255,0.06)", 
                  border: "2px solid rgba(184, 212, 50, 0.4)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0
                }}>
                  {formData.imageUrl ? (
                    <Image src={formData.imageUrl} alt="Member preview" fill style={{ objectFit: "cover" }} />
                  ) : (
                    <User size={28} color="#94a3b8" />
                  )}
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem", flex: 1 }}>
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploadingImage}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "0.4rem",
                        background: "#b8d432",
                        color: "#121212",
                        border: "none",
                        borderRadius: "6px",
                        padding: "0.5rem 1rem",
                        fontSize: "0.85rem",
                        fontWeight: 700,
                        cursor: "pointer"
                      }}
                    >
                      <UploadCloud size={16} />
                      {uploadingImage ? "Uploading to Cloudinary..." : "Upload Photo"}
                    </button>
                    {formData.imageUrl && (
                      <button
                        type="button"
                        onClick={() => setFormData((prev) => ({ ...prev, imageUrl: "" }))}
                        style={{
                          background: "rgba(239, 68, 68, 0.15)",
                          color: "#ef4444",
                          border: "1px solid rgba(239, 68, 68, 0.3)",
                          borderRadius: "6px",
                          padding: "0.5rem 0.85rem",
                          fontSize: "0.85rem",
                          cursor: "pointer"
                        }}
                      >
                        Remove Photo
                      </button>
                    )}
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={handleImageFileChange}
                  />
                  <input
                    type="text"
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                    placeholder="Or paste an image URL here directly..."
                    style={{ fontSize: "0.8rem", padding: "0.4rem 0.75rem", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "6px", color: "#cbd5e1" }}
                  />
                </div>
              </div>
            </div>

            <div className={styles.fieldFull}>
              <label>Testimony Story *</label>
              <textarea 
                rows={6}
                required
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="Share the story of God's grace, salvation, healing, or transformation..."
              ></textarea>
            </div>
          </div>

          <div className={styles.formActions}>
            <button type="button" onClick={() => router.back()} className={styles.cancelBtn}>
              Cancel
            </button>
            <button type="submit" disabled={loading} className={styles.saveBtn}>
              <Save size={18} />
              {loading ? "Saving to Database..." : "Save Testimonial"}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
