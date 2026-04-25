"use client";

import { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import styles from "../sermons/Sermons.module.css";
import { Mail, User, Trash2, Download } from "lucide-react";

 type SubscriberItem = {
   id: string | number;
   email: string;
   name?: string | null;
   isActive: boolean;
   subscribedAt: string | number | Date;
 };

export default function AdminNewsletter() {
  const [subscribers, setSubscribers] = useState<SubscriberItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSubscribers() {
      try {
        const response = await fetch("/api/newsletter");
        const data = await response.json();
        if (Array.isArray(data)) {
          setSubscribers(data);
        }
      } catch (error) {
        console.error("Failed to fetch subscribers:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchSubscribers();
  }, []);

  return (
    <div className={styles.layout}>
      <Sidebar />
      <main className={styles.main}>
        <header className={styles.header}>
          <div className={styles.headerText}>
            <h1>Newsletter Subscribers</h1>
            <p>Manage your church mailing list and growing community.</p>
          </div>
          <button className={styles.addBtn} style={{ background: '#2563eb' }}>
            <Download size={20} />
            Export CSV
          </button>
        </header>

        <div className={styles.tableCard}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Subscriber</th>
                <th>Status</th>
                <th>Joined Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={4} className={styles.loading}>Loading subscribers...</td></tr>
              ) : subscribers.length === 0 ? (
                <tr><td colSpan={4} className={styles.empty}>No subscribers yet.</td></tr>
              ) : (
                subscribers.map((sub) => (
                  <tr key={sub.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#2563eb', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700 }}>
                          <Mail size={14} />
                        </div>
                        <div>
                          <strong>{sub.email}</strong>
                          <p style={{ fontSize: '0.75rem', color: '#64748b' }}>{sub.name || "Anonymous Subscriber"}</p>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className={styles.badge} style={{ 
                        background: sub.isActive ? 'rgba(16, 185, 129, 0.1)' : '#fef2f2',
                        color: sub.isActive ? '#10b981' : '#ef4444'
                      }}>
                        {sub.isActive ? 'Active' : 'Unsubscribed'}
                      </span>
                    </td>
                    <td>{new Date(sub.subscribedAt).toLocaleDateString()}</td>
                    <td>
                      <div className={styles.actions}>
                        <button className={styles.iconBtnDelete} title="Remove"><Trash2 size={18} /></button>
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
