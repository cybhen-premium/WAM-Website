"use client";

import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import { 
  LogOut, BookOpen, Calendar, Users, Home, Settings, 
  MessageSquareQuote, Mail, Send, Radio, ExternalLink, ShieldCheck, ImageIcon, LayoutGrid
} from "lucide-react";
import { usePathname } from "next/navigation";
import styles from "./Sidebar.module.css";
import clsx from "clsx";

export default function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();

  const sections = [
    {
      title: "Core",
      items: [
        { href: "/admin/dashboard", label: "Overview", icon: Home },
      ]
    },
    {
      title: "Content Management",
      items: [
        { href: "/admin/sections", label: "Sections & Names", icon: LayoutGrid },
        { href: "/admin/ministries", label: "Ministries", icon: Users },
        { href: "/admin/media", label: "Media Library", icon: ImageIcon },
        { href: "/admin/sermons", label: "Sermons & Audio", icon: BookOpen },
        { href: "/admin/events", label: "Events Schedule", icon: Calendar },
        { href: "/admin/testimonials", label: "Testimonials", icon: MessageSquareQuote },
      ]
    },
    {
      title: "Ministry & Desk",
      items: [
        { href: "/admin/prayer-requests", label: "Prayer Requests", icon: ShieldCheck },
        { href: "/admin/messages", label: "Contact Inquiries", icon: Send },
        { href: "/admin/newsletter", label: "Newsletter Subscribers", icon: Mail },
      ]
    },
    {
      title: "Configuration",
      items: [
        { href: "/admin/settings", label: "Live Stream & Settings", icon: Radio },
      ]
    }
  ];

  return (
    <aside className={styles.sidebar}>
      {/* Brand Header */}
      <div className={styles.sidebarHeader}>
        <div className={styles.logoWrapper}>
          <Image 
            src="/assets/logo.png" 
            alt="World Ark Missions Crest" 
            width={36} 
            height={36} 
            className={styles.logo} 
            priority
          />
          <div className={styles.brandText}>
            <span className={styles.brandTitle}>WORLD ARK</span>
            <span className={styles.brandSubtitle}>ADMIN CONSOLE</span>
          </div>
        </div>
      </div>

      {/* Navigation Groups */}
      <nav className={styles.nav}>
        {sections.map((section) => (
          <div key={section.title} className={styles.navGroup}>
            <span className={styles.groupTitle}>{section.title}</span>
            <div className={styles.groupItems}>
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href || (item.href !== "/admin/dashboard" && pathname.startsWith(item.href + "/"));
                return (
                  <Link 
                    key={item.href} 
                    href={item.href} 
                    className={clsx(styles.navItem, isActive && styles.active)}
                  >
                    <Icon size={18} className={styles.navIcon} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer / Account */}
      <div className={styles.sidebarFooter}>
        <Link href="/" target="_blank" className={styles.publicLink}>
          <ExternalLink size={15} />
          <span>View Public Site</span>
        </Link>

        <div className={styles.userCard}>
          <div className={styles.avatar}>
            {session?.user?.name?.[0] || "A"}
          </div>
          <div className={styles.userInfo}>
            <span className={styles.userName}>{session?.user?.name || "Administrator"}</span>
            <span className={styles.userRole}>Super Admin</span>
          </div>
          <button 
            onClick={() => signOut({ callbackUrl: "/admin/login" })} 
            className={styles.signOutBtn}
            title="Sign Out"
            aria-label="Sign Out"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </aside>
  );
}
