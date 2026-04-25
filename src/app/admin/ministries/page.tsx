"use client";

import { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import styles from "../sermons/Sermons.module.css";
import { Plus, Edit2, Trash2, User } from "lucide-react";
import Link from "next/link";

 type MinistryItem = {
   id: string | number;
   name: string;
   leadName?: string | null;
   isActive: boolean;
   order: number;
 };

export default function AdminMinistries() {
  const [ministries, setMinistries] = useState<MinistryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMinistries() {
      try {
        const response = await fetch("/api/ministries");
        const data = await response.json();
        if (Array.isArray(data)) {
          setMinistries(data);
        }
      } catch (error) {
        console.error("Failed to fetch ministries:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchMinistries();
  }, []);

  return (
    <div className={styles.layout}>
      <Sidebar />
      <main className={styles.main}>
        <header className={styles.header}>
          <div className={styles.headerText}>
            <h1>Ministries</h1>
            <p>Manage the different departments and ministries of the church.</p>
          </div>
          <Link href="/admin/ministries/new" className={styles.addBtn}>
            <Plus size={20} />
            Add New Ministry
          </Link>
        </header>

        <div className={styles.tableCard}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Ministry Name</th>
                <th>Lead</th>
                <th>Status</th>
                <th>Order</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={5} className={styles.loading}>Loading ministries...</td></tr>
              ) : (
                ministries.map((m) => (
                  <tr key={m.id}>
                    <td><strong>{m.name}</strong></td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <User size={14} />
                        {m.leadName || "No Lead Assigned"}
                      </div>
                    </td>
                    <td>
                      <span className={styles.badge} style={{ 
                        background: m.isActive ? 'rgba(16, 185, 129, 0.1)' : '#f1f5f9',
                        color: m.isActive ? '#10b981' : '#64748b'
                      }}>
                        {m.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td>{m.order}</td>
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
