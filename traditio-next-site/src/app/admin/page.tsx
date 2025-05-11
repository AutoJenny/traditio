"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function AdminProductList() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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
      <div className="mb-6 text-right">
        <Link href="/admin/products/new" className="bg-brass text-espresso font-bold rounded px-6 py-2 border-2 border-brass shadow hover:bg-espresso hover:text-ivory transition">Add New Product</Link>
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
              <th className="p-2 text-left">Price</th>
              <th className="p-2 text-left">Status</th>
              <th className="p-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((prod: any) => (
              <tr key={prod.id} className="border-b border-sand hover:bg-ivory">
                <td className="p-2">
                  {prod.images && prod.images[0] ? (
                    <img src={prod.images[0].url} alt={prod.title} className="w-16 h-16 object-cover rounded" />
                  ) : (
                    <span className="text-2xl">🪑</span>
                  )}
                </td>
                <td className="p-2 font-bold">
                  <Link href={`/admin/products/${prod.slug}`} className="hover:underline text-brass">{prod.title}</Link>
                </td>
                <td className="p-2">{prod.category?.name || "-"}</td>
                <td className="p-2">£{prod.price}</td>
                <td className="p-2">{prod.status}</td>
                <td className="p-2">
                  <Link href={`/admin/products/${prod.slug}`} className="text-blue-600 hover:underline mr-2">Edit</Link>
                  <Link href={`/admin/products/${prod.slug}/delete`} className="text-red-600 hover:underline">Delete</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  );
} 