'use client';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from "next/link";
import ProductGrid from "../../components/ProductGrid";

export default function Showroom() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') || 'all';
  const [categories, setCategories] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);

  useEffect(() => {
    async function fetchData() {
      const catRes = await fetch('/api/categories');
      const prodRes = await fetch('/api/products');
      setCategories(await catRes.json());
      setProducts(await prodRes.json());
      setLoading(false);
    }
    fetchData();
  }, []);

  function formatPrice(value: string | number) {
    if (value === null || value === undefined) return '';
    const num = typeof value === 'number' ? value : parseFloat(value.toString().replace(/,/g, ''));
    if (isNaN(num)) return '';
    return num.toLocaleString('en-GB');
  }

  if (loading) return <div className="text-center py-16">Loading...</div>;

  // Filter products by selected category
  const filteredProducts = selectedCategory === 'all'
    ? products
    : products.filter((prod: any) =>
        prod.categories && prod.categories.some((cat: any) => cat.slug === selectedCategory)
      );

  return (
    <main className="max-w-6xl mx-auto py-16 px-4">
      <h1 className="font-heading text-4xl md:text-5xl font-bold uppercase text-espresso mb-10 text-center">Showroom</h1>
      {/* Category Filter */}
      <nav className="w-full mb-8 overflow-x-auto" aria-label="Product Categories">
        <ul className="flex gap-6 md:gap-8 text-sm font-bold uppercase tracking-wider font-body whitespace-nowrap justify-center">
          <li key="all">
            <button
              className={`px-2 py-1 border-b-2 ${selectedCategory === 'all' ? 'border-brass text-brass' : 'border-transparent hover:border-brass hover:text-brass'} transition-colors duration-200`}
              onClick={() => setSelectedCategory('all')}
            >
              All
            </button>
          </li>
          {categories.map((cat: any) => (
            <li key={cat.slug}>
              <button
                className={`px-2 py-1 border-b-2 ${selectedCategory === cat.slug ? 'border-brass text-brass' : 'border-transparent hover:border-brass hover:text-brass'} transition-colors duration-200`}
                onClick={() => setSelectedCategory(cat.slug)}
              >
                {cat.name}
              </button>
            </li>
          ))}
        </ul>
      </nav>
      {/* Product Grid */}
      <ProductGrid products={filteredProducts} gridClassName="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mb-12" />
      {/* Pagination Controls */}
      <div className="flex justify-center gap-2">
        <button className="px-4 py-2 rounded border border-sand bg-ivory text-espresso font-bold hover:bg-sand transition-colors">Previous</button>
        <span className="px-4 py-2 font-body">Page 1 of 1</span>
        <button className="px-4 py-2 rounded border border-sand bg-ivory text-espresso font-bold hover:bg-sand transition-colors">Next</button>
      </div>
    </main>
  );
} 