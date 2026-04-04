"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { getGuestTimeRemaining } from "@/lib/auth";
import { useAuth } from "@/hooks/useAuth";

interface GuestBannerProps {
  sessionExpiry: number;
  onDismiss?: () => void;
}

export default function GuestBanner({
  sessionExpiry,
  onDismiss,
}: GuestBannerProps) {
  const [timeStr, setTimeStr] = useState(getGuestTimeRemaining(sessionExpiry));
  const { auth } = useAuth();

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeStr(getGuestTimeRemaining(sessionExpiry));
    }, 30000);
    return () => clearInterval(interval);
  }, [sessionExpiry]);
  if (auth.token || !auth.isGuest) return null;
  return (
    <div
      style={{
        background: "var(--amber-lt)",
        borderBottom: "1px solid rgba(138,90,0,0.15)",
        padding: "0.55rem 1.25rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        fontSize: "0.8rem",
        color: "var(--amber)",
      }}
    >
      <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <span style={{ fontSize: "0.85rem" }}>👤</span>
        <strong>Guest session</strong> · {timeStr} ·{" "}
        <Link
          href="/auth/login"
          style={{
            color: "var(--accent)",
            fontWeight: 600,
            textDecoration: "none",
          }}
        >
          Sign in to save history
        </Link>
      </span>
      {onDismiss && (
        <button
          onClick={onDismiss}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "var(--amber)",
            fontSize: "1rem",
            lineHeight: 1,
            padding: "0 0.25rem",
          }}
        >
          ×
        </button>
      )}
    </div>
  );
}
