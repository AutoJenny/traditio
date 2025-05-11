import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';

// TODO: Replace with real API call
async function fetchProduct(slug: string) {
  const res = await fetch(`/api/products/${slug}`);
  if (!res.ok) return null;
  return res.json();
}

export default async function ProductImagesPage({ params }: { params: { slug: string } }) {
  const { slug } = params;
  // For SSR, replace with server-side fetch or pass data as prop
  // const product = await fetchProduct(slug);
  // For now, stub with empty array
  const product = { images: [] };

  return (
    <div className="max-w-2xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">Edit Images</h1>
      <Link href={`/admin/products/${slug}`} className="text-sand-600 hover:underline">&larr; Back to Product</Link>
      <div className="mt-6">
        {/* Image list */}
        <div className="mb-4">
          <label className="block font-semibold mb-2">Images</label>
          {/* TODO: List images, allow reorder, set main, edit alt, delete */}
          <div className="border rounded p-4 text-gray-500">Image management UI coming soon...</div>
        </div>
        {/* Upload new image */}
        <div className="mb-4">
          <label className="block font-semibold mb-2">Upload New Image</label>
          {/* TODO: Upload form */}
          <div className="border rounded p-4 text-gray-500">Image upload UI coming soon...</div>
        </div>
      </div>
    </div>
  );
} 