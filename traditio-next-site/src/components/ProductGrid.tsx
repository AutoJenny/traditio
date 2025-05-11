import Link from "next/link";

export interface ProductGridProps {
  products: any[];
  gridClassName?: string;
  onProductClick?: (product: any) => void;
}

function formatPrice(value: string | number) {
  if (value === null || value === undefined) return '';
  const num = typeof value === 'number' ? value : parseFloat(value.toString().replace(/,/g, ''));
  if (isNaN(num)) return '';
  return num.toLocaleString('en-GB');
}

export default function ProductGrid({ products, gridClassName = "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8", onProductClick }: ProductGridProps) {
  if (!products || products.length === 0) {
    return <div className="col-span-full text-center py-12 text-sand">No products found.</div>;
  }
  return (
    <section className={gridClassName}>
      {products.map(prod => (
        <Link
          key={prod.id}
          href={`/showroom/${prod.slug}`}
          className="relative group bg-sand rounded-card shadow-card flex flex-col items-center transition-transform duration-200 hover:scale-105 hover:shadow-lg aspect-square overflow-hidden"
          onClick={onProductClick ? (e) => { e.preventDefault(); onProductClick(prod); } : undefined}
        >
          {/* SOLD icon, top right, only on hover */}
          {prod.status === 'sold' && (
            <span className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity inline-block bg-red-400 text-white text-xs rounded px-2 py-0.5 uppercase font-bold">SOLD</span>
          )}
          <div className="absolute inset-0 w-full h-full">
            {prod.images && prod.images[0] ? (
              <img
                src={prod.images[0].url}
                alt={prod.images[0].alt || prod.title}
                className="object-cover object-center w-full h-full transition-all duration-300"
              />
            ) : (
              <span className="text-4xl text-sand flex items-center justify-center w-full h-full">🪑</span>
            )}
            {/* Overlay for hover */}
            <div className="absolute inset-0 bg-espresso bg-opacity-70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center">
              <h2 className="font-heading text-xl text-sand mb-2 text-center">{prod.title}</h2>
              <p className="font-body text-sand font-bold mb-2 text-center">£{formatPrice(prod.price)}</p>
            </div>
          </div>
        </Link>
      ))}
    </section>
  );
} 