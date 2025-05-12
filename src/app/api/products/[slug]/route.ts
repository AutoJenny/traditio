import { NextResponse } from 'next/server';
import { prisma } from '../../../../../lib/prisma';

function withCors(response) {
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  return response;
}

export async function OPTIONS() {
  return withCors(new Response(null, { status: 204 }));
}

export async function PUT(req, { params }) {
  const slug = params.slug;
  let body;
  try {
    body = await req.json();
  } catch (err) {
    console.error('PUT /api/products/[slug] invalid JSON:', err);
    return withCors(NextResponse.json({ error: 'Invalid JSON' }, { status: 400 }));
  }
  const { categoryIds, images, title, description, price, currency, status, mainImageId, dimensions, condition, origin, period, featured } = body;
  // Basic validation
  if (!title || !price) {
    console.error('PUT /api/products/[slug] missing required fields:', { title, price });
    return withCors(NextResponse.json({ error: 'Title and price are required' }, { status: 400 }));
  }
  console.log('PUT /api/products/[slug] received body:', body);
  // Sanitize images for nested create
  const cleanImages = (images || []).map((img) => {
    const clean = { url: img.url };
    if (img.alt !== undefined) clean.alt = img.alt;
    if (typeof img.order === 'number') clean.order = img.order;
    return clean;
  });
  // Find product by slug, including categories and images
  let product;
  try {
    product = await prisma.product.findUnique({
      where: { slug },
      include: {
        categories: { include: { category: true } },
        images: true,
      },
    });
  } catch (err) {
    console.error('PUT /api/products/[slug] error finding product:', err);
    return withCors(NextResponse.json({ error: 'Database error' }, { status: 500 }));
  }
  if (!product) return withCors(NextResponse.json({ error: 'Product not found' }, { status: 404 }));

  // Prepare update data
  const updateData = {
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
  };
  // Only update categories if provided and changed
  if (Array.isArray(categoryIds)) {
    const cleanCategoryIds = categoryIds.filter((id) => Number.isFinite(Number(id)) && Number(id) > 0);
    const currentCategoryIds = (product.categories || []).map((c) => c.categoryId || c.category?.id).filter(Boolean).sort();
    const newCategoryIds = [...cleanCategoryIds].sort();
    const categoriesChanged =
      currentCategoryIds.length !== newCategoryIds.length ||
      currentCategoryIds.some((id, i) => id !== newCategoryIds[i]);
    if (categoriesChanged) {
      // Explicitly update join table
      await prisma.productCategory.deleteMany({ where: { productId: product.id } });
      if (newCategoryIds.length > 0) {
        await prisma.productCategory.createMany({
          data: newCategoryIds.map((categoryId) => ({
            productId: product.id,
            categoryId: parseInt(categoryId),
          })),
        });
      }
    }
  }
  // Only update images if provided and changed
  if (Array.isArray(images)) {
    const currentImages = (product.images || []).map((img) => img.url).sort();
    const newImages = cleanImages.map((img) => img.url).sort();
    const imagesChanged =
      currentImages.length !== newImages.length ||
      currentImages.some((url, i) => url !== newImages[i]);
    if (imagesChanged) {
      updateData.images = {
        deleteMany: {},
        create: cleanImages,
      };
    }
  }
  console.log('PUT /api/products/[slug] updateData:', updateData);
  // Update product fields
  let updated;
  try {
    console.log('PUT /api/products/[slug] about to update product with slug:', slug);
    updated = await prisma.product.update({
      where: { slug },
      data: updateData,
      include: {
        images: true,
        categories: { include: { category: true } },
      },
    });
    console.log('PUT /api/products/[slug] update successful. Updated product:', updated);
  } catch (err) {
    console.error('PUT /api/products/[slug] error updating product:', err);
    return withCors(NextResponse.json({ error: 'Update failed', details: String(err) }, { status: 500 }));
  }
  console.log('PUT /api/products/[slug] sending response:', { product: updated });
  return withCors(NextResponse.json({ product: updated }));
}

export async function GET(req, { params }) {
  const slug = params.slug;
  try {
    const product = await prisma.product.findUnique({
      where: { slug },
      include: {
        images: true,
        categories: { include: { category: true } },
      },
    });
    if (!product) {
      return withCors(NextResponse.json({ error: 'Product not found' }, { status: 404 }));
    }
    return withCors(NextResponse.json({ product }));
  } catch (error) {
    return withCors(NextResponse.json({ error: typeof error === 'object' && error && 'message' in error ? (error).message : String(error) }, { status: 500 }));
  }
} 