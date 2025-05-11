"use client";
import React, { useEffect, useState } from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

// TODO: Replace with real API call
async function fetchProduct(slug: string) {
  const res = await fetch(`/api/products/${slug}`);
  if (!res.ok) return null;
  return res.json();
}

export default function ProductImagesPage({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const [images, setImages] = useState<any[]>([]);
  const [mainImageId, setMainImageId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

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

  function reorder(list: any[], startIndex: number, endIndex: number) {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
  }

  function onDragEnd(result: any) {
    if (!result.destination) return;
    const newImages = reorder(images, result.source.index, result.destination.index);
    setImages(newImages);
  }

  if (loading) return <div className="text-center py-16">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">Edit Images</h1>
      <Link href={`/admin/products/${slug}`} className="text-sand-600 hover:underline">&larr; Back to Product</Link>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="images-droppable" direction="horizontal">
          {(provided, snapshot) => (
            <div
              className="mt-6 flex flex-wrap gap-8"
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              {images.map((img, idx) => (
                <Draggable key={img.id || img.url} draggableId={String(img.id || img.url)} index={idx}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className={`flex flex-col items-center border border-sand-200 rounded-lg shadow-sm bg-white p-3 relative group transition-all ${snapshot.isDragging ? 'ring-2 ring-sand-500 bg-sand-50' : ''}`}
                      style={{
                        ...provided.draggableProps.style,
                        boxShadow: snapshot.isDragging ? '0 4px 16px rgba(191,167,122,0.15)' : '0 2px 8px rgba(0,0,0,0.03)',
                        minWidth: 220,
                        maxWidth: 220,
                      }}
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
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
} 