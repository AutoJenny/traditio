"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function AdminMessageDetail() {
  const { id } = useParams();
  const router = useRouter();
  const [message, setMessage] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function fetchMessage() {
      const res = await fetch(`/api/messages/${id}`);
      const data = await res.json();
      setMessage(data);
      setLoading(false);
      // Mark as read if not already
      if (data && data.status === "unread") {
        await fetch(`/api/messages/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: "read" })
        });
        setMessage((m: any) => ({ ...m, status: "read" }));
      }
    }
    fetchMessage();
  }, [id]);

  async function handleStatusChange(e: any) {
    const newStatus = e.target.value;
    setSaving(true);
    await fetch(`/api/messages/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus })
    });
    setMessage((m: any) => ({ ...m, status: newStatus }));
    setSaving(false);
  }

  return (
    <main className="max-w-2xl mx-auto py-12 px-4">
      {loading ? (
        <div className="text-center py-16">Loading...</div>
      ) : message ? (
        <>
          <h1 className="font-heading text-2xl font-bold text-espresso mb-2">Message from {message.customer_name || message.customer_email}</h1>
          <div className="mb-2 text-sand-700">Email: {message.customer_email}</div>
          <div className="mb-2 text-sand-700">Date: {message.created ? new Date(message.created).toLocaleString() : ""}</div>
          <div className="mb-2 text-sand-700">Product: {message.productSlug || "-"}</div>
          <div className="mb-2 text-sand-700">Page: {message.pageUrl || "-"}</div>
          <div className="mb-4 flex items-center gap-4">
            <label className="font-semibold mr-2">Status:</label>
            <select value={message.status} onChange={handleStatusChange} disabled={saving} className="border rounded px-2 py-1">
              <option value="unread">Unread</option>
              <option value="read">Read</option>
              <option value="deleted">Deleted</option>
            </select>
            <button
              className="text-red-600 hover:text-white hover:bg-red-600 rounded-full p-1 transition ml-4"
              title="Delete message"
              onClick={async () => {
                if (!confirm('Delete this message?')) return;
                setSaving(true);
                await fetch(`/api/messages/${id}`, {
                  method: 'PUT',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ status: 'deleted' })
                });
                setSaving(false);
                router.push('/admin/messages');
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" /><line x1="10" y1="11" x2="10" y2="17" /><line x1="14" y1="11" x2="14" y2="17" /></svg>
            </button>
          </div>
          <div className="bg-sand-50 rounded p-6 text-lg text-espresso shadow mb-8">
            {message.content}
          </div>
        </>
      ) : (
        <div className="text-center py-16 text-red-600">Message not found.</div>
      )}
    </main>
  );
} 