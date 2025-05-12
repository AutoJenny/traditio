import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../../../lib/prisma';

export async function PUT(req, context) {
  const { slug } = context.params;
  const body = await req.json();
  const { images } = body;

  // Find the product
  const product = await prisma.product.findUnique({ where: { slug } });
  if (!product) return NextResponse.json({ error: 'Product not found' }, { status: 404 });

  // Update each image's order and alt text
  for (let i = 0; i < images.length; i++) {
    const img = images[i];
    await prisma.image.update({
      where: { id: img.id },
      data: {
        order: i,
        alt: img.alt || null,
      },
    });
  }

  // Fetch updated images
  const updatedImages = await prisma.image.findMany({
    where: { productId: product.id },
    orderBy: { order: 'asc' },
  });

  return NextResponse.json({ images: updatedImages });
} 