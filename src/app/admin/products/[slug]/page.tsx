  {/* Images summary and edit link */}
  <div className="mb-4">
    <label className="block font-semibold mb-1">Images</label>
    <div className="flex flex-wrap gap-2 items-center">
      {product.images && product.images.length > 0 ? (
        product.images.map((img: any, idx: number) => (
          <div key={img.url} className="relative">
            <img src={img.url} alt={img.alt || ''} className={`w-16 h-16 object-cover rounded border ${product.mainImageId === img.id ? 'ring-2 ring-sand-500' : ''}`} />
            {product.mainImageId === img.id && (
              <span className="absolute top-0 right-0 bg-sand-500 text-xs text-white px-1 rounded-bl">Main</span>
            )}
          </div>
        ))
      ) : (
        <span className="text-gray-400">No images</span>
      )}
      <a href={`/admin/products/${slug}/images`} className="ml-4 px-3 py-1 bg-sand-500 text-white rounded hover:bg-sand-600 transition">Edit Images</a>
    </div>
  </div> 