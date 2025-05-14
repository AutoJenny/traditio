"use client";
import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";

export default function AdminProductEdit() {
  const { slug } = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<any>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  // Track if price input is focused
  const [priceFocused, setPriceFocused] = useState(false);
  const [activeTab, setActiveTab] = useState('Description');
  // Accept both id and slug for routing
  const productIdOrSlug = slug;
  const [showImageWarning, setShowImageWarning] = useState(false);
  const [pendingSave, setPendingSave] = useState<any>(null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    async function fetchData() {
      const [catRes, prodRes] = await Promise.all([
        fetch("/api/categories"),
        fetch(`/api/products/${slug}`),
      ]);
      const cats = await catRes.json();
      const prodData = await prodRes.json();
      setCategories(cats);
      // Flatten categories to array of IDs for form
      setProduct({
        ...prodData.product,
        categoryIds: prodData.product?.categories?.map((cat: any) => Number(cat.id)) || [],
        images: prodData.product?.images || [],
      });
      setLoading(false);
    }
    fetchData();
  }, [slug]);

  function formatPrice(value: string | number) {
    if (value === null || value === undefined) return '';
    const num = typeof value === 'number' ? value : parseFloat(value.toString().replace(/,/g, ''));
    if (isNaN(num)) return '';
    return num.toLocaleString('en-GB');
  }

  function handlePriceChange(e: any) {
    // Always store raw value (no commas)
    const raw = e.target.value.replace(/,/g, '');
    if (!/^\d*(\.\d{0,2})?$/.test(raw)) return; // Only allow numbers and up to 2 decimals
    setProduct((prev: any) => ({ ...prev, price: raw }));
  }

  function handlePriceFocus() {
    setPriceFocused(true);
  }

  function handlePriceBlur() {
    setPriceFocused(false);
    // Optionally, format price on blur (already handled by value logic)
  }

  function handleChange(e: any) {
    const { name, value, type, checked } = e.target;
    if (name === "categoryIds") {
      const id = Number(value);
      setProduct((prev: any) => ({
        ...prev,
        categoryIds: checked
          ? [...prev.categoryIds, id]
          : prev.categoryIds.filter((cid: number) => cid !== id),
      }));
    } else if (name === "images") {
      setProduct((prev: any) => ({ ...prev, images: value.split(",").map((url: string) => ({ url })) }));
    } else {
      setProduct((prev: any) => ({ ...prev, [name]: value }));
    }
  }

  async function fetchLatestImages() {
    const res = await fetch(`/api/products/${slug}`);
    if (!res.ok) return [];
    const data = await res.json();
    return data.product.images || [];
  }

  async function handleSave(e: any) {
    e.preventDefault();
    setSaving(true);
    setError("");
    // Always fetch latest images before saving
    const latestImages = await fetchLatestImages();
    const imagesToSave = (product.images && product.images.length > 0) ? product.images : latestImages;
    if (!imagesToSave || imagesToSave.length === 0) {
      setShowImageWarning(true);
      setPendingSave(() => () => handleSave(e));
      setSaving(false);
      return;
    }
    try {
      // Sanitize payload
      const cleanProduct = {
        ...product,
        categoryIds: (product.categoryIds || []).filter((id: any) => typeof id === 'number' && id > 0),
        images: imagesToSave.map((img: any) => ({
          url: img.url,
          ...(img.alt !== undefined ? { alt: img.alt } : {}),
          ...(typeof img.order === 'number' ? { order: img.order } : {}),
        })),
      };
      const res = await fetch(`/api/products/${slug}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cleanProduct),
      });
      if (!res.ok) throw new Error("Failed to save");
      const data = await res.json();
      // If the slug has changed, redirect to the new canonical URL
      if (data.product && data.product.slug && data.product.slug !== slug) {
        router.push(`/admin/products/${data.product.slug}`);
      } else if (data.product) {
        setProduct({
          ...data.product,
          categoryIds: data.product.categories?.map((cat: any) => Number(cat.id)) || [],
          images: data.product.images || [],
        });
        // Optionally, show a success message here
      } else {
        router.refresh();
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!confirm("Are you sure you want to delete this product?")) return;
    setSaving(true);
    setError("");
    try {
      const res = await fetch(`/api/products/${slug}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      router.push("/admin");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div className="text-center py-16">Loading...</div>;
  if (!product) return <div className="text-center py-16">Product not found.</div>;

  return (
    <main className="max-w-2xl mx-auto py-12 px-4">
      {/* Link to live product page */}
      {product?.slug && (
        <div className="flex justify-end mb-2">
          <a
            href={`/showroom/${product.slug}`}
            className="text-xs text-brass hover:underline border border-brass rounded px-3 py-1 transition font-semibold"
            target="_blank"
            rel="noopener noreferrer"
          >
            View Live Page
          </a>
        </div>
      )}
      <h1 className="font-heading text-2xl md:text-3xl font-bold uppercase text-espresso mb-6">Edit Product</h1>
      {/* Show the product slug for visual confirmation */}
      {product?.slug && (
        <div className="mb-4 text-sand-500 text-sm font-mono">Slug: <span className="font-bold">{product.slug}</span></div>
      )}
      {/* Draft indicator */}
      {(!product.title || !product.price) && (
        <div className="mb-4 px-4 py-2 bg-yellow-100 text-yellow-800 font-semibold rounded border-l-4 border-yellow-400">
          Draft: Please add a title and price to complete this product.
        </div>
      )}
      {/* Tab Bar */}
      <div className="flex mb-8 border-b-2 border-sand-300">
        {['Source', 'Description', 'Images', 'Sale'].map(tab => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-3 font-bold uppercase tracking-wide text-lg focus:outline-none transition border-b-4 ${activeTab === tab ? 'border-brass text-espresso bg-sand-100' : 'border-transparent text-sand-500 hover:text-espresso hover:bg-sand-50'}`}
            style={{ marginBottom: -2 }}
          >
            {tab}
          </button>
        ))}
      </div>
      {activeTab === 'Source' && (
        <div className="py-8 text-sand-700 text-lg italic text-center">
          <p>Source details for this product will go here.</p>
        </div>
      )}
      {activeTab === 'Description' && (
        <>
          <form onSubmit={handleSave} ref={formRef} className="space-y-4">
            {error && <div className="mb-4 text-red-600">{error}</div>}
            <div>
              <label className="block font-bold mb-1">Title</label>
              <input name="title" value={product.title || ""} onChange={handleChange} className="w-full border rounded p-2" />
            </div>
            <div>
              <label className="block font-bold mb-1">Price</label>
              <input
                name="price"
                type="text"
                value={priceFocused ? (product.price || '') : formatPrice(product.price) || ''}
                onChange={handlePriceChange}
                onFocus={handlePriceFocus}
                onBlur={handlePriceBlur}
                className="w-full border rounded p-2"
                inputMode="decimal"
              />
            </div>
            <div>
              <label className="block font-bold mb-1">Status</label>
              <select name="status" value={product.status || "draft"} onChange={handleChange} className="w-full border rounded p-2" disabled={!product.title || !product.price}>
                <option value="draft">Draft</option>
                <option value="available">Available</option>
                <option value="sold">Sold</option>
                <option value="deleted">Deleted</option>
              </select>
            </div>
            <div>
              <label className="block font-bold mb-1">Categories</label>
              <div className="flex flex-wrap gap-2">
                {categories.map((cat: any) => (
                  <label key={cat.id} className="flex items-center gap-1">
                    <input
                      type="checkbox"
                      name="categoryIds"
                      value={cat.id}
                      checked={product.categoryIds.includes(Number(cat.id))}
                      onChange={handleChange}
                      disabled={!product.title || !product.price}
                    />
                    {cat.name}
                  </label>
                ))}
              </div>
            </div>
            <div>
              <label className="block font-bold mb-1">Description</label>
              <textarea name="description" value={product.description || ""} onChange={handleChange} className="w-full border rounded p-2" rows={3} />
            </div>
            <div>
              <label className="block font-bold mb-1">Dimensions (Wide): cm</label>
              <input name="dimension_wide" type="number" step="any" value={product.dimension_wide || ""} onChange={handleChange} className="w-full border rounded p-2 mb-2" />
            </div>
            <div>
              <label className="block font-bold mb-1">Dimensions (Deep): cm</label>
              <input name="dimension_deep" type="number" step="any" value={product.dimension_deep || ""} onChange={handleChange} className="w-full border rounded p-2 mb-2" />
            </div>
            <div>
              <label className="block font-bold mb-1">Dimensions (High): cm</label>
              <input name="dimension_high" type="number" step="any" value={product.dimension_high || ""} onChange={handleChange} className="w-full border rounded p-2" />
            </div>
            <div>
              <label className="block font-bold mb-1">Weight: kg</label>
              <input name="weight" type="number" step="any" value={product.weight || ""} onChange={handleChange} className="w-full border rounded p-2 mb-2" />
            </div>
            <div>
              <label className="block font-bold mb-1">Condition</label>
              <input name="condition" value={product.condition || ""} onChange={handleChange} className="w-full border rounded p-2" />
            </div>
            <div>
              <label className="block font-bold mb-1">Origin</label>
              <input name="origin" value={product.origin || ""} onChange={handleChange} className="w-full border rounded p-2" />
            </div>
            <div>
              <label className="block font-bold mb-1">Period</label>
              <input name="period" value={product.period || ""} onChange={handleChange} className="w-full border rounded p-2" />
            </div>
            <div className="flex gap-4 mt-6">
              <button type="submit" disabled={saving} className="bg-brass text-espresso font-bold rounded px-6 py-2 border-2 border-brass shadow hover:bg-espresso hover:text-ivory transition">{saving ? "Saving..." : "Save"}</button>
            </div>
          </form>
          {/* Delete icon button outside the form */}
          <div className="flex justify-end mt-4">
            <button
              type="button"
              onClick={handleDelete}
              disabled={saving}
              aria-label="Delete product"
              className="p-2 rounded-full bg-red-600 hover:bg-red-700 text-white shadow border-2 border-red-700 transition flex items-center justify-center"
              title="Delete product"
            >
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" /><line x1="10" y1="11" x2="10" y2="17" /><line x1="14" y1="11" x2="14" y2="17" /></svg>
            </button>
          </div>
          {/* Image removal warning modal */}
          {showImageWarning && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
              <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md relative">
                <h2 className="text-xl font-bold mb-4 text-espresso">No Images Attached</h2>
                <p className="mb-4 text-sand-700">Saving now will remove all images from this product. This is not allowed. Please add at least one image before saving.</p>
                <div className="flex gap-4 mt-6">
                  <button type="button" onClick={() => setShowImageWarning(false)} className="bg-sand text-espresso rounded px-6 py-2 border-2 border-sand shadow hover:bg-espresso hover:text-ivory transition">OK</button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
      {activeTab === 'Images' && (
        <div>
          <a href={`/admin/products/${product.slug || product.id}/images`} className="block font-semibold mb-4 text-brass hover:underline transition">Edit Images</a>
          <div className="flex flex-wrap gap-2 items-center">
            {product.images && product.images.length > 0 ? (
              product.images.map((img: any, idx: number) => (
                <a key={img.url} href={`/admin/products/${product.slug || product.id}/images`} className="relative group">
                  <img src={img.url} alt={img.alt || ''} className={`w-32 h-32 object-cover rounded border ${product.mainImageId === img.id ? 'ring-2 ring-sand-500' : ''} group-hover:opacity-80 transition`} />
                  {product.mainImageId === img.id && (
                    <span className="absolute top-0 right-0 bg-sand-500 text-xs text-white px-1 rounded-bl">Main</span>
                  )}
                </a>
              ))
            ) : (
              <span className="text-gray-400">No images</span>
            )}
            <a href={`/admin/products/${product.slug || product.id}/images`} className="ml-4 px-3 py-1 bg-sand-500 text-white rounded hover:bg-sand-600 transition">Edit Images</a>
          </div>
        </div>
      )}
      {activeTab === 'Sale' && (
        <div className="py-8 text-sand-700 text-lg italic text-center">
          <p>Sale details for this product will go here.</p>
        </div>
      )}
    </main>
  );
} 