'use client';
import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from 'next/navigation';
import Link from "next/link";
import ProductGrid from "../components/ProductGrid";

export default function Home() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedCategory = searchParams.get('category') || 'all';

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch("/api/products");
        const allProducts = await res.json();
        setProducts(allProducts.filter((p: any) => p.featured));
      } catch (e) {
        setProducts([]);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  function formatPrice(value: string | number) {
    if (value === null || value === undefined) return '';
    const num = typeof value === 'number' ? value : parseFloat(value.toString().replace(/,/g, ''));
    if (isNaN(num)) return '';
    return num.toLocaleString('en-GB');
  }

  return (
    <main className="flex flex-col items-center justify-center min-h-[60vh] py-16 px-4 bg-ivory">
      <section className="w-full max-w-2xl mx-auto text-center">
        <h1 className="font-heading text-5xl md:text-6xl font-bold uppercase text-espresso mb-6 animate-fadein">Traditio Interiors</h1>
        <p className="font-body text-lg md:text-xl text-sand mb-8">Beautifully curated interiors and timeless pieces. Discover our collection.</p>
        <a href="/showroom" className="inline-block bg-sand text-espresso font-bold font-body rounded px-8 py-4 border-2 border-brass transition-colors duration-200 hover:bg-espresso hover:text-ivory text-lg shadow-card">Shop Collection</a>
      </section>
      {/* Category Navigation */}
      <nav className="w-full max-w-6xl mx-auto mt-16 mb-8" aria-label="Product Categories">
        <ul className="flex flex-wrap justify-center gap-6 md:gap-8 text-sm font-bold uppercase tracking-wider font-body w-full max-w-5xl mx-auto">
          {["All","Decorative","Garden","Lighting","Mirrors","Rugs","Seating","Storage","Tables"].map(cat => {
            const slug = cat === 'All' ? 'all' : cat.toLowerCase();
            const isSelected = selectedCategory === slug;
            return (
              <li key={cat}>
                <a
                  href={`/showroom?category=${slug}`}
                  className={`px-2 py-1 border-b-2 ${isSelected ? 'border-brass text-brass' : 'border-transparent hover:border-brass hover:text-brass'} transition-colors duration-200`}
                >
                  {cat}
                </a>
              </li>
            );
          })}
        </ul>
      </nav>
      {/* Featured Product Grid */}
      <div className="w-full max-w-6xl mx-auto mb-16">
        {loading ? (
          <div className="col-span-full text-center py-12">Loading...</div>
        ) : (
          <ProductGrid products={products} />
        )}
      </div>
    </main>
  );
} 