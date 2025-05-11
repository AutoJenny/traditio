"use client";
import React, { useEffect, useState } from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
  rectSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// TODO: Replace with real API call
async function fetchProduct(slug: string) {
  const res = await fetch(`/api/products/${slug}`);
  if (!res.ok) return null;
  return res.json();
}

function SortableImage({ img, idx, mainImageId, handleAltChange, listeners, attributes, setNodeRef, style, isDragging }) {
  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`flex flex-col items-center border border-sand-200 rounded-lg shadow-sm bg-white p-3 relative group transition-all ${isDragging ? 'ring-2 ring-sand-500 bg-sand-50' : ''}`}
    >
      <div className="mb-2 w-full text-center">
        {img.id === mainImageId ? (
          <span className="inline-block px-2 py-0.5 text-xs font-bold text-white bg-sand-500 rounded">MAIN</span>
        ) : (
          <span className="inline-block px-2 py-0.5 text-xs text-sand-700 bg-sand-100 rounded">{img.order != null ? img.order : idx + 1}</span>
        )}
      </div>
      <img src={img.url} alt={img.alt || ''} className="w-[200px] h-auto object-cover rounded border mb-2 group-hover:shadow-lg transition" />
      <input
        type="text"
        value={img.alt || ''}
        onChange={e => handleAltChange(idx, e.target.value)}
        className="border rounded p-1 w-full"
        placeholder="Alt text"
      />
      {/* Drag handle visual cue */}
      <div className="absolute top-2 right-2 cursor-move opacity-40 group-hover:opacity-80 transition" title="Drag to reorder">
        <svg width="20" height="20" fill="none" viewBox="0 0 20 20"><circle cx="5" cy="5" r="1.5" fill="#bfa77a"/><circle cx="5" cy="10" r="1.5" fill="#bfa77a"/><circle cx="5" cy="15" r="1.5" fill="#bfa77a"/><circle cx="10" cy="5" r="1.5" fill="#bfa77a"/><circle cx="10" cy="10" r="1.5" fill="#bfa77a"/><circle cx="10" cy="15" r="1.5" fill="#bfa77a"/><circle cx="15" cy="5" r="1.5" fill="#bfa77a"/><circle cx="15" cy="10" r="1.5" fill="#bfa77a"/><circle cx="15" cy="15" r="1.5" fill="#bfa77a"/></svg>
      </div>
    </div>
  );
}

function DraggableImage({ img, idx, mainImageId, handleAltChange }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: img.id || img.url });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    minWidth: 220,
    maxWidth: 220,
    zIndex: isDragging ? 10 : 1,
  };
  return (
    <SortableImage
      img={img}
      idx={idx}
      mainImageId={mainImageId}
      handleAltChange={handleAltChange}
      listeners={listeners}
      attributes={attributes}
      setNodeRef={setNodeRef}
      style={style}
      isDragging={isDragging}
    />
  );
}

export default function ProductImagesPage({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const [images, setImages] = useState<any[]>([]);
  const [mainImageId, setMainImageId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchImages() {
      const res = await fetch(`/api/products/${slug}`);
      if (!res.ok) return;
      const data = await res.json();
      setImages(
        (data.product.images || []).sort((a: any, b: any) => {
          if (a.order != null && b.order != null) return a.order - b.order;
          if (a.order != null) return -1;
          if (b.order != null) return 1;
          return a.id - b.id;
        })
      );
      setMainImageId(data.product.mainImageId || null);
      setLoading(false);
    }
    fetchImages();
  }, [slug]);

  function handleAltChange(idx: number, value: string) {
    setImages((prev) => prev.map((img, i) => i === idx ? { ...img, alt: value } : img));
  }

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  function handleDragEnd(event: any) {
    const { active, over } = event;
    if (active.id !== over?.id) {
      const oldIndex = images.findIndex((img) => (img.id || img.url) === active.id);
      const newIndex = images.findIndex((img) => (img.id || img.url) === over.id);
      setImages((imgs) => arrayMove(imgs, oldIndex, newIndex));
    }
  }

  async function handleSave() {
    setSaving(true);
    setSaveMsg(null);
    try {
      const res = await fetch(`/api/products/${slug}/images`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ images }),
      });
      if (!res.ok) throw new Error('Failed to save');
      setSaveMsg('Saved!');
    } catch (err: any) {
      setSaveMsg('Error saving');
    } finally {
      setSaving(false);
    }
  }

  async function handleUpload(e: React.FormEvent) {
    e.preventDefault();
    setUploading(true);
    setUploadError(null);
    const form = e.target as HTMLFormElement;
    const input = form.elements.namedItem('images') as HTMLInputElement;
    if (!input.files || input.files.length === 0) {
      setUploadError('No files selected');
      setUploading(false);
      return;
    }
    const formData = new FormData();
    Array.from(input.files).forEach(file => formData.append('images', file));
    try {
      const res = await fetch(`/api/products/${slug}/images/upload`, {
        method: 'POST',
        body: formData,
      });
      if (!res.ok) throw new Error('Upload failed');
      // Refresh images
      const data = await res.json();
      setImages(
        (data.images || []).sort((a: any, b: any) => {
          if (a.order != null && b.order != null) return a.order - b.order;
          if (a.order != null) return -1;
          if (b.order != null) return 1;
          return a.id - b.id;
        })
      );
      setMainImageId(data.mainImageId || null);
    } catch (err: any) {
      setUploadError(err.message);
    } finally {
      setUploading(false);
      form.reset();
    }
  }

  if (loading) return <div className="text-center py-16">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">Edit Images</h1>
      <Link href={`/admin/products/${slug}`} className="text-sand-600 hover:underline">&larr; Back to Product</Link>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={images.map((img) => img.id || img.url)}
          strategy={rectSortingStrategy}
        >
          <form onSubmit={handleUpload} className="mb-8 flex flex-col sm:flex-row items-center gap-4">
            <input
              type="file"
              name="images"
              accept="image/*"
              multiple
              className="border rounded px-2 py-1"
              disabled={uploading}
            />
            <button
              type="submit"
              disabled={uploading}
              className="bg-brass text-espresso font-bold rounded px-6 py-2 border-2 border-brass shadow hover:bg-espresso hover:text-ivory transition"
            >
              {uploading ? 'Uploading...' : 'Upload Images'}
            </button>
            {uploadError && <span className="text-red-600 text-sm">{uploadError}</span>}
          </form>
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {images.map((img, idx) => (
              <DraggableImage
                key={img.id || img.url}
                img={img}
                idx={idx}
                mainImageId={mainImageId}
                handleAltChange={handleAltChange}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
      <div className="mt-8 flex flex-col items-center">
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-brass text-espresso font-bold rounded px-6 py-2 border-2 border-brass shadow hover:bg-espresso hover:text-ivory transition"
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
        {saveMsg && <div className={`mt-2 text-sm ${saveMsg === 'Saved!' ? 'text-green-600' : 'text-red-600'}`}>{saveMsg}</div>}
      </div>
    </div>
  );
} 