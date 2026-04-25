"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import styles from "../../sermons/new/NewSermon.module.css";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";

export default function NewTestimonial() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    category: "Healing",
    date: "April 2024",
    content: "",
    imageUrl: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/testimonials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        router.push("/admin/testimonials");
      }
    } catch (error) {
      console.error("Failed to create testimonial:", error);
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
              <label>Member Name</label>
              <input 
                type="text" 
                required 
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Sister Sarah"
              />
            </div>

            <div className={styles.field}>
              <label>Category</label>
              <select 
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              >
                <option>Healing</option>
                <option>Financial Breakthrough</option>
                <option>Restoration</option>
                <option>Salvation</option>
                <option>Purpose</option>
              </select>
            </div>

            <div className={styles.field}>
              <label>Date (Display text)</label>
              <input 
                type="text" 
                required 
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                placeholder="e.g., April 2024"
              />
            </div>

            <div className={styles.fieldFull}>
              <label>Testimony Content</label>
              <textarea 
                rows={6}
                required
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="The full story of transformation..."
              ></textarea>
            </div>
          </div>

          <div className={styles.formActions}>
            <button type="button" onClick={() => router.back()} className={styles.cancelBtn}>
              Cancel
            </button>
            <button type="submit" disabled={loading} className={styles.saveBtn}>
              <Save size={18} />
              {loading ? "Saving..." : "Save Testimonial"}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
