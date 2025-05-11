"use client";
import React, { useEffect, useState } from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';

// TODO: Replace with real API call
async function fetchProduct(slug: string) {
  const res = await fetch(`/api/products/${slug}`);
  if (!res.ok) return null;
  return res.json();
}

export default function ProductImagesPage({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const [images, setImages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchImages() {
      const res = await fetch(`/api/products/${slug}`);
      if (!res.ok) return;
      const data = await res.json();
      setImages(data.product.images || []);
      setLoading(false);
    }
    fetchImages();
  }, [slug]);

  function handleAltChange(idx: number, value: string) {
    setImages((prev) => prev.map((img, i) => i === idx ? { ...img, alt: value } : img));
  }

  if (loading) return <div className="text-center py-16">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">Edit Images</h1>
      <Link href={`/admin/products/${slug}`} className="text-sand-600 hover:underline">&larr; Back to Product</Link>
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {images.map((img, idx) => (
          <div key={img.id || img.url} className="flex flex-col items-center">
            <img src={img.url} alt={img.alt || ''} className="w-[200px] h-auto object-cover rounded border mb-2" />
            <input
              type="text"
              value={img.alt || ''}
              onChange={e => handleAltChange(idx, e.target.value)}
              className="border rounded p-1 w-full"
              placeholder="Alt text"
            />
          </div>
        ))}
      </div>
    </div>
  );
} 