"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

const QUICK_SOURCES = [
  { label: "Inherited", name: "Inherited" },
  { label: "Found/Gift", name: "Found/Gift" },
  { label: "Anonymous Purchase", name: "Anonymous Purchase" },
];

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
  // Source tab state
  const [sourceQuery, setSourceQuery] = useState("");
  const [sourceOptions, setSourceOptions] = useState<any[]>([]);
  const [sourceLoading, setSourceLoading] = useState(false);
  const [showNewSource, setShowNewSource] = useState(false);
  const [newSource, setNewSource] = useState({ name: "", address: "", postcode: "", notes: "" });

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

  // Fetch sources for autocomplete
  useEffect(() => {
    if (!sourceQuery) return setSourceOptions([]);
    setSourceLoading(true);
    fetch(`/api/sources?query=${encodeURIComponent(sourceQuery)}`)
      .then(res => res.json())
      .then(setSourceOptions)
      .finally(() => setSourceLoading(false));
  }, [sourceQuery]);

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

  // Handle quick source selection
  function handleQuickSource(name: string) {
    setProduct((prev: any) => ({ ...prev, sourceName: name, sourceId: undefined }));
    setSourceQuery(name);
    setShowNewSource(false);
  }

  // Handle source select
  function handleSourceSelect(option: any) {
    setProduct((prev: any) => ({ ...prev, sourceId: option.id, sourceName: option.name }));
    setShowNewSource(false);
  }

  // Handle new source creation
  async function handleCreateSource(e: any) {
    e.preventDefault();
    const res = await fetch('/api/sources', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newSource),
    });
    if (res.ok) {
      const created = await res.json();
      setProduct((prev: any) => ({ ...prev, sourceId: created.id, sourceName: created.name }));
      setShowNewSource(false);
      setSourceQuery("");
      setNewSource({ name: "", address: "", postcode: "", notes: "" });
    }
  }

  async function handleSave(e: any) {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const res = await fetch(`/api/products/${slug}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(product),
      });
      if (!res.ok) throw new Error("Failed to save");
      const data = await res.json();
      // If the slug has changed, redirect to the new canonical URL
      if (data.product && data.product.slug && data.product.slug !== slug) {
        router.push(`/admin/products/${data.product.slug}`);
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
      <h1 className="font-heading text-2xl md:text-3xl font-bold uppercase text-espresso mb-6">Edit Product</h1>
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
        <div className="space-y-6">
          <div>
            <label className="block font-bold mb-1">Source</label>
            <div className="flex gap-2 mb-2">
              {QUICK_SOURCES.map(q => (
                <button key={q.name} type="button" className="px-3 py-1 rounded bg-sand-200 hover:bg-sand-300 text-espresso font-semibold" onClick={() => handleQuickSource(q.name)}>{q.label}</button>
              ))}
            </div>
            <input
              type="text"
              className="w-full border rounded p-2 mb-1"
              placeholder="Type to search or add source..."
              value={product.sourceName || sourceQuery}
              onChange={e => {
                setSourceQuery(e.target.value);
                setProduct((prev: any) => ({ ...prev, sourceName: e.target.value, sourceId: undefined }));
                setShowNewSource(false);
              }}
              onFocus={() => setShowNewSource(false)}
            />
            {sourceLoading && <div className="text-sm text-gray-400">Searching...</div>}
            {sourceOptions.length > 0 && (
              <div className="border rounded bg-white shadow p-2 mt-1">
                {sourceOptions.map(opt => (
                  <div key={opt.id} className="cursor-pointer hover:bg-sand-100 p-1 rounded" onClick={() => handleSourceSelect(opt)}>{opt.name}</div>
                ))}
                <div className="mt-2 text-xs text-gray-500">Can't find it? <button type="button" className="underline" onClick={() => setShowNewSource(true)}>Add new source</button></div>
              </div>
            )}
            {showNewSource && (
              <form onSubmit={handleCreateSource} className="mt-2 space-y-2 border rounded p-3 bg-sand-50">
                <input required className="w-full border rounded p-2" placeholder="Name" value={newSource.name} onChange={e => setNewSource(s => ({ ...s, name: e.target.value }))} />
                <input className="w-full border rounded p-2" placeholder="Address" value={newSource.address} onChange={e => setNewSource(s => ({ ...s, address: e.target.value }))} />
                <input className="w-full border rounded p-2" placeholder="Postcode" value={newSource.postcode} onChange={e => setNewSource(s => ({ ...s, postcode: e.target.value }))} />
                <textarea className="w-full border rounded p-2" placeholder="Notes" value={newSource.notes} onChange={e => setNewSource(s => ({ ...s, notes: e.target.value }))} />
                <button type="submit" className="bg-brass text-espresso font-bold rounded px-4 py-2 border-2 border-brass shadow hover:bg-espresso hover:text-ivory transition">Create Source</button>
              </form>
            )}
          </div>
          <div>
            <label className="block font-bold mb-1">Acquisition Date</label>
            <input type="date" className="w-full border rounded p-2" value={product.acquisitionDate ? product.acquisitionDate.slice(0,10) : ''} onChange={e => setProduct((prev: any) => ({ ...prev, acquisitionDate: e.target.value }))} />
          </div>
          <div>
            <label className="block font-bold mb-1">Acquisition Price</label>
            <div className="flex gap-2">
              <input type="number" step="0.01" className="w-full border rounded p-2" value={product.acquisitionPrice || ''} onChange={e => setProduct((prev: any) => ({ ...prev, acquisitionPrice: e.target.value }))} />
              <select className="border rounded p-2" value={product.acquisitionCurrency || 'GBP'} onChange={e => setProduct((prev: any) => ({ ...prev, acquisitionCurrency: e.target.value }))}>
                <option value="GBP">GBP</option>
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block font-bold mb-1">Acquisition Notes</label>
            <textarea className="w-full border rounded p-2" value={product.acquisitionNotes || ''} onChange={e => setProduct((prev: any) => ({ ...prev, acquisitionNotes: e.target.value }))} />
          </div>
          <div>
            <label className="block font-bold mb-1">Provenance</label>
            <textarea className="w-full border rounded p-2" value={product.provenance || ''} onChange={e => setProduct((prev: any) => ({ ...prev, provenance: e.target.value }))} />
          </div>
          <div>
            <label className="block font-bold mb-1">Receipts / Documents</label>
            <input type="file" className="w-full border rounded p-2" multiple disabled />
            <div className="text-xs text-gray-400 mt-1">(Document upload coming soon)</div>
          </div>
        </div>
      )}
      {activeTab === 'Description' && (
        <form onSubmit={handleSave} className="space-y-4">
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
            <label className="block font-bold mb-1">Dimensions</label>
            <input name="dimensions" value={product.dimensions || ""} onChange={handleChange} className="w-full border rounded p-2" />
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
            <button type="button" onClick={handleDelete} disabled={saving} className="bg-red-600 text-white font-bold rounded px-6 py-2 border-2 border-red-600 shadow hover:bg-espresso hover:text-ivory transition">Delete</button>
          </div>
        </form>
      )}
      {activeTab === 'Images' && (
        <div>
          <a href={`/admin/products/${product.slug || product.id}/images`} className="block font-semibold mb-4 text-brass hover:underline transition">Edit Images</a>
          <div className="flex flex-wrap gap-2 items-center">
            {product.images && product.images.length > 0 ? (
              product.images.map((img: any, idx: number) => (
                <a key={img.url} href={`/admin/products/${product.slug || product.id}/images`} className="relative group">
                  <img src={img.url} alt={img.alt || ''} className={`w-16 h-16 object-cover rounded border ${product.mainImageId === img.id ? 'ring-2 ring-sand-500' : ''} group-hover:opacity-80 transition`} />
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