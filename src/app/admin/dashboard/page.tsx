"use client";

import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import { 
  BookOpen, Calendar, Users, Plus, ArrowUpRight, 
  MessageSquareQuote, Mail, Send, Settings, 
  Search, Bell, ChevronRight, MoreVertical,
  Clock, CheckCircle, AlertCircle, LogOut
} from "lucide-react";
import styles from "./Dashboard.module.css";
import Sidebar from "@/components/Sidebar";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminDashboard() {
  const { data: session } = useSession();
  const [counts, setCounts] = useState({ sermons: 0, messages: 0, prayers: 0, subscribers: 0 });
  const [activities, setActivities] = useState<any[]>([]);
  const [showUserMenu, setShowUserMenu] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, actRes] = await Promise.all([
          fetch("/api/admin/stats"),
          fetch("/api/admin/activities")
        ]);
        const statsData = await statsRes.json();
        const actData = await actRes.json();
        
        if (!statsData.error) setCounts(statsData);
        if (Array.isArray(actData)) setActivities(actData);
      } catch (error) {}
    };
    fetchData();
  }, []);

  const stats = [
    { label: "Total Sermons", value: counts.sermons, icon: BookOpen, color: "#3b82f6", bg: "rgba(59, 130, 246, 0.1)" },
    { label: "New Messages", value: counts.messages, icon: Send, color: "#ef4444", bg: "rgba(239, 68, 68, 0.1)" },
    { label: "Prayer Requests", value: counts.prayers, icon: MessageSquareQuote, color: "#f59e0b", bg: "rgba(245, 158, 11, 0.1)" },
    { label: "Subscribers", value: counts.subscribers, icon: Mail, color: "#10b981", bg: "rgba(16, 185, 129, 0.1)" },
  ];

  return (
    <div className={styles.layout}>
      <Sidebar />
      
      <main className={styles.main}>
        {/* Top Bar */}
        <div className={styles.topBar}>
          <div className={styles.topBarLeft}>
            <div className={styles.searchBox}>
              <Search className={styles.searchIcon} size={18} />
              <input type="text" placeholder="Search Here..." />
            </div>
          </div>
          <div className={styles.topBarRight}>
            <button className={styles.iconBtn}><Bell size={20} /></button>
            <div className={styles.userProfileWrapper}>
              <div 
                className={styles.userProfile} 
                onClick={() => setShowUserMenu(!showUserMenu)}
                style={{ cursor: 'pointer' }}
              >
                <div className={styles.userText}>
                  <strong>{session?.user?.name || "Admin"}</strong>
                  <span>Super Admin</span>
                </div>
                <div className={styles.userAvatar}>
                  {session?.user?.name?.[0] || "A"}
                </div>
              </div>

              <AnimatePresence>
                {showUserMenu && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className={styles.userDropdown}
                  >
                    <div className={styles.dropdownHeader}>
                      <strong>{session?.user?.name}</strong>
                      <p>{session?.user?.email}</p>
                    </div>
                    <button className={styles.dropdownItem} onClick={() => signOut()}>
                      <LogOut size={16} />
                      Sign Out
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className={styles.content}>
          <div className={styles.breadcrumb}>
            <Image src="/assets/logo.png" alt="WAM" width={20} height={20} style={{ objectFit: 'contain', marginRight: '0.5rem' }} />
            <Link href="/admin/dashboard">Home</Link>
            <ChevronRight size={14} />
            <span>Admin Dashboard</span>
          </div>

          {/* Stats Row */}
          <div className={styles.statsRow}>
            {stats.map((stat, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0,0,0,0.1)" }}
                className={styles.statCard}
              >
                <div className={styles.statText}>
                  <span className={styles.statLabel}>{stat.label}</span>
                  <motion.div 
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    className={styles.statValue}
                  >
                    {stat.value}
                  </motion.div>
                </div>
                <div className={styles.statIcon} style={{ background: stat.bg, color: stat.color }}>
                  <stat.icon size={24} />
                </div>
              </motion.div>
            ))}
          </div>

          <div className={styles.mainGrid}>
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className={styles.leftColumn}
            >
              {/* Recent Prayer Requests Section */}
              <div className={styles.panel}>
                <div className={styles.panelHeader}>
                  <h3>Recent Prayer Requests</h3>
                  <MoreVertical size={18} color="#a0aec0" />
                </div>
                <div className={styles.list}>
                  {counts.prayers === 0 ? (
                    <p style={{ fontSize: '0.8rem', color: '#718096', textAlign: 'center', padding: '1rem' }}>No new prayer requests</p>
                  ) : (
                    [1, 2, 3].map((_, i) => (
                      <motion.div 
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        key={i} 
                        style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem 0', borderBottom: '1px solid #f8fafc' }}
                      >
                        <div>
                          <strong style={{ display: 'block', fontSize: '0.875rem' }}>Prayer for Healing</strong>
                          <span style={{ fontSize: '0.75rem', color: '#718096' }}>from John Doe • 2 hours ago</span>
                        </div>
                        <span className={styles.badge} style={{ background: '#fef2f2', color: '#ef4444', fontSize: '0.7rem', padding: '0.2rem 0.5rem', borderRadius: '4px', height: 'fit-content' }}>NEW</span>
                      </motion.div>
                    ))
                  )}
                </div>
              </div>

              {/* Quick Actions Panel */}
              <div className={styles.panel}>
                <div className={styles.panelHeader}>
                  <h3>Church Management</h3>
                  <button className={styles.viewAll}>View All</button>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Link href="/admin/sermons/new" style={{ display: 'block', padding: '1rem', border: '1px solid #f1f5f9', borderRadius: '8px', textAlign: 'center', textDecoration: 'none' }}>
                      <div style={{ color: '#3b82f6', marginBottom: '0.5rem' }}><Plus size={20} /></div>
                      <span style={{ fontSize: '0.8rem', color: '#1e293b', fontWeight: 600 }}>New Sermon</span>
                    </Link>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Link href="/admin/events/new" style={{ display: 'block', padding: '1rem', border: '1px solid #f1f5f9', borderRadius: '8px', textAlign: 'center', textDecoration: 'none' }}>
                      <div style={{ color: '#ef4444', marginBottom: '0.5rem' }}><Calendar size={20} /></div>
                      <span style={{ fontSize: '0.8rem', color: '#1e293b', fontWeight: 600 }}>Create Event</span>
                    </Link>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Link href="/admin/settings" style={{ display: 'block', padding: '1rem', border: '1px solid #f1f5f9', borderRadius: '8px', textAlign: 'center', textDecoration: 'none' }}>
                      <div style={{ color: '#f59e0b', marginBottom: '0.5rem' }}><Settings size={20} /></div>
                      <span style={{ fontSize: '0.8rem', color: '#1e293b', fontWeight: 600 }}>Live Settings</span>
                    </Link>
                  </motion.div>
                </div>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className={styles.rightColumn}
            >
              {/* Recent Activity Timeline */}
              <div className={styles.panel}>
                <div className={styles.panelHeader}>
                  <h3>Recent Activity</h3>
                </div>
                <div className={styles.timeline}>
                  {activities.length === 0 ? (
                    <p style={{ fontSize: '0.8rem', color: '#718096', textAlign: 'center' }}>No recent activity</p>
                  ) : (
                    activities.map((act, i) => (
                      <motion.div 
                        key={i} 
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.6 + (i * 0.1) }}
                        className={styles.timelineItem}
                      >
                        <div className={styles.timelineDot} style={{ background: act.color }}></div>
                        <div className={styles.timelineContent}>
                          <div className={styles.timelineTime}>{new Date(act.time).toLocaleString()}</div>
                          <h4>{act.title}</h4>
                          <p>{act.desc}</p>
                        </div>
                      </motion.div>
                    ))
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
}
