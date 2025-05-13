"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function AdminProductList() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [showDeleted, setShowDeleted] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [categoryFilter, setCategoryFilter] = useState('ALL');

  useEffect(() => {
    async function fetchProducts() {
      const res = await fetch(`/api/products${showDeleted ? '?showDeleted=1' : ''}`);
      const data = await res.json();
      setProducts(data.sort((a: any, b: any) => a.title.localeCompare(b.title)));
      setLoading(false);
    }
    async function fetchCategories() {
      const res = await fetch("/api/categories");
      setCategories(await res.json());
    }
    fetchProducts();
    fetchCategories();
  }, [showDeleted]);

  return (
    <main className="max-w-4xl mx-auto py-12 px-4">
      <h1 className="font-heading text-3xl md:text-4xl font-bold uppercase text-espresso mb-8">Admin: Products</h1>
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <label className="inline-flex items-center gap-2 font-semibold text-sand-700">
            <input
              type="checkbox"
              checked={showDeleted}
              onChange={e => setShowDeleted(e.target.checked)}
              className="accent-brass"
            />
            Show Deleted
          </label>
          <label className="inline-flex items-center gap-2 font-semibold text-sand-700">
            Category:
            <select
              value={categoryFilter}
              onChange={e => setCategoryFilter(e.target.value)}
              className="border rounded px-2 py-1"
            >
              <option value="ALL">ALL</option>
              {categories.map((cat: any) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
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
              .filter((prod: any) => showDeleted ? prod.status === 'deleted' : prod.status !== 'deleted')
              .filter((prod: any) =>
                categoryFilter === 'ALL' ||
                (prod.categories && prod.categories.some((cat: any) => String(cat.id) === String(categoryFilter)))
              )
              .map((prod: any) => (
                <tr
                  key={prod.id}
                  className={`border-b border-sand hover:bg-ivory group transition-colors duration-150
                    ${prod.status === 'sold' ? 'bg-gray-300 opacity-60' : ''}
                    ${prod.status === 'draft' ? 'bg-white' : ''}
                  `}
                >
                  <td className="p-2 relative">
                    {prod.images && prod.images[0] ? (
                      <Link href={`/admin/products/${prod.slug}/images`}>
                        <img src={prod.images[0].url} alt={prod.title} className="w-16 h-16 object-cover rounded hover:ring-2 hover:ring-sand-500 transition" />
                        {prod.status === 'sold' && (
                          <span className="absolute top-1 right-1 z-10 opacity-0 group-hover:opacity-100 transition-opacity inline-block bg-gray-700 text-white text-xs rounded px-2 py-0.5 uppercase font-bold">SOLD</span>
                        )}
                      </Link>
                    ) : (
                      <Link href={`/admin/products/${prod.slug}/images`} className="text-2xl">🪑
                        {prod.status === 'sold' && (
                          <span className="absolute top-1 right-1 z-10 opacity-0 group-hover:opacity-100 transition-opacity inline-block bg-gray-700 text-white text-xs rounded px-2 py-0.5 uppercase font-bold">SOLD</span>
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
                        setProducts((prev) => prev.map((p) => p.id === prod.id ? { ...p, featured: newVal } : p));
                        await fetch(`/api/products/${prod.slug}`, {
                          method: 'PUT',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ ...prod, featured: newVal }),
                        });
                      }}
                      className={`border rounded px-2 py-1 ${prod.featured ? 'bg-green-200 text-espresso font-bold' : ''}`}
                    >
                      <option value="y">{prod.featured ? 'yes' : 'n'}</option>
                      <option value="n">n</option>
                    </select>
                  </td>
                  <td className="p-2">£{prod.price}</td>
                  <td className="p-2">{prod.status}</td>
                  <td className="p-2">
                    <Link href={`/admin/products/${prod.slug}`} className="bg-blue-600 text-white rounded-full p-2 mr-2 hover:bg-blue-700 transition flex items-center justify-center" title="Edit product">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19.5 3 21l1.5-4L16.5 3.5z"/></svg>
                    </Link>
                    <button
                      className="text-red-600 hover:text-red-800 p-2 rounded-full border border-transparent hover:border-red-400 transition flex items-center justify-center"
                      title="Delete product"
                      onClick={async (e) => {
                        e.preventDefault();
                        if (!confirm('Are you sure you want to delete this product?')) return;
                        // Optimistically remove from UI
                        setProducts((prev) => prev.filter((p) => p.id !== prod.id));
                        // Send DELETE request to API
                        const res = await fetch(`/api/products/${prod.slug}`, { method: 'DELETE' });
                        if (!res.ok) {
                          alert('Failed to delete product');
                          // Optionally, re-add to UI if failed
                          setProducts((prev) => [...prev, prod]);
                        }
                      }}
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" /><line x1="10" y1="11" x2="10" y2="17" /><line x1="14" y1="11" x2="14" y2="17" /></svg>
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