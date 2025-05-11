"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function AdminProductList() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [showDeleted, setShowDeleted] = useState(false);

  useEffect(() => {
    async function fetchProducts() {
      const res = await fetch("/api/products");
      const data = await res.json();
      setProducts(data.sort((a: any, b: any) => a.title.localeCompare(b.title)));
      setLoading(false);
    }
    fetchProducts();
  }, []);

  return (
    <main className="max-w-4xl mx-auto py-12 px-4">
      <h1 className="font-heading text-3xl md:text-4xl font-bold uppercase text-espresso mb-8">Admin: Products</h1>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <label className="inline-flex items-center gap-2 font-semibold text-sand-700">
            <input
              type="checkbox"
              checked={showDeleted}
              onChange={e => setShowDeleted(e.target.checked)}
              className="accent-brass"
            />
            Show Deleted
          </label>
        </div>
        <button
          onClick={async () => {
            setCreating(true);
            const res = await fetch('/api/products?init=1', { method: 'PUT' });
            const data = await res.json();
            if (data.id) {
              // Fetch the product to get its slug
              const prodRes = await fetch(`/api/products`);
              const allProducts = await prodRes.json();
              const newProduct = allProducts.find((p: any) => p.id === data.id);
              if (newProduct && newProduct.slug) {
                window.location.href = `/admin/products/${newProduct.slug}`;
              } else {
                window.location.href = `/admin/products/${data.id}`;
              }
            } else {
              alert('Failed to create new product');
            }
            setCreating(false);
          }}
          className="bg-brass text-espresso font-bold rounded px-6 py-2 border-2 border-brass shadow hover:bg-espresso hover:text-ivory transition"
          disabled={creating}
        >
          {creating ? 'Creating...' : 'Add New Product'}
        </button>
      </div>
      {loading ? (
        <div className="text-center py-16">Loading...</div>
      ) : (
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-sand text-espresso">
              <th className="p-2 text-left">Image</th>
              <th className="p-2 text-left">Title</th>
              <th className="p-2 text-left">Category</th>
              <th className="p-2 text-left">Featured</th>
              <th className="p-2 text-left">Price</th>
              <th className="p-2 text-left">Status</th>
              <th className="p-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products
              .filter((prod: any) => showDeleted || prod.status !== 'deleted')
              .map((prod: any) => (
                <tr key={prod.id} className="border-b border-sand hover:bg-ivory group">
                  <td className="p-2 relative">
                    {prod.images && prod.images[0] ? (
                      <Link href={`/admin/products/${prod.slug}/images`}>
                        <img src={prod.images[0].url} alt={prod.title} className="w-16 h-16 object-cover rounded hover:ring-2 hover:ring-sand-500 transition" />
                        {prod.status === 'sold' && (
                          <span className="absolute top-1 right-1 z-10 opacity-0 group-hover:opacity-100 transition-opacity inline-block bg-red-400 text-white text-xs rounded px-2 py-0.5 uppercase font-bold">SOLD</span>
                        )}
                      </Link>
                    ) : (
                      <Link href={`/admin/products/${prod.slug}/images`} className="text-2xl">🪑
                        {prod.status === 'sold' && (
                          <span className="absolute top-1 right-1 z-10 opacity-0 group-hover:opacity-100 transition-opacity inline-block bg-red-400 text-white text-xs rounded px-2 py-0.5 uppercase font-bold">SOLD</span>
                        )}
                      </Link>
                    )}
                  </td>
                  <td className="p-2 font-bold">
                    <Link href={`/admin/products/${prod.slug}`} className="hover:underline text-brass">{prod.title}</Link>
                  </td>
                  <td className="p-2">
                    {prod.categories && prod.categories.length > 0
                      ? prod.categories.map((cat: any) => cat.name).join(", ")
                      : "-"}
                  </td>
                  <td className="p-2">
                    <select
                      value={prod.featured ? 'y' : 'n'}
                      onChange={async (e) => {
                        const newVal = e.target.value === 'y';
                        // Optimistically update UI
                        setProducts((prev) => prev.map((p) => p.id === prod.id ? { ...p, featured: newVal } : p));
                        // Update backend
                        await fetch(`/api/products/${prod.slug}`, {
                          method: 'PUT',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ ...prod, featured: newVal }),
                        });
                      }}
                      className="border rounded px-2 py-1"
                    >
                      <option value="y">y</option>
                      <option value="n">n</option>
                    </select>
                  </td>
                  <td className="p-2">£{prod.price}</td>
                  <td className="p-2">{prod.status}</td>
                  <td className="p-2">
                    <Link href={`/admin/products/${prod.slug}`} className="text-blue-600 hover:underline mr-2">Edit</Link>
                    <button
                      className="text-red-600 hover:underline"
                      onClick={async (e) => {
                        e.preventDefault();
                        if (!confirm('Are you sure you want to delete this product?')) return;
                        // Optimistically remove from UI
                        setProducts((prev) => prev.filter((p) => p.id !== prod.id));
                        // Update backend status to 'deleted'
                        await fetch(`/api/products/${prod.slug}`, {
                          method: 'PUT',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ ...prod, status: 'deleted' }),
                        });
                      }}
                    >
                      Delete
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