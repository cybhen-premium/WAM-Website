"use client";

import { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import styles from "../sermons/Sermons.module.css"; // Reuse shared table styles
import { Plus, Search, MoreVertical, Edit2, Trash2, Calendar } from "lucide-react";
import Link from "next/link";

 type EventItem = {
   id: string | number;
   title: string;
   date: string | number | Date;
   location: string;
   status: string;
 };

export default function AdminEvents() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchEvents() {
      try {
        const response = await fetch("/api/events");
        const data = await response.json();
        if (Array.isArray(data)) {
          setEvents(data);
        }
      } catch (error) {
        console.error("Failed to fetch events:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchEvents();
  }, []);

  return (
    <div className={styles.layout}>
      <Sidebar />
      <main className={styles.main}>
        <header className={styles.header}>
          <div className={styles.headerText}>
            <h1>Event Management</h1>
            <p>Organize and schedule upcoming church events.</p>
          </div>
          <Link href="/admin/events/new" className={styles.addBtn}>
            <Plus size={20} />
            Post New Event
          </Link>
        </header>

        <div className={styles.tableCard}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Event Title</th>
                <th>Date</th>
                <th>Location</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={5} className={styles.loading}>Loading events...</td></tr>
              ) : (
                events.map((event) => (
                  <tr key={event.id}>
                    <td><strong>{event.title}</strong></td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#64748b' }}>
                        <Calendar size={14} />
                        {new Date(event.date).toLocaleDateString()}
                      </div>
                    </td>
                    <td>{event.location}</td>
                    <td>
                      <span className={styles.badge} style={{ 
                        background: event.status === 'upcoming' ? 'rgba(16, 185, 129, 0.1)' : '#f1f5f9',
                        color: event.status === 'upcoming' ? '#10b981' : '#64748b'
                      }}>
                        {event.status}
                      </span>
                    </td>
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
