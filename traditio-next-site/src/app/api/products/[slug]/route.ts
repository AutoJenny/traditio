import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../../lib/prisma';

// @ts-ignore
export async function GET(req, context) {
  const { slug } = context.params;
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
  const { slug } = context.params;
  const body = await req.json();
  const { categoryIds, images, ...data } = body;
  // Find product by slug
  const product = await prisma.product.findUnique({ where: { slug } });
  if (!product) return NextResponse.json({ error: 'Product not found' }, { status: 404 });

  // Update product fields
  const updated = await prisma.product.update({
    where: { slug },
    data: {
      ...data,
      price: parseFloat(data.price),
      // Replace all categories
      categories: {
        deleteMany: {},
        create: (categoryIds || []).map((categoryId: any) => ({ category: { connect: { id: parseInt(categoryId) } } })),
      },
      // Replace all images
      images: {
        deleteMany: {},
        create: images || [],
      },
    },
    include: {
      images: true,
      categories: { include: { category: true } },
    },
  });
  // Flatten categories
  const flatProduct = {
    ...updated,
    categories: updated.categories.map((pc: any) => pc.category),
  };
  return NextResponse.json(flatProduct);
}

export async function DELETE(req, context) {
  const { slug } = context.params;
  // Delete product by slug
  await prisma.product.delete({ where: { slug } });
  return NextResponse.json({ ok: true });
} 