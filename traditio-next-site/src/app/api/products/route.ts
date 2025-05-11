import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      include: {
        images: true,
        categories: {
          include: { category: true }
        },
      },
      orderBy: { createdAt: 'desc' },
    });
    // Flatten categories for easier frontend use
    const result = products.map(p => ({
      ...p,
      categories: p.categories.map((pc: any) => pc.category)
    }));
    return NextResponse.json(result);
  } catch (error) {
    console.error('API /api/products error:', error);
    return NextResponse.json({ error: typeof error === 'object' && error && 'message' in error ? (error as any).message : String(error) }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { categoryIds, ...data } = body;
    const product = await prisma.product.create({
      data: {
        ...data,
        price: parseFloat(data.price),
        images: { create: data.images || [] },
        categories: {
          create: (categoryIds || []).map((categoryId: any) => ({ category: { connect: { id: parseInt(categoryId) } } }))
        },
      },
      include: {
        images: true,
        categories: { include: { category: true } },
      },
    });
    return NextResponse.json(product);
  } catch (error) {
    console.error('API /api/products POST error:', error);
    return NextResponse.json({ error: typeof error === 'object' && error && 'message' in error ? (error as any).message : String(error) }, { status: 500 });
  }
} 