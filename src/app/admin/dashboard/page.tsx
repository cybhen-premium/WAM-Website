"use client";

import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { 
  BookOpen, Calendar, Plus, 
  MessageSquareQuote, Mail, Send, Radio,
  Search, Bell, ExternalLink, LogOut, ShieldCheck, ImageIcon
} from "lucide-react";
import styles from "./Dashboard.module.css";
import Sidebar from "@/components/Sidebar";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Activity {
  type: string;
  title: string;
  desc: string;
  time: string | Date;
  color: string;
}

export default function AdminDashboard() {
  const { data: session } = useSession();
  const [counts, setCounts] = useState({ sermons: 3, messages: 1, prayers: 2, subscribers: 5 });
  const [activities, setActivities] = useState<Activity[]>([
    {
      type: "sermon",
      title: "New Sermon Published",
      desc: '"Living with Divine Purpose" by Rev. Benjamin Eturu Adom',
      time: "2 hours ago",
      color: "#3b82f6",
    },
    {
      type: "prayer",
      title: "Prayer Request Received",
      desc: "Intercession for family healing and divine breakthrough",
      time: "5 hours ago",
      color: "#f59e0b",
    },
    {
      type: "subscriber",
      title: "New Newsletter Subscriber",
      desc: "grace@example.com joined the mailing list",
      time: "Yesterday",
      color: "#10b981",
    },
  ]);
  const [isLive, setIsLive] = useState(false);
  const [liveTitle, setLiveTitle] = useState("Sunday Celebration Service Live from Afienya");
  const [showUserMenu, setShowUserMenu] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, actRes, liveRes] = await Promise.all([
          fetch("/api/admin/stats"),
          fetch("/api/admin/activities"),
          fetch("/api/settings/live")
        ]);
        const statsData = await statsRes.json();
        const actData = await actRes.json();
        const liveData = await liveRes.json();
        
        if (statsData && !statsData.error) setCounts(statsData);
        if (Array.isArray(actData) && actData.length > 0) setActivities(actData);
        if (liveData && typeof liveData.isLive === "boolean") {
          setIsLive(liveData.isLive);
          if (liveData.title) setLiveTitle(liveData.title);
        }
      } catch (error) {
        console.error("Dashboard data load:", error);
      }
    };
    fetchData();
  }, []);

  const toggleLiveStatus = async () => {
    const nextState = !isLive;
    setIsLive(nextState);
    try {
      await fetch("/api/settings/live", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isLive: nextState, title: liveTitle }),
      });
    } catch (e) {
      console.error("Failed to toggle live:", e);
    }
  };

  const stats = [
    { label: "Total Sermons", value: counts.sermons, icon: BookOpen, color: "#3b82f6", bg: "rgba(59, 130, 246, 0.15)" },
    { label: "New Inquiries", value: counts.messages, icon: Send, color: "#ef4444", bg: "rgba(239, 68, 68, 0.15)" },
    { label: "Prayer Requests", value: counts.prayers, icon: ShieldCheck, color: "#f59e0b", bg: "rgba(245, 158, 11, 0.15)" },
    { label: "Subscribers", value: counts.subscribers, icon: Mail, color: "#10b981", bg: "rgba(16, 185, 129, 0.15)" },
  ];

  return (
    <div className={styles.layout}>
      <Sidebar />
      
      <main className={styles.main}>
        {/* Top Bar */}
        <div className={styles.topBar}>
          <div className={styles.topBarLeft}>
            <div className={styles.searchBox}>
              <Search className={styles.searchIcon} size={16} />
              <input type="text" placeholder="Search sermons, events, messages..." />
            </div>
          </div>

          <div className={styles.topBarRight}>
            <Link href="/" target="_blank" className={styles.iconBtn} title="Open Live Website">
              <ExternalLink size={17} />
            </Link>

            <button className={styles.iconBtn} title="Notifications">
              <Bell size={17} />
            </button>

            <div className={styles.userProfileWrapper}>
              <div 
                className={styles.userProfile} 
                onClick={() => setShowUserMenu(!showUserMenu)}
                style={{ cursor: 'pointer' }}
              >
                <div className={styles.userAvatar}>
                  {session?.user?.name?.[0] || "A"}
                </div>
                <div className={styles.userText}>
                  <strong>{session?.user?.name || "Administrator"}</strong>
                  <span>Super Admin</span>
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
                      <strong>{session?.user?.name || "Administrator"}</strong>
                      <p>{session?.user?.email || "admin@worldarkmissions.org"}</p>
                    </div>
                    <button className={styles.dropdownItem} onClick={() => signOut({ callbackUrl: "/admin/login" })}>
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
            <span>Admin</span>
            <span>/</span>
            <Link href="/admin/dashboard">Overview Dashboard</Link>
          </div>

          {/* Live Stream Quick Banner */}
          <div className={styles.liveBannerCard}>
            <div className={styles.liveBannerInfo}>
              <span className={isLive ? styles.liveIndicator : styles.liveIndicatorOff}></span>
              <div className={styles.liveBannerText}>
                <h4>Broadcast Status: {isLive ? "LIVE STREAM ACTIVE" : "OFFLINE"}</h4>
                <p>{isLive ? `Broadcasting: ${liveTitle} · "Live Now" banner visible on website.` : "No active stream broadcasting to the public site."}</p>
              </div>
            </div>

            <div className={styles.liveControls}>
              <button 
                onClick={toggleLiveStatus} 
                className={isLive ? styles.liveToggleBtnStop : styles.liveToggleBtn}
              >
                <Radio size={16} />
                {isLive ? "End Broadcast" : "Go Live Now"}
              </button>
              <Link href="/admin/settings" className={styles.iconBtn} title="Configure Stream URL">
                Edit Stream
              </Link>
            </div>
          </div>

          {/* Stats Row */}
          <div className={styles.statsRow}>
            {stats.map((s, i) => {
              const Icon = s.icon;
              return (
                <div key={i} className={styles.statCard}>
                  <div className={styles.statInfo}>
                    <span className={styles.statValue}>{s.value}</span>
                    <span className={styles.statLabel}>{s.label}</span>
                  </div>
                  <div className={styles.statIcon} style={{ background: s.bg, color: s.color }}>
                    <Icon size={24} />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Main Grid: Activities & Quick Actions */}
          <div className={styles.mainGrid}>
            
            {/* Left: Recent Activity Feed */}
            <div className={styles.panel}>
              <div className={styles.panelHeader}>
                <h3>Live Activity Feed</h3>
                <Link href="/admin/messages" className={styles.viewAll}>
                  View All Messages
                </Link>
              </div>

              <div className={styles.timeline}>
                {activities.map((act, i) => (
                  <div key={i} className={styles.timelineItem}>
                    <div className={styles.timelineDot} style={{ backgroundColor: act.color }} />
                    <div className={styles.timelineContent}>
                      <h4>{act.title}</h4>
                      <p>{act.desc}</p>
                      <span className={styles.timelineTime}>{String(act.time)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Quick Action Shortcuts */}
            <div className={styles.panel}>
              <div className={styles.panelHeader}>
                <h3>Quick Management</h3>
              </div>

              <div className={styles.quickActionsGrid}>
                <Link href="/admin/media" className={styles.actionBtn}>
                  <ImageIcon size={22} style={{ color: "#38bdf8" }} />
                  <span>Media Library</span>
                </Link>

                <Link href="/admin/sermons/new" className={styles.actionBtn}>
                  <BookOpen size={22} className="text-accent" />
                  <span>Post Sermon</span>
                </Link>
                
                <Link href="/admin/events/new" className={styles.actionBtn}>
                  <Calendar size={22} style={{ color: "#ef4444" }} />
                  <span>Create Event</span>
                </Link>

                <Link href="/admin/prayer-requests" className={styles.actionBtn}>
                  <ShieldCheck size={22} style={{ color: "#f59e0b" }} />
                  <span>Prayer Desk</span>
                </Link>

                <Link href="/admin/settings" className={styles.actionBtn}>
                  <Radio size={22} style={{ color: "#10b981" }} />
                  <span>Live & Settings</span>
                </Link>
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}
