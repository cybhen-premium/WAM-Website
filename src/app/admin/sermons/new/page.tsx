"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import styles from "./NewSermon.module.css";
import { ArrowLeft, Save, X } from "lucide-react";
import Link from "next/link";

export default function NewSermon() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    speaker: "Rev. Benjamin Eturu Adom",
    date: new Date().toISOString().split('T')[0],
    category: "Sunday Service",
    videoUrl: "",
    imageUrl: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/sermons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        router.push("/admin/sermons");
      }
    } catch (error) {
      console.error("Failed to create sermon:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.layout}>
      <Sidebar />
      <main className={styles.main}>
        <header className={styles.header}>
          <Link href="/admin/sermons" className={styles.backBtn}>
            <ArrowLeft size={20} />
            Back to Sermons
          </Link>
          <h1>Add New Sermon</h1>
        </header>

        <form onSubmit={handleSubmit} className={styles.formCard}>
          <div className={styles.formGrid}>
            <div className={styles.field}>
              <label>Sermon Title</label>
              <input 
                type="text" 
                required 
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g., The Power of Faith"
              />
            </div>

            <div className={styles.field}>
              <label>Speaker</label>
              <input 
                type="text" 
                required 
                value={formData.speaker}
                onChange={(e) => setFormData({ ...formData, speaker: e.target.value })}
              />
            </div>

            <div className={styles.field}>
              <label>Category</label>
              <select 
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              >
                <option>Sunday Service</option>
                <option>Rescue Hour</option>
                <option>Mid-Week Grace</option>
                <option>Special Event</option>
              </select>
            </div>

            <div className={styles.field}>
              <label>Date</label>
              <input 
                type="date" 
                required 
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              />
            </div>

            <div className={styles.fieldFull}>
              <label>Description</label>
              <textarea 
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Brief summary of the sermon..."
              ></textarea>
            </div>

            <div className={styles.field}>
              <label>Video URL (YouTube/Vimeo)</label>
              <input 
                type="url" 
                value={formData.videoUrl}
                onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                placeholder="https://youtube.com/watch?v=..."
              />
            </div>

            <div className={styles.field}>
              <label>Cover Image URL</label>
              <input 
                type="url" 
                value={formData.imageUrl}
                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                placeholder="https://..."
              />
            </div>
          </div>

          <div className={styles.formActions}>
            <button type="button" onClick={() => router.back()} className={styles.cancelBtn}>
              Cancel
            </button>
            <button type="submit" disabled={loading} className={styles.saveBtn}>
              <Save size={18} />
              {loading ? "Saving..." : "Save Sermon"}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
