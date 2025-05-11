const { categoryIds, images, title, description, price, currency, status, mainImageId, dimensions, condition, origin, period, featured } = body;
console.log('PUT /api/products/[slug] received categoryIds:', categoryIds, 'types:', Array.isArray(categoryIds) ? categoryIds.map(x => typeof x) : typeof categoryIds);
// Sanitize images for nested create
const cleanImages = (images || []).map((img: any) => {
  const clean: any = { url: img.url };
  if (img.alt !== undefined) clean.alt = img.alt;
  if (typeof img.order === 'number') clean.order = img.order;
  return clean;
});
// Find product by slug
const product = await prisma.product.findUnique({ where: { slug } });
if (!product) return NextResponse.json({ error: 'Product not found' }, { status: 404 });

// Update product fields
const updated = await prisma.product.update({
  where: { slug },
  data: {
    title,
    slug,
    description,
    price: parseFloat(price),
    currency,
    status,
    mainImageId,
    dimensions,
    condition,
    origin,
    period,
    featured,
    // Replace all categories
    categories: {
      deleteMany: {},
      create: (categoryIds || []).map((categoryId: any) => ({ category: { connect: { id: parseInt(categoryId) } } })),
    },
    // Replace all images
    images: {
      deleteMany: {},
      create: cleanImages,
    },
  },
  include: {
    images: true,
    categories: { include: { category: true } },
  },
}); 