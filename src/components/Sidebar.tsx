"use client";

import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import { LogOut, BookOpen, Calendar, Users, Home, Settings, MessageSquareQuote, Mail, Send } from "lucide-react";
import { usePathname } from "next/navigation";
import styles from "./Sidebar.module.css";
import clsx from "clsx";

export default function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();

  const menuItems = [
    { href: "/admin/dashboard", label: "Overview", icon: Home },
    { href: "/admin/sermons", label: "Sermons", icon: BookOpen },
    { href: "/admin/events", label: "Events", icon: Calendar },
    { href: "/admin/ministries", label: "Ministries", icon: Settings },
    { href: "/admin/testimonials", label: "Testimonials", icon: Users },
    { href: "/admin/prayer-requests", label: "Prayer Requests", icon: MessageSquareQuote },
    { href: "/admin/newsletter", label: "Newsletter", icon: Mail },
    { href: "/admin/messages", label: "Messages", icon: Send },
    { href: "/admin/settings", label: "Settings", icon: Settings },
  ];

  return (
    <aside className={styles.sidebar}>
      <div className={styles.sidebarHeader}>
        <Image src="/assets/logo.png" alt="Logo" width={40} height={40} className={styles.logo} />
        <h2>WAM</h2>
      </div>
      <nav className={styles.nav}>
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link 
              key={item.href} 
              href={item.href} 
              className={clsx(styles.navItem, isActive && styles.active)}
            >
              <Icon size={20} />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
