"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminProductNew() {
  const router = useRouter();
  const [categories, setCategories] = useState<any[]>([]);
  const [product, setProduct] = useState<any>({
    title: "",
    slug: "",
    price: "",
    status: "available",
    categoryIds: [],
    description: "",
    dimensions: "",
    condition: "",
    origin: "",
    period: "",
    images: [],
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchCategories() {
      const res = await fetch("/api/categories");
      setCategories(await res.json());
    }
    fetchCategories();
  }, []);

  function handleChange(e: any) {
    const { name, value, type, checked } = e.target;
    if (name === "categoryIds") {
      setProduct((prev: any) => ({
        ...prev,
        categoryIds: checked
          ? [...prev.categoryIds, value]
          : prev.categoryIds.filter((id: string) => id !== value),
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
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(product),
      });
      if (!res.ok) throw new Error("Failed to create product");
      router.push("/admin");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="max-w-2xl mx-auto py-12 px-4">
      <h1 className="font-heading text-2xl md:text-3xl font-bold uppercase text-espresso mb-6">Add New Product</h1>
      {error && <div className="mb-4 text-red-600">{error}</div>}
      <form onSubmit={handleSave} className="space-y-4">
        <div>
          <label className="block font-bold mb-1">Title</label>
          <input name="title" value={product.title} onChange={handleChange} className="w-full border rounded p-2" />
        </div>
        <div>
          <label className="block font-bold mb-1">Slug</label>
          <input name="slug" value={product.slug} onChange={handleChange} className="w-full border rounded p-2" />
        </div>
        <div>
          <label className="block font-bold mb-1">Price</label>
          <input name="price" type="number" value={product.price} onChange={handleChange} className="w-full border rounded p-2" />
        </div>
        <div>
          <label className="block font-bold mb-1">Status</label>
          <select name="status" value={product.status} onChange={handleChange} className="w-full border rounded p-2">
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
                  checked={product.categoryIds.includes(cat.id)}
                  onChange={handleChange}
                />
                {cat.name}
              </label>
            ))}
          </div>
        </div>
        <div>
          <label className="block font-bold mb-1">Description</label>
          <textarea name="description" value={product.description} onChange={handleChange} className="w-full border rounded p-2" rows={3} />
        </div>
        <div>
          <label className="block font-bold mb-1">Dimensions</label>
          <input name="dimensions" value={product.dimensions} onChange={handleChange} className="w-full border rounded p-2" />
        </div>
        <div>
          <label className="block font-bold mb-1">Condition</label>
          <input name="condition" value={product.condition} onChange={handleChange} className="w-full border rounded p-2" />
        </div>
        <div>
          <label className="block font-bold mb-1">Origin</label>
          <input name="origin" value={product.origin} onChange={handleChange} className="w-full border rounded p-2" />
        </div>
        <div>
          <label className="block font-bold mb-1">Period</label>
          <input name="period" value={product.period} onChange={handleChange} className="w-full border rounded p-2" />
        </div>
        <div>
          <label className="block font-bold mb-1">Images (comma-separated URLs)</label>
          <input name="images" value={product.images.map((img: any) => img.url).join(",")} onChange={handleChange} className="w-full border rounded p-2" />
        </div>
        <div className="flex gap-4 mt-6">
          <button type="submit" disabled={saving} className="bg-brass text-espresso font-bold rounded px-6 py-2 border-2 border-brass shadow hover:bg-espresso hover:text-ivory transition">{saving ? "Saving..." : "Save"}</button>
        </div>
      </form>
    </main>
  );
} 