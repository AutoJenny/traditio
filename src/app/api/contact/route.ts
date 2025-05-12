import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const { name, email, phone, message, pageUrl } = await req.json();
    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 });
    }
    // Find or create customer
    let customer = await prisma.customer.findUnique({ where: { email } });
    if (!customer) {
      customer = await prisma.customer.create({ data: { name, email, phone } });
    } else if (customer.name !== name || customer.phone !== phone) {
      // Optionally update name/phone if changed
      customer = await prisma.customer.update({ where: { id: customer.id }, data: { name, phone } });
    }
    // Create message
    const ipAddress = req.headers.get('x-forwarded-for') || req.ip || null;
    const userAgent = req.headers.get('user-agent') || null;
    await prisma.message.create({
      data: {
        customerId: customer.id,
        message,
        pageUrl,
        ipAddress,
        userAgent,
      },
    });
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
} 