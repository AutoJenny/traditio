import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../../lib/prisma';

// @ts-ignore
export async function GET(req, context) {
  const params = await context.params;
  const { slug } = params;
  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      images: true,
      categories: { include: { category: true } },
    },
  });
  if (!product) return NextResponse.json({ product: null, related: [] }, { status: 404 });

  // Use the first category for related products (for now)
  const firstCat = product.categories[0]?.category;
  let related = [];
  if (firstCat) {
    related = await prisma.product.findMany({
      where: {
        categories: {
          some: { categoryId: firstCat.id },
        },
        id: { not: product.id },
      },
      include: { images: true },
      take: 3,
    });
  }

  // Flatten categories for easier frontend use
  const flatProduct = {
    ...product,
    categories: product.categories.map((pc: any) => pc.category),
  };

  return NextResponse.json({ product: flatProduct, related });
}

export async function PUT(req, context) {
  const params = await context.params;
  const { slug } = params;
  const body = await req.json();
  const {
    categoryIds,
    title, description, price, currency, status, mainImageId,
    dimensions, condition, origin, period, featured
  } = body;

  // Find product by slug
  const product = await prisma.product.findUnique({ where: { slug } });
  if (!product) return NextResponse.json({ error: 'Product not found' }, { status: 404 });

  // Update product fields (NO images)
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
      categories: {
        deleteMany: {},
        create: (categoryIds || []).map((id: number) => ({
          category: { connect: { id } }
        })),
      },
      // No images update here
    },
    include: {
      images: true,
      categories: { include: { category: true } }
    }
  });

  return NextResponse.json({ product: updated });
}

export async function DELETE(req, context) {
  const params = await context.params;
  const { slug } = params;
  // Delete product by slug
  await prisma.product.delete({ where: { slug } });
  return NextResponse.json({ ok: true });
} 