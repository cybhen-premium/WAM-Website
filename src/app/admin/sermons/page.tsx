"use client";

import { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import styles from "./Sermons.module.css";
import { Plus, Search, MoreVertical, Edit2, Trash2, ExternalLink } from "lucide-react";
import Link from "next/link";

 type SermonItem = {
   id: string | number;
   title: string;
   speaker: string;
   category: string;
   date: string | number | Date;
 };

export default function AdminSermons() {
  const [sermons, setSermons] = useState<SermonItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // Simulated data for now - will connect to API next
  useEffect(() => {
    async function fetchSermons() {
      try {
        const response = await fetch("/api/sermons");
        const data = await response.json();
        if (Array.isArray(data)) {
          setSermons(data);
        }
      } catch (error) {
        console.error("Failed to fetch sermons:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchSermons();
  }, []);

  return (
    <div className={styles.layout}>
      <Sidebar />
      <main className={styles.main}>
        <header className={styles.header}>
          <div className={styles.headerText}>
            <h1>Sermon Management</h1>
            <p>Manage and publish sermons to your website.</p>
          </div>
          <Link href="/admin/sermons/new" className={styles.addBtn}>
            <Plus size={20} />
            Add New Sermon
          </Link>
        </header>

        <div className={styles.controls}>
          <div className={styles.searchWrapper}>
            <Search size={20} className={styles.searchIcon} />
            <input 
              type="text" 
              placeholder="Search sermons..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className={styles.tableCard}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Title</th>
                <th>Speaker</th>
                <th>Category</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={5} className={styles.loading}>Loading sermons...</td></tr>
              ) : sermons.length === 0 ? (
                <tr><td colSpan={5} className={styles.empty}>No sermons found.</td></tr>
              ) : (
                sermons.map((sermon) => (
                  <tr key={sermon.id}>
                    <td>
                      <div className={styles.sermonTitle}>
                        <strong>{sermon.title}</strong>
                        <Link href={`/sermons/${sermon.id}`} className={styles.viewLink}>
                          View <ExternalLink size={12} />
                        </Link>
                      </div>
                    </td>
                    <td>{sermon.speaker}</td>
                    <td><span className={styles.badge}>{sermon.category}</span></td>
                    <td>{new Date(sermon.date).toLocaleDateString()}</td>
                    <td>
                      <div className={styles.actions}>
                        <button className={styles.iconBtn} title="Edit"><Edit2 size={18} /></button>
                        <button className={styles.iconBtnDelete} title="Delete"><Trash2 size={18} /></button>
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
