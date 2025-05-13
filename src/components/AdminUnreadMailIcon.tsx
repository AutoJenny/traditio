"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function AdminUnreadMailIcon() {
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    async function fetchUnread() {
      const res = await fetch("/api/messages");
      const data = await res.json();
      setUnreadCount(data.filter((msg: any) => msg.status === "unread").length);
    }
    fetchUnread();
  }, []);

  if (unreadCount === 0) return null;

  return (
    <Link href="/admin/messages" className="relative ml-2" title="Unread Messages">
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="inline align-middle text-brass">
        <rect x="3" y="5" width="18" height="14" rx="2" /><polyline points="3 7 12 13 21 7" />
      </svg>
      <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full px-1.5 py-0.5 font-bold">{unreadCount}</span>
    </Link>
  );
} 