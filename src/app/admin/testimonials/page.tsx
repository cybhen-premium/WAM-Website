"use client";

import { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import styles from "../sermons/Sermons.module.css";
import { Plus, User, MessageSquare, Trash2, Edit2 } from "lucide-react";
import Link from "next/link";

export default function AdminTestimonials() {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTestimonials() {
      try {
        const response = await fetch("/api/testimonials");
        const data = await response.json();
        if (Array.isArray(data)) {
          setTestimonials(data);
        }
      } catch (error) {
        console.error("Failed to fetch testimonials:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchTestimonials();
  }, []);

  return (
    <div className={styles.layout}>
      <Sidebar />
      <main className={styles.main}>
        <header className={styles.header}>
          <div className={styles.headerText}>
            <h1>Testimonials</h1>
            <p>Manage and share stories of God's work in our members' lives.</p>
          </div>
          <Link href="/admin/testimonials/new" className={styles.addBtn}>
            <Plus size={20} />
            Add Testimonial
          </Link>
        </header>

        <div className={styles.tableCard}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Member</th>
                <th>Category</th>
                <th>Date</th>
                <th>Content Snippet</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={5} className={styles.loading}>Loading stories...</td></tr>
              ) : (
                testimonials.map((t) => (
                  <tr key={t.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#ff7e33', color: 'white', display: 'flex', alignItems: 'center', justifyCenter: 'center', fontSize: 12, fontWeight: 700 }}>
                          {t.name[0]}
                        </div>
                        <strong>{t.name}</strong>
                      </div>
                    </td>
                    <td><span className={styles.badge}>{t.category}</span></td>
                    <td>{t.date}</td>
                    <td style={{ color: '#64748b', fontSize: '0.875rem' }}>{t.content}</td>
                    <td>
                      <div className={styles.actions}>
                        <button className={styles.iconBtn}><Edit2 size={18} /></button>
                        <button className={styles.iconBtnDelete}><Trash2 size={18} /></button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
