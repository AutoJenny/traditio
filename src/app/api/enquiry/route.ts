import { NextRequest, NextResponse } from 'next/server';
import pool from '../../../../lib/db';

export async function POST(req: NextRequest) {
  try {
    const { email, name, phone, message, productSlug, pageUrl } = await req.json();
    if (!email || !message || !productSlug) {
      return NextResponse.json({ error: 'Email, message, and productSlug are required.' }, { status: 400 });
    }
    // Upsert customer
    let customerRes = await pool.query('SELECT * FROM "Customer" WHERE email = $1', [email]);
    let customer;
    if (customerRes.rows.length > 0) {
      customer = customerRes.rows[0];
      await pool.query('UPDATE "Customer" SET name = $1, phone = $2 WHERE id = $3', [name || customer.name, phone || customer.phone, customer.id]);
    } else {
      const insertRes = await pool.query('INSERT INTO "Customer" (email, name, phone, newsletter, createdAt) VALUES ($1, $2, $3, false, NOW()) RETURNING *', [email, name, phone]);
      customer = insertRes.rows[0];
    }
    // Look up product by slug
    const productRes = await pool.query('SELECT * FROM "Product" WHERE slug = $1', [productSlug]);
    if (productRes.rows.length === 0) {
      return NextResponse.json({ error: 'Product not found.' }, { status: 404 });
    }
    const product = productRes.rows[0];
    // Create message
    const ipAddress = req.headers.get('x-forwarded-for') || req.ip || null;
    const userAgent = req.headers.get('user-agent') || null;
    await pool.query(
      'INSERT INTO "Message" ("customerId", message, "pageUrl", "ipAddress", "userAgent") VALUES ($1, $2, $3, $4, $5)',
      [customer.id, message, pageUrl || null, ipAddress, userAgent]
    );
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Enquiry form error:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
} 