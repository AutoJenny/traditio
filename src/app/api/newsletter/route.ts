import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const { email, name, phone } = await req.json();
    if (!email) {
      return NextResponse.json({ error: 'Email is required.' }, { status: 400 });
    }
    // Upsert customer
    const customer = await prisma.customer.upsert({
      where: { email },
      update: { newsletter: true, name: name || undefined, phone: phone || undefined },
      create: { email, name: name || undefined, phone: phone || undefined, newsletter: true },
    });
    return NextResponse.json({ success: true, customerId: customer.id });
  } catch (error) {
    console.error('Newsletter signup error:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
} 