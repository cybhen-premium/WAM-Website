"use client";

import { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import styles from "../sermons/Sermons.module.css";
import { Mail, User, Trash2, CheckCircle, MessageSquare } from "lucide-react";

export default function AdminMessages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMessages() {
      try {
        const response = await fetch("/api/messages");
        const data = await response.json();
        if (Array.isArray(data)) {
          setMessages(data);
        }
      } catch (error) {
        console.error("Failed to fetch messages:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchMessages();
  }, []);

  return (
    <div className={styles.layout}>
      <Sidebar />
      <main className={styles.main}>
        <header className={styles.header}>
          <div className={styles.headerText}>
            <h1>Inbound Messages</h1>
            <p>Direct inquiries and messages from the "Contact Us" page.</p>
          </div>
        </header>

        <div className={styles.tableCard}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Sender</th>
                <th>Subject</th>
                <th>Message Snippet</th>
                <th>Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} className={styles.loading}>Loading messages...</td></tr>
              ) : messages.length === 0 ? (
                <tr><td colSpan={6} className={styles.empty}>No messages received yet.</td></tr>
              ) : (
                messages.map((msg) => (
                  <tr key={msg.id}>
                    <td>
                      <strong>{msg.name}</strong>
                      <p style={{ fontSize: '0.75rem', color: '#64748b' }}>{msg.email}</p>
                    </td>
                    <td>{msg.subject || "No Subject"}</td>
                    <td style={{ maxWidth: '250px' }}>
                      <p style={{ fontSize: '0.875rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {msg.message}
                      </p>
                    </td>
                    <td>{new Date(msg.createdAt).toLocaleDateString()}</td>
                    <td>
                      <span className={styles.badge} style={{ 
                        background: msg.isRead ? '#f1f5f9' : 'rgba(37, 99, 235, 0.1)',
                        color: msg.isRead ? '#64748b' : '#2563eb'
                      }}>
                        {msg.isRead ? 'Read' : 'New'}
                      </span>
                    </td>
                    <td>
                      <div className={styles.actions}>
                        <button className={styles.iconBtn} title="Mark as Read"><CheckCircle size={18} /></button>
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
