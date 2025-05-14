'use client';
import { useEffect, useState, useRef } from 'react';
import { useParams } from 'next/navigation';
import { TransformWrapper, TransformComponent, useControls } from 'react-zoom-pan-pinch';
import ProductGrid from "../../../components/ProductGrid";
import ProductEnquiryForm from '../../../components/ProductEnquiryForm';

// Utility functions for unit conversion and formatting
function formatDimensionMetric(cm: number) {
  if (cm >= 100) {
    return (cm / 100).toFixed(2) + ' m';
  } else {
    return Math.round(cm) + ' cm';
  }
}
function formatWeightMetric(kg: number) {
  if (kg >= 1) {
    return kg.toFixed(2) + ' kg';
  } else {
    return Math.round(kg * 1000) + ' g';
  }
}
function cmToInches(cm: number) {
  return cm / 2.54;
}
function formatDimensionImperial(cm: number) {
  const totalInches = cmToInches(cm);
  if (totalInches >= 12) {
    const feet = Math.floor(totalInches / 12);
    const inches = totalInches % 12;
    return `${feet}' ${inches.toFixed(1)}"`;
  } else {
    return totalInches.toFixed(1) + '"';
  }
}
function kgToLbs(kg: number) {
  return kg * 2.20462;
}
function formatWeightImperial(kg: number) {
  const totalOunces = kg * 35.274;
  if (totalOunces >= 224) { // 1 stone = 14 lbs = 224 oz
    const stones = Math.floor(totalOunces / 224);
    const lbs = Math.floor((totalOunces % 224) / 16);
    const oz = Math.round(totalOunces % 16);
    return `${stones} st ${lbs} lb${oz ? ' ' + oz + ' oz' : ''}`;
  } else if (totalOunces >= 16) {
    const lbs = Math.floor(totalOunces / 16);
    const oz = Math.round(totalOunces % 16);
    return `${lbs} lb${oz ? ' ' + oz + ' oz' : ''}`;
  } else {
    return Math.round(totalOunces) + ' oz';
  }
}

