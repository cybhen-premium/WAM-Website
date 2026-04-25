"use client";

import { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import styles from "../sermons/Sermons.module.css";
import { Search, CheckCircle, Clock, Eye, Trash2 } from "lucide-react";

 type PrayerRequestItem = {
   id: string | number;
   name: string;
   phone?: string | null;
   email?: string | null;
   request: string;
   isPrayed: boolean;
   createdAt: string | number | Date;
 };

export default function AdminPrayerRequests() {
  const [requests, setRequests] = useState<PrayerRequestItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRequests() {
      try {
        const response = await fetch("/api/prayer-requests");
        const data = await response.json();
        if (Array.isArray(data)) {
          setRequests(data);
        }
      } catch (error) {
        console.error("Failed to fetch prayer requests:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchRequests();
  }, []);

  return (
    <div className={styles.layout}>
      <Sidebar />
      <main className={styles.main}>
        <header className={styles.header}>
          <div className={styles.headerText}>
            <h1>Prayer Requests</h1>
            <p>Interceding for the needs of our community.</p>
          </div>
        </header>

        <div className={styles.tableCard}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Request</th>
                <th>Status</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={5} className={styles.loading}>Loading requests...</td></tr>
              ) : requests.length === 0 ? (
                <tr><td colSpan={5} className={styles.empty}>No prayer requests yet.</td></tr>
              ) : (
                requests.map((req) => (
                  <tr key={req.id}>
                    <td>
                      <strong>{req.name}</strong>
                      <p style={{ fontSize: '0.75rem', color: '#64748b' }}>{req.phone || req.email}</p>
                    </td>
                    <td style={{ maxWidth: '300px' }}>
                      <p style={{ fontSize: '0.875rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {req.request}
                      </p>
                    </td>
                    <td>
                      <span className={styles.badge} style={{ 
                        background: req.isPrayed ? 'rgba(16, 185, 129, 0.1)' : 'rgba(255, 126, 51, 0.1)',
                        color: req.isPrayed ? '#10b981' : '#ff7e33'
                      }}>
                        {req.isPrayed ? 'Prayed' : 'New'}
                      </span>
                    </td>
                    <td>{new Date(req.createdAt).toLocaleDateString()}</td>
                    <td>
                      <div className={styles.actions}>
                        <button className={styles.iconBtn} title="Mark as Prayed"><CheckCircle size={18} /></button>
                        <button className={styles.iconBtn} title="View Full"><Eye size={18} /></button>
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
