"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

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

async function fetchProduct(slug: string): Promise<any | null> {
  if (!slug) return null;
  try {
    const res = await fetch(`/api/products/${slug}`);
    if (!res.ok) return null;
    const data = await res.json();
    if (data.product) return data.product;
    return null;
  } catch {
    return null;
  }
}

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

function formatGBP(pounds: number) {
  if (typeof pounds !== 'number' || isNaN(pounds)) return '';
  return new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP', maximumFractionDigits: 0 }).format(pounds);
}

export default function AdminMessageDetail() {
  const { id } = useParams();
  const router = useRouter();
  const [message, setMessage] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [productImage, setProductImage] = useState<string | null>(null);
  const [product, setProduct] = useState<any | null>(null);

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
      // Fetch product if productSlug exists
      if (data && data.productSlug) {
        const prod = await fetchProduct(data.productSlug);
        setProduct(prod);
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
        <div className="flex flex-col md:flex-row gap-8">
          <div className="flex-1 min-w-0">
            <h1 className="font-heading text-2xl font-bold text-espresso mb-2">Message from {message.customer_name || message.customer_email}</h1>
            <div className="mb-2 text-sand-700">Email: {message.customer_email}</div>
            <div className="mb-2 text-sand-700">Date: {message.created ? new Date(message.created).toLocaleString() : ""}</div>
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
            <div className="bg-white rounded p-6 text-lg text-espresso shadow mb-8">
              {message.content}
            </div>
          </div>
          {/* Product panel if available */}
          {product && product.images && product.images.length > 0 && (
            <div className="w-full md:w-72 flex-shrink-0 bg-white rounded-lg shadow-lg border border-sand-200 p-4 flex flex-col items-center">
              <a href={`/admin/products/${product.slug}`} target="_blank" rel="noopener noreferrer" className="block mb-2 w-full text-center">
                <div className="font-bold text-lg text-espresso mb-2 truncate">{product.title}</div>
                <img
                  src={product.images[0].url}
                  alt={product.slug}
                  className="w-56 h-56 object-cover rounded mb-2 border border-sand-300 shadow"
                />
              </a>
              <div className="text-brass-700 font-semibold text-xl mb-1">{product.price ? formatGBP(product.price) : ""}</div>
              <div className="text-sand-500 text-sm">Added: {product.created ? timeAgo(product.created) : ""}</div>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-16 text-red-600">Message not found.</div>
      )}
    </main>
  );
} 