import { NextRequest, NextResponse } from 'next/server';
import pool from '../../../../lib/db';

export async function POST(req: NextRequest) {
  try {
    const { name, email, phone, message, pageUrl } = await req.json();
    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 });
    }
    // Find or create customer
    let customerRes = await pool.query('SELECT * FROM "Customer" WHERE email = $1', [email]);
    let customer;
    if (customerRes.rows.length > 0) {
      customer = customerRes.rows[0];
      if (customer.name !== name || customer.phone !== phone) {
        await pool.query('UPDATE "Customer" SET name = $1, phone = $2 WHERE id = $3', [name, phone, customer.id]);
      }
    } else {
      const insertRes = await pool.query('INSERT INTO "Customer" (name, email, phone, "createdAt") VALUES ($1, $2, $3, NOW()) RETURNING *', [name, email, phone]);
      customer = insertRes.rows[0];
    }
    // Create message
    const ipAddress = req.headers.get('x-forwarded-for') || req.ip || null;
    const userAgent = req.headers.get('user-agent') || null;
    await pool.query(
      'INSERT INTO "Message" ("customerId", message, "pageUrl", "ipAddress", "userAgent", "createdAt") VALUES ($1, $2, $3, $4, $5, NOW())',
      [customer.id, message, pageUrl || null, ipAddress, userAgent]
    );
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
} 