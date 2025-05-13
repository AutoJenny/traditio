"use client";
import { useEffect, useState } from "react";

function timeAgo(dateString: string) {
  const now = new Date();
  const date = new Date(dateString);
  const diff = (now.getTime() - date.getTime()) / 1000;
  if (diff < 60) return 'just now';
  if (diff < 3600) return `${Math.floor(diff / 60)} min${Math.floor(diff / 60) === 1 ? '' : 's'} ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} hour${Math.floor(diff / 3600) === 1 ? '' : 's'} ago`;
  if (diff < 2592000) return `${Math.floor(diff / 86400)} day${Math.floor(diff / 86400) === 1 ? '' : 's'} ago`;
  if (diff < 31536000) return `${Math.floor(diff / 2592000)} month${Math.floor(diff / 2592000) === 1 ? '' : 's'} ago`;
  return `${Math.floor(diff / 31536000)} year${Math.floor(diff / 31536000) === 1 ? '' : 's'} ago`;
}

function getLastPathSegment(url: string) {
  if (!url) return "";
  const parts = url.split("/").filter(Boolean);
  return parts[parts.length - 1] || "";
}

async function fetchProductImage(slug: string): Promise<string | null> {
  if (!slug) return null;
  try {
    const res = await fetch(`/api/products/${slug}`);
    if (!res.ok) return null;
    const data = await res.json();
    if (data.product && data.product.images && data.product.images.length > 0) {
      return data.product.images[0].url;
    }
    return null;
  } catch {
    return null;
  }
}

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDeleted, setShowDeleted] = useState(false);

  useEffect(() => {
    async function fetchMessages() {
      const res = await fetch("/api/messages");
      const data = await res.json();
      // For each message, if it has a productSlug, fetch the main image
      const messagesWithImages = await Promise.all(data.map(async (msg: any) => {
        if (msg.productSlug) {
          const imageUrl = await fetchProductImage(msg.productSlug);
          return { ...msg, productImage: imageUrl };
        }
        return msg;
      }));
      setMessages(messagesWithImages);
      setLoading(false);
    }
    fetchMessages();
  }, []);

  const filteredMessages = showDeleted ? messages : messages.filter((msg: any) => msg.status !== 'deleted');

  return (
    <main className="max-w-4xl mx-auto py-12 px-4">
      <h1 className="font-heading text-3xl md:text-4xl font-bold uppercase text-espresso mb-8">Admin: Messages</h1>
      <div className="mb-6 flex items-center gap-4">
        <label className="font-semibold text-sand-700 inline-flex items-center gap-2">
          <input
            type="checkbox"
            checked={showDeleted}
            onChange={e => setShowDeleted(e.target.checked)}
            className="accent-brass"
          />
          Show Deleted
        </label>
      </div>
      {loading ? (
        <div className="text-center py-16">Loading...</div>
      ) : (
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-sand text-espresso">
              <th className="p-2 text-left">Date</th>
              <th className="p-2 text-left">Customer</th>
              <th className="p-2 text-left">Email</th>
              <th className="p-2 text-left">Message</th>
              <th className="p-2 text-left">Product</th>
              <th className="p-2 text-left">Page</th>
              <th className="p-2 text-left">Status</th>
              <th className="p-2 text-left">Delete</th>
            </tr>
          </thead>
          <tbody>
            {filteredMessages.map((msg: any) => (
              <tr key={msg.id} className="border-b border-sand hover:bg-sand-100 cursor-pointer transition" onClick={() => window.location.href = `/admin/messages/${msg.id}`} tabIndex={0} role="button" aria-label={`View message from ${msg.customer_name || msg.customer_email}`}>
                <td className="p-2 whitespace-nowrap">{msg.created ? timeAgo(msg.created) : ""}</td>
                <td className="p-2">{msg.customer_name || msg.customerName || ""}</td>
                <td className="p-2">{msg.customer_email || msg.customerEmail || ""}</td>
                <td className="p-2 max-w-[320px] truncate">{msg.content.length > 100 ? msg.content.slice(0, 100) + '…' : msg.content}</td>
                <td className="p-2">
                  {msg.productImage ? (
                    <img src={msg.productImage} alt={msg.productSlug} className="w-12 h-12 object-cover rounded shadow inline-block mr-2 align-middle" />
                  ) : (
                    msg.productSlug || ""
                  )}
                </td>
                <td className="p-2">{getLastPathSegment(msg.pageUrl) || ""}</td>
                <td className="p-2">
                  <span className={`inline-block px-2 py-1 rounded text-xs font-bold ${msg.status === 'unread' ? 'bg-yellow-200 text-yellow-800' : msg.status === 'read' ? 'bg-green-200 text-green-800' : 'bg-sand-300 text-sand-700'}`}>{msg.status}</span>
                </td>
                <td className="p-2">
                  <button
                    className="text-red-600 hover:text-white hover:bg-red-600 rounded-full p-1 transition"
                    title="Delete message"
                    onClick={async (e) => {
                      e.stopPropagation();
                      if (!confirm('Delete this message?')) return;
                      await fetch(`/api/messages/${msg.id}`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ status: 'deleted' })
                      });
                      setMessages((prev: any[]) => prev.filter((m) => m.id !== msg.id));
                    }}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" /><line x1="10" y1="11" x2="10" y2="17" /><line x1="14" y1="11" x2="14" y2="17" /></svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  );
} 