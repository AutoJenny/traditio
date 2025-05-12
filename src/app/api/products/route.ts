import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      where: {
        status: {
          not: 'deleted'  // Filter out deleted products
        }
      },
      include: {
        images: true,
      },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(products);
  } catch (error) {
    console.error('API /api/products error:', error);
    return NextResponse.json({ error: typeof error === 'object' && error && 'message' in error ? (error as any).message : String(error) }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { categoryIds, title, price, ...data } = body;
    // Step 1: Generate slug from title
    const tempSlug = title ? title.toLowerCase().replace(/[^a-z0-9]+/g, '-') : 'product';
    // Step 2: Create product without images (images handled separately)
    const product = await prisma.product.create({
      data: {
        ...data,
        title,
        slug: tempSlug,
        price: parseFloat(price),
        categories: {
          create: (categoryIds || []).map((categoryId) => ({ category: { connect: { id: parseInt(categoryId) } } }))
        },
      },
      include: {
        images: true,
        categories: { include: { category: true } },
      },
    });
    // Step 3: Update slug to include ID
    const newSlug = `${tempSlug}-${product.id}`;
    const updated = await prisma.product.update({
      where: { id: product.id },
      data: { slug: newSlug },
      include: {
        images: true,
        categories: { include: { category: true } },
      },
    });
    return NextResponse.json({ product: updated });
  } catch (error) {
    console.error('API /api/products POST error:', error);
    return NextResponse.json({ error: typeof error === 'object' && error && 'message' in error ? (error as any).message : String(error) }, { status: 500 });
  }
}

// New: POST /api/products/init to create a blank product and return its ID
export async function PUT(req) {
  // This is a workaround for Next.js API routes: use PUT to /api/products?init=1
  const url = new URL(req.url, 'http://localhost');
  if (url.searchParams.get('init') === '1') {
    try {
      // Generate a unique draft slug
      const draftSlug = `draft-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
      const product = await prisma.product.create({
        data: {
          status: 'draft',
          slug: draftSlug,
          title: 'Draft',
          description: 'Draft',
          price: 0,
          currency: 'GBP',
          featured: false,
          dimensions: '',
          condition: '',
          origin: '',
          period: '',
        },
      });
      return NextResponse.json({ id: product.id });
    } catch (error) {
      return NextResponse.json({ error: typeof error === 'object' && error && 'message' in error ? (error as any).message : String(error) }, { status: 500 });
    }
  }
  return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
} 