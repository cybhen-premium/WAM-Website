"use client";

import { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import styles from "../sermons/Sermons.module.css";
import { Plus, Trash2, RefreshCw } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

type TestimonialItem = {
  id: string;
  name: string;
  role?: string;
  category?: string;
  content: string;
  imageUrl?: string;
  image?: string;
  createdAt?: string;
  date?: string;
};

export default function AdminTestimonials() {
  const [testimonials, setTestimonials] = useState<TestimonialItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTestimonials = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/testimonials?t=${Date.now()}`);
      const data = await response.json();
      if (Array.isArray(data)) {
        setTestimonials(data);
      }
    } catch (error) {
      console.error("Failed to fetch testimonials:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete the testimony from "${name}"?`)) return;

    try {
      const res = await fetch("/api/testimonials", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      if (res.ok) {
        setTestimonials((prev) => prev.filter((t) => t.id !== id));
      } else {
        const data = await res.json().catch(() => ({}));
        alert(data.error || "Failed to delete testimonial.");
      }
    } catch (err) {
      console.error("Delete error:", err);
      alert("Failed to delete testimonial.");
    }
  };

  return (
    <div className={styles.layout}>
      <Sidebar />
      <main className={styles.main}>
        <header className={styles.header}>
          <div className={styles.headerText}>
            <h1>Testimonials &amp; Testimonies</h1>
            <p>Manage stories of transformation that appear on the homepage.</p>
          </div>
          <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
            <button 
              onClick={fetchTestimonials}
              className={styles.addBtn}
              style={{ background: "rgba(255,255,255,0.08)", color: "#cbd5e1" }}
              title="Refresh Testimonials"
            >
              <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
            </button>
            <Link href="/admin/testimonials/new" className={styles.addBtn}>
              <Plus size={20} />
              Add Testimonial
            </Link>
          </div>
        </header>

        <div className={styles.tableCard}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Member</th>
                <th>Role / Group</th>
                <th>Content Snippet</th>
                <th>Date</th>
                <th style={{ textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className={styles.loading}>
                    <RefreshCw size={20} className="animate-spin" style={{ margin: "0 auto 0.5rem auto" }} />
                    Loading stories from database...
                  </td>
                </tr>
              ) : testimonials.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ textAlign: "center", padding: "2rem", color: "#94a3b8" }}>
                    No testimonials found. Click &ldquo;Add Testimonial&rdquo; to share a story.
                  </td>
                </tr>
              ) : (
                testimonials.map((t) => {
                  const avatar = t.imageUrl || t.image;
                  const roleText = t.role || t.category || "Member";
                  const dateStr = t.createdAt 
                    ? new Date(t.createdAt).toLocaleDateString()
                    : t.date 
                    ? String(t.date) 
                    : "Recent";

                  return (
                    <tr key={t.id || t.name}>
                      <td>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                          {avatar ? (
                            <div style={{ width: 38, height: 38, borderRadius: "50%", overflow: "hidden", position: "relative", flexShrink: 0, border: "2px solid rgba(184, 212, 50, 0.4)" }}>
                              <Image src={avatar} alt={t.name} fill style={{ objectFit: "cover" }} />
                            </div>
                          ) : (
                            <div style={{ width: 38, height: 38, borderRadius: "50%", background: "#2563eb", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, flexShrink: 0 }}>
                              {t.name[0] || "M"}
                            </div>
                          )}
                          <strong>{t.name}</strong>
                        </div>
                      </td>
                      <td>
                        <span className={styles.badge} style={{ background: "rgba(184, 212, 50, 0.15)", color: "#b8d432", border: "1px solid rgba(184, 212, 50, 0.3)" }}>
                          {roleText}
                        </span>
                      </td>
                      <td style={{ color: "#94a3b8", fontSize: "0.875rem", maxWidth: "380px" }}>
                        &ldquo;{t.content.length > 120 ? t.content.slice(0, 120) + "..." : t.content}&rdquo;
                      </td>
                      <td style={{ color: "#64748b", fontSize: "0.85rem" }}>
                        {dateStr}
                      </td>
                      <td style={{ textAlign: "right" }}>
                        <div className={styles.actions} style={{ justifyContent: "flex-end" }}>
                          <button 
                            className={styles.iconBtnDelete}
                            onClick={() => handleDelete(t.id, t.name)}
                            title="Delete this testimonial"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
