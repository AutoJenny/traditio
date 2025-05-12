import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const { email, name, phone, message, productSlug } = await req.json();
    if (!email || !message || !productSlug) {
      return NextResponse.json({ error: 'Email, message, and productSlug are required.' }, { status: 400 });
    }
    // Upsert customer
    const customer = await prisma.customer.upsert({
      where: { email },
      update: { name: name || undefined, phone: phone || undefined },
      create: { email, name: name || undefined, phone: phone || undefined },
    });
    // Look up product by slug
    const product = await prisma.product.findUnique({ where: { slug: productSlug } });
    if (!product) {
      return NextResponse.json({ error: 'Product not found.' }, { status: 404 });
    }
    // Create message
    await prisma.message.create({
      data: {
        customerId: customer.id,
        message: message,
        productId: product.id,
      },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Enquiry form error:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
} 