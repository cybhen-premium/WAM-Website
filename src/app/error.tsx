"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Application error:", error);
  }, [error]);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#080c11",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
        fontFamily: "var(--font-geist-sans), sans-serif",
        color: "#ffffff",
      }}
    >
      <div
        style={{
          maxWidth: "480px",
          width: "100%",
          background: "#0f172a",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          borderRadius: "16px",
          padding: "2.5rem",
          textAlign: "center",
        }}
      >
        <div
          style={{
            width: "56px",
            height: "56px",
            borderRadius: "12px",
            background: "rgba(37, 99, 235, 0.15)",
            color: "#2563eb",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 1.5rem auto",
            fontSize: "1.75rem",
            fontWeight: "bold",
          }}
        >
          !
        </div>
        <h2
          style={{
            fontSize: "1.5rem",
            fontWeight: 700,
            marginBottom: "0.75rem",
            letterSpacing: "-0.02em",
          }}
        >
          Something went wrong
        </h2>
        <p
          style={{
            color: "#94a3b8",
            fontSize: "0.95rem",
            lineHeight: 1.6,
            marginBottom: "2rem",
          }}
        >
          We encountered an unexpected issue while loading this page. Please try refreshing or return to the home page.
        </p>
        <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center" }}>
          <button
            onClick={() => reset()}
            style={{
              background: "#2563eb",
              color: "#ffffff",
              border: "none",
              borderRadius: "8px",
              padding: "0.75rem 1.5rem",
              fontWeight: 600,
              fontSize: "0.9rem",
              cursor: "pointer",
            }}
          >
            Try Again
          </button>
          <Link
            href="/"
            style={{
              background: "rgba(255, 255, 255, 0.05)",
              color: "#e2e8f0",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              borderRadius: "8px",
              padding: "0.75rem 1.5rem",
              fontWeight: 600,
              fontSize: "0.9rem",
              textDecoration: "none",
            }}
          >
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}
