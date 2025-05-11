"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function AdminProductEdit() {
  const { slug } = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<any>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

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
      router.refresh();
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
      {error && <div className="mb-4 text-red-600">{error}</div>}
      <form onSubmit={handleSave} className="space-y-4">
        <div>
          <label className="block font-bold mb-1">Title</label>
          <input name="title" value={product.title || ""} onChange={handleChange} className="w-full border rounded p-2" />
        </div>
        <div>
          <label className="block font-bold mb-1">Slug</label>
          <input name="slug" value={product.slug || ""} onChange={handleChange} className="w-full border rounded p-2" />
        </div>
        <div>
          <label className="block font-bold mb-1">Price</label>
          <input name="price" type="number" value={product.price || ""} onChange={handleChange} className="w-full border rounded p-2" />
        </div>
        <div>
          <label className="block font-bold mb-1">Status</label>
          <select name="status" value={product.status || "available"} onChange={handleChange} className="w-full border rounded p-2">
            <option value="available">Available</option>
            <option value="sold">Sold</option>
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
        <div>
          <label className="block font-bold mb-1">Images (comma-separated URLs)</label>
          <input name="images" value={product.images?.map((img: any) => img.url).join(",") || ""} onChange={handleChange} className="w-full border rounded p-2" />
        </div>
        <div className="flex gap-4 mt-6">
          <button type="submit" disabled={saving} className="bg-brass text-espresso font-bold rounded px-6 py-2 border-2 border-brass shadow hover:bg-espresso hover:text-ivory transition">{saving ? "Saving..." : "Save"}</button>
          <button type="button" onClick={handleDelete} disabled={saving} className="bg-red-600 text-white font-bold rounded px-6 py-2 border-2 border-red-600 shadow hover:bg-espresso hover:text-ivory transition">Delete</button>
        </div>
      </form>
    </main>
  );
} 