export default function ProductDetail() {
  const { slug } = useParams();
  console.log('Showroom page slug param:', slug);
  const [product, setProduct] = useState<any>(null);
  const [related, setRelated] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [mainImgIdx, setMainImgIdx] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [showEnquiryForm, setShowEnquiryForm] = useState(false);
  const enquiryFormRef = useRef<HTMLDivElement>(null);
  const [unitSystem, setUnitSystem] = useState<'Metric' | 'Imperial'>('Metric');
  const [detailsOpen, setDetailsOpen] = useState(false);

  useEffect(() => {
    async function fetchProduct() {
      try {
        const res = await fetch(`/api/products/${slug}`);
        if (!res.ok) throw new Error('Fetch failed: ' + res.status);
        const data = await res.json();
        setProduct(data.product);
        setRelated(data.related || []);
      } catch (err) {
        console.error('Error fetching product:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
  }, [slug]);

  function formatPrice(value: string | number) {
    if (value === null || value === undefined) return '';
    const num = typeof value === 'number' ? value : parseFloat(value.toString().replace(/,/g, ''));
    if (isNaN(num)) return '';
    return num.toLocaleString('en-GB');
  }

  if (loading) return <div className="text-center py-16">Loading...</div>;
  if (!product) return <div className="text-center py-16">Product not found.</div>;

  return (
    <main className="max-w-5xl mx-auto py-12 px-4 md:px-0">
      {/* Edit link at top right */}
      <div className="flex justify-end">
        <a
          href={`/admin/products/${product.slug}`}
          className="text-xs text-brass hover:underline border border-brass rounded px-3 py-1 mt-2 font-semibold"
        >
          Edit {product.title}
        </a>
      </div>
      {/* Image Gallery */}
      <section className="flex flex-col md:flex-row gap-10 mb-10">
        <div className="flex-1 flex flex-col items-center">
          <div className="w-full aspect-square bg-sand rounded-lg mb-4 flex items-center justify-center overflow-hidden cursor-zoom-in relative group" onClick={() => setModalOpen(true)}>
            {product.images && product.images[mainImgIdx] ? (
              <img src={product.images[mainImgIdx].url} alt={product.images[mainImgIdx].alt || product.title} className="object-cover w-full h-full transition-transform duration-200 group-hover:scale-105" />
            ) : (
              <span className="text-6xl text-espresso">🪑</span>
            )}
            <span className="absolute bottom-2 right-2 bg-espresso/80 text-ivory text-xs px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition">Click to enlarge</span>
          </div>
          <div className="flex gap-2 justify-center mt-2">
            {product.images && product.images.map((img: any, i: number) => (
              <button key={i} className={`w-16 h-16 rounded border-2 ${mainImgIdx === i ? 'border-brass' : 'border-sand'} overflow-hidden focus:outline-none`} onClick={() => setMainImgIdx(i)}>
                <img src={img.url} alt={img.alt || product.title} className="object-cover w-full h-full" />
              </button>
            ))}
          </div>
        </div>
        {/* Product Info */}
        <div className="flex-1 flex flex-col justify-center">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="font-heading text-3xl md:text-4xl font-bold uppercase text-espresso tracking-tight">{product.title}</h1>
            {product.featured && <span className="inline-block bg-brass text-espresso text-xs rounded px-2 py-0.5 uppercase font-bold">Featured</span>}
            {product.status === 'sold' && <span className="inline-block bg-red-400 text-white text-xs rounded px-2 py-0.5 uppercase font-bold">SOLD</span>}
          </div>
          <p className="font-body text-2xl text-brass font-bold mb-4">£{formatPrice(product.price)}</p>
          <div className="mb-6">
            <p className="font-body text-base text-sand mb-2 whitespace-pre-line">{product.description}</p>
          </div>
          {/* Details Accordion */}
          <details className="mb-4 bg-ivory/60 rounded p-3" open={detailsOpen} onToggle={e => setDetailsOpen((e.target as HTMLDetailsElement).open)}>
            <summary className="cursor-pointer font-bold text-espresso flex items-center justify-between">
              <span>Details</span>
              {detailsOpen && (
                <span className="ml-auto">
                  <select
                    value={unitSystem}
                    onChange={e => setUnitSystem(e.target.value as 'Metric' | 'Imperial')}
                    className="bg-transparent border-0 border-b border-sand text-sand font-body text-sm px-2 py-1 focus:outline-none focus:border-brass focus:text-brass transition-colors duration-150 appearance-none min-w-[120px] hover:text-brass"
                    aria-label="Unit system"
                  >
                    <option value="Metric">Metric</option>
                    <option value="Imperial">Imperial</option>
                  </select>
                </span>
              )}
            </summary>
            <div className="mt-2 text-sand text-sm space-y-2">
              {(product.dimension_wide || product.dimension_deep || product.dimension_high) && (
                <div>
                  <b>Dimensions:</b>
                  {product.dimension_wide && <span> W: {unitSystem === 'Metric' ? formatDimensionMetric(parseFloat(product.dimension_wide)) : formatDimensionImperial(parseFloat(product.dimension_wide))}</span>}
                  {product.dimension_deep && <span> × D: {unitSystem === 'Metric' ? formatDimensionMetric(parseFloat(product.dimension_deep)) : formatDimensionImperial(parseFloat(product.dimension_deep))}</span>}
                  {product.dimension_high && <span> × H: {unitSystem === 'Metric' ? formatDimensionMetric(parseFloat(product.dimension_high)) : formatDimensionImperial(parseFloat(product.dimension_high))}</span>}
                </div>
              )}
              {product.weight && <div><b>Weight:</b> {unitSystem === 'Metric' ? formatWeightMetric(parseFloat(product.weight)) : formatWeightImperial(parseFloat(product.weight))}</div>}
              {product.condition && <div><b>Condition:</b> {product.condition}</div>}
              {product.period && <div><b>Period:</b> {product.period}</div>}
              {product.materials && <div><b>Materials:</b> {product.materials}</div>}
              {product.provenance && <div><b>Provenance:</b> {product.provenance}</div>}
              {/* Condition details */}
              {(product.condition_grade || product.condition_rubric || product.condition_notes) && (
                <div className="mt-4">
                  <div className="font-bold text-espresso mb-1">Condition</div>
                  {product.condition_grade && (
                    <div className="text-sand-900 font-semibold">{product.condition_grade}</div>
                  )}
                  {product.condition_rubric && (
                    <div className="text-xs text-sand-600 mb-1">{product.condition_rubric}</div>
                  )}
                  {product.condition_notes && product.condition_notes.trim() && (
                    <div className="mt-1 text-sand-700"><b>Notes:</b> {product.condition_notes}</div>
                  )}
                </div>
              )}
            </div>
          </details>
          {/* Social Share */}
          <div className="flex gap-4 mb-6">
            <a href="#" aria-label="Share on Facebook" className="hover:text-brass"><svg width="24" height="24" fill="currentColor"><path d="M22 12c0-5.522-4.477-10-10-10S2 6.478 2 12c0 5 3.657 9.127 8.438 9.877v-6.987h-2.54v-2.89h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.242 0-1.632.771-1.632 1.562v1.875h2.773l-.443 2.89h-2.33v6.987C18.343 21.127 22 17 22 12"/></svg></a>
            <a href="#" aria-label="Share on Twitter" className="hover:text-brass"><svg width="24" height="24" fill="currentColor"><path d="M22.46 5.924c-.793.352-1.645.59-2.54.698a4.48 4.48 0 0 0 1.963-2.475 8.94 8.94 0 0 1-2.828 1.082A4.48 4.48 0 0 0 16.11 4c-2.485 0-4.5 2.015-4.5 4.5 0 .353.04.697.116 1.026C7.728 9.37 4.1 7.575 1.67 4.905c-.387.664-.61 1.437-.61 2.26 0 1.56.794 2.936 2.003 3.744-.737-.023-1.43-.226-2.037-.563v.057c0 2.18 1.55 4.002 3.604 4.417-.377.103-.775.158-1.185.158-.29 0-.568-.028-.84-.08.568 1.772 2.217 3.062 4.175 3.096A8.98 8.98 0 0 1 2 19.54a12.68 12.68 0 0 0 6.88 2.017c8.253 0 12.77-6.833 12.77-12.76 0-.195-.004-.39-.013-.583A9.14 9.14 0 0 0 24 4.59a8.94 8.94 0 0 1-2.54.697z"/></svg></a>
            <a href="#" aria-label="Share on Pinterest" className="hover:text-brass"><svg width="24" height="24" fill="currentColor"><path d="M12 2C6.477 2 2 6.477 2 12c0 4.084 2.438 7.563 5.938 8.938-.082-.76-.156-1.926.033-2.755.17-.73 1.09-4.646 1.09-4.646s-.277-.555-.277-1.375c0-1.29.748-2.254 1.68-2.254.793 0 1.176.596 1.176 1.312 0 .8-.51 1.995-.773 3.106-.22.93.468 1.688 1.39 1.688 1.668 0 2.953-1.76 2.953-4.297 0-2.25-1.62-3.825-3.936-3.825-2.684 0-4.26 2.012-4.26 4.09 0 .81.312 1.68.702 2.15.078.094.09.176.066.27-.072.293-.23.93-.26 1.06-.04.17-.13.207-.3.125-1.12-.52-1.82-2.15-1.82-3.463 0-2.82 2.05-6.06 6.11-6.06 3.21 0 5.7 2.29 5.7 5.35 0 3.18-1.99 5.74-4.76 5.74-1.01 0-1.96-.53-2.28-1.14l-.62 2.36c-.18.7-.67 1.58-1 2.12.75.23 1.54.36 2.37.36 5.523 0 10-4.477 10-10S17.523 2 12 2z"/></svg></a>
          </div>
          <button
            className="bg-brass text-espresso font-bold rounded px-8 py-3 border-2 border-brass shadow-lg transition-colors duration-200 hover:bg-espresso hover:text-ivory text-lg"
            onClick={() => {
              setShowEnquiryForm(true);
              setTimeout(() => {
                enquiryFormRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
              }, 100);
            }}
          >
            {showEnquiryForm ? 'Enquiry Form Below' : 'Enquire about this item'}
          </button>
        </div>
      </section>
      {/* Modal for image zoom */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center" onClick={() => setModalOpen(false)}>
          <div onClick={e => e.stopPropagation()} className="bg-white rounded shadow-lg p-2 max-w-4xl max-h-[90vh] flex flex-col items-center justify-center">
            <TransformWrapper initialScale={1} minScale={1} maxScale={5} wheel={{ step: 0.2 }} doubleClick={{ disabled: false }}>
              {({ zoomIn, zoomOut, resetTransform }) => (
                <>
                  <div className="flex gap-2 mb-2">
                    <button onClick={e => { e.stopPropagation(); zoomIn(); }} className="bg-brass text-espresso rounded px-3 py-1 font-bold text-lg shadow hover:bg-espresso hover:text-ivory transition">+</button>
                    <button onClick={e => { e.stopPropagation(); zoomOut(); }} className="bg-brass text-espresso rounded px-3 py-1 font-bold text-lg shadow hover:bg-espresso hover:text-ivory transition">−</button>
                    <button onClick={e => { e.stopPropagation(); resetTransform(); }} className="bg-sand text-espresso rounded px-3 py-1 font-bold text-lg shadow hover:bg-espresso hover:text-ivory transition">Reset</button>
                  </div>
                  <TransformComponent>
                    <img
                      src={product.images[mainImgIdx].url}
                      alt={product.images[mainImgIdx].alt || product.title}
                      className="max-w-3xl max-h-[80vh] rounded shadow-lg cursor-move"
                      draggable={false}
                    />
                  </TransformComponent>
                </>
              )}
            </TransformWrapper>
          </div>
          <button onClick={() => setModalOpen(false)} className="absolute top-4 right-4 bg-espresso text-ivory rounded-full w-10 h-10 flex items-center justify-center text-2xl font-bold shadow-lg hover:bg-brass hover:text-espresso transition">&times;</button>
        </div>
      )}
      {/* Related Products */}
      <section className="mt-16">
        <h2 className="font-heading text-2xl mb-6 text-espresso">Related Products</h2>
        <ProductGrid products={related} gridClassName="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8" />
      </section>
      <div ref={enquiryFormRef} className="mt-12">
        {showEnquiryForm && <ProductEnquiryForm productSlug={product.slug} />}
      </div>
    </main>
  );
} 