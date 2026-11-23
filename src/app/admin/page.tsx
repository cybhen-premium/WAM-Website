"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export default function AdminRoot() {
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "loading") return;
    if (session?.user) {
      router.replace("/admin/dashboard");
    } else {
      router.replace("/admin/login");
    }
  }, [session, status, router]);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#080c11",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#94a3b8",
        fontFamily: "var(--font-geist-sans), sans-serif",
        fontSize: "0.95rem",
      }}
    >
      Redirecting to World Ark Missions Admin Console...
    </div>
  );
}